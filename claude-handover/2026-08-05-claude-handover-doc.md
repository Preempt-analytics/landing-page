---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-08-05 (build session — /product/ real sidebar shell, shipped and live)
updated_by: Claude (dashboard-shell build + deploy verification session)
head_sha: abc2af6
branch: main
status: green (build passes; deployed live and verified against the production URL)
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: main @ abc2af6, identical to origin/main. Pushed and deployed — GitHub Actions "Build and deploy" ran green for this commit, and I independently confirmed the live page's HTML/Last-Modified header match it.
Just did: built the real clickable /product/ dashboard sidebar (Option 4 hybrid shell from the 2026-08-04 handover), pulled forward ahead of the standalone Phase A panels per explicit human request. Real tablist/tabpanel shell (src/lib/dashboard.ts registry + ProductPreview.astro), 9 sidebar items matching the mockup. Overview/Alerts/Predictions are labelled "Concept preview" screenshots (Alerts/Predictions generated fresh this session from prompts I wrote, now committed to docs/IMAGE_ASSETS.md items 12-13). Model Health and Settings are real, live content. The other 4 items are a plain "in development" placeholder. Documented as Contract 5 in CLAUDE.md.
DO NEXT: see §1. No hard blocker — pick any of: (a) promote a 'soon' panel to real content, (b) add brier_score calibration framing to Model Health (Contract 2 change), (c) decide where the downtime-cost calculator (still unbuilt) lives now that a shell exists, (d) reconcile the now-THREE different illustrative savings figures across the site (see §3).
DON'T: the "no RUL model, don't ship time-to-failure as real" rule from 2026-08-04 still applies to any *real/html* panel — it does NOT block the existing labelled "Concept preview" images (Overview/Predictions already ship an illustrative time-to-failure under that badge, by explicit human direction this session). Don't add brier_score to metrics.json without updating metrics.ts in the SAME commit (Contract 2). Don't touch LiveFactory.astro's aria-label wording without asking — see §4, it reads oddly ("Safe " with a trailing space) but is committed, not mid-edit, and I don't know if that's final.
Blocked on: nothing structural. Two content decisions worth a human before building further — §4.
Ground truth: CLAUDE.md (standing rules, now includes Contract 5) + docs/ARCHITECTURE.md §9.1 (revised) + docs/IMAGE_ASSETS.md items 12-13. Run §5 verify before editing.
```

---

## 1. Resume here

**No hard next action — several independent options, pick based on what the team wants to see next:**

1. **Promote a `'soon'` panel.** `src/lib/dashboard.ts`'s `DASHBOARD_PANELS` still
   has `live-machines`, `maintenance-queue`, `work-orders`, `reports` as
   `mode: 'soon'` (plain "still in development" placeholder). Flipping any one
   to `'image'` (a new generated concept mockup, same recipe as Alerts/
   Predictions — see §3's crop notes) or `'html'` (real data) is a registry
   edit + one template branch in `ProductPreview.astro` — the shell doesn't
   need touching. Cheapest visible win: **Live Machines** as another concept
   image, or **Reports** backed by the real `reports/monitor_log.jsonl` drift
   history from the ML repo (per the 2026-08-04 handover's data audit — 1,093
   real drift checks, currently unused by this site).
2. **Model Health calibration upgrade.** The panel currently shows
   recall/precision/version/last-retrained — all real, all already in
   `metrics.json`. `brier_score` (0.0075, live in MLflow, still unused) was
   flagged in the prior handover as "the single most end-user-relevant number
   the project owns" — *"when it says 90%, it fails about 90% of the time."*
   **This is a Contract 2 change**: `scripts/fetch-metrics.mjs` and
   `src/lib/metrics.ts` must both move in the same commit.
3. **Downtime-cost calculator** — still not built (it was Phase A item 2 in
   the 2026-08-04 handover, unaffected by this session's shell work). Open
   question now that a dashboard shell exists: does it become a new sidebar
   panel (`html` mode, a slider + a real predicted-failure count), or stay a
   separate homepage section as originally scoped? Worth a quick human call
   before starting — see §4.
4. **Reconcile the illustrative savings figures** — now three, not two (§3).

**Settled — do NOT re-litigate:**

- **The hybrid shell is built, not just planned.** `/product/`'s sidebar is
  real HTML (`role="tablist"`), not an image with a fake sidebar baked in.
  Verified end-to-end this session (see §5) — tab switching, live Model
  Health data, mobile horizontal-scroll collapse, zero console errors.
- **Per-panel switchability is proven, not just designed.** Alerts and
  Predictions shipped as `mode: 'soon'` mid-session and were flipped to
  `'image'` the moment their generated crops existed — one registry line
  each, zero shell changes. This is the mechanism, not a one-off.
- **Concept-image content doesn't need to be data-grounded — human-directed,
  2026-08-05.** Revising the 2026-08-04 handover's stricter stance: a
  panel's `mode: 'image'` content is explicitly allowed to be
  conceptual/illustrative (invented machine names, alert counts, an
  un-backed time-to-failure figure) *as long as* it carries the "Concept
  preview" badge — same latitude the original Overview screenshot already
  used. This is now written into `CLAUDE.md`'s Danger Zones, not just this
  doc. It does **not** loosen the rule for `'html'`-mode (real) panels.
- **Panel-switch mechanism is settled: a small vanilla-JS tablist**, not the
  CSS-only `:target`/radio alternative the 2026-08-04 handover left open —
  chosen because it lazy-loads panel images (Astro's `<Image>` default)
  instead of loading all nine eagerly.
- Everything from prior handovers not contradicted above stays settled:
  stack, dark-only, no-analytics, `withBase()`, batched commits, CLAUDE.md as
  standing rules, the two-verb CTA system.

## 2. What changed this session

- **`src/lib/dashboard.ts`** (new) — `DASHBOARD_PANELS` registry, the single
  source of truth for the sidebar's 9 items and each one's `mode`
  (`'image'` / `'html'` / `'soon'`). Documented as **Contract 5** in
  `CLAUDE.md`.
- **`src/components/sections/ProductPreview.astro`** (rewritten) — real
  `role="tablist"` sidebar + `role="tabpanel"` content pane replaces the
  single framed `<img>`. Keeps the existing browser-chrome frame and cursor-
  tilt effect, now wrapping the whole shell. ~25 lines of vanilla JS for tab
  switching, no dependency.
- **Three new/derived images**, all in `src/assets/`:
  `dashboard-overview.png` (crop of the existing screenshot, sidebar column
  removed), `dashboard-alerts.png` and `dashboard-predictions.png` (new
  concept mockups — I wrote the prompts, the human's teammate generated them
  in ChatGPT, I cropped them). Sources: `design/mockups/ui-Alerts.png` /
  `ui_predictions.png`.
- **Docs:** `CLAUDE.md` (Contract 5 + pre-change checklist row + Danger Zones
  note), `docs/ARCHITECTURE.md` §9.1 (revision block describing the shell),
  `docs/IMAGE_ASSETS.md` (items 12–13, the two new prompts + crop notes; a
  derivative-crop note added to item 9).
- **Committed and pushed to `main`** (`abc2af6`), deploy confirmed green via
  the GitHub Actions API, live page independently re-verified via `curl`
  against the production URL (see §5's commands).

## 3. Un-recoverable context — worth knowing before the next edit

**Sidebar-crop pixel offsets** (found by sampling color jumps down each
image, not by eye — each generation's fake sidebar came back a slightly
different width):
- Original `dashboard.png` (Overview source): boundary at **x=230** of 1536.
- `ui-Alerts.png`: boundary at **x=247** of 1536 (wider sidebar than the
  reference — this generation added a "Collapse" affordance at the bottom).
- `ui_predictions.png`: boundary at **x=227** of 1536 (near-identical to the
  reference).
If a future concept image needs the same treatment, don't assume x=230 —
re-sample; a couple of generations already didn't match it exactly.

**No browser-automation tooling installed in this environment** — neither
`chromium-cli` nor the `playwright` npm package is available locally, and
neither should be added as a project dependency just for one-off UI
verification (Second Law). What worked instead: this machine has Brave
Browser installed, which supports the same `--headless=new
--remote-debugging-port` flags as Chrome; a ~60-line Node script using only
built-in `fetch`/`WebSocket` (Node 22+, already this project's minimum) drove
it over the raw Chrome DevTools Protocol — navigate, click, screenshot, read
console errors, all with zero new dependencies. Written to the harness
scratchpad, not the repo, and deleted after use per this project's
Verification Artifact Hygiene rule. Worth reusing this pattern rather than
reaching for `npm install playwright` next time a UI change needs a real
browser check.

**No `gh` CLI installed either.** Live-deploy verification used the GitHub
Actions REST API directly via anonymous `curl` (works for this public repo's
run list without a token) plus a `curl` of the actual production URL,
checking `Last-Modified` against the deploy time and grepping the HTML for
new markup. Faster and more conclusive than trusting "the workflow probably
ran."

**Illustrative savings figures are now a three-way inconsistency, not
two-way.** The 2026-08-04 handover already flagged the hero-adjacent
Overview screenshot's **€28,400** vs. `UserStory.astro`'s Overnight Impact
card's **€24,300**. The new Predictions concept image adds a **third**:
its "Saving Resources, Every Day" widget reads **€32,800**. All three are
labelled illustrative (or sit under a "Concept preview" badge) so none of
them is a false-claim problem individually — but three different numbers for
what reads like the same kind of claim is worth a human decision before it
compounds further. Not fixed this session; flagged, not resolved.

**`LiveFactory.astro`'s aria-label is committed, not mid-edit — but still
looks unfinished.** The 2026-08-04 handover flagged this exact line as
another live session's uncommitted work-in-progress
(`no drift detected, Safe ` — capitalized mid-sentence, trailing space). It's
now committed (git status is clean there), so whoever owned it finished and
shipped it — but the wording itself still reads like a typo/half-edit rather
than a deliberate final choice. I didn't touch it (not part of this
session's task, and per the Multi-Instance protocol I don't fix another
session's already-committed wording without asking). Flagging for a human
glance, not treating it as broken.

## 4. Open questions — need a human, not a guess

- [ ] **Where does the downtime-cost calculator live now?** Originally scoped
      (2026-08-04 handover, Phase A item 2) as its own homepage-adjacent
      section. With a real dashboard shell now existing, it could instead
      become a new `html`-mode sidebar panel. Either works architecturally;
      it's a placement call, not a technical blocker.
- [ ] **Reconcile €28,400 / €24,300 / €32,800** (§3) — or explicitly decide
      three different illustrative numbers across three different contexts is
      fine and stop tracking it as an inconsistency.
- [ ] **`LiveFactory.astro`'s aria-label wording** (§3) — confirm it's final,
      or fix the capitalization/trailing space.
- [ ] Carried over, still open, still not blocking anything above: real
      logo/icon mark, §9.1's in-action clip (screen recording, needs a human),
      machine-naming convention (`machine_01` vs. "Press-07") — moot until a
      *real* per-machine panel is built; the concept images are free to
      invent names since they're explicitly labelled concept art.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin
git log --oneline -5      # tip = abc2af6 (+ this handover commit) or later?
git status                # expect clean
npm run build              # must pass; 3 routes build
```

