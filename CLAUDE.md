# Preempt Analytics — Landing Page
## Engineering Laws & Integration Contract

These laws govern every change made to this codebase — by humans and AI assistants
alike. This is a **single static Astro site**, not the coupled multi-process system
the ML repo (`predictive-maintenance-demo`) is — there is no training pipeline, no
registry, no database. The coupling here is much smaller: a handful of shared
constants, one JSON data contract, and a base-path convention. The laws below are
scaled to that reality, not copy-pasted from the ML repo's `CLAUDE.md`.

**Where things live:** the durable *why* behind design/build decisions is
`docs/ARCHITECTURE.md` — read it before making a structural change. Session-to-
session state lives in the dated files under `claude-handover/` (newest wins).
This file is neither of those — it's the standing rules that don't change session
to session.

---

## THE LAWS

### Zeroth Law — Intent Fidelity
Preserve the developer's intent. When a change is ambiguous or touches a shared
contract (see Integration Contracts below), surface the risk before executing.
Never make irreversible changes — force-pushing, rewriting history, deleting a
handover doc, changing `astro.config.mjs`'s `base` — without stating the
downstream effect first.

### First Law — Outcome Integrity
A change is not complete until the **build + deploy contract** still holds, not
just because the edited file looks right in isolation:

```
Build contract : npm run build passes → both routes (/,  /try-it-yourself/) render
                 → internal links resolve under base: '/landing-page'
Deploy contract: fetch-metrics.mjs must fail open → deploy.yml builds → GitHub
                 Pages serves it
```

