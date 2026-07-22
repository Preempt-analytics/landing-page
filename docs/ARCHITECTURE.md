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

**Where this repo lives is independent of whether it can reach DagsHub.** This repo
should be hosted under the team's main GitHub account/org, not the `Preempt-Analytics-Demo`
account the ML repo uses (see §7 item 4 for why). That choice has **no effect** on
the dashboard's ability to read live data: the fetch step just makes an outbound
HTTPS call to `dagshub.com` using whatever credential is stored as *this repo's own*
secret. Any GitHub repo's Actions runner can reach any public API — it doesn't
matter which account owns the workflow. "Mint a fresh token" means generating a new
token string for the same `Preempt-Analytics-Demo/predictive-maintenance-demo`
DagsHub project (that's still where the live model data lives), stored only as a
secret on this repo — not pointing at a different data source, and never written to
a committed file this time.

**What actually makes a local demo run show up on the dashboard.** Running
`docker compose up` locally does not push anything to DagsHub by itself. The full
chain, traced through the ML repo's own scripts:
1. The simulator generates readings into local `simulation.db`.
2. `monitor.py` detects drift → runs `export_simulation_to_parquet.py --push` → uploads to DagsHub via DVC, commits `retrain.trigger`, pushes to GitHub.
3. That push fires `retrain.yml` **on GitHub Actions**, not locally → trains → `promote_model.py` moves the `@production` alias if the new version clears its gates.

Only step 3 changes what's on DagsHub's MLflow registry — running the simulator
alone won't move the dashboard, only a full drift → retrain → promote cycle will.
Given the hourly cron below, that's up to ~1 hour of lag by default. For a live
walkthrough where immediate reflection matters, either manually fire this repo's
`workflow_dispatch` right after a promotion completes, or wire up the
`repository_dispatch` hook noted below.

**Worth a two-minute check:** if the DagsHub project is public, its MLflow API may
allow anonymous reads with no token at all, which would simplify this further —
worth glancing at the project's visibility setting on DagsHub before minting a token.

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

**CTAs — two-verb system (panel finding, actioned).** The whole site uses exactly
**two CTA verbs** so a visitor never has to decode near-synonyms: a **"look" verb**
(*See it in action*) for anything that shows the product, and a **"do" verb**
(*Test it on your device*) for the one path that runs it. Every CTA across the
page maps to one of these two — no "Explore Platform," no "Open Dashboard" as a
separate third verb (see §9.5).
- Primary (look): `See it in action →` — solid teal-400 fill, navy-900 text
  (9.3:1 contrast). Target: `#product` — the Product Preview section (§9.1).
  Honest because §9.1 is planned to carry an **animated GIF of the system
  running** (§9.1), not only a still — so "in action" describes something that
  actually moves.
- Secondary (do): `Test it on your device` — teal-400 outline on transparent
  background. Target: `/try-it-yourself` (§9.7), the plain-language clone/run
  subpage. **Revised from the original "Explore Platform"** (vague, redundant
  with the nav's `Product` anchor). Two CTAs, two distinct destinations, two
  distinct verbs — no dilution.

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

**Honesty cue (panel finding — "don't let real numbers read as boasts," actioned).**
The two live tiles carry a small provenance line so a skeptical visitor reads them
as *measurements*, not marketing: the Failure Recall tile gets a subtle
"live · updated hourly" caption (it's a real MLflow metric, §4), and the `2.3M`
Sensor Readings tile gets a quiet "illustrative" caption (it's descriptive copy,
not a measured figure). This is the same distinction the §9.5 user story draws
with its "Illustrative example" label — real is shown as real, illustrative is
labelled illustrative, nothing is left to read as an unearned claim.

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
3. **Fake customer logo strip — RESOLVED.** Omitted entirely, no replacement strip.
   The real tool stack is already covered in full by §9.6's technical architecture
   section, so a separate "Built with" strip would be redundant.
4. **Hosting account: main GitHub account/org, not `Preempt-Analytics-Demo`.** The ML
   repo's demo account ships credentials deliberately, for zero-setup friction —
   checked, and its SSH credential is specifically a repo-scoped deploy key (not an
   account-wide PAT), so it can't reach a sibling repo by itself. The real risk is
   account-level compromise and blast-radius asymmetry: the ML demo repo is
   *designed* to be disposable (rotate a token, no harm done); a public landing page
   during "wider release" carries real reputational stakes that shouldn't share a
   trust boundary with an account built around "embed it, it's easier." Mint a
   DagsHub token fresh for this repo (read-only scope if DagsHub's token UI offers
   it — worth checking) and never copy the one from the ML repo's `.env.demo`/`.dvc/config`.
5. **Branch protection on `main`** — require a PR + at least one review before merge. `deploy.yml` auto-builds and publishes on every push to `main`, so without this, one compromised collaborator credential or a stray force-push goes straight to the live public site with no checkpoint.
6. **Enable secret scanning + push protection** on this repo — a live guard rail against ever repeating the `.dvc/config`/`.env.demo` class of mistake (a real credential landing in a committed file), catching it at push time instead of after the fact.
7. **§9.7's exact repo URL and local-demo commands — RESOLVED.** Pulled directly
   from the ML repo's `README.md`: repo is
   `github.com/Preempt-Analytics-Demo/predictive-maintenance-demo`, setup is
   `git clone` → `cd` → `docker compose up -d`, with a menu-driven alternative
   (`./preempt.sh` / `.\preempt.ps1`) also worth surfacing.
8. **Footer's real content — mostly RESOLVED.** Team (Nate/@envelopingCODE,
   Ivo/@undorigo, neuefische AI Engineering Bootcamp · Cohort 2026) and an About
   blurb are pulled from the README's own public "Team" section (§9.8). Still
   open: the Legal/meta line (copyright/build credit) — minor, non-blocking.
9. **"Show it in action" content — RESOLVED (revised after panel audit).** The
   tool-branded `Retraining Loop.png` is now the *content reference* for §9.6's
   rebuilt technical diagram (not raw-embedded in §9.3). The birds-eye §9.3 stays
   tool-free; proof-of-running is the §9.1 in-action clip (item 11).
10. **Whether to crop/blur the "Sophie de Vries" persona label** baked into the
    §9.1 Product Preview screenshot. Recommendation (not yet confirmed): leave it —
    a fictional example user inside a labeled "here's the UI" concept image reads
    differently than the fake customer-logo strip did, which implied real paying
    customers.
11. **§9.1 in-action clip (NEW, from panel audit)** — a team-recorded screen
    capture of the system running (terminal drift check / GitHub Actions going
    green / dashboard updating). Delivered as a muted looping `<video>` (WebM/MP4),
    not a `.gif`. v1 ships without it (still + "Concept preview" badge); it drops
    into the same slot when recorded. Needs a human to capture it.
12. **Capstone-showcase framing placement (NEW, from panel audit)** — the decision
    to frame the site as a capstone showcase on simulated data is made (§9.8); its
    exact on-page placement (hero eyebrow addendum vs. a slim ribbon near the top)
    is a small design call left for build-out.

---

## 8. Roadmap

Hero (§5) and the full below-fold pass (§9.1–§9.8, §10 social-preview, §11 asset
plan, §12 cross-cutting build standards) are now spec'd. Real content from the ML
repo's `README.md` resolved the diagram labels, subpage commands, and footer/team
copy. A subsequent **expert-panel audit** (UX, web/systems, MLOps, content,
accessibility, target-user) was run and its accepted findings folded in: the
two-loop design was kept but sharpened (§9.3 birds-eye/no-tools vs §9.6
technical/late), a two-verb CTA system adopted, over-claims replaced with
capstone-true wording (§9.6), honesty labels locked (§5, §9.5), and a full set of
cross-cutting standards added (§12: responsive, reduced-motion, alt-text, focus,
dark-only, no-analytics). A handful of findings were deliberately deferred
(audience signposting, deep ARIA authoring, contact channel — see §12). Only
minor/asset items remain open (see §7 items 1–2, 10–12) — none block scaffolding.
If further mockups arrive, append new sections here rather than starting a
separate doc — keep one architecture doc as the team's single source of truth.

---

## 9. Below-fold sections — merged design spec

Sourced from the remaining 9 mockups in `design/mockups/` (8 screenshots + 1
ChatGPT-generated dashboard image, `ChatGPT Image Jul 20, 2026, 05_08_05 PM.png`
— note the non-`Screenshot...` filename, easy to miss in a directory listing).
Same process as the hero: merge into one spec, flag trust/consistency issues the
same way the hero's fake-logo-strip and stat-tile-coloring issues were caught.

Page order below matches the settled nav order (`Product · How It Works ·
Solutions · Tech stack · Project & team`) so that anchor-link clicks always jump
forward down the page.

### 9.1 Product Preview

**Source:** `ChatGPT Image Jul 20, 2026, 05_08_05 PM.png` — a full "Maintenance
Control Center" dashboard screenshot: fleet-health stat tiles (Overall Fleet
Health, Machines Requiring Attention, Predicted Failures (24h), Estimated
Downtime Prevented), a Priority Maintenance Queue ranked by failure probability,
a "why this matters" failure-probability explainer panel, a failure-probability
trend chart, live sensor tiles (temperature, vibration, rotational speed, torque,
tool wear), a validation checklist card, and a business-impact card.

- Presented as a **framed product-concept image** — the existing PNG wrapped in a
  browser/app-chrome CSS frame (rounded corners, a thin top bar with dots,
  matching the site's navy/teal palette). Not rebuilt as live HTML/CSS — that's a
  full application UI, out of scope for a marketing page.
- Intro copy above it, framed as a preview, not a claim of public login access —
  e.g. *"Here's what the platform looks like in practice."*
- **"Concept preview" cue (panel finding, actioned):** because the screenshot is
  photoreal, visitors will try to click the queue rows and the time-range toggles.
  A small persistent **"Concept preview"** badge on the frame (plus a
  `cursor: default` / non-interactive treatment) makes the dead interactivity
  read as *intentional*, not broken — the frame is a picture of the app, and it
  says so.
- **Planned in-action GIF (panel finding, actioned — makes "See it in action"
  honest).** Alongside the still, this section is designed to hold an **animated
  GIF/short screen-recording of the system actually running** (e.g. the terminal
  demo firing drift detection, a live GitHub Actions run going green, or the
  dashboard updating). This is the honest fulfillment of the hero's "See it in
  action" CTA (§5) — the label points at something that moves. **The GIF is a
  team-recorded asset** (I can't capture a screen recording), so v1 ships the
  still + concept badge and the GIF drops into the same slot when recorded; not an
  empty placeholder, a real still now upgraded to motion later.
- **Live-dashboard path kept open (panel note).** Framing this as a *concept
  preview* deliberately does **not** foreclose a future real, interactive
  dashboard — if one is ever hosted, this section can swap the still/GIF for a
  "Launch live dashboard" link with no restructuring. v1 is a preview by choice,
  not a dead end.
- **Ready-to-use asset, no external sourcing needed** — unlike every other visual
  in this section, the still already exists at final quality (the GIF is the only
  future add).
- **Open flag (not blocking, §7 item 10):** the screenshot has "Sophie de Vries,
  Maintenance Lead" baked into its pixels as the example logged-in user.
  Recommend leaving it — an illustrative persona inside a labeled UI-preview image
  reads differently than the fake customer-logo strip did (that implied real
  paying customers; this is clearly an interface mockup). Crop/blur it later if
  the human disagrees.
- **CTA target:** this section (`#product`) is the shared landing point for every
  "look" CTA on the page — the hero's primary `See it in action` (§5) and the
  user story's `See it in action` (§9.5, relabelled from "Open Dashboard" for the
  two-verb system). One consistent destination for "show me the product."

### 9.2 Live Factory. Real Predictions.

**Source:** `Screenshot 2026-07-21 112329.png`.

- Headline/subhead verbatim: `Live Factory.` / `Real Predictions.` (teal on the
  second line, matching the hero's headline color convention). Body copy about
  continuous monitoring and drift detection, adapted from the mockup.
- **Visual — stylized SVG placeholder, not the mockup's photoreal isometric
  render.** That level of polish needs an external AI image tool or commissioned
  illustration (see Asset production plan, §12). Ships today as a simplified
  in-code graphic: geometric floor grid, glowing teal sensor pins (one
  pulsing/highlighted), one sample alert callout card reading *"Drift Detected —
  Tool Wear Shift — 2.3 hrs to failure — View Details"* in the mockup's
  warning-red accent.
- **Machine type: CNC/milling silhouettes, not generic robot arms.** This
  project's dataset is a milling process — confirmed by the Product Preview
  dashboard's own "CNC-03" and "Tool Wear" language, and consistent with the
  "Tool Wear Shift" alert already present in this same mockup. The placeholder's
  machine shapes and sensor labels should reflect that domain specifically, not
  arbitrary factory robotics.
- Purpose: connective tissue between the hero's abstract claim and the physical
  hardware/factory context — the first section after the hero that grounds the
  page in real machines, not just dashboards.

### 9.3 How it works — the birds-eye loop (non-technical)

**Source:** `Screenshot 2026-07-21 112449.png`.

**Role in the two-loop design (panel decision — keep both loops, actioned).** The
page deliberately shows the loop **twice, at two depths, for two audiences** — and
this is the shallow one. §9.3 is the **birds-eye, plain-language** view: *what the
system does*, in outcomes, **with no tools or tech stack named.** §9.6 is the same
loop again, later on the page, **with the real tools and technical depth** for the
engineer who wants it. They are explicitly **one system shown at two zoom levels,
not two different systems** — §9.6's subhead and this section's copy should say so
in as many words, so a reader who sees both feels reinforcement, not déjà vu.

- Headline: `The AI + MLOps platform for continuous reliability` (mixed navy/blue
  per mockup), subhead: `One system. One loop. Always learning.`
- 6-node loop, verbatim structure: **Collect → Predict → Detect → Retrain →
  Improve → Business Impact**, each a card with an icon + one-line description,
  connected by curved arrow paths (top arrow feeds node 1, bottom arrow returns
  from node 5 back to node 1, matching the mockup exactly). "Business Impact" is
  visually distinct (teal border) as the loop's outcome, not just another step.
  **No tool logos here** — that's what makes it the non-technical view; the
  tool-branded diagram lives in §9.6.
- Fully producible in SVG/CSS: an icon set (pulse/heartbeat, brain, magnifying
  glass, refresh, checkmark, bar-chart) + curved `<path>` arrows + a card grid.
- **"See it in action" belongs to §9.1, not here (panel finding, actioned).** The
  earlier draft embedded the tool-branded `Retraining Loop.png` in this section —
  but that image *names the tech stack* (Python, Evidently, GitHub, DVC, MLflow),
  which contradicts this section's non-technical remit **and** made the technical
  loop appear a third time. Resolution: the *proof of it running* is the animated
  GIF planned for **§9.1**, and the tool-branded loop content moves to **§9.6**
  (rebuilt to the design system, not raw-embedded). §9.3 keeps a single
  `See it in action →` (look-verb) link to §9.1 and a `Test it on your device`
  (do-verb) link onward to §9.7 — no embedded diagram of its own beyond the
  conceptual 6-node loop.
- **Responsive:** the 6 cards are a horizontal row on desktop; on narrow
  viewports they stack vertically and the connecting arrows rotate to point
  down-the-column (or drop to simple separators). See §12 for the page-wide
  responsive rules.
- Audience: general/semi-technical — the plain-language "how it works," the
  birds-eye counterpart to §9.6's engineer-facing view of the same system.

### 9.4 Benefits grid

**Source:** `Screenshot 2026-07-21 114029.png`, `114150.png`, `114244.png`, `114318.png`.

- 4 tiles, copy verbatim from the mockups:
  - **Reduce Downtime** — "Prevent unexpected failures and unplanned stops."
  - **Extend Asset Life** — "Catch issues early and reduce wear and tear."
  - **Lower Maintenance Costs** — "Replace parts based on actual condition, not guesswork."
  - **Increase Operational Efficiency** — "More uptime. Smoother operations. Happier teams."
- **Styling fix, same class of issue as the hero's stat-tile inconsistency
  (§5):** the 4 source screenshots are visually inconsistent — some on light
  backgrounds with blue icons, some on dark backgrounds with white icons. Fixed
  here the same way: all 4 tiles render as dark navy-800 cards, teal-400 icon
  color, off-white headline, muted-slate body text. One consistent system, not
  four stitched-together screenshots.
- Purpose: a fast, non-technical scan of "why this matters to you" — deliberately
  simple, no jargon, positioned right before the deeper narrative proof in §9.5.

### 9.5 "While the employees sleep" (user story)

**Source:** `Screenshot 2026-07-21 112223.png` (originally "While Philippa Slept").

- Headline, anonymized per the human's request: **`While the employees sleep...`**
  (present tense — the mockup's named individual and past-tense framing are both
  dropped).
- **Tense/voice fix (panel finding, actioned).** The mockup's subhead
  ("The system *watched* over the factory all night") is past tense under a
  present-tense headline — a jarring mismatch. Rewrite to present, active voice:
  **`The system watches over the factory all night.`** Keep the timeline beats in
  crisp active voice too (see below).
- 5-point horizontal timeline, active-voice beats (timestamps verbatim):
  **Detects drift** (02:16) → **Triggers the pipeline** (02:16) → **Retrains the
  model** (02:20) → **Promotes the winner** (02:37) → **Reports all-clear**
  (08:47). Active verbs make the *system* the actor doing the work overnight,
  which is the whole point of the section.
- Final beat's supporting copy: **"Maintenance lead checks the dashboard"** —
  role-based, no named individual, and it matches the Product Preview dashboard's
  own persona label ("Sophie de Vries, Maintenance Lead"), so the two sections
  stay internally consistent without inventing a second fictional name.
- Below the timeline, 3-column layout from the mockup:
  - **Overnight Impact** card (left) — checklist: "1 potential failure
    prevented," "~8 hours of downtime avoided," "€24,300 saved," "Production
    stayed on track." **Locked microcopy (panel finding, actioned):** the card
    carries a small teal-outlined badge reading **"Illustrative example"** (exact
    wording, not "sample"/"scenario"/"demo" — pick one and this is it), and a
    one-line footnote: *"A walkthrough of one night — not aggregated customer
    data."* These are narrative numbers, and the label is the single line that
    stops them reading as a real historical claim (same principle that dropped the
    fake customer logos and that labels the hero's `2.3M` tile illustrative, §5).
  - **Center** — an **illustrated avatar/silhouette** (SVG/CSS), replacing the
    mockup's stock photo/video-play element. No real footage exists, and a
    stock/AI-generated photo of a person would imply a real employee the same
    way the fake customer logos implied real customers.
  - **Morning Summary** card (right) — status checkmark + "No incidents. Model
    upgraded overnight." + a **`See it in action →` CTA targeting §9.1 Product
    Preview** (`#product`). **Relabelled from "Open Dashboard"** to the page's
    canonical look-verb (§5's two-verb system) — same destination, consistent
    wording, no third synonym.
  - **Responsive:** the horizontal timeline rotates to a **vertical** timeline on
    narrow viewports (dots down the left edge, beats stacked); the 3 cards stack
    to one column. See §12.
- Closing line, verbatim: `One system. Always learning. Always protecting.`

### 9.6 The MLOps System Behind the Predictions — the technical loop (with tech stack)

**Source:** `Screenshot 2026-07-21 112150.png` + the ML repo's `README.md`
"Architecture overview" and `images/Retraining Loop.png`.

**Role & placement (panel decision, actioned).** This is the **deep** half of the
two-loop design (§9.3 is the shallow half). It is **deliberately positioned late**
on the page — after the benefits and the user story — so the tech stack is a
*reward for the interested reader*, not something forced on a first-time visitor.
Its subhead must explicitly frame it as **the same system as §9.3, one level
deeper** — e.g. *"The same loop, now with the tools that run it"* — so the
returning eye reads "ah, here's the how" rather than "wait, didn't I just see
this?" One system, two zoom levels; **not two different systems.**

- Headline: `The MLOps System Behind the Predictions`, subhead (revised per
  above): *"The same loop from '[How it works](#how-it-works)' — now with the
  tools that run it."*
- Circular 6-node diagram — **corrected to the real pipeline** now that ground
  truth exists: **Simulated/Live Sensor Data → Prediction API → Evidently Drift
  Check → GitHub Actions → DVC Pipeline (retrain) → MLflow Registry (compare &
  promote)** — loops back to sensor data. Preempt Analytics triangle mark centered
  inside the circle, curved arrow paths around it, matching the mockup's layout.
- **This is where the tool-branded loop lives (moved out of §9.3).** The ML repo's
  `Retraining Loop.png` is the **content reference** for this diagram — but it is
  **rebuilt in SVG/CSS aligned to the site's teal-400/navy-900 tokens**, not
  raw-embedded as an off-palette raster (panel finding re: design-system
  alignment — we align every mockup/asset to the system, we don't pixel-copy).
- Two side panels, content verbatim — **real**, not fabricated, confirmed against
  the project's actual stack (§4):
  - **Built With:** Python (data processing & modeling), Pandas (data analysis),
    Scikit-learn (ML modeling), NumPy (numerical computing).
  - **Powered By:** GitHub Actions (automated CI/CD for ML), DVC (data version
    control), MLflow (experiment tracking & model registry), Evidently AI (data &
    model drift monitoring).
- **Bottom strip — honest, capstone-true claims (panel finding, actioned).** The
  mockup's `Automated / Scalable / Reliable / Secure` (with subtext like
  "Enterprise ready" and "Built for any factory") **overclaims for a bootcamp
  capstone running on a simulated single-CNC dataset** — and a technical reviewer
  will clock it, undercutting the honesty the rest of the page earns. Replace with
  four claims that are **true of what actually exists**:
  **Automated** (no manual retraining) · **Reproducible** (DVC-versioned data &
  pipeline) · **Monitored** (Evidently drift checks) · **Open-source stack** (runs
  on your own machine). Same one-consistent-system icon styling as §9.4's tiles.
- **Repeat CTA (panel finding, actioned):** end this section with a
  `Test it on your device →` (do-verb) button to §9.7 — the technical reader who
  scrolled this far is *exactly* the person most likely to run it, so give them
  the door here instead of making them scroll back to the hero.
- Fully producible in SVG/CSS, including the tool brand marks via a
  permissively-licensed icon set (e.g. Simple Icons) — standard practice for
  "built with" attribution at this scale, not a trademark concern.
- Audience: the technical reader who scrolled this far — the "prove it" section
  for engineers/recruiters evaluating actual MLOps rigor, the deep counterpart to
  §9.3's birds-eye view of the same loop.

### 9.7 Try It Yourself (new subpage)

**Source:** the ML repo's own `README.md` — **resolved with real content, no
longer an open item.**

- Reached via the hero's secondary **"Test it on your own device"** CTA (§5) —
  not added to the main nav bar this round; trivial to add later (`Nav.astro`
  already supports adding a link, per §3's component structure).
- **Short teaser, not a full reproduction** — deliberately doesn't copy the
  entire README onto the landing page, to avoid two copies of setup steps
  drifting out of sync when the README changes. Content, Krug/Redish style:
  - Headline: *"Run Preempt Analytics on your own machine."*
  - One-line prerequisite: **Docker Desktop** — nothing else to install.
  - **Menu-first ordering (panel finding, actioned).** Lead with the *friendly*
    path, not raw commands — a non-coder shouldn't hit a wall of `docker compose`
    syntax first. So the primary how-to is the README's **single-keypress control
    panel**: after cloning, run `./preempt.sh` (Mac/Linux) or `.\preempt.ps1`
    (Windows) and press a number — simulate readings, open the drift report, watch
    GitHub Actions, all without typing or memorizing flags.
  - The 3 real setup commands come **second**, in a fenced block, for those who
    prefer typing:
    ```bash
    git clone https://github.com/Preempt-Analytics-Demo/predictive-maintenance-demo.git
    cd predictive-maintenance-demo
    docker compose up -d
    ```
  - One line naming what happens next without walking through it here (drift
    detection, retraining, promotion) — the full walkthrough, all simulation
    modes, and the direct-API `curl` examples live in the README, not duplicated
    on this subpage.
  - **Shared-resource expectation (panel finding, actioned).** One honest line so
    a first run doesn't read as "broken": *"Retraining runs on a shared demo
    pipeline (about 10 runs/hour for everyone combined) — if it's busy, your data
    still uploads and your run simply queues."* Sets the expectation the README
    documents, so a queued run looks intended, not failed.
  - A prominent **"Full instructions on GitHub →"** button linking to
    `github.com/Preempt-Analytics-Demo/predictive-maintenance-demo` (the
    README's own URL) — the actual destination for anyone who wants to run it.
- Reuses `BaseLayout` + `Nav` + `Footer`, same pattern already documented for
  future pages in §2 item 5.

### 9.8 Footer / Project & team

**Source:** the ML repo's own `README.md` "Team" section — **resolved with real
content, no longer just a structural placeholder.**

- **About** — a one-line project blurb adapted from the README's "What this
  project does": *"Predictive maintenance for industrial equipment — a complete
  MLOps pipeline: live sensor predictions, automated drift monitoring, and
  self-triggering retraining."* **Owns the capstone framing** (see below) so it
  reads as an honest project showcase, not a company pretending to have customers.
- **Team** — Nate ([@envelopingCODE](https://github.com/envelopingCODE)), Ivo
  ([@undorigo](https://github.com/undorigo)) — *"neuefische AI Engineering
  Bootcamp · Cohort 2026."* Reused as-is; already public in the ML repo's README.
- **Links** — GitHub repo (`Preempt-Analytics-Demo/predictive-maintenance-demo`),
  a link to this architecture doc's repo, **and `Test it on your device` → §9.7
  Try It Yourself** (panel finding, actioned — this gives the otherwise-orphaned
  subpage a permanent home reachable from anywhere on the page, not just the one
  hero CTA). *"Get in touch" is intentionally deferred to a later stage.*
- **Privacy line (panel finding, actioned):** a short, plain statement —
  *"This site uses no analytics and no tracking. Nothing you do here is logged."*
  It's true (a static GitHub Pages site with no scripts phoning home), it's
  reassuring, and stating it is essentially free. Revisit only if analytics is
  ever deliberately added.
- **Legal/meta** — copyright line, "built with" credit line (placeholder text —
  minor, non-blocking).

**Capstone-showcase framing (panel finding, actioned).** Right now the page reads
as a polished SaaS until the footer quietly reveals it's a bootcamp capstone —
that late reveal can feel like a bait-and-switch to the recruiter/instructor
audience this page is actually for. **Lean into it instead:** a small, honest
signal that this is a **capstone project showcase** built on **simulated CNC
sensor data** — placed once, low-key (a hero eyebrow addendum or a slim ribbon
near the top, exact placement TBD), not scattered. For this audience "impressive
student capstone" is a *stronger* frame than "SaaS with no customers," and it
retro-justifies every honesty choice already made (dropped logos, labelled
illustrative numbers, capstone-true claim strip). This resolves the panel's
"is this real or a student project?" tension by answering it up front.

---

## 10. Social preview (SEO/OG), explained

"Social preview" is what a shared link looks like when pasted into Slack,
iMessage, LinkedIn, etc. — title, description, and a preview image, controlled by
`<meta property="og:...">` tags in the page `<head>`. Separately, a plain `<meta
name="description">` tag affects how the page's snippet looks in Google search
results. **Neither requires any personal information** — they're page-level
metadata, not tied to individual identity.

Scoped to the project, not individuals (per the human's request): title something
like *"Preempt Analytics — Predictive Maintenance,"* a one-line project
description, an OG image (can reuse the hero's visual treatment or the §9.1
Product Preview screenshot), and any "learn more" attribution pointed at the
**GitHub repo/org**, not at individual names or social profiles. This is a small,
mechanical addition once the page exists — not a blocker for anything above.

---

## 11. Asset production plan

**Governing principle (panel finding, actioned): align, don't pixel-copy.** Every
mockup and every borrowed asset (the dashboard screenshot, the Retraining Loop
diagram, the benefit tiles) is a **content/reference source**, not a
drop-in — the implementation rebuilds each one to the site's design system
(teal-400/navy-900 tokens, one icon family, consistent card/border treatment) so
the finished page reads as one system, not a scrapbook of stitched-together
images. The two exceptions below (finished screenshots used inside a frame) are
deliberate and labelled as such.

**Ready to use as-is (finished images, shown inside a frame, not restyled):**
- The Product Preview screenshot (§9.1) — a finished, high-quality image; needs
  only the browser-chrome CSS frame + "Concept preview" badge, no rebuild.

**Producible directly in code (SVG/CSS/HTML), no external tool needed:**
- §9.3's birds-eye process loop (icons, cards, curved SVG arrows) — no tool logos.
- §9.6's circular technical diagram — **rebuilt in SVG/CSS aligned to the site
  tokens**, using the ML repo's `Retraining Loop.png` as the *content reference*
  (not raw-embedded — see the governing principle). Real open-source tool marks
  via a permissively-licensed icon set (e.g. Simple Icons).
- §9.5's timeline component (horizontal → vertical responsive) + illustrated
  avatar/silhouette.
- §9.4's 4 benefit-tile icons, restyled for consistency.
- §9.2's stylized CNC-mill factory placeholder.
- All gradient/glow/particle CSS overlays, consistent with the hero's treatment
  (§5), and all **motion gated behind `prefers-reduced-motion`** (§12).

**Image performance (panel finding, actioned).** The two raster images (the
dashboard screenshot, and any recorded GIF) are heavy. Route static images through
Astro's `astro:assets` `<Image>` (responsive `srcset`, modern formats, explicit
width/height to avoid layout shift) rather than dropping them unoptimized into
`public/`; lazy-load everything below the fold. A large GIF should be delivered as
a looping muted `<video>` (WebM/MP4) instead of an actual `.gif` — an order of
magnitude smaller. See §12.

**Still needs external sourcing (none block building the sections above):**
- **§9.1's in-action GIF/clip** — a team-recorded screen capture of the system
  running (I can't record one). v1 ships the still + concept badge; the clip drops
  into the same slot later.
- Hero macro-gears photo (open item since the hero session).
- A future photoreal/commissioned upgrade of §9.2's factory visual (v2, not v1).
- A real logo/icon mark (open item since the hero session).

---

## 12. Cross-cutting build standards

Page-wide rules that apply to every section, collected here so they're specified
once rather than rediscovered per-component. Most of these are direct results of
the expert-panel audit.

**Responsive strategy (panel finding, actioned).** The design is horizontally
biased — a 6-card loop (§9.3), a 5-point timeline (§9.5), a circular diagram
(§9.6), a dense dashboard image (§9.1). None of these may shrink into an
illegible strip on a phone. Rules:
- The horizontal loop (§9.3) **stacks vertically**; its arrows rotate to point
  down the column (or become simple separators).
- The horizontal timeline (§9.5) becomes a **vertical timeline** (dots down the
  left edge, beats stacked).
- The circular diagram (§9.6) **linearizes** to a vertical node list on narrow
  viewports rather than scaling the circle down to unreadable.
- The dashboard image (§9.1) gets a **"view full size"** affordance (tap to open
  the full-resolution frame) instead of being crushed to a thumbnail.
- Body layouts use fluid/flex/grid; nothing assumes a desktop width. Mobile nav
  collapses to a standard menu (hamburger) — the desktop link row won't fit.

**Motion & `prefers-reduced-motion` (panel finding, actioned).** The site is
animation-heavy (pulsing sensor pins §9.2, loop arrows §9.3/§9.6, particle/glow
overlays §5, any §9.1 clip). A single blanket rule in `global.css` — under
`@media (prefers-reduced-motion: reduce)` — disables/settles all non-essential
motion (animations reduced to their end state, autoplaying clips paused with a
play control, no infinite pulses). Every animated component inherits this; it is
not re-decided per section.

**Text alternatives for image-borne information (panel finding, actioned).**
Information carried as pixels is invisible to screen readers. Rules:
- The §9.1 dashboard screenshot gets **descriptive `alt` text** plus a short
  **visually-hidden text summary** of what it shows (the key tiles/queue), so a
  non-sighted visitor gets the point, not just "dashboard image."
- The §9.6 diagram, being rebuilt in SVG, is authored with a `<title>`/`<desc>`
  and readable text labels (a rebuilt SVG is inherently more accessible than the
  raster it's replacing — a side benefit of the align-don't-copy rule).
- Every meaningful image has real `alt`; decorative overlays are `alt=""`.

**Focus states & hit targets (panel finding, actioned — kept lightweight).** All
interactive elements (nav links, CTAs, the §9.2 "View Details" callout, footer
links) get a **visible focus ring** (not `outline: none`) and a **≥44px** touch
target. This is a small, blanket component-convention line, not a per-element
retrofit — deliberately scoped to stay within a capstone's effort budget.

**Dark-only, by design (panel finding, actioned).** The site ships **dark theme
only** — a deliberate choice matching the futuristic/cyberpunk direction, not an
unfinished light mode. No light-mode variant is planned or half-built; the theme
tokens (§5) are single-valued. Stated here so nobody starts a light theme later
"to be safe."

**No analytics, no tracking (panel finding, actioned).** The site loads **no
analytics, no third-party scripts, no cookies, no tracking** — it's static
GitHub Pages with nothing phoning home, which sidesteps consent-banner/GDPR
obligations entirely. This is surfaced to visitors as a short footer line (§9.8).
If analytics is ever added deliberately, this decision (and the footer line) must
be revisited.

**Minor completeness adds.** A **"back to top"** affordance on long scroll
(panel finding, small), and the existing favicon/`404` placeholders tracked in
§7. "Get in touch" contact is **intentionally deferred** to a later stage.

**Deliberately NOT done this round (panel findings the team chose to defer):**
- **Audience signposting** ("for operators / for engineers" cue) — judged
  over-engineered; who the product is for becomes clear from the description
  itself. Revisit only if user testing shows confusion.
- **Full semantic linearization / ARIA authoring of the timeline & circular
  diagram** (beyond the alt-text/focus basics above) — judged too complex for a
  capstone's scope. The basics ship; deep assistive-tech authoring does not.
- **"Get in touch" / contact channel** — deferred to a later stage (§9.8).
