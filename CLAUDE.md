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
Build contract : npm run build passes → all 6 routes render (/, /product/,
                 /try-it-yourself/ × English + German — Contract 8)
                 → internal links resolve under base: '/landing-page'
                 → every de.ts key matches en.ts's shape (TS build error otherwise)
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

### Standing Protocol — Digital Sovereignty & Privacy
Default to European-hosted/operated infrastructure, CDNs, and services wherever a
real choice exists. Avoid China-, Russia-, and North Korea-linked infrastructure
entirely for supply-chain and cybersecurity reasons — this isn't just the site's
own "no analytics / no tracking" stance (Danger Zones), it extends to the tooling
and services used to build and ship it. US-based providers are acceptable only as
a fallback when no viable alternative exists, given weaker GDPR alignment — e.g.
`registry.npmjs.org` is used because there is no realistic full EU-hosted mirror
of the public npm package ecosystem, not because a US registry is preferred.
  - **Check the resolved registry domain before trusting a regenerated
    lockfile.** A personal machine's global `~/.npmrc` can silently point
    `npm install` at a third-party mirror — already happened once:
    `registry.npmmirror.com` (a China-hosted mirror) baked into every `resolved`
    URL of a regenerated `package-lock.json`. If `package-lock.json`'s
    `resolved` fields aren't `registry.npmjs.org`, regenerate explicitly with
    `npm install --registry https://registry.npmjs.org/` and flag it — a
    contributor's personal global npm config must never leak into a shared,
    committed lockfile.
  - No big-tech telemetry or analytics, from any provider, in any part of the
    stack — build tooling, CI actions, or any future third-party service
    considered for this repo, not just the shipped site.

### Standing Protocol — Multi-Instance Collaboration
This repo is routinely worked on by more than one Claude Code instance at once —
a teammate's parallel session, another window on a different machine. Treat
that as the normal case, not an anomaly:
  - Before merging or pushing, `git fetch` and check for divergent remote
    history — that's expected here, not a sign something went wrong.
  - Default to **merging** another instance's committed work, not force-pushing
    over it or rebasing it away. Resolve conflicts by combining intent from
    both sides, not by unilaterally picking one.
  - If a file has *uncommitted* changes that don't match anything you just did,
    assume another live session owns them. Don't stash, edit, revert, or commit
    over them without asking first. `git stash` is fine to *unblock* your own
    work as long as the stashed content is restored unchanged afterward.
  - When changes genuinely can't be reconciled automatically — two different
    fixes to the same function, two different values for the same data field —
    stop and surface the conflict to the user with both versions shown, rather
    than guessing which one should win.

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

### Standing Protocol — Verification Artifact Hygiene
Screenshots, browser captures, and other one-off files produced only to verify
a change — not a shipped asset — are not deliverables. Clean them up once
they've served their purpose instead of letting them accumulate across a
session.
  - Write them to the harness's scratchpad/OS temp directory, never into this
    repo's working tree (`/tmp` inside a Bash tool call on this project's
    Windows setup resolves to a real Windows temp folder, not the repo — still
    prefer the actual scratchpad path so this stays true regardless of shell).
  - Delete them once you've looked at them and confirmed the result — don't
    leave a growing pile of `*.png` verification shots for a later session to
    trip over or clean up.
  - If a capture is later needed as a real reference asset (e.g. for
    `docs/IMAGE_ASSETS.md` or a design discussion), move it deliberately into
    `design/mockups/` or similar — don't let verification exhaust and real
    design references live in the same undifferentiated pile.

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
the ML repo's URL, the team's names/handles, the bootcamp credit line, the
Kaggle source-dataset URL/name, and the nav's label/href pairs. **Never
hardcode any of these inline in a component** — import from here so a change
(e.g. a renamed repo, a new team member) is a one-file edit instead of a
grep-and-replace across the codebase.

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
| `binary_model.metrics.precision_test` | The Failure Precision stat tile's value (replaced the old illustrative "2.3M Sensor Readings/Day" tile, 2026-07-30 — same live source as recall, no reason for one real stat to sit next to a fake one) | `metrics.ts`'s `failurePrecisionPct()` reads this exact path |
| `binary_model.metrics.brier_score` | `/product`'s Model Health "Calibration" tile (added 2026-08-05 — scores the *probabilities*, not just the yes/no call, so it answers the one question recall and precision can't) | `metrics.ts`'s `brierScore()` reads this exact path |
| `binary_model.metrics.overfit_delta` | `/product`'s Model Health "Train/Test Gap" tile | `metrics.ts`'s `overfitGap()` reads this exact path |
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