**Why "fail open" is part of the outcome, not an implementation detail:** the
outcome that actually matters is "the live public site is up and current." Live
model metrics are a bonus layered on top of that outcome, not a precondition for
it. A missing/expired `DAGSHUB_TOKEN` or a DagsHub outage may only ever degrade
the hero to sample data (see `metrics.json`'s `_meta.source`) — it must never
break the build. If a future edit to `fetch-metrics.mjs` removes one of its
`try/catch` layers and lets an error propagate, every deploy starts failing
silently in unattended CI until someone happens to notice — exactly the "looks
fine in isolation, breaks the real outcome unattended" failure mode this Law
exists to catch.

Run `npm run build` before considering any non-trivial change finished.

### Second Law — Elegant Sufficiency
Use the simplest change that satisfies the First Law. This is a marketing site —
resist adding state management, client-side JS, new dependencies, or abstraction
layers unless a specific requirement can't be met without them. Astro's default
(zero client JS, static HTML) is the right shape for almost everything here.

### Third Law — Compatibility & Longevity
Maintain contract stability across the files listed in Integration Contracts
below. Where a cleaner internal design would require changing a shared contract
(the `site.ts` exports, the `metrics.json` shape, the base path), prefer the
stable design unless the contract change is explicit and every dependent file is
updated in the same change.

### Standing Protocol — Platform Agnosticism
This project is built and run across Windows, Mac, and Linux — never assume a
Unix-only environment just because local dev happens to be on one. Concretely:
  - Node scripts use `node:path`'s `join`/`resolve` (already the pattern in
    `fetch-metrics.mjs`) — never hardcode `/`-separated paths.
  - `package.json` scripts avoid shell-specific syntax — bash-only globbing,
    `rm -rf`, `cp`, inline `export VAR=` — that behaves differently or fails
    outright under Windows' `cmd`/PowerShell. Prefer plain Node or a small
    cross-platform package (e.g. `rimraf`, `cross-env`) over a script that only
    works in one shell.
  - **Never chain commands with `&&` as the only form shown in docs** — it fails
    as a parser error in Windows PowerShell 5.1 (chaining with `&&`/`||` was only
    added in PowerShell 7+). Show commands one per line, or give both a bash and
    a PowerShell form when chaining genuinely matters.
  - File paths and import specifiers must match exact case. A Mac's default
    filesystem is case-insensitive, so a wrong-case import (`../Components/Foo`
    vs. `../components/Foo`) can work locally and only fail once it hits GitHub
    Actions' case-sensitive Ubuntu runner. Match case exactly, every time.
  - **Native optional dependencies can silently resolve to the wrong platform's
    binary.** Packages like Vite ship OS-specific native optional deps
    (`@rolldown/binding-*`, etc.), and a known npm bug
    ([npm/cli#4828](https://github.com/npm/cli/issues/4828)) can let a lockfile
    drift onto a dependency chain missing the binary for someone else's OS —
    it'll work fine on whichever machine generated the lockfile and break with a
    "Cannot find native binding" error on every other platform. If that happens:
    delete `node_modules` and `package-lock.json`, then reinstall. **This already
    happened once** — see the incident logged in `claude-handover/`.
  - Any instructions written for a human to run locally should give both a
    Mac/Linux and a Windows form where they differ — the same discipline the ML
    repo's own README already follows, and now this repo's `README.md` does too.

### Standing Protocol — Transparency
Before any change that touches an Integration Contract, state:
  1. Which contract is affected
  2. Which other files depend on it
  3. Whether those files are being updated in the same change

### Standing Protocol — Comments
Keep comments short, but make them count as **brief educational signposts** — not
the ML repo's mandatory two-layer protocol (a prose paragraph per section, a
phrase per line), but not comment-free either. A one-line comment is worth adding
wherever it helps a reader who doesn't already know this codebase, Astro, or
Tailwind well quickly understand *what* a non-obvious block does or *why* it's
shaped that way — not only when it's a hidden constraint or a gotcha. For example:
a short line on why `metrics.ts` takes the `max()` of two `promoted_at` dates, or
why `fetch-metrics.mjs` wraps each model fetch in its own `try/catch` (see the
First Law above), earns its place. Skip comments on code that already reads like
plain English (`export const X = ...`, a single Tailwind class list) — the goal is
quick orientation for a reader, not a running narration of every line.

### Standing Protocol — Commit Discipline
**Deliberately not the ML repo's "commit and push after every change" policy** —
that was justified there by an unattended, live automated retrain loop where
silent failures hide for hours. This repo has no equivalent background process.
Instead:
  - Batch a logical change into one commit; don't split one reason for changing
    across multiple commits, and don't bundle two unrelated reasons into one.
  - Every push to `main` triggers `deploy.yml`, which publishes straight to the
    live public site (`ARCHITECTURE.md` §6–§7) — so a push is a real release, not
    a save point. Verify the build locally first (see Pre-Push Verification).
  - Only commit/push when actually asked to, or when it's the clearly agreed next
    step in a session — not proactively after every file edit.

### Standing Protocol — Pre-Push Verification
Before pushing any non-trivial change:
  1. `npm run build` — must pass. This is the entire "runtime dependency check"
     this repo needs; there's no separate container/binary environment to drift
     from what `npm ci` installs.
  2. New npm package → confirm it landed in both `package.json` **and**
     `package-lock.json` (commit both together).
  3. New internal link → uses `withBase()` from `src/lib/site.ts`, not a
     hardcoded root-absolute `href="/..."` (breaks under the `/landing-page` base
     path — see Danger Zones).
  4. If a change touches `scripts/fetch-metrics.mjs` or `metrics.json`'s shape,
     confirm it still fails open — a missing/invalid `DAGSHUB_TOKEN` must never
     break the build or show `undefined` on the page.

### Meta-Law — Conflict Resolution
Laws are ordered. When they conflict, state the conflict, justify the resolution,
and resolve in hierarchy order.

---

## INTEGRATION CONTRACTS

The shared interfaces where a change in one file breaks another elsewhere in the
site. Check every applicable contract before committing.

---

### Contract 1 — Shared Site Constants

**Owner:** `src/lib/site.ts`
**Dependents:** `Nav.astro`, `Footer.astro`, `Hero.astro`, `MlopsSystem.astro`,
`try-it-yourself.astro` (and any future page/component needing the repo URL, team
list, program name, nav links, or `withBase()`)

Single source of truth for content that would otherwise drift if copy-pasted:
the ML repo's URL, the team's names/handles, the bootcamp credit line, and the
nav's label/href pairs. **Never hardcode any of these inline in a component** —
import from here so a change (e.g. a renamed repo, a new team member) is a
one-file edit instead of a grep-and-replace across the codebase.

---

### Contract 2 — Metrics Data Shape

**Owner:** `scripts/fetch-metrics.mjs` (writes), `src/data/metrics.json` (committed,
CI-overwritten)
**Dependents:** `src/lib/metrics.ts` (reads) → `StatRow.astro` (renders)

**What is locked:**

| Field | Controls | If changed without updating dependents |
|---|---|---|
| `_meta.source` (`"live"` \| `"sample"`) | Whether hero tiles show a "live" dot or a "sample metric" caption | Honesty labeling breaks — a sample number could silently read as live, or vice versa |
| `binary_model.metrics.recall_test` | The Failure Recall stat tile's value | `metrics.ts`'s `failureRecallPct()` reads this exact path |
| `binary_model.promoted_at` / `multiclass_model.promoted_at` | "Last retrained" relative-time caption | `metrics.ts`'s `lastPromotedAt()` takes the max of both |

`src/data/metrics.sample.json` is the never-overwritten seed/fallback — don't let
`fetch-metrics.mjs` write to it. If the DagsHub MLflow REST path changes (see
`ARCHITECTURE.md` §3's landmine — the anonymous read 404'd, the authenticated path
is unconfirmed), update the fetch script, not the shape consumers expect.

---

### Contract 3 — Base Path

**Owner:** `astro.config.mjs` (`base: '/landing-page'`)
**Dependents:** every internal `href`/`src` anywhere in `src/`

The site deploys to a GitHub Pages *project* page, not a domain root. Any
root-absolute internal link (`href="/try-it-yourself"`) resolves to the wrong
URL in production even though it works in local dev without the prefix confusion
being obvious. **Always** route internal links through `withBase()`
(`src/lib/site.ts`) or Astro's own asset/image handling, which already respects
`base`.

---

### Contract 4 — Design Tokens

**Owner:** `src/styles/global.css`'s `@theme` block
**Dependents:** every component's Tailwind utility classes (`bg-navy-900`,
`text-teal-400`, etc.), verified contrast ratios in `ARCHITECTURE.md` §5

