---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-08-04 (design/analysis session — /product/ interactivity decision, no code written)
updated_by: Claude (product-page data-audit + option-sparring session)
head_sha: 584650c
branch: main
status: green (build passes; nothing shipped this session — this was a decision session)
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: main @ 584650c, identical to origin/main. No code changed this session — this was a design/analysis session about /product/.
Just did: audited every data source available to the site (DagsHub MLflow, GitHub Actions, the ML repo's simulation.db + monitor_log + parquet), mapped it against what the /product/ dashboard mockup claims, and sparred through 5 options for making that page interactive. Human chose Option 4 (hybrid shell), with an explicit added constraint: build it so each panel can be static image OR interactive HTML, decided per-panel later, never locked in.
DO NEXT: Phase A — three self-contained panels, no shell required yet: (1) "trust the number" panel using recall/precision/brier_score, (2) downtime-cost calculator with a user-input slider, (3) live version-history chart from a new fetch-model-history.mjs. See §1. Each ships alone.
DON'T: don't build a screen that shows time-to-failure ("1.8 hrs left") — no RUL model exists in this project, it cannot be backed. Don't build a vibration sensor tile — not an AI4I sensor, the mockup invented it. Don't add brier_score to metrics.json without updating metrics.ts in the SAME commit (Contract 2). Don't touch LiveFactory.astro's uncommitted one-line edit — another session owns it (§4).
Blocked on: three product decisions listed in §4. Phase A is NOT blocked by any of them.
Ground truth: CLAUDE.md (standing rules) + docs/ARCHITECTURE.md (design why). Run §5 verify before editing. §3 has verified API/data facts — trust them, they were probed live today.
```

---

## 1. Resume here

**Next action: Phase A of Option 4.** Three panels, each independently
shippable, none requiring the dashboard shell to exist yet. Build them as
normal page sections first; they get *moved into* the shell in Phase B.

1. **"Trust the number" panel** (~45 min). Reframes existing live metrics as
   consequences rather than statistics:
   - recall 0.824 → "catches 5 of every 6 failures — plan for the sixth"
   - precision 0.918 → "8 false alarms per 100 alerts"
   - **brier_score 0.0075 → "when it says 90%, it fails about 90% of the
     time"** — this is a calibration score and it is the single most
     end-user-relevant number the project owns. It is live in MLflow today
     and currently unused by the site.
   - ⚠️ Adding `brier_score` to `metrics.json` is a **Contract 2 change** —
     `scripts/fetch-metrics.mjs` and `src/lib/metrics.ts` must move in the
     same commit. See CLAUDE.md → Integration Contracts → Contract 2.
   - Reuse `StatCard.astro` (`value`/`label`/`caption`/`captionTone`/`info`).
     `captionTone="live"` already renders the teal live dot.

2. **Downtime-cost calculator** (~1h). The mockup's €28,400 cannot be
   sourced — there is no cost model anywhere in the project. Fix by making
   the fabricated half a *user input*: "your downtime costs €___ per hour"
   as a slider, multiplied by a real predicted-failure count. Honest,
   interactive, and it converts the page's weakest tile into its strongest.
   - This is the site's **first stateful client-side component**. ~30 lines
     of vanilla JS, no dependency — clears the Second Law, but say so out
     loud in the commit rather than letting a reviewer discover it.

3. **Version-history chart** (~1.5–2h). New `scripts/fetch-model-history.mjs`
   + `src/lib/model-history.ts` + a build-time SVG chart component.
   - The fetch script is the **third instance of a pattern already in the
     repo twice** (`fetch-metrics.mjs`, `fetch-ci-stats.mjs`) — copy their
     shape, including the fail-open `.catch()` + `process.exit(0)` and the
     `_meta.source: 'live' | 'sample'` honesty field. First Law: this must
     never break the build.
   - Chart as build-time-generated inline SVG. **No charting dependency, no
     client JS** — Second Law.

**Settled — do NOT re-litigate:**

- **Option 4 (hybrid shell) is the chosen direction**, over: leaving the
  static image (status quo), clickable-sidebar-swapping-generated-images
  (Proposal 1), full HTML rebuild with mockup parity (Proposal 2), and a
  recorded video clip (Option 5). Reasoning is in §3.
- **The per-panel escape hatch is a hard requirement, not a nice-to-have.**
  The human explicitly asked not to be locked in: every dashboard panel must
  be switchable between "static image" and "interactive HTML" *later*,
  panel by panel, without rework. See §2 for the recommended shape.
- **Phase A leads with trust + cost calculator, NOT the version-history
  chart.** Earlier in the session the ordering was the reverse; it was
  changed deliberately after the human asked to think in terms of what an
  end-user actually wants to know. Trust and cost are cheaper *and* answer
  questions a visitor actually has.
- **Honest framing beats impressive framing on this page.** Nobody who loads
  `/product/` is Sophie the maintenance lead — they're evaluating whether
  this team can build. "It misses 1 in 6, here's the number" reads as
  competence to that audience; "94% fleet health" with no source reads as
  marketing. This is why calibration/overfit-delta stats (which you'd never
  put in a real product UI) are the strongest assets here.
- Everything from prior handovers stays settled: stack, dark-only,
  no-analytics, `withBase()` for internal links, batched commit discipline,
  CLAUDE.md as standing rules.

## 2. What changed this session

**No code.** This was analysis + decision. Concretely produced:

- **A full data audit** of what the site can show vs. what the mockup claims
  (§3 — the durable part of this session).
- **A five-option comparison** with effort/quality/honesty-risk estimates.
- **A decision: Option 4**, plus the added per-panel-switchability constraint.
- **Effort estimate for Claude-assisted implementation:** ~10–14h of Claude
  tool-time, ~5–9h of human attention, across 3–4 sessions. (Versus 16–24h
  solo-human.) The dominant variance is *design-taste iteration rounds in
  Phase B*, not code volume.

**Recommended shape for the "never locked in" requirement** (proposed, not
yet built — Phase B decides):

A single registry declaring each panel's render mode, so switching a panel
from image to HTML is a one-field edit plus a component:

```ts
// src/lib/dashboard.ts  (proposed)
export type PanelMode = 'html' | 'image';
export const DASHBOARD_PANELS = [
  { id: 'overview',      label: 'Overview',          mode: 'image' },
  { id: 'model-health',  label: 'Model Health',      mode: 'html'  },
  { id: 'live-machines', label: 'Live Machines',     mode: 'html'  },
  { id: 'alerts',        label: 'Alerts',            mode: 'image' },
  // … Predictions, Maintenance Queue, Work Orders, Reports, Settings
];
```

The shell renders the sidebar from this list unconditionally (all 9 items
always visible, matching the mockup); `mode` decides only what fills the
panel area. Consequence: **a panel can be promoted image → HTML at any time,
and demoted back, without touching the shell.**

Open sub-decision for Phase B: panel switching mechanism. Recommendation is
all panels rendered, hidden by default, ~20 lines of JS to toggle, plus
`loading="lazy"` on every image so the 9-panel version doesn't load megabytes
up front. A `:target`/radio CSS-only version avoids JS entirely but loads all
images eagerly — worse trade on this site. Not settled; flag it to the human.

## 3. Un-recoverable context — the data audit

**All endpoints below were probed live on 2026-08-04 and returned HTTP 200
anonymously** (no `DAGSHUB_TOKEN` needed — consistent with `metrics.json`'s
own `_meta.note`). Don't re-derive this; verify with one call if in doubt.

Base: `https://dagshub.com/Preempt-Analytics-Demo/predictive-maintenance-demo.mlflow/api/2.0/mlflow`

| Endpoint | Method | Gives you |
|---|---|---|
| `registered-models/get?name=…` | GET | aliases (`production=v36`), tags, description. **Already used** by `fetch-metrics.mjs`. |
| `model-versions/search?filter=name='…'` | GET | **All 36 versions** with `creation_timestamp` + `run_id` → a real quality-over-retrains time series |
| `runs/search` | **POST** (`{experiment_ids:[…], max_results}`) | per-run metrics + params for every candidate |
| `runs/get?run_id=…` | GET | one run's full metrics/params/tags. **Already used.** |
| `experiments/search` | GET | 6 competing families: xgboost, lightgbm, random_forest, logreg, svm, mlp |
| `artifacts/list?run_id=…` | GET | **returns only `root_uri` — the artifact store is EMPTY** |

**Exact metric keys on the production binary run** (`abd0fe87…`, v36,
lightgbm — note the *winner is lightgbm*, though the registry's `model_family`
tag on the registered model still reads `xgboost`):

```
f1_train      = 0.9944954128440368
f1_test       = 0.8682170542635659
overfit_delta = 0.12627835858047087
precision_test= 0.9180327868852459
recall_test   = 0.8235294117647058
brier_score   = 0.007496163557971437   ← calibration, UNUSED by the site
roc_auc_test  = 0.9755967604433078
```

Multiclass production alias = **v32**. Same metric keys.

**Consequence of the empty artifact store:** there are no logged confusion
matrices and no feature importances. So **"why was this machine flagged?" is
not answerable** without new work in the ML repo. Don't design a panel that
needs it.

**Other real data, in the ML repo at
`../predictive-maintenance-demo` (sibling directory, present locally):**

- `data/simulation.db` → table `sensor_readings`, columns: `timestamp`,
  `reading_number`, `machine_id` (`machine_01`…`machine_05`), `machine_type`
  (L/M/H), `air_temperature_kelvin`, `process_temperature_kelvin`,
  `rotational_speed_rpm`, `torque_nm`, `tool_wear_minutes`, `power_kw`,
  `temp_diff_kelvin`, `mechanical_stress`, `predicted_failure`,
  `predicted_failure_type`, `failure_probability`, `injected_failure`,
  `mode`, `target`, `effective_failure_rate`.
  **Currently only 5 rows** — it gets drained on export. The simulator
  regenerates thousands in minutes (`src/sensor_simulator.py`, needs the
  FastAPI service up). This is the source for the Phase C replay.
- `reports/monitor_log.jsonl` → **1,093 real drift checks**, each
  `{timestamp, drift_detected, retrain_triggered}`. Real drift-history
  timeline, no fabrication needed.
- `data/ai4i2020.parquet` → 20,000 rows, columns are the raw AI4I 2020 set.

**Base rates computed from that parquet today — with caveats that matter:**

- Failure rate **10.4%** (2,076 / 20,000). ⚠️ This is **inflated** — the
  original AI4I rate is ~3.4% (and `simulation.db`'s own
  `effective_failure_rate` field reads `0.034`). The parquet has accumulated
  stress-test runs with injected failures. **Do not publish "1 in 10 readings
  is a failure" as a factory rate.**
- Failure-mode flags: TWF 114, HDF 268, PWF 105, OSF 221, RNF 19 — these sum
  to 727, well under the 2,076 total failures. ⚠️ **~65% of failures carry no
  specific mode flag**, because `scripts/export_simulation_to_parquet.py`
  derives them from sensor physics rather than the injector's intent (the
  script says so in its own header). A "failure mode mix" panel is usable
  with a caption, not as a headline.