### Contract 5 — Dashboard Panel Registry

**Owner:** `src/lib/dashboard.ts` (`DASHBOARD_PANELS`)
**Dependents:** `ProductPreview.astro`'s sidebar + tabpanel shell (`/product`)

`/product`'s dashboard is a real clickable sidebar, not a single static image.
Each of the 9 items in `DASHBOARD_PANELS` has a `mode` — `'image'` (a labelled
"Dashboard preview" screenshot), `'html'` (real markup, e.g. live metrics), or
`'soon'` (in-development placeholder) — and that field is the **only** thing
that decides how `ProductPreview.astro` renders that panel. This is what lets
a panel be promoted or demoted (e.g. `'soon' → 'image'` once a concept
screenshot is generated, or `'image' → 'html'` once real data exists) as a
one-line registry edit plus one template branch, never a shell rewrite.

**What is locked:**

| Field | Controls | If changed without updating dependents |
|---|---|---|
| `mode` | Which branch of `ProductPreview.astro` renders that panel's content | A panel with no matching branch (or no imported asset for an `'image'` id) renders nothing/breaks the build |
| `id` | Which asset/content block a panel maps to (`PANEL_IMAGES`, the `model-health`/`settings` branches in `ProductPreview.astro`) | Renaming an id without updating those maps orphans the panel |

Adding a new `'image'`-mode panel needs both a registry entry **and** an
entry in `ProductPreview.astro`'s `PANEL_IMAGES`/`PANEL_ALT` maps in the same
change. Adding a new `'html'`-mode panel needs a new id-specific branch in
the same file. See `docs/IMAGE_ASSETS.md` items 12–13 for the two existing
generated concept screenshots (Alerts, Predictions) and their crop recipe.

---

### Contract 6 — Recorded Run Fixture

**Owner:** `scripts/record-live-machines.py` (writes), `src/data/live-machines.json`
(committed)
**Dependents:** `src/lib/live-machines.ts` (reads) → `ProductPreview.astro`'s
`live-machines` panel + its replay script

`/product`'s Live Machines panel replays a **recording of a real run**, not live
data and not a simulation running in the browser. The recorder loads the actual
`@production` models from DagsHub (anonymous read works) and drives the ML repo's
own `generate_raw_reading()` / `engineer_features()`, so every sensor value and
every probability in the fixture came out of the real system.

**Manual, never CI.** The recorder needs the ML repo checked out as a sibling
(`../predictive-maintenance-demo`); running it from CI would couple this repo's
build to a second repository for no benefit. The JSON it writes is committed —
that committed file is what the build consumes.

| Field | Controls | If changed without updating dependents |
|---|---|---|
| `_meta.fields` | Column order within every frame. The client reads indices **from this array**, never hardcoded | Reorder it without the client re-reading it and every sensor silently displays another sensor's value |
| `_meta.step_seconds` / `_meta.started_at` | The replay clock | Wrong simulated timestamps |
| `_meta.binary_model_version` / `multiclass_model_version` | The "models v36 / v32" provenance line | The panel misattributes which model produced the numbers |
| `machines[].frames[]` | One frame per timestep, arity must equal `_meta.fields.length` | A short/long frame shifts every later column |

**Never fabricate frames by hand.** The whole point of this panel is that it is
real; a hand-edited probability would be indistinguishable on screen from a
recorded one, which is exactly the failure mode the "Recording · not live" badge
and the provenance caption exist to prevent. Re-record instead.

**Never add `--export-on-drift` (or the drift/export flags) to the recorder.**
Those push to DagsHub and fire the ML repo's GitHub Actions retrain pipeline.
The recorder deliberately runs no server, writes nothing to `simulation.db`, and
triggers nothing.

---

### Contract 7 — Savings Calculator Assumptions

**Owner:** `src/lib/savings.ts`
**Dependents:** `SavingsCalculator.astro` (homepage, directly after
UserStory), `UserStory.astro`'s Overnight Impact card

The homepage's "What could this save you?" slider (added 2026-08-07, moved
below UserStory 2026-08-07) is partially grounded, not a fully invented
marketing calculator: it applies `failureRecallPct()` (Contract 2, live
production-model recall) directly to the visitor's own monthly
unplanned-downtime cost — the share of failures the model currently catches
is treated as the share of that cost avoided. That is the *only* multiplier
in the formula; no second, invented percentage is stacked on top of it.

