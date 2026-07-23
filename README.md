# Preempt Analytics — landing page

Public marketing site for the [Preempt Analytics predictive-maintenance capstone](https://github.com/Preempt-Analytics-Demo/predictive-maintenance-demo).
Built with **Astro + Tailwind CSS v4**, deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build → dist/
npm run preview    # preview the production build
```

Requires Node 22+. The site is **dark-only by design** and ships **no analytics / no
tracking**.

**Windows note:** run these one per line, not chained with `&&` — that syntax fails
in Windows PowerShell 5.1. If `npm run dev` errors with `Cannot find native binding`
/ `Cannot find module '@rolldown/binding-*'`, the lockfile has drifted onto the
experimental rolldown-vite dependency chain and is missing your platform's native
binary (a known npm optional-deps bug — [npm/cli#4828](https://github.com/npm/cli/issues/4828)).
Fix: delete `node_modules` and `package-lock.json`, then `npm install` again.

## Live metrics

The hero stat tiles can show real numbers (production model recall + last-retrained
time) fetched at build time from DagsHub's MLflow API:

```bash
npm run fetch-metrics   # writes src/data/metrics.json (needs DAGSHUB_* env vars)
```

Without credentials it **fails open**: the committed `src/data/metrics.json` sample
values are used and the tiles label themselves `sample metric` (never faked as live).
See `.env.example` and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) §4.

## Deploy (first-time setup)

CI (`.github/workflows/deploy.yml`) fetches metrics → builds → deploys on every push
to `main` (and hourly). Before it goes green:

1. **Settings → Pages → Source → "GitHub Actions"**
2. Add secrets `DAGSHUB_USERNAME`, `DAGSHUB_TOKEN` (token minted **fresh** for this
   repo — never copied from the ML repo) and variable `MLFLOW_TRACKING_URI`.

## For contributors

- **Architecture & design decisions:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the living source of truth for *why* the site is built the way it is.
- **Picking up a Claude session?** Read the latest dated file in [`claude-handover/`](claude-handover/) first, then run its ground-truth verify commands before editing.

## Structure

```
src/
├── components/          # Nav, Hero, Footer, StatCard, Button, Logo …
│   └── sections/        # ProductPreview, LiveFactory, HowItWorks, Benefits, UserStory, MlopsSystem
├── layouts/BaseLayout.astro
├── pages/               # index.astro, try-it-yourself.astro
├── data/                # metrics.json (CI-refreshed) + metrics.sample.json
├── lib/                 # site constants, metrics helpers
└── styles/global.css    # @theme tokens, reduced-motion, focus
scripts/fetch-metrics.mjs # CI: DagsHub MLflow → metrics.json
```