Color values are defined exactly once. Don't introduce a one-off hex value in a
component — add or reuse a token here, so the whole site stays one consistent
palette instead of drifting per-component (the exact failure mode the stat-tile
and benefit-tile mockups shipped with, and that `ARCHITECTURE.md` explicitly
fixed).

---

## PRE-CHANGE CHECKLIST

| Change type | Check |
|---|---|
| Edit `src/lib/site.ts` | Every dependent component still reads the same export names? |
| Edit `metrics.json`'s shape | `metrics.ts` and `StatRow.astro` updated in the same change? |
| Add an internal link | Routed through `withBase()`, not hardcoded? |
| Add a color | Added to `@theme` in `global.css`, not inlined as a raw hex? |
| Add an npm dependency | In `package.json` **and** `package-lock.json`? `npm run build` still passes? |
| Add or edit an npm/Node script | Works identically on Windows, Mac, and Linux? Uses `node:path`, not hardcoded `/` separators or bash-only syntax? |
| Add/edit a section component | Matches the design spec in `ARCHITECTURE.md` §9 for that section, or is the spec being updated too? |
| Touch `.github/workflows/deploy.yml` | Still fails open if `DAGSHUB_TOKEN` is unset? Still only one workflow (§6's "why one, not two")? |

---

## DANGER ZONES

Gotchas already discovered this project — consolidated here from `ARCHITECTURE.md`
and the handover docs so they don't have to be rediscovered:

- **Never copy the DagsHub token/SSH key from the ML repo's `.env.demo` or
  `.dvc/config`.** This repo mints its own, narrowly-scoped credential. See
  `ARCHITECTURE.md` §4, §7.
- **No third-party scripts or remote font links** (e.g. Google Fonts `<link>`).
  The footer states "no analytics and no tracking" — adding one makes that false.
  Self-host any custom font instead.
- **Dark-only is deliberate**, not an unfinished light mode. Don't half-build a
  light theme "to be safe" — `ARCHITECTURE.md` §12 settles this.
- **`MlopsSystem.astro` (§9.6) renders a rebuilt SVG with real pipeline labels on
  purpose** — never swap it for a raw embed of the ML repo's
  `images/Retraining Loop.png`. That raster is a *content reference*, not a
  drop-in asset (the "align, don't pixel-copy" rule, §11).
- **The two-verb CTA system is settled**: "See it in action" (look → `#product`)
  and "Test it on your device" (do → `/try-it-yourself`). Don't introduce a third
  synonym CTA label — it was deliberately consolidated from more (`ARCHITECTURE.md`
  §5, panel-audit round).
- **Illustrative numbers must stay labeled illustrative.** The Overnight Impact
  card's €24,300/etc. and the hero's `2.3M` sensor tile are narrative/marketing
  copy, not measured data — don't let a future edit drop the "Illustrative
  example" / "illustrative" captions that keep them from reading as real claims.
- **`fetch-metrics.mjs` must fail open, always.** A missing/invalid
  `DAGSHUB_TOKEN`, a DagsHub outage, or an API shape change should keep the
  last-committed `metrics.json` values and log a warning — never break the build,
  never render `undefined`.
- **Nav order/labels are settled**: `Product · How It Works · Solutions ·
  Tech stack · Project & team`. Don't relitigate without a new mockup-driven
  reason — see `ARCHITECTURE.md` §5.
- **Case-sensitive imports.** An import that works locally on a Mac's
  case-insensitive filesystem can still break the build in CI, since GitHub
  Actions' Ubuntu runner is case-sensitive. Match file-path case exactly.
- **Rolldown-vite lockfile drift already broke `npm run dev` on Windows once**
  (real incident, not hypothetical — see `claude-handover/`). A lockfile
  generated on one OS can resolve onto a native optional-dependency chain
  missing another OS's binary. Symptom: `Cannot find native binding` /
  `Cannot find module '@rolldown/binding-*'`. Fix: delete `node_modules` +
  `package-lock.json`, reinstall. Worth a second look if `npm install` is ever
  run right after bumping Astro/Vite/Tailwind versions.
- **Every push to `main` deploys live** (once Pages + secrets are configured,
  per `ARCHITECTURE.md` §7 item 5's open branch-protection item). Treat `main` as
  production, not a scratchpad.

---

## COMPONENT QUICK-REFERENCE

| File | Role | Reads from | Writes to / consumed by |
|---|---|---|---|
| `scripts/fetch-metrics.mjs` | CI live-metrics fetch | DagsHub MLflow REST API | `src/data/metrics.json` |
| `src/lib/metrics.ts` | Metrics accessor | `src/data/metrics.json` | `StatRow.astro` |
| `src/lib/site.ts` | Shared constants + `withBase()` | — | `Nav`, `Footer`, `Hero`, `MlopsSystem`, `try-it-yourself` |
| `astro.config.mjs` | Site/base config | — | every internal link via `withBase()` |
| `src/styles/global.css` | Design tokens, motion/focus rules | — | every component's Tailwind classes |
| `src/layouts/BaseLayout.astro` | Page shell, SEO/OG meta | `site.ts` | wraps every page in `src/pages/` |
| `.github/workflows/deploy.yml` | CI/CD | secrets `DAGSHUB_USERNAME`/`DAGSHUB_TOKEN`, var `MLFLOW_TRACKING_URI` | GitHub Pages |
