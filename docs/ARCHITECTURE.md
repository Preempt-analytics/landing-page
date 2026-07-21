# Preempt Analytics — Landing Page Architecture

Status: **Hero section planned, not yet built.** This doc grows as new sections are
designed — treat it as the living source of truth for how the site is built, not
a one-time planning artifact.

---

## 1. Purpose & scope

A public marketing landing page for Preempt Analytics, separate from the
`predictive-maintenance-demo` ML repo (different git history, different deploy
target, no shared code). This round of planning covers only the **hero section**
(the first fold of the homepage). More sections will be designed and appended to
this doc as new mockups arrive.

Design direction: a hybrid of two mockups —
- **"Corporate"** mockup — kept for its **copy and nav framing** (trustworthy B2B SaaS tone).
- **"Cyberpunk"** mockup — kept for its **imagery and color treatment** (macro-gears hero image, teal accent intensity, stat-tile row).

---

## 2. Tech stack: Astro + Tailwind v4

**Decision: Astro, with Tailwind CSS v4 (CSS-first, via `@tailwindcss/vite`).**

Rejected alternatives and why:

| Option | Why not |
|---|---|
| Next.js (static export) | Its value is React interactivity + server features; this site needs neither. GitHub Pages forecloses server features entirely, and static export fights basePath/image-optimization on GitHub Pages. Paying React's runtime cost for a brochure site isn't justified. |
| Plain HTML/CSS/JS | No native partial/include mechanism — Nav/Footer would be hand-copy-pasted across every future page, which is the exact duplication we're trying to avoid. Live data would also have to be a client-side `fetch()`, adding a loading-flash state for no benefit. |

Why Astro fits this project specifically:
1. **Islands architecture** — `.astro` components render to plain HTML at build time and ship **zero client JS by default**. Only a component explicitly marked as an island hydrates in the browser. A mostly-static marketing site with one dynamic stat card is exactly this shape.
2. **Live data becomes a build-time concern, not a client-time one.** A component can `import metrics from '../data/metrics.json'` directly at build time — no client fetch, no CORS, no exposed endpoint, no token anywhere near the browser.
3. **First-party GitHub Pages deploy path** via `withastro/action` + `actions/deploy-pages`.
4. **Tailwind v4 is CSS-first** — no `tailwind.config.mjs`, no `content: []` glob array. Content scanning is automatic via Vite's module graph. Color tokens live in one `@theme` block in CSS (see §4).
5. Extensible without over-building: a second page later is `src/pages/about.astro` reusing `BaseLayout` + `Nav` + `Footer` — no new abstraction needed until it's actually needed.

---

## 3. Repo structure

```
preempt-analytics-landing/
├── .github/workflows/deploy.yml       # fetch metrics → build → deploy (§5)
├── public/
│   ├── favicon.svg                    # placeholder — no real logo exists yet (§6 open items)
│   └── images/hero/macro-gears.jpg    # open item — asset does not exist yet (§4)
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── StatCard.astro
│   │   ├── StatRow.astro              # lays out 3x StatCard
│   │   ├── Button.astro               # variant="solid" | "outline"
│   │   └── Footer.astro               # minimal stub only, full design out of scope this round
│   ├── layouts/BaseLayout.astro       # <html> shell, imports global.css, wraps Nav+slot+Footer
│   ├── pages/index.astro              # BaseLayout + Hero + StatRow
│   ├── data/
│   │   ├── metrics.json               # committed; overwritten by CI before every build
│   │   └── metrics.sample.json        # seed/fallback, never overwritten by CI
│   └── styles/global.css              # @import "tailwindcss"; + @theme token block
├── scripts/fetch-metrics.mjs          # CI script that hits the MLflow REST API (§4)
├── astro.config.mjs
├── package.json
├── .env.example                       # documents required env vars, no real values
├── .gitignore                         # node_modules, dist, .env, .env.local (not .env.example, not metrics.json)
└── README.md
```

---

## 4. Data pipeline: live model metrics from DagsHub

