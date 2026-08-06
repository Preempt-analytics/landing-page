---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-08-06 (covers two sessions: the 2026-08-05 *afternoon* session — Model Health depth + the Live Machines recorded replay — plus a same-day follow-up that enlarged the /product dashboard frame and added a sidebar legend)
updated_by: Claude (Model Health / Live Machines replay / LiveFactory polish session, then a same-day dashboard-prominence + legend session)
head_sha: a7ba5b0
branch: main
status: green (build passes; all session work committed and pushed; working tree clean)
---

# Claude Session Handover

> **Note on dating:** this covers two sessions stacked on top of
> `2026-08-05-claude-handover-doc.md` (written that morning, covering the shell
> build). §§1–3 below were written by the session that added Model Health depth
> and the Live Machines recorded replay; §2a is a same-day follow-up that
> enlarged the dashboard frame and added the sidebar legend. Read the
> 2026-08-05 doc first for the shell's design, this one for what's on top of it.

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: main @ a7ba5b0, identical to origin/main, pushed. Build green (3 routes). Working tree clean.
Just did (most recent first): (0) enlarged the /product dashboard frame ~12%, added a sidebar legend decoding live-vs-preview panels, moved+renamed the "Concept preview" badge (now "Dashboard preview") off the screenshot so it stops overlapping the image's own baked-in UI — see §2a; (1) deepened Model Health with brier_score + overfit_delta as a Contract 2 change; (2) built the Live Machines panel — a browser replay of a REAL recorded run of the demo, new scripts/record-live-machines.py + src/data/live-machines.json + Contract 6; (3) smoothed the replay from setInterval to a requestAnimationFrame playhead; (4) moved the sidebar's discover dot next to the label; (5) fixed LiveFactory's drift-card proportions/pin-overlap on mobile and turned that card into a link into /product/#live-machines.
DO NEXT: cheapest real win is Maintenance Queue — it rides free off the recording already committed (rank the 5 machines by failure_probability at the current step, no new data). See §1.
DON'T: don't interpolate the replay's sensor NUMBERS — they're i.i.d. samples, not a trajectory (§3). Don't hand-edit live-machines.json — re-record (Contract 6). Don't add drift/export flags to the recorder — they fire the ML repo's retrain pipeline. Don't design a "gradual climb to failure" chart — the real model doesn't do that (§3, the single most important finding here). Don't call the image-panel badge "Concept preview" anymore — it's "Dashboard preview" now, everywhere (§2a).
Blocked on: the 36-version chart question, asked three times and still unanswered (§4). Nothing else blocks.
Ground truth: CLAUDE.md (now Contracts 1–6) + docs/ARCHITECTURE.md. Run §5 verify before editing. §3's data-shape finding is load-bearing — read it before designing any chart.
```

---

## 1. Resume here

**Cheapest next win: Maintenance Queue.** It needs no new data — the committed
recording already has everything. Rank the five machines by `failure_probability`
at the current replay step and render the list. `src/lib/live-machines.ts`
already exposes the fixture; `dashboard.ts` just needs `maintenance-queue`
flipped `'soon' → 'html'` plus one branch in `ProductPreview.astro` (Contract 5).

Other live options, in rough value order:

1. **Downtime-cost calculator** — still unbuilt, still the strongest "I did
   something" interaction on the site. Placement is an open human call (§4).
2. **Metric toggle on a version-history chart** (f1 / recall / precision /
   brier). Blocked on the §4 question about whether the 36-version history
   ships at all.
3. **Reports panel** backed by the ML repo's `reports/monitor_log.jsonl` —
   1,093 real drift checks, still unused by this site.

**Settled — do NOT re-litigate:**

- Everything settled in the 2026-08-04 and 2026-08-05 docs still stands: the
  hybrid shell, per-panel switchability via `mode`, concept-image latitude
  under the badge (now named "Dashboard preview", see below), the tablist
  mechanism.
- **Live Machines is `'html'` mode and real.** It replays a recording, not a
  browser-side simulation and not live data. The "Recording · not live" badge
  and the provenance caption are load-bearing, not decoration.
- **The replay's playhead may be interpolated; its numbers may not.** Position
  is presentation, a reading is data. See §3 — this isn't fussiness, it's the
  one thing that would make the panel dishonest.
- **`brier_score` is framed as "probabilities land close to reality", not as
  "when it says 90% it fails 90% of the time".** The stronger claim was stated
  twice mid-session and is wrong — see §3.
- **The drift card's CTA is "See it in action →"**, the site's settled
  look-verb for `/product`. A human suggested "see more"; I used the canonical
  label instead because `CLAUDE.md`'s Danger Zones explicitly forbid a third
  synonym. Flagged to the human at the time; overrule freely, but deliberately.
- **The sparkline is drift-card-only** (human review). It was briefly on all
  five cards; on the four healthy ones it was decoration on a card whose whole
  message is "nothing to see here".
- **The image-panel badge is "Dashboard preview", not "Concept preview"**
  (human-requested rename, §2a). It lives above the image now, not overlaid on
  it. Every mention — component, its comments, the bottom caption, `CLAUDE.md`'s
  two Contract 5 references — was updated in the same commit. Don't reintroduce
  the old name or the absolute-overlay position.
- **The sidebar has a live/preview legend now** (§2a): a teal dot on `'html'`
  panels, a hollow square on `'image'` panels, both defined once in a small key
  row above the frame. `'soon'` panels deliberately get neither — their own tag
  already self-explains. Any new panel added to `DASHBOARD_PANELS` inherits the
  right mark automatically from its `mode`; no separate registry to update.

## 2. What changed this session

**Model Health depth — a Contract 2 change (all files in one commit):**
- `scripts/fetch-metrics.mjs` — fetches `brier_score` + `overfit_delta` for both
  models; both added to `metricsEqual()` so a change in either still triggers a
  rewrite.
- `src/data/metrics.json` + `metrics.sample.json` — new fields, both models.
- `src/lib/metrics.ts` — `brierScore()`, `overfitGap()`, `missesOneIn()`,
  `falseAlarmsPer100()`.
- `ProductPreview.astro` — Model Health went 4 tiles → 6 (grid 4-col → 3-col):
  quality on top (Recall, Precision, **Calibration**), maintenance below
  (**Train/Test Gap**, Version, Last Retrained). Killed the old "the same
  metrics shown on the homepage" line — a visitor who clicked through was
  being told they'd wasted the click.
- Added a derived plain-language summary: *"it misses roughly 1 failure in 6,
  and about 8 of every 100 warnings turn out to be false alarms."* **Computed
  from the live values, never hardcoded** — otherwise a retrain silently turns
  the prose false while the tiles stay right. `missesOneIn()` returns `null` at
  100% recall with a fallback sentence; not hypothetical, versions 2–4 scored
  exactly 1.000 and `1/0` would have rendered "1 in Infinity".
- `CLAUDE.md` — two new locked rows in Contract 2.

**Live Machines replay — new Contract 6:**
- `scripts/record-live-machines.py` (new, **manual, never CI**) — loads both
  `@production` models from DagsHub and drives the ML repo's own
  `generate_raw_reading()` / `engineer_features()`. Runs no server, writes
  nothing to `simulation.db`, triggers nothing.
- `src/data/live-machines.json` (new, committed) — 5 machines × 120 steps =
  600 readings, ~25 KB, inlined into the page rather than fetched.
- `src/lib/live-machines.ts` (new) — accessor + `stepCount()`,
  `recordedModelVersions()`, `recordedSpanMinutes()`.
- `src/lib/dashboard.ts` — `live-machines` flipped `'soon' → 'html'`.
- `ProductPreview.astro` — the panel: play/pause, scrubber, machine selector,
  five sensor tiles, and the full recorded trace with a moving playhead.
- `CLAUDE.md` — Contract 6 + a PRE-CHANGE CHECKLIST row + two
  COMPONENT QUICK-REFERENCE rows.

**Smoothing pass (human-requested):**
- `setInterval` → `requestAnimationFrame`. A continuous `position` float
  advances with the display refresh; `step` (the integer frame whose recorded
  values are shown) is deliberately separate.
- Added a marker dot riding the drawn trace, 260 ms colour transitions, and a
  pulse on a machine's dot when it flips to predicted-failure.
- Numbers still snap. On purpose — see §3.

**Sidebar discover dot (human-requested):** the teal dot on the Live Machines
tab was pinned to the tab's right edge. Cause was `ml-auto` on the dot *plus*
`flex-1` on the label expanding to fill. Both removed; dot now `ml-1` after the
text. `Soon` tags keep their own `ml-auto`; labels still truncate via `min-w-0`.

**LiveFactory fixes (human-reported):**
- Both card kinds now share one `--fc-*` type/padding scale, with a compact
  step below `sm`. Headers are `flex-wrap: nowrap` + `white-space: nowrap` on
  both halves, cards are `width: max-content` — so "NO DRIFT DETECTED" and
  "CNC-01" can no longer wrap into the squashed two-line state.
- The red drift card moves to the top-left below `sm`. The overlap window was
  roughly 420–500 px viewport: the photo is short there, so a card at `top: 3%`
  ran past CNC-01's pin at `24.4%` *and* sat horizontally over it.
- The red card was inline Tailwind while the green ones were CSS classes — they
  had drifted apart. It now uses the same `machine-card-*` classes.
- The drift card became an `<a>` to `withBase('/product/#live-machines')`, with
  a build-time sparkline of CNC-01's recorded trace, revealed on hover/focus/tap.
- `ProductPreview.astro` gained hash deep-link support so that link lands on the
  right panel instead of Overview.

## 2a. Same-day follow-up: dashboard prominence + legend (human-driven, spar-then-build)

Human's ask: the `/product` dashboard read as a static screenshot rather than
an interactive product, and the sidebar gave no hint which tabs show real
content vs. a mockup. Before touching code, we sparred through the encoding
options (color-only, symbol-only, both, text-pills-everywhere) and the legend's
placement — see the two `AskUserQuestion` rounds earlier in that session's
transcript if the reasoning behind the choice matters later.

**What shipped (`ProductPreview.astro` + `CLAUDE.md`, one commit, `a7ba5b0`):**
- Frame `max-w-5xl → max-w-6xl` (~12% wider); section's outer container
  `max-w-6xl → max-w-7xl` so the increase isn't clamped by its own padding.
  The centered intro paragraph keeps its own `max-w-2xl`, so it didn't widen.
- New legend row above the frame: a teal-dot key ("Live, interactive data")
  and a hollow-square key ("Dashboard preview"). Right-aligned on `md+`
  (matches the frame's right edge below it, deliberately *not* stacked under
  the centered intro text, per human direction); centered/wrapping on mobile,
  where there's no "side" to sit in.
- Matching marks added to the sidebar tabs themselves, driven purely by
  `panel.mode` — a static teal dot on Model Health/Settings, the *existing*
  pulsing teal dot kept as-is on Live Machines only (human-requested
  2026-08-05 "discover me" cue, deliberately not erased), a hollow muted
  square on Overview/Alerts/Predictions. `'soon'` tabs untouched.
- The per-panel badge (`'image'` mode) renamed "Concept preview" →
  "Dashboard preview" and moved from an absolutely-positioned overlay into its
  own row above the `<Image>`. The human flagged via screenshot that the old
  overlay collided with the screenshot's own baked-in top-right UI (a "Live"
  pill, a search icon) — living in normal flow above the image means a future
  screenshot's own content can never collide with it again, regardless of what
  that screenshot draws in that corner.
- `CLAUDE.md`'s two Contract 5 mentions of "Concept preview" synced to
  "Dashboard preview" in the same commit — the badge name is called out there
  as load-bearing, so a stale doc would mislead the next session.

**Verification gotcha worth recording (cost real time this session): a plain
headless-Chrome/Brave CLI `--window-size=390,844` screenshot does NOT reliably
produce a true 390px-wide layout viewport** — confirmed by rendering a trivial
isolated test page (a `width:100%` bar next to a `width:390px` bar; the two
should match exactly and didn't, and long unbroken text failed to wrap at all).
The resulting screenshot looked like a real mobile bug (headline text missing
words, sidebar tabs clipped) but wasn't one — it was the tool silently
rendering at a wider viewport than requested. **Don't trust a raw
`chrome/brave --headless --window-size=<narrow> --screenshot` capture as
evidence of a mobile bug without corroborating it another way first** (e.g. an
isolated test page, or proper viewport emulation). Playwright's
`newPage({ viewport: {...} })` did emulate the width correctly and confirmed
the real layout has no issue. This is a tooling gotcha, not a CLAUDE.md rule —
recorded here so the next session doesn't lose the same time to it.

## 3. Un-recoverable context

**The recorded data's shape — read this before designing any chart.** Measured
off the committed fixture:

```
p50 = 0.0046   p75 = 0.0047   p90 = 0.0072   p95 = 0.7731   p99 = 0.8915
max = 0.8925   flagged as will-fail: 38 / 600 (6.3%)
corr(tool_wear, probability) on non-flagged readings: +0.153
```

**The model is effectively a step function, not a ramp.** ~95% of readings sit
at ~0.5%, then an injected failure jumps straight to ~89%. There is no gradual
climb. Mean probability moves only 0.0046 → 0.0098 across the *entire* tool-wear
range. Consequences:

- The mockup's smooth "Failure Probability Trend" rising to 97% over six hours
  **cannot be reproduced from real data.** Don't design toward it.
- This is a *better* story than the mockup's, and worth telling: a real
  classifier is quiet, then certain. It pairs directly with the calibration and
  precision framing already on Model Health.
- It also independently re-confirms that "1.8 hrs to failure" is unsupportable —
  the jump is instantaneous, so there is no runway to measure.

**Correction I owe the record: the Brier claim.** Mid-session I twice described
`brier_score` as *"when it says 90%, it fails about 90% of the time."* That
over-claims. Brier is mean squared error on the probabilities — a low score is
strong evidence of good calibration but is **not** a direct measurement of it
(that needs a reliability curve, and the artifact store is empty, so none is
logged). The shipped copy says the defensible version. Don't let the stronger
phrasing creep back in.

**Getting the models to run locally — four gotchas, all already solved in
`record-live-machines.py`, but each cost real time:**

1. **The models load anonymously from DagsHub.** No credentials, no `.env`, no
   Docker, no FastAPI server. This collapsed the plan from "stand up the whole
   stack" to "one standalone script". `.env` doesn't even exist in the ML repo
   (only `.env.demo`).
2. **The ML repo's modules import each other flat** (`from
   feature_transformation import ...`), so `<ml-repo>/src` must go on
   `sys.path` — putting the repo *root* there fails.
3. **The pipeline starts with a `DictVectorizer`**, so it wants
   `df[FEATURES].to_dict(orient="records")`, not a DataFrame. Same call shape
   `api.py` uses.
4. **The multiclass model needs an xgboost/sklearn compatibility patch.**
   xgboost 2.0.3 predates sklearn 1.8's tag-based typing, so
   `is_classifier(XGBClassifier())` returns `False` and the calibrated model
   raises *"Got a regressor"* on predict. Patch the **class**, not an instance —
   `CalibratedClassifierCV` clones internally and drops instance-level patches.
   Lifted verbatim from `api.py`'s own patch.

**Verification gotcha — Astro inlines component CSS.** Checking that new styles
shipped by grepping `dist/_astro/*.css` gives **false negatives**: for `/product`
the component CSS is inlined into the HTML instead. Check the inline `<style>`
blocks *and* whichever linked sheets that page actually references. I briefly
reported CSS as missing when it was there.

**PowerShell gotcha — a truncated pipe fakes a build failure.** Piping
`npm run build` into `Select-String ... | Select-Object -First N` returns exit
**255** even on a clean build, because closing the pipe early kills the process.
Run the build unfiltered (or `-Last N`) before believing a non-zero exit.

**The Live Factory sparkline mapping is a judgement call, not a fact.** The
CNC-0N names in that section are illustrative; the traces are real, mapped
CNC-0N → the recording's `machine_0N`. I labelled the line as a recorded run
rather than as live telemetry from the illustrated machine. A human may
reasonably want this swapped for an obviously-illustrative line instead —
flagged at the time, not overruled.

**Not browser-verified.** Playwright isn't installed and I didn't add a
dependency just to check. Everything was verified statically against the built
HTML/CSS/JS (markup present, JSON parses, frame arity, probability ranges, zero
`undefined`/`NaN`, rAF in bundle, `:has()` and `max-content` in the shipped
CSS). The human confirmed the panel visually and asked for the smoothing pass,
so it does render — but no automated end-to-end check exists.

## 4. Open questions — need a human, not a guess

- [ ] **Does the 36-version history chart ship, and in what form?** Asked three
      times across two sessions, never answered. Options: all 36 versions
      honestly, only the recent few, or no chart. **The metric-toggle
      interaction is blocked behind this** and nothing else. The data is
      confirmed fetchable (`model-versions/search` + `runs/search`, both 200
      anonymous — see the 2026-08-04 handover's endpoint table).
- [ ] **Machine naming is no longer moot.** Previous handovers parked this as
      "only matters once a real per-machine panel exists". That panel now
      exists and ships `machine_01`–`machine_05` (formatted "Machine 01") with
      the L/M/H grade as the differentiator. Confirm that's the final call, or
      decide the real panel gets dressed-up names too.
- [ ] **The Live Factory sparkline mapping** (§3) — keep real traces under
      illustrative CNC-0N names, or swap for an explicitly illustrative line?
- [x] ~~Uncommitted: `LiveFactory.astro`'s per-machine `detail` captions~~ —
      resolved; landed in `93df956` ("Interactive dashboard timeline") before
      this doc's own commit. Working tree is clean as of `a7ba5b0`.
- [ ] Carried, unchanged: downtime-cost calculator placement (own panel vs.
      homepage section); the three illustrative savings figures
      (€28,400 / €24,300 / €32,800); `LiveFactory.astro`'s odd aria-label
      wording (`no drift detected, Safe ` — committed, still reads unfinished);
      real logo/icon mark; §9.1's in-action screen recording.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin
git log --oneline -5      # tip = a7ba5b0 (+ this handover commit) or later?
git status                # expect clean working tree
npm run build             # must pass; 3 routes build
```

PowerShell: run these one per line (`&&` is a parser error in PowerShell 5.1 —
CLAUDE.md, Platform Agnosticism). Don't pipe the build into `-First N` — see §3.

Re-record the Live Machines fixture (needs the ML repo as a sibling):
```bash
python scripts/record-live-machines.py --steps 120 --machines 5
```

- **Branch / commit:** `main` @ `a7ba5b0`, identical to `origin/main`.
- **Build:** passes, 3 pages.
- **Uncommitted:** nothing — working tree clean.
- **Canonical sources:** [`CLAUDE.md`](../CLAUDE.md) (rules, now Contracts 1–6) ·
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