- **What a failing machine actually looks like** (real, computed, honest):
  rotational speed 1541 → **1341 rpm**, torque 39.8 → **51.5 Nm**. Air
  temperature barely moves (300.0 → 300.1). This is a correlation, not model
  feature importance — label it as "how failing readings differ," not as
  "what the model looks at."

**What the mockup shows that has NO data source anywhere** (this list is the
main deliverable of the session — check any new panel against it):

- ❌ **"Est. Time Left — 1.8 hrs until likely failure."** No RUL/time-to-
  failure model exists. Binary classifier + failure-type multiclass only.
  This is the single biggest honesty gap in the mockup.
- ❌ **Vibration (4.6 mm/s).** Not an AI4I sensor. The real five are air
  temperature, process temperature, rotational speed, torque, tool wear.
- ❌ **Named equipment** — Press-07, CNC-03, Hydraulic-11, Conveyor-05,
  Compressor-02. Reality is `machine_01`–`machine_05`, typed L/M/H, no
  equipment class.
- ❌ €28,400 / €4,200 vs yesterday, 94% fleet health, "7 requiring
  attention", "3 predicted failures (24h)", recommended actions ("Replace
  spindle bearing"), per-machine 6H/24H/7D/30D trends, Alerts/Work
  Orders/Reports/Settings content, Sophie de Vries, Eindhoven Plant A.