**Goal:** show a couple of genuinely live numbers on the hero (current production
model's recall, last-retrained date) without ever exposing a DagsHub credential
to the browser or committing one to this repo.

**Source (confirmed against the ML repo's own `README-DEV.md` / `.env.demo` / `promote_model.py`):**
- MLflow tracking server: `https://dagshub.com/Preempt-Analytics-Demo/predictive-maintenance-demo.mlflow`
- Registered models: `predictive-maintenance-binary`, `predictive-maintenance-multiclass`, each with a `@production` alias
- Metrics logged per run: `f1_test`, `precision_test`, `recall_test`, `brier_score`

**Confirmed REST endpoints (checked live against `mlflow.org/docs/latest/rest-api.html`):**

| Call | Method | Path | Params |
|---|---|---|---|
| Resolve `@production` alias → version + run_id | GET | `/api/2.0/mlflow/model-versions/get-by-alias` | `name`, `alias=production` |
| Fetch that run's metrics | GET | `/api/2.0/mlflow/runs/get` | `run_id` |

Both require HTTP Basic Auth: `Authorization: Basic base64(DAGSHUB_USERNAME:DAGSHUB_TOKEN)`.

**Is this pipeline already built somewhere in the ML repo? No — checked, and worth recording why.**
`scripts/promote_model.py` in the ML repo already has `get_production_version()` and
`get_metric_for_version()`, which resolve the `@production` alias and pull a run's
metric via the official `mlflow.MlflowClient` Python API — the exact same
alias→version→metric lookup this pipeline needs, and useful confirmation that the
REST paths above resolve correctly against this MLflow instance. But that code only
runs as a one-time gate check inside `retrain.yml`, which itself only fires when
drift is detected (not on a schedule) — the result is used once for a promotion
decision and never persisted anywhere external. So the fetch step below is genuinely
new work, not a duplicate of something that already exists.

**Judgment call: plain Node `fetch()`, not the Python `mlflow` client.** `promote_model.py`'s
approach is proven, but pulling the full `mlflow` package (and its pandas/pyarrow-sized
dependency tree) into this repo's CI just to make two GET requests is more tooling
than the job needs — the REST paths are already confirmed above. Two raw HTTP calls
in Node keep this repo's CI dependency-free (Node 22's built-in `fetch`, no `pip
install`, no second language in a JS/Astro project). Reversible later if it turns out
we want richer MLflow SDK features.

**`scripts/fetch-metrics.mjs`** — runs in CI, writes `src/data/metrics.json`:
- For each of the two registered models: resolve `@production` → run_id → pull `recall_test`/`f1_test`/`precision_test` and the version's `last_updated_timestamp`.
- **Fails open, never fails the build:** if a fetch for one model errors, keep that model's last-committed values in `metrics.json` and log a warning — a stale-but-valid number beats a broken build or a page showing `undefined%`.
- Falls back to `metrics.sample.json` if `metrics.json` doesn't exist yet (first run).

**Secrets vs. variables (GitHub repo settings):**
- Secrets: `DAGSHUB_USERNAME`, `DAGSHUB_TOKEN` — **a token minted fresh for this repo.** Do not reuse anything from the ML repo's `.env.demo` or `.dvc/config`, even though those are disposable-account credentials by design over there — this repo has its own trust boundary.
- Variable (not secret — already public in the ML repo's own docs): `MLFLOW_TRACKING_URI`.
- Model names are hardcoded constants in the script, matching how the ML repo treats them as a fixed integration contract.

**No path exposes the token client-side:** the fetch happens only inside the GitHub Actions runner. `metrics.json` (plain numbers + ISO timestamps) is the only artifact that reaches `src/`, and Astro imports it at build time into static HTML. The deployed site makes **zero** runtime calls to DagsHub.

**Refresh cadence: hourly, `cron: "17 * * * *"`.** Retraining in this system is drift-triggered, not scheduled, so there's no fixed cadence to match. Hourly keeps the page from ever looking stale relative to how often this demo actually promotes new versions (hours-to-days), without hammering DagsHub's API. The `:17` offset avoids the well-documented top-of-hour GitHub Actions scheduler queuing delay.

**Future upgrade path (not built yet):** the workflow already accepts a `repository_dispatch` trigger (type `metrics-updated`). If the ML repo's `retrain.yml` is later given one step to POST that dispatch event after promotion, this site would update within seconds instead of within the hour. That's a change to the *other* repo and is explicitly out of scope for now.

---

## 5. Hero section — merged design spec

**Nav** — kept from "corporate" wholesale (explicit instruction: keep corporate's copy/framing):
- Logo: "Preempt Analytics" wordmark + triangle/A icon (placeholder — see open items).
- Links, exact order (**provisional** — adapted from corporate's generic SaaS labels
  to what this project actually has to show; revisit once the linked pages/sections
  are themselves designed): `Product · How It Works · Solutions · Tech stack · Project & team`.
  `Resources`/`Company` (generic B2B-SaaS placeholders) became `Tech stack` and
  `Project & team` since this is a capstone project site, not a company with generic
  resources/company pages — `Tech stack` can point at the real MLflow/DagsHub/XGBoost/
  Evidently/DVC pipeline, `Project & team` at the people and bootcamp context behind it.
- Cyberpunk's "Book a Demo" nav pill is dropped — the hero already has two CTAs; a third competing one dilutes rather than reinforces.

**Headline & body — verbatim from "corporate":**
- Eyebrow: `PREDICTIVE MAINTENANCE, POWERED BY AI` (small caps, letter-spaced, blue-500).
- Headline: `Predict failures.` / `Prevent downtime.` ("Prevent" in teal-400, rest off-white).
- Body: *"Preempt Analytics helps manufacturing teams predict machine failures before they happen—so you can maximize uptime and efficiency."*

**CTAs — corporate's labels, cyberpunk's visual intensity:**
- Primary: `See It In Action →` — solid teal-400 fill, navy-900 text (9.3:1 contrast).
- Secondary: `Explore Platform` — teal-400 outline on transparent background.

**Stat tile row — new, additive from cyberpunk** (this is the "live dashboard" ask):

| Tile | Value | Source |
|---|---|---|
| Failure Recall | e.g. `98%` | **Live** — `metrics.binary_model.metrics.recall_test`, rounded |
| Sensor Readings / Day | `2.3M` | **Static/illustrative** — no MLflow metric corresponds to this; it's a throughput claim about a hosted API that doesn't exist in this static site's scope. Kept as marketing copy, not fabricated as "live." |
| Retrains Automatically | subtext: "Last retrained {relative time}" | **Live** — derived from the same `metrics.json`, `max()` of both models' `promoted_at`; falls back to a static line if missing |

Styling rule (deliberate deviation from the mockups, which color values inconsistently):
all three tile **values** render in the same off-white; teal-400 is reserved for each
tile's icon + a 1px top-border accent. One consistent system, and a reader doesn't
need to know which tile is "the live one" to read any of them correctly.

**Dropped from this round** (present in the cyberpunk mockup, out of hero scope or flagged as a trust issue):
- The fake customer-logo strip ("Advantage MFG," etc.) — these are invented placeholder names. Recommend **not** shipping fabricated customer names on a real public page. A truthful alternative for later: a "Built with" strip of the real stack (MLflow · DagsHub · XGBoost · Evidently AI · DVC). Not built yet — needs a decision (§6).
- "Scroll to explore" affordance — belongs to a below-fold section not yet designed.

**Hero image** — no macro-gears photo exists anywhere in the org tree yet. Ship functional today, swap the asset later with zero code changes:
- Fixed-aspect image slot at `public/images/hero/macro-gears.jpg`; until sourced, a navy→teal CSS gradient panel with a faint gear-silhouette SVG stands in, so the build never errors on a missing asset.
- The cyberpunk "digital particle/lens-flare" effect is a **separate CSS overlay** (radial-gradient teal glow + `mix-blend-mode: screen` + dot-grid), not baked into the photo — so the photo can be swapped later without redoing the effect.
- Left-edge vignette (linear-gradient to navy-900) replicates both mockups' "photo dimmed into the dark background" treatment.

**Color tokens** (Tailwind v4, `@theme` block in `src/styles/global.css`):

```css
@theme {
  --color-navy-950: #0a0f1a;
  --color-navy-900: #0d1b2e;
  --color-navy-800: #13233a;
  --color-navy-700: #1c3350;
  --color-teal-300: #5eead4;
  --color-teal-400: #2dd4bf;
  --color-teal-500: #14b8a6;
  --color-blue-500: #3b82f6;
  --color-offwhite: #f8fafc;
  --color-muted: #cbd5e1;
}
```

Verified contrast ratios: teal-400/navy-900 = 9.30:1 (AAA), off-white/navy-900 =
16.54:1 (AAA), slate-300/navy-900 (body copy) = 11.66:1 (AAA), blue-500/navy-900
(eyebrow label) = 4.71:1 (AA — fine at the eyebrow's size/weight, not for small body text).

---

## 6. Deployment: one workflow, three triggers

**Decision: a single `deploy.yml`**, not a separate metrics-refresh workflow. GitHub
Actions does not trigger `push`-based workflows from a push made with the default
`GITHUB_TOKEN` — working around that needs an extra PAT or an explicit
cross-workflow dispatch call, more moving parts than folding fetch → commit →
build → deploy into one workflow. This also matches the mental model "every build
bakes in the freshest data available, whatever triggered it."

```yaml
name: Build and deploy

on:
  push:
    branches: [main]
  schedule:
    - cron: "17 * * * *"
  workflow_dispatch: {}
  repository_dispatch:
    types: [metrics-updated]     # unused today; future hook from the ML repo's retrain workflow

permissions:
  contents: write   # to commit metrics.json
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - name: Refresh live model metrics from DagsHub MLflow
        env:
          DAGSHUB_USERNAME: ${{ secrets.DAGSHUB_USERNAME }}
          DAGSHUB_TOKEN: ${{ secrets.DAGSHUB_TOKEN }}
          MLFLOW_TRACKING_URI: ${{ vars.MLFLOW_TRACKING_URI }}
        run: node scripts/fetch-metrics.mjs
      - name: Commit metrics.json if changed
        run: |
          git config user.name "preempt-metrics-bot"
          git config user.email "bot@users.noreply.github.com"
          git add src/data/metrics.json
          git diff --cached --quiet || git commit -m "chore: refresh live model metrics"
          git push || echo "nothing to push"
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

Repo settings needed: **Settings → Pages → Source → GitHub Actions** (not "deploy
from branch"). `astro.config.mjs` needs `site: "https://<user>.github.io"` and, if
this repo isn't a `<user>.github.io` root repo, `base: "/preempt-analytics-landing"`.

---

## 7. Open items — decisions needed before full build-out

These need a person, not a coding agent, to resolve:

1. **Logo/icon** — the triangle/A mark in both mockups is itself a placeholder. Commission/generate a real one, or ship a text-only wordmark until one exists.
2. **Hero photo** — the macro-gears image needs sourcing (stock license) or generation. Scaffolding works without it (gradient placeholder), but the visual won't match the mockup until it's dropped in.
3. **Fake customer logo strip** — decide between omitting it, or a truthful "Built with" tech-stack strip instead of invented company names.
4. **Fresh DagsHub token** — mint a new token scoped to this repo before wiring up `scripts/fetch-metrics.mjs` in CI; never copy the one from the ML repo's `.env.demo`/`.dvc/config`.

---

## 8. Roadmap

This doc currently covers the hero section only. As more mockups/screenshots
arrive for other parts of the site (nav sub-pages, features section, pricing,
footer, etc.), append new sections here rather than starting a separate doc —
keep one architecture doc as the team's single source of truth.