PowerShell: run the same commands one per line (`&&` is a parser error in
PowerShell 5.1 — CLAUDE.md, Platform Agnosticism).

**Confirm the live deploy independently** (don't just trust the Actions tab):
```bash
curl -sI https://preempt-analytics.github.io/landing-page/product/ | grep -i last-modified
curl -s https://preempt-analytics.github.io/landing-page/product/ | grep -c "data-dashboard"
```
The first should be at/after this handover's `head_sha`'s push time; the
second should be non-zero (the new sidebar shell's markup).

- **Branch / commit:** `main` @ `abc2af6`, identical to `origin/main`.
- **Build:** passes. Deploy confirmed green (GitHub Actions) and independently
  re-verified against the live URL.
- **Uncommitted work:** none — `git status` is clean.
- **Canonical sources:** [`CLAUDE.md`](../CLAUDE.md) (rules, now with
  Contract 5) · [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) (design why,
  §9.1 revised) · [`docs/IMAGE_ASSETS.md`](../docs/IMAGE_ASSETS.md) (image
  assets + prompts, items 12–13 new).

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
  (It did, twice, this session — a teammate committed two mockup-image
  commits directly to `main` mid-session. No conflict resulted; `git fetch`
  before pushing caught it cleanly.)
- **Staleness guard.** If `updated` >1 working day old or `head_sha` ≠ `origin`,
  trust §5's live commands over anything written here.
- **Right-tier rule.** Durable *design why* → `ARCHITECTURE.md`. Durable
  *engineering rules* → `CLAUDE.md`. Image assets + prompts → `IMAGE_ASSETS.md`.
  History → `git log`. Only *current state + next action* → here.
- **Every push to `main` is a live release.** Verify `npm run build` first.