**What the mockup shows that IS real and buildable today:**

- ✅ The **"Validated by FastAPI"** panel — `src/api.py` genuinely does
  Pydantic validation, returns 422 on missing fields, blocks out-of-range
  values. Every claim on that panel is true.
- ✅ The **"Failure Probability Explained"** band chart (0–20/20–50/50–80/
  80–100%) — explanatory content, not data.
- ✅ A **ranked queue** by `failure_probability` — real model output, once a
  simulation run is recorded. Only the machine *names* would be dressed up.

**Why Option 4 won** (so it isn't re-argued): Proposal 1 (sidebar + generated
images) makes interactivity decorative, adds 10–15 MB to git permanently,
needs ~400-char alt text per panel, and **numbers baked into pixels can never
carry the site's `live · updated hourly` / `sample metric` honesty labels**.
Proposal 2 (full HTML parity) requires fabricating the ❌ list above — and a
fake number in live DOM reads as a *claim*, where the same number in a
captioned screenshot reads as a *sketch*. Option 4 builds only the panels that
can be backed and leaves the rest as clearly-labelled pictures.

## 4. Open questions — need a human, not a guess

- [ ] **Does "Est. Time Left" ship at all?** It needs a model this project
      doesn't have. Options: cut it, or keep it visible only in the static
      concept image with the "Concept preview" badge doing the work. Phase B
      stalls on this.
