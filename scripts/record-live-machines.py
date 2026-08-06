#!/usr/bin/env python3
"""Record a real run of the predictive-maintenance demo into a static fixture.

Writes src/data/live-machines.json, which /product's "Live Machines" panel
replays in the browser. Everything in that file is real:

  - sensor readings come from the ML repo's own generate_raw_reading(), the
    same function that feeds its live demo (bootstrap-sampled from the AI4I
    training rows, so every pairwise correlation is a real observation)
  - features come from the ML repo's engineer_features() — the same function
    used at training time, so there is no training/serving skew
  - probabilities come from the actual @production models pulled from DagsHub

MANUAL, NOT CI. Run it when you want a fresh recording; the JSON it writes is
committed. CI never runs this — it needs the ML repo checked out as a sibling
and would otherwise couple the landing page's build to a second repository.

Deliberately does NOT touch the ML repo: no FastAPI server, no writes to
simulation.db, no drift detection, and no --export-on-drift (that flag pushes
to DagsHub and fires GitHub Actions — never call it from here).

Usage
-----
    python scripts/record-live-machines.py
    python scripts/record-live-machines.py --steps 120 --machines 5

    # ML repo somewhere else:
    python scripts/record-live-machines.py --ml-repo ../predictive-maintenance-demo
"""

import argparse
import json
import os
import random
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "src" / "data" / "live-machines.json"
DEFAULT_ML_REPO = HERE.parent.parent / "predictive-maintenance-demo"

TRACKING_URI = "https://dagshub.com/Preempt-Analytics-Demo/predictive-maintenance-demo.mlflow"
BINARY_MODEL = "predictive-maintenance-binary"
MULTICLASS_MODEL = "predictive-maintenance-multiclass"

# Field order for each recorded frame. The browser reads this from _meta.fields
# rather than hardcoding it, so adding a field here doesn't silently shift the
# meaning of every existing column client-side.
FIELDS = [
    "air_temp_k",
    "process_temp_k",
    "rpm",
    "torque_nm",
    "tool_wear_min",
    "failure_prob",
    "predicted_failure",
    "failure_type",
]


def load_ml_repo(ml_repo: Path):
    """Import the ML repo's own simulator + feature code.

    Its modules use paths relative to the repo root (data/ai4i2020.parquet),
    so cwd has to move there — not just sys.path.
    """
    if not (ml_repo / "src" / "sensor_simulator.py").exists():
        sys.exit(
            f"ML repo not found at {ml_repo}\n"
            "Pass --ml-repo <path> pointing at a checkout of "
            "predictive-maintenance-demo."
        )
    os.chdir(ml_repo)
    # src/ itself goes on the path, not just the repo root: the ML repo's modules
    # import each other flat ("from feature_transformation import ...") because
    # that's how it runs them (python src/sensor_simulator.py).
    sys.path.insert(0, str(ml_repo / "src"))
    from feature_transformation import (  # noqa: E402
        FAILURE_TYPE_CLASSES,
        FEATURES,
        engineer_features,
    )
    from sensor_simulator import (  # noqa: E402
        BASE_FAILURE_RATE,
        TOOL_WEAR_MAX_MINUTES,
        TOOL_WEAR_STEP_MINUTES,
        generate_raw_reading,
    )

    return {
        "engineer_features": engineer_features,
        "FEATURES": FEATURES,
        "FAILURE_TYPE_CLASSES": FAILURE_TYPE_CLASSES,
        "generate_raw_reading": generate_raw_reading,
        "BASE_FAILURE_RATE": BASE_FAILURE_RATE,
        "TOOL_WEAR_MAX_MINUTES": TOOL_WEAR_MAX_MINUTES,
        "TOOL_WEAR_STEP_MINUTES": TOOL_WEAR_STEP_MINUTES,
    }


def _patch_xgboost_tags() -> None:
    """Same compatibility patch src/api.py applies at import time (see its
    comment near the top). xgboost 2.0.3 predates sklearn 1.8's tag-based
    typing, so is_classifier(XGBClassifier()) returns False and the calibrated
    multiclass model raises "Got a regressor" on predict. Patch the CLASS, not
    an instance — CalibratedClassifierCV clones internally and would drop an
    instance-level patch. The binary model is LightGBM and doesn't need this.
    """
    import xgboost as xgb

    original = xgb.XGBClassifier.__sklearn_tags__

    def patched(self):
        tags = original(self)
        tags.estimator_type = "classifier"
        return tags

    xgb.XGBClassifier.__sklearn_tags__ = patched