`OVERNIGHT_IMPACT_EUR` (the €24,300 one-night figure) is defined once here,
not inline in `UserStory.astro`, so if a future change re-introduces a
second place that quotes "one night's impact," both read the same number
instead of drifting apart into two different figures.

**No more cross-component DOM wiring (removed 2026-08-07):** an earlier
version had `SavingsCalculator.astro`'s client script reach outside its own
section to live-update a "≈ N days like this, every month" figure inside
`UserStory.astro`'s Overnight Impact card, via a shared `[data-savings-days]`
hook. Human-requested removal — the linked stat read as confusing rather
than illuminating for an average visitor. `UserStory.astro` now just links
forward to the calculator ("try your own numbers in the calculator below
↓") with no figure of its own to keep in sync; `SavingsCalculator.astro`
lost the parallel "≈ N days like the one above" line the same way. If a
similar cross-component live-updated figure is added back later, restore
that DOM-hook discipline rather than reinventing it ad hoc.

| Field | Controls | If changed without updating dependents |
|---|---|---|
| `OVERNIGHT_IMPACT_EUR` | (via `formatEur`) the €-figure `UserStory.astro`'s Overnight Impact card displays | `UserStory.astro`'s "one night" figure goes stale relative to the constant |
| `SAVINGS_SLIDER` (`min`/`max`/`step`/`default`) | The slider's range and starting position | N/A — no other file reads this anymore |
| `estimateMonthlySavings()` | The calculator's own savings math | N/A — no other file reads this anymore |

Like the Overnight Impact card itself, every number this calculator shows is
illustrative and must keep saying so (Danger Zones) — it estimates, it does
not quote a price.

---

### Contract 8 — i18n Dictionary & Locale Routing

**Owner:** `src/i18n/en.ts` (canonical shape), `src/i18n/de.ts` (typed against
it via `Dictionary = typeof en`), `src/i18n/index.ts` (`Locale`,
`DEFAULT_LOCALE`, `useTranslations()`), `astro.config.mjs`'s `i18n` block
**Dependents:** every component that renders visitor-facing text; `src/lib/site.ts`'s
`withBase()`/`getNavLinks()`; `src/lib/metrics.ts`'s `relativeTime()`;
`src/lib/savings.ts`'s `formatEur()`; `src/pages/de/*` (the mirrored German
page tree)

German is a full parallel content tree via Astro's built-in i18n routing —
real static pages per locale (`src/pages/de/*`, zero added client JS for the
routing itself), not a client-side string swap over one English DOM. English
stays unprefixed (`defaultLocale: 'en'`, `prefixDefaultLocale: false`);
German lives under `/landing-page/de/*`.

**What is locked:**

| Field | Controls | If changed without updating dependents |
|---|---|---|
| `en.ts`'s object shape | Every key `de.ts` must also have, with matching value types (string vs. function) | TypeScript errors at build time — a missing/extra key in `de.ts` fails `npm run build` rather than shipping a blank string, by design |
| `withBase(path, locale?)`'s signature | Every internal `href` and asset `src` sitewide | Omitting the second argument on a `href` silently links to the English page even from a German one; **never** pass `locale` to an image/asset `src` call — see the Danger Zone below on why |
| `Astro.currentLocale` | Which dictionary a component reads (`useTranslations(Astro.currentLocale ?? DEFAULT_LOCALE)`) | A component that hardcodes a string instead of reading `t.xxx` silently ships English-only inside a German page |
| `formatEur(amount, locale?)` / `relativeTime(iso, locale?)` | Locale-correct number/date formatting (German period-thousands + trailing €; German "vor X" phrasing via `Intl.RelativeTimeFormat`) | A call site missing the `locale` argument silently reverts to English formatting (e.g. "€15,000" instead of "15.000 €") on an otherwise-German page |
| `transition:name` on `Nav.astro`'s `<header>`, `Footer.astro`'s `<footer>`, `SiteToast.astro`'s toast | Must be locale-keyed (e.g. `` `site-nav-${locale}` ``), not a fixed string | A fixed name lets Astro's view-transitions persist the OLD locale's DOM across a language switch — the nav/footer/toast silently stay in English under German page content until a hard refresh |