- [ ] **Do €28,400 (dashboard sidebar) and €24,300 (UserStory's Overnight
      Impact card) reconcile?** Different scopes ("this week" vs "overnight")
      or an inconsistency? If the cost calculator ships in Phase A, both
      numbers should probably come from it.
- [ ] **Machine naming:** stay honest with `machine_01`–`machine_05`, or dress
      them as Press-07/CNC-03? The latter is the only fabrication Option 4
      still carries. Recommendation: keep real IDs, add machine *type* (L/M/H)
      as the human-readable differentiator.
- [ ] **Panel-switch mechanism** (§2's open sub-decision) — small JS toggle
      with lazy images (recommended) vs. CSS-only `:target`.
- [ ] **`LiveFactory.astro` has an uncommitted one-line edit** that predates
      this session — an `aria-label` changed from `no drift detected, nominal`
      to `no drift detected, Safe ` (note the trailing space; looks mid-edit).
      Per CLAUDE.md's Multi-Instance Collaboration protocol, **another live
      session owns this — don't stash, revert, or commit over it.** Ask first.
- [ ] Also uncommitted, untouched by me: `design/mockups/dashboard-mockup.png`
      added (untracked), `design/mockups/ChatGPT Image Jul 20…png` deleted.
- [ ] Carried over from prior handovers: §9.1 in-action clip (Option 5 above
      is still a cheap win if Phase B stalls), real logo/icon mark, employee
      illustration placeholder.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin
git log --oneline -5      # tip = 584650c (+ this handover commit) or later?
git status                # expect the 3 items in §4 still outstanding
npm run build             # must pass; 3 routes build
```

PowerShell: run the same commands one per line (`&&` is a parser error in
PowerShell 5.1 — CLAUDE.md, Platform Agnosticism).

- **Branch / commit:** `main` @ `584650c`, identical to `origin/main` at
  session end. This handover is uncommitted unless the human asked otherwise.
- **Build:** passes. No code changed this session.
- **Uncommitted work:** the three items in §4 — one belongs to another
  session.
- **Canonical sources:** [`CLAUDE.md`](../CLAUDE.md) (rules) ·
  [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) (design why) ·
  [`docs/IMAGE_ASSETS.md`](../docs/IMAGE_ASSETS.md) (image assets + prompts).

---

## Protocol & guardrails

**Outgoing session** (before standup / lunch / EOD):
1. Update frontmatter + context block + §1 next action.
2. Create a **new dated** handover (`YYYY-MM-DD-…`) — never overwrite prior days'.
3. `git fetch` first — this repo has more than one active committer.
4. `git commit` → `git push` (rebase/merge onto any new remote commits first).

**Incoming session** (first message of the day):
> "`git pull`, read the latest dated `claude-handover/…-claude-handover-doc.md`,
> read `CLAUDE.md`, run the §5 verify commands, then confirm the plan back to
> me before editing."

**Guardrails**
- **Coordinate this handover doc; expect `main` itself to move between sessions.**
- **Staleness guard.** If `updated` >1 working day old or `head_sha` ≠ `origin`,
  trust §5's live commands over anything written here.
- **Right-tier rule.** Durable *design why* → `ARCHITECTURE.md`. Durable
  *engineering rules* → `CLAUDE.md`. Image assets + prompts → `IMAGE_ASSETS.md`.
  History → `git log`. Only *current state + next action* → here.
- **Every push to `main` is a live release.** Verify `npm run build` first.