def load_models():
    """Pull both @production models. Anonymous read — DagsHub allows it for
    this public repo, so no credentials are needed or wanted here."""
    import mlflow

    _patch_xgboost_tags()

    mlflow.set_tracking_uri(TRACKING_URI)
    client = mlflow.MlflowClient()

    binary = mlflow.sklearn.load_model(f"models:/{BINARY_MODEL}@production")
    multiclass = mlflow.sklearn.load_model(f"models:/{MULTICLASS_MODEL}@production")
    versions = {
        "binary": client.get_model_version_by_alias(BINARY_MODEL, "production").version,
        "multiclass": client.get_model_version_by_alias(MULTICLASS_MODEL, "production").version,
    }
    return binary, multiclass, versions


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--steps", type=int, default=120, help="timesteps per machine")
    ap.add_argument("--machines", type=int, default=5)
    ap.add_argument("--step-seconds", type=int, default=30, help="simulated gap between readings")
    ap.add_argument("--seed", type=int, default=7, help="fixed so a re-record is reproducible")
    ap.add_argument("--ml-repo", type=Path, default=DEFAULT_ML_REPO)
    args = ap.parse_args()

    random.seed(args.seed)
    np.random.seed(args.seed)

    out_path = OUT  # resolved before load_ml_repo() chdirs away
    ml = load_ml_repo(args.ml_repo)
    print(f"→ using ML repo at {args.ml_repo}")

    binary, multiclass, versions = load_models()
    print(f"→ binary v{versions['binary']}, multiclass v{versions['multiclass']} loaded")

    wear_step = ml["TOOL_WEAR_STEP_MINUTES"]
    wear_max = ml["TOOL_WEAR_MAX_MINUTES"]

    # Stagger each machine's starting wear so they don't age in lockstep — a real
    # floor has tools changed at different times, and a synchronised sawtooth
    # across all five would read as obviously scripted.
    machines = [
        {
            "id": f"machine_{i + 1:02d}",
            "wear": (i * wear_max) / args.machines,
            "frames": [],
            "type": None,
        }
        for i in range(args.machines)
    ]

    start = datetime.now(timezone.utc) - timedelta(seconds=args.step_seconds * args.steps)

    for step in range(args.steps):
        for m in machines:
            inject = random.random() < ml["BASE_FAILURE_RATE"]
            raw = ml["generate_raw_reading"](m["wear"], inject, mode="normal")

            df = ml["engineer_features"](pd.DataFrame([raw]))
            # to_dict(orient="records"), not the DataFrame itself — the pipeline
            # starts with a DictVectorizer (it one-hot encodes the L/M/H "type"
            # string), so it wants [{col: val, ...}]. Same call shape as api.py.
            X = df[ml["FEATURES"]].to_dict(orient="records")

            prob = float(binary.predict_proba(X)[0][1])
            pred = int(binary.predict(X)[0])

            # Gate-and-detail, exactly as src/api.py does it: the failure-type
            # model is only consulted when the binary model says "will fail".
            ftype = None
            if pred == 1:
                idx = int(multiclass.predict(X)[0])
                name = ml["FAILURE_TYPE_CLASSES"][idx]
                ftype = None if name == "none" else name

            if m["type"] is None:
                m["type"] = raw["Type"]

            m["frames"].append([
                raw["Air temperature [K]"],
                raw["Process temperature [K]"],
                raw["Rotational speed [rpm]"],
                raw["Torque [Nm]"],
                raw["Tool wear [min]"],
                round(prob, 4),
                pred,
                ftype,
            ])

            # Tool wear climbs until the tool is changed, then resets — this is
            # what makes probability trend upward within a cycle rather than
            # jitter randomly, since mechanical_stress = torque x tool wear.
            m["wear"] += wear_step
            if m["wear"] > wear_max:
                m["wear"] = 0.0

        if (step + 1) % 20 == 0:
            print(f"  {step + 1}/{args.steps} steps")

    payload = {
        "_meta": {
            "source": "recorded",
            "note": (
                "A real recorded run, not live and not fabricated. Sensor readings come from "
                "the ML repo's generate_raw_reading() (bootstrap-sampled from AI4I training "
                "rows); probabilities come from the @production models named below. Regenerate "
                "with scripts/record-live-machines.py."
            ),
            "recorded_at": datetime.now(timezone.utc).isoformat(),
            "binary_model_version": versions["binary"],
            "multiclass_model_version": versions["multiclass"],
            "step_seconds": args.step_seconds,
            "started_at": start.isoformat(),
            "seed": args.seed,
            "fields": FIELDS,
        },
        "machines": [
            {"id": m["id"], "type": m["type"], "frames": m["frames"]} for m in machines
        ],
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, separators=(",", ":")) + "\n", encoding="utf-8")

    probs = [f[5] for m in machines for f in m["frames"]]
    flagged = sum(f[6] for m in machines for f in m["frames"])
    size_kb = out_path.stat().st_size / 1024
    print(f"\n✓ {out_path}  ({size_kb:.0f} KB, {len(probs)} readings)")
    print(f"  probability: min {min(probs):.4f}  median {np.median(probs):.4f}  max {max(probs):.4f}")
    print(f"  flagged as will-fail: {flagged} ({flagged / len(probs) * 100:.1f}%)")


if __name__ == "__main__":
    main()