Every new component with visitor-facing copy must: import `useTranslations`
and `DEFAULT_LOCALE` from `../i18n`, read
`const locale = Astro.currentLocale ?? DEFAULT_LOCALE;`, pull its strings
from `useTranslations(locale).<namespace>`, and add the matching English
value to `en.ts` (`de.ts` follows immediately or the build fails). A
`<script>` block has no access to `Astro.currentLocale` — pass translated
strings it needs down via a `data-*` attribute (see `ProductPreview.astro`'s
`data-lm-strings` JSON blob on the Live Machines panel, or
`SavingsCalculator.astro`'s client `fmt()` reading `document.documentElement.lang`)
rather than hardcoding English inside the script.

Adding a mirrored German page under `src/pages/de/*` needs the exact same
section composition as its English counterpart, with import paths one
directory deeper (`../../` not `../`) — see that directory's own file-top
comments for the "keep in sync" note.

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
| Add/flip a `/product` dashboard panel | Registry entry (`dashboard.ts`) **and** a matching branch/asset in `ProductPreview.astro` updated in the same change (Contract 5)? |
| Re-record `live-machines.json` | Ran `scripts/record-live-machines.py` (never hand-edited)? Frame arity still matches `_meta.fields`? No drift/export flags used (Contract 6)? |
| Edit `src/lib/savings.ts` | `SavingsCalculator.astro` **and** `UserStory.astro` both updated in the same change if the constant they share changes (Contract 7)? |
| Add a new visitor-facing string anywhere | Added to **both** `src/i18n/en.ts` and `src/i18n/de.ts` (build fails otherwise), read via `useTranslations(locale)`, not hardcoded (Contract 8)? |
| Add a new internal `href` | `withBase(path, locale)` with the locale argument — not just `withBase(path)`, which silently defaults to English (Contract 8)? |
| Add a new page | Mirrored under `src/pages/de/*` with the same section composition, import paths one level deeper (Contract 8)? |
| Add a `transition:persist`-ed element with translated content inside it | `transition:name` keyed by locale (e.g. `` `foo-${locale}` ``), not a fixed string (Contract 8)? |

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
- **The two-verb CTA system is settled**: "See it in action" (look → `/product`)
  and "Test it on your device" (do → `/try-it-yourself`). Don't introduce a third
  synonym CTA label — it was deliberately consolidated from more (`ARCHITECTURE.md`
  §5, panel-audit round). **One deliberate exception (human review, 2026-07-23):**
  `UserStory.astro`'s Morning Summary card reads "See the dashboard" instead —
  a one-off, context-matched variant of the same "look" CTA (still targets
  `/product`), not a new third verb introduced sitewide. Don't generalize this
  wording to other CTAs without a similar explicit call.
- **Illustrative numbers must stay labeled illustrative.** The Overnight Impact
  card's €24,300/etc. and the hero's `2.3M` sensor tile are narrative/marketing
  copy, not measured data — don't let a future edit drop the "Illustrative
  example" / "illustrative" captions that keep them from reading as real claims.
  **This extends to `/product`'s `'image'`-mode dashboard panels** (Overview,
  Alerts, Predictions — Contract 5): their generated content is explicitly
  allowed to be conceptual/fabricated (machine names, alert counts, an
  un-backed "time to likely failure," per human direction 2026-08-04, see
  `docs/IMAGE_ASSETS.md` items 12–13) **only because** each carries a
  "Dashboard preview" badge. The badge is load-bearing — never ship an
  `'image'`-mode panel without it, and never put a fabricated live-looking
  number (e.g. a notification-count badge) on the *real* sidebar nav item
  itself, outside the labelled image.
- **The hero's three failure-mode cards (Hero.astro) must stay true to the
  real dataset's failure definitions**, not invented mechanics — Power
  Failure (torque × rotational speed outside a working band), Tool Wear
  Failure (tool wear time crossing into a replacement/failure window, with
  the outcome inside that window randomly assigned — not something the model
  can perfectly "catch"), Heat Dissipation Failure (a low air/process
  temperature gap *and* low rotational speed at once). Source of truth: the
  Kaggle AI4I 2020 dataset now credited in the footer (Contract 1's
  `KAGGLE_DATASET_URL`). RNF (random failure) deliberately has no marker —
  it has no sensor signature by definition, so giving it one would overclaim.
- **`fetch-metrics.mjs` must fail open, always.** A missing/invalid
  `DAGSHUB_TOKEN`, a DagsHub outage, or an API shape change should keep the
  last-committed `metrics.json` values and log a warning — never break the build,
  never render `undefined`.
- **Nav order/labels are settled**: `Product · How It Works · Solutions ·
  Tech Stack · Project & Team` (capitalization fixed 2026-07-28, human review).
  Don't relitigate without a new mockup-driven reason — see `ARCHITECTURE.md` §5.
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
- **A regenerated lockfile inherits whichever registry the generating machine's
  global npm config points at.** Already happened once — a global `~/.npmrc`
  pointed at `registry.npmmirror.com` (China-hosted) and every `resolved` URL in
  `package-lock.json` silently followed. See Digital Sovereignty & Privacy above.
- **`withBase()`'s `locale` argument is for page routes only, never for image/asset
  `src`.** Astro's own `getRelativeLocaleUrl` (the obvious first choice for a
  locale-aware path helper) appends a trailing slash to every path it returns —
  correct for a page route (`/product/`), but it turns
  `cnc-machine-hyperrealistic.png` into `cnc-machine-hyperrealistic.png/`, a
  silent 404 for the actual image file. `withBase()` is hand-rolled specifically
  to avoid this (no `getRelativeLocaleUrl` dependency, no trailing slash added to
  a non-empty path) — this already broke the Hero/LiveFactory/SavingsCalculator
  background photos once during the i18n build-out. Image `src={withBase(path)}`
  calls correctly omit the `locale` argument (assets aren't duplicated per
  locale) — don't "fix" that by adding one.
- **A `<script>` tag has no access to `Astro.currentLocale`.** Any client script
  that needs translated text (a Play/Pause label, a "Copied!" toast, a status
  string set from JS after the initial render) must receive it via a `data-*`
  attribute rendered from the component's own frontmatter, or by reading
  `document.documentElement.lang` at runtime (see `SavingsCalculator.astro`'s
  client-side `fmt()`) — never hardcode the English string as a fallback inside
  the script itself.

---

## COMPONENT QUICK-REFERENCE

| File | Role | Reads from | Writes to / consumed by |
|---|---|---|---|
| `scripts/fetch-metrics.mjs` | CI live-metrics fetch | DagsHub MLflow REST API | `src/data/metrics.json` |
| `src/lib/metrics.ts` | Metrics accessor | `src/data/metrics.json` | `StatRow.astro`, `ProductPreview.astro`, `SavingsCalculator.astro`, `UserStory.astro` |
| `src/lib/site.ts` | Shared constants + `withBase()` | — | `Nav`, `Footer`, `Hero`, `MlopsSystem`, `try-it-yourself` |
| `src/lib/dashboard.ts` | `/product` panel registry (`mode` per panel) | — | `ProductPreview.astro` |
| `src/lib/savings.ts` | Savings-calculator constants + formula (Contract 7) | `metrics.ts` (recall) | `SavingsCalculator.astro`, `UserStory.astro` |
| `scripts/record-live-machines.py` | **Manual** recorder (not CI) | DagsHub `@production` models + ML repo's sensor generator | `src/data/live-machines.json` |
| `src/lib/live-machines.ts` | Recorded-run accessor | `src/data/live-machines.json` | `ProductPreview.astro`'s Live Machines panel |
| `astro.config.mjs` | Site/base config | — | every internal link via `withBase()` |
| `src/styles/global.css` | Design tokens, motion/focus rules | — | every component's Tailwind classes |
| `src/layouts/BaseLayout.astro` | Page shell, SEO/OG meta, pre-paint a11y-preference script | `site.ts`, `i18n/` | wraps every page in `src/pages/` |
| `.github/workflows/deploy.yml` | CI/CD | secrets `DAGSHUB_USERNAME`/`DAGSHUB_TOKEN`, var `MLFLOW_TRACKING_URI` | GitHub Pages |
| `src/i18n/en.ts` / `de.ts` / `index.ts` | Translation dictionary (Contract 8) — `en.ts` is the canonical shape, `de.ts` is typed against it | — | every component with visitor-facing text |
| `src/pages/de/*` | Mirrored German page tree (Contract 8) | Same section components as their English counterparts | Astro's i18n router (`astro.config.mjs`) |
| `src/components/AccessibilityMenu.astro` | Nav-row widget: text size / high contrast / reduced motion, persisted to `localStorage`, hover-expand + click-pin panel | `i18n/`, `global.css`'s `.nav-dropdown-panel` + "Accessibility overrides" section | `Nav.astro` |
| `src/components/LanguageSwitcher.astro` | Nav-row EN/DE link (autonym label, e.g. "Deutsch") | `i18n/`, `lib/site.ts`'s `withBase()` | `Nav.astro` |
