---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-08-07 (two sessions: the savings-calculator session below, then a same-day mobile UX audit — see §2b)
updated_by: Claude (homepage savings-calculator session, then a same-day mobile-audit session)
head_sha: 1991409
branch: main
status: green (build passes; mobile-audit session's work committed and pushed clean; working tree clean of anything of ours — see §1 for what's still outstanding from other sessions)
---

# Claude Session Handover

> **Note on dating:** two sessions landed on `main` today. §§1–4 below (minus
> §2b) were written by the savings-calculator session, first. §2b, and the
> updates folded into §1/§4/§5, are a same-day mobile UX audit session that
> came after — it committed and pushed the six files the savings-calculator
> session found "uncommitted, not mine" (§1 below), so that warning is now
> resolved. Read both; the savings-calculator content is untouched and still
> accurate for its own work.

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: main @ 1991409, identical to origin/main, pushed. Build green (3 routes). Working tree clean.
Just did (most recent first): (1) [mobile-audit session] ran a Steve Krug-style mobile UX audit across all three pages using real Playwright automation (Chromium + WebKit mobile emulation, not just screenshots) at a 390px viewport — found and fixed two real horizontal-overflow bugs (a stat-row InfoTip 100px past the viewport edge; /product's tab strip inflating document scrollWidth by ~800px, fixed with contain-layout), InfoTip popovers being unreachable by tap on iOS Safari sitewide (15+ instances, fixed with an explicit .focus() call), "Hover for details" shown to touch users, ~18px icon-only tap targets, a static hamburger icon that never confirmed the menu was open, a heading/icon text collision, two copy errors, and no way to grab the full text of unwrappable terminal commands (added a copy-to-clipboard button); (2) committed that work as one commit (`1991409`) and pushed clean — see §2b; (3) [savings-calculator session, earlier] shipped the homepage savings calculator (§2) and committed a teammate's separate Kaggle-dataset-credit change; merged one concurrent teammate push with no conflicts.
DO NEXT: nothing blocking from either session today. See §4 for carried-over open questions, and §2b for two mobile-audit findings deliberately left unfixed (scope/risk) with a clear recommendation each: the MLOps System diagram stays cramped/circular on mobile instead of converting to a vertical stepper like How It Works already does; /product's 'image'-mode dashboard-preview screenshots are illegibly small on a phone (pinch-zoom still works, isn't blocked).
DON'T: don't pop stash@{0} without checking first — still there, still unresolved (see §1 and the savings-calculator session's own note below); the mobile-audit session didn't touch it either, since it wasn't asked to and it isn't clearly this session's call to make. Don't reintroduce "Hover for details" wording or a hover-only reveal on InfoTip.astro — both were deliberate mobile-audit fixes, see §2b.
Blocked on: nothing. The savings-calculator's downtime-cost-calculator open item is resolved (see below); nothing from the mobile audit is blocked either.
Ground truth: CLAUDE.md (now Contracts 1–7) + docs/ARCHITECTURE.md. Run §5 verify before editing.
```

---

## 1. Resume here

**Nothing outstanding from either of today's sessions.** The savings
calculator shipped, iterated through several rounds of human feedback, and
is live on `main`. The mobile-audit session (§2b) that the savings-calculator
session flagged below as "uncommitted, not mine" has since finished,
committed, and pushed — that warning is now resolved, kept below verbatim
(struck through) so the *reasoning* for treating it cautiously stays on
record for the next time this situation comes up.

~~**Uncommitted, not mine — check before touching:** as of this doc
(2026-08-07, ~13:34), `git status` shows real, uncommitted modifications
in `src/components/InfoTip.astro` (a mobile Safari tap-to-focus fix),
`src/components/Nav.astro`, `src/components/StatCard.astro`,
`src/components/sections/Benefits.astro`,
`src/components/sections/MlopsSystem.astro`,
`src/components/sections/ProductPreview.astro` — a teammate's Claude Code
instance is actively working in this same working directory right now.~~
**Resolved 2026-08-07, ~13:50** — that was this same day's mobile-audit
session, which finished and committed all of it as `1991409` (see §2b for
what it actually was). The caution itself was correct and cost nothing; this
note exists so a future "everything's uncommitted, another session must own
it" judgment call has a real precedent to point at.

**Don't stash, edit, revert, or commit another session's in-flight work
without checking first** — straight from CLAUDE.md's Multi-Instance
Collaboration protocol. Today hit this for real, twice (see §2), and it
worked exactly as designed: caution cost a few hours of the block above
reading "not mine, check first," and nothing was lost or stepped on.

**One stash sitting on top, deliberately not resolved:**
```
stash@{0}: On main: Hero.astro marker-repositioning WIP (not mine, unfinished per own comments)
stash@{1}: WIP on main: 2665345 handover: 2026-07-27 image-asset session (pre-existing, unrelated, untouched)
```
`stash@{0}` was *this session's own* doing — see §2 for why it exists and why
it's now almost certainly safe to drop (but I didn't drop it; that's a call
for whoever owns it). `stash@{1}` predates this session and was never
touched.

**The 2026-08-06 handover's open "downtime-cost calculator" item is now
resolved.** It shipped this session as the homepage savings calculator,
placed directly after `UserStory` (`"While the dayshift sleep…"`) rather than
as its own `/product` panel — a human call made mid-session, not a default.

## 2. What changed this session

**Homepage savings calculator (`SavingsCalculator.astro`, `src/lib/savings.ts`
— new files) — Contract 7 in `CLAUDE.md`:**
- One slider: "your monthly unplanned downtime cost" (€1,000–€50,000).
- Cost-of-inaction framing: "If nothing changes" (red) vs. "With predictive
  maintenance" (teal) side by side, not just a single savings delta.
- **Partially grounded, not a fully invented calculator:** applies
  `failureRecallPct()` (Contract 2, the model's own live recall — the same
  number `/product`'s Model Health panel shows) directly to the visitor's
  cost. That's the *only* multiplier; nothing stacked on top of it.
- **Cross-component tie-in:** `UserStory.astro`'s Overnight Impact card shows
  "≈ N days like this, every month," live-updated by the calculator's script
  reaching outside its own section via `[data-savings-days]`. Both read the
  same `OVERNIGHT_IMPACT_EUR` (€24,300) constant from `savings.ts` so the two
  "one night" figures can't drift apart. Server-rendered with a correct
  default even before any JS runs.
- Labeled "Illustrative example" throughout — same honesty convention as
  `UserStory`'s existing Overnight Impact numbers.

**Iteration, all human-requested, roughly in order:**
1. Section moved from between `Benefits`/`UserStory` to directly after
   `UserStory` — the calculator now generalizes the one-night story instead
   of pre-empting it. Background flipped `bg-navy-900` → `bg-navy-950` to
   match its new neighbor rather than leaving an odd same-color run.
2. "Illustrative example" pill moved to the card's top-right, in a normal
   flex row next to the slider label (not absolutely positioned) — mirrors
   `UserStory`'s own Overnight Impact card header, so it structurally cannot
   overlap anything.
3. **Plain-language (Redish) pass** — three real fixes, nothing manufactured:
   the recall disclosure line was an awkward noun-stack ("this model's live
   · updated hourly failure recall — 82%…"), split into a separate live/
   sample badge plus a plain sentence; the subhead didn't state the cadence
   ("each month") up front; `UserStory`'s tie-in line claimed "the cost you
   set" before a top-to-bottom reader had actually interacted with anything
   below it — reframed as a forward invitation instead.
4. "Nights" → "days" sitewide (the thing being counted is a prevented-failure
   event, not something inherently nocturnal) — including a full rename of
   the `data-savings-nights` → `data-savings-days` hook across both
   components and `CLAUDE.md`. "The one below" → "the one above" to match
   the new section order.
5. The InfoTip's "catch that share, treat that share of the cost as avoided"
   was flagged as an awkward, repetitive abstraction. Rewrote it to ground
   the mechanism in the actual live number twice: *"since it currently
   catches {recall}% of failures, we assume {recall}% of your downtime cost
   is avoided too."* Confirmed for the human afterward that this number *is*
   dynamic — but only across deploys (baked in at `npm run build` from
   `metrics.json`, same as every other recall mention on the site), not
   client-side reactive to the slider.

Every round was build-verified (`npm run build`) and browser-verified via a
scripted Playwright pass (dev server + headless Chromium — `chromium-cli`
wasn't available; the fallback pattern from the `run` skill's
`examples/playwright.md` was used instead, importing straight from the npx
cache's installed copy). Screenshots and the driver script were scratchpad-
only and deleted after each check per Verification Artifact Hygiene.

**Multi-instance handling (the git mechanics, not a feature):**
- Found four unrelated sets of uncommitted/in-flight work already sitting in
  the working tree before touching git at all: a finished-looking Kaggle-
  dataset-credit feature (`Footer.astro`/`site.ts`/`ARCHITECTURE.md`), an
  explicitly-flagged-unfinished Hero.astro marker-repositioning WIP (its own
  comment: *"expect a small nudge once actually seen"*), and — discovered
  only *while* staging my own commit — live, actively-growing changes to
  `InfoTip.astro`/`StatCard.astro`/`Benefits.astro`/`MlopsSystem.astro`/
  `ProductPreview.astro`/`Nav.astro` from a concurrent session.
- Asked the human how to handle the flagged-unfinished Hero.astro WIP
  specifically (`AskUserQuestion`) rather than guessing; got "stash it, push
  everything else, restore after."
- `CLAUDE.md`'s own working diff had *my* Contract 7 additions and the
  teammate's Kaggle-credit documentation mixed into the same uncommitted
  file. Split it by temporarily reverting the teammate's two hunks with
  `Edit`, committing my portion, then restoring those hunks for the Kaggle
  commit — so each commit stays one logical change (Commit Discipline).
- `git stash push -- src/components/Hero.astro` (scoped to that one file,
  not a blanket stash — the other in-flight files were never touched).
- `git pull --ff-only` failed: the remote had moved *again* mid-session
  (`ec805ef` → `91e5f5d`, a second teammate push). Confirmed no file overlap
  with my own commit, then `git merge --no-ff origin/main` — clean, no
  conflicts (default-to-merge, per the Multi-Instance protocol).
- Committed the Kaggle-credit trio as its own commit. `npm run build`
  green. `git fetch` once more to check for a third concurrent push (none),
  then `git push origin main` — succeeded, 3 commits landed
  (`48487c6`, `85dd616` merge, `2a8e504`).
- Attempted `git stash apply --index stash@{0}` to restore the Hero.astro
  WIP afterward, as promised. **Real conflict** — the teammate's just-pushed
  `91e5f5d` (264 lines changed: card restructure, checking-for spinner,
  bootup flicker) supersedes the ~120-line stash I'd set aside. Per the
  protocol's explicit instruction for this exact situation ("stop and
  surface the conflict... rather than guessing which one should win"),
  aborted the apply (`git reset` + `git checkout -- Hero.astro`) without
  resolving it, and left `stash@{0}` in place, unpopped, for a human/the
  other session to judge — not dropped unilaterally, even though it's very
  likely stale now.

## 2b. Same-day follow-up: mobile UX audit (human-requested, Steve Krug POV)

Human's ask: audit the whole site's mobile view for usability issues and fix
them, not just report them. Given Krug's own methodology is fundamentally
about *looking at the actual rendered page*, not reading source, this session
leaned on real browser automation rather than static analysis — see §3 for
why that mattered (a first screenshot attempt was actively misleading).

**Real bugs fixed (`1991409`), most severe first:**

1. **InfoTip popovers were unreachable by tap on iOS Safari, sitewide
   (15+ instances)** — `InfoTip.astro` revealed its popover via CSS
   `:hover`/`:focus-within` only, no client JS, per its own header comment.
   Confirmed with real WebKit automation (Playwright's `webkit` engine, not
   Chromium's mobile emulation, since this is specifically an iOS Safari
   focus quirk) that tapping the trigger button never actually satisfied
   `:focus-within` — the exact same issue `Hero.astro`'s and
   `LiveFactory.astro`'s hover-card hotspots already worked around with a
   tap-toggle script, just never carried over to this component. Fixed by
   calling `.focus()` explicitly on tap (works on iOS Safari even though
   implicit tap-to-focus doesn't) plus a document-level blur-on-outside-tap
   listener — zero CSS changes needed, since every existing
   `:focus-within` rule (position variants, the eco-leaf, the sprout) just
   started working correctly once real focus landed on the button.
2. **Two horizontal-overflow bugs** — confirmed via
   `document.documentElement.scrollWidth` vs `clientWidth` in a real
   Chromium mobile context, not visual inspection (see §3, this distinction
   mattered a lot):
   - The homepage's default `InfoTip` popover (`position="start"`, the
     unqualified default) anchors its left edge to the *trigger's* position,
     not the viewport's — safe on desktop, but a trigger anywhere but the
     left edge of a narrow single-column mobile page pushes a 17rem-wide
     popover off the right side. Measured 100px of real, scrollable overflow
     on the "Failure Recall" stat tile. Fixed with a `max-width: 639px`
     media query centering it under the trigger instead — `data-pos="end"`
     deliberately excluded, since that variant exists specifically for
     triggers already pinned near the edge (Benefits.astro's corner eco-tip)
     and centering it *caused* an overflow that wasn't there before (caught
     by re-running the same audit after the first attempt — worth doing).
   - `/product`'s mobile tab strip (`.dashboard-sidebar`, `overflow-x-auto`
     + `shrink-0` tabs) measured `scrollWidth`/`clientWidth` as correctly
     self-contained (~348px both) under direct inspection, yet
     `document.documentElement.scrollWidth` still read ~1200px — the whole
     page was horizontally scrollable despite the nav's own containment
     looking correct. `min-width: 0` and an explicit `width` on the nav did
     NOT fix it (tested live via `page.evaluate` before touching source);
     `contain: layout` did. Root cause not fully explained (a browser/
     flexbox containment interaction, not textbook), but the fix is
     confirmed correct via before/after `scrollWidth` measurement, not just
     "seems to work."
3. **"Hover for details"** (the `StatCard.astro` discovery hint on Retrains
   Automatically) told touch users — the majority of visitors — to do
   something impossible, and because its CSS-only dismiss also depended on
   real `:focus-within`, it would never go away once tapped on a device
   where tap didn't grant focus. Now says "Tap for details"; dismissal
   works correctly as a side effect of fix #1.

**Smaller fixes, same commit:**
- `.info-tip-btn`'s tap target was ~18px (icon-only, repeated 15+ times
  sitewide) — added an invisible 44px hit area via a `::before` pseudo-
  element rather than growing the visible glyph.
- The hamburger menu (`Nav.astro`) never visually changed when open — no
  confirmation it worked, no obvious "tap to close" affordance beyond
  re-tapping the unchanged icon. Now morphs into an X via three
  independently-transformable line elements, keyed off the `aria-expanded`
  the click handler already set (no new JS).
- `Benefits.astro`: "Lower Maintenance Costs" (the longest tile heading) ran
  its last word into the absolutely-positioned corner eco-leaf icon on a
  single-column mobile card. Fixed with `pr-6` reserving space.
- `ProductPreview.astro`: added a static right-edge `mask-image` fade to the
  mobile tab strip so a first-time visitor notices Alerts/Predictions/Model
  Health/etc. exist off-screen instead of assuming Overview + Live Machines
  is the whole list. Also fixed a stray `". ."` typo and a subject-verb
  agreement error ("sidebar... serve" → "serves") in the section intro.
- `try-it-yourself.astro`: the three terminal commands (`git clone` with a
  long URL, especially) scrolled off the edge of their own box with no way
  to grab the full text short of manual character-by-character selection
  inside a horizontally-scrolling box. New `src/components/CodeBlock.astro`
  adds a working copy-to-clipboard button — reads from the rendered
  `<code>` element's own `textContent` at click time (not a separately
  passed copy of the string) so the copied text can never drift from what's
  displayed. Verified the clipboard actually contains the exact right bytes
  after a real tap, not just that the button renders.

**Deliberately NOT fixed — flagged instead, with reasoning:**
- **`MlopsSystem.astro`'s circular diagram stays circular (and cramped) on
  mobile**, while `HowItWorks.astro`'s near-identical loop concept already
  converts to a clean vertical stepper with down-arrows above it on the same
  page — a real inconsistency, and the diagram's node labels were 8px font
  before this session (bumped to 9.6px as a small, low-risk mitigation).
  The full fix — a genuine mobile-specific vertical-stepper rebuild — was
  judged out of proportion for an audit pass: the diagram's absolutely-
  positioned trigonometric node placement, SVG connector arcs, hover cross-
  highlighting with the "Powered By" cards, and rotation animation are all
  interdependent in ways a rushed parallel mobile layout could easily break.
  **Recommend as deliberate follow-up work, not bundled into a future
  unrelated change.**
- **`/product`'s `'image'`-mode dashboard-preview screenshots (Overview,
  Alerts, Predictions) are illegibly small on a real phone width** — they're
  desktop-resolution mockups scaled to ~350px, so the table/chart text
  inside them is unreadable without zooming. Pinch-zoom is NOT blocked
  (`BaseLayout.astro`'s viewport meta has no `user-scalable=no`/
  `maximum-scale`, confirmed), which softens this from a hard dead-end to
  "requires an extra gesture." A tap-to-enlarge lightbox would fix it
  properly but is a new UI feature (new interaction pattern, backdrop, close
  affordance), not a bug fix — scoped out of this pass for the same
  proportionality reason as the diagram above.

**Verification approach — all claims below are load-bearing for trusting
this section:**
- Overflow claims: `document.documentElement.scrollWidth` vs `clientWidth`,
  measured in real Chromium via Playwright (`isMobile: true, hasTouch: true`,
  390×844 viewport), before AND after each fix, not eyeballed from a
  screenshot.
- The iOS Safari tap-to-focus claim: Playwright's `webkit` engine
  specifically (downloaded fresh this session, cached at
  `~/Library/Caches/ms-playwright/webkit-2336` — already there from a prior
  session's chromium install at `chromium-1234`, so `npx playwright install
  webkit` only needed to fetch the one new engine), not Chromium's mobile
  *emulation* — emulation doesn't reproduce this specific focus quirk, only
  a real WebKit engine does.
- The clipboard fix: `context.grantPermissions`-equivalent
  (`permissions: ['clipboard-read', 'clipboard-write']` on `newContext`)
  plus `navigator.clipboard.readText()` after a real `.tap()`, confirmed
  byte-for-byte against the expected command string.
- No dependency was added to the project — `playwright` was installed
  ephemerally in the OS scratchpad directory (`npm init -y` +
  `npm install playwright --no-save`, a throwaway `package.json` there, not
  this repo's), matching the 2026-08-05 handover's own note that Playwright
  wasn't a project dependency and a prior session didn't want to add one
  just to check. This session made the same call for the same reason.

## 3. Un-recoverable context

**The `npx`-cache Playwright import path used for browser verification is
machine-specific and will not exist in a fresh environment.** This session
imported directly from
`~/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs` (found via
`find ~/.npm/_npx -iname playwright`) because `playwright` isn't a project
dependency and ESM `import` doesn't honor `NODE_PATH`. A future session
needing browser verification will need to re-resolve this (or just install
`playwright` properly, or check whether `chromium-cli` is available by then)
— don't copy that literal path.

**The "days" generalization was a deliberate, reasoned choice, not
arbitrary.** `UserStory`'s Overnight Impact card is specifically a *night*
story (the whole section heading is about the dayshift asleep). The
calculator's multiplier counts prevented-failure *events*, which aren't
inherently nocturnal — so "days" is the more general, correct unit for the
calculator's own sentence, even though it sits right next to (and now right
after) a card that's explicitly about one particular night. If a future
session is tempted to "fix" this back to "nights" for surface-level
consistency with the Overnight Impact narrative, that would be reintroducing
the exact mismatch this session's human feedback asked to remove.

**Why the InfoTip rewrite interpolates `{recall}` twice instead of once.**
The plain-language fix explicitly grounds the abstract mechanism ("apply the
recall rate to your cost") in a concrete worked example using the actual
live number on both sides of the analogy ("catches X% of failures... we
assume X% of cost is avoided too") — a single mention wouldn't complete the
example. Don't simplify this back down to one mention without re-reading why
the two-sided phrasing was the fix, not incidental.

**A raw headless-browser screenshot actively lied about a bug that didn't
exist — corroborate before trusting one (mobile-audit session).** An early
Brave-CLI headless screenshot (`--headless --window-size=390,844
--screenshot`, no `--force-device-scale-factor`) showed the homepage's
headline and body copy apparently clipped mid-word at the right edge —
looked exactly like a real horizontal-overflow bug. It wasn't: a real
Playwright `page.evaluate()` measurement of `document.documentElement
.scrollWidth` showed only ~490px vs a 390px viewport (a real, but much
smaller and differently-located, InfoTip overflow — see §2b), and a
from-scratch Chromium render via Playwright showed the headline wrapping
perfectly normally. Adding `--force-device-scale-factor=1` to the Brave CLI
call fixed a *simpler* isolated test page, but even then a full-page
screenshot of the real site produced further false signals — most
notably, every `[data-reveal]` scroll-triggered section reading as
permanently blank, because a single `page.screenshot({fullPage:true})`
taken immediately after `page.goto()` never scrolls each section into the
viewport, so their IntersectionObserver-driven reveal never fires. (A
*separate*, even more misleading false alarm came from measuring reveal
state after an artificially fast synthetic `window.scrollTo()` loop —
21/21 elements read as permanently stuck hidden even after "scrolling
through" the whole page. A single realistic `scrollIntoView()` call proved
the mechanism works fine; the rapid-fire loop just outran the observer's
callback timing, which no real user's scroll ever would.) **The fix for all
of this was the same: use Playwright's real automation API
(`page.evaluate`, `getBoundingClientRect`, `scrollWidth`) as the source of
truth, and treat any screenshot — Brave CLI or Playwright's own — as
something to corroborate, not something to read pixels off of and
conclude a bug exists.** This generalizes the 2026-08-05 handover's
narrower "raw Brave screenshot at a narrow width isn't trustworthy" finding
— it turns out the failure mode is broader than just the narrow-viewport
case that prompted it.

## 4. Open questions — need a human, not a guess

- [ ] **Is `stash@{0}` (the superseded Hero.astro marker WIP) safe to drop?**
      Almost certainly yes — the teammate's `91e5f5d` appears to be a more
      complete version of the same work — but this session deliberately
      didn't drop it. Whoever owns that WIP should confirm and run
      `git stash drop stash@{0}` themselves (or tell the next session to).
- [x] ~~What are `InfoTip.astro`/`Nav.astro`/`StatCard.astro`/
      `Benefits.astro`/`MlopsSystem.astro`/`ProductPreview.astro`'s
      uncommitted changes, and are they ready to commit?~~ — **resolved
      2026-08-07, ~13:50.** They were the mobile-audit session's own work
      (§2b), finished, committed (`1991409`), and pushed the same day.
- [ ] **Should `MlopsSystem.astro`'s circular diagram get a real mobile
      layout (a vertical stepper, matching `HowItWorks.astro`'s existing
      treatment of a near-identical loop concept)?** Flagged, not built, by
      the mobile-audit session (§2b) — judged too large/risky to bundle into
      an audit pass given the diagram's interdependent hover-highlighting,
      SVG connector arcs, and rotation animation. A small mitigation (8px →
      9.6px node-label text) shipped instead. Needs a deliberate design/build
      pass if greenlit, not a quick follow-on edit.
- [ ] **Should `/product`'s `'image'`-mode dashboard-preview screenshots get
      a tap-to-enlarge lightbox on mobile?** They're desktop-resolution
      mockups scaled to ~350px — illegible without zooming, though pinch-zoom
      itself isn't blocked. Flagged by the mobile-audit session (§2b) as a
      new-feature-sized fix, out of scope for that pass.
- [ ] Carried, unchanged from 2026-08-06 (not touched this session): the
      36-version history chart question; machine naming
      (`machine_01`–`machine_05` vs. dressed-up names) for a real per-machine
      panel; the Live Factory sparkline's CNC-0N ↔ `machine_0N` mapping
      (illustrative names over real traces); `LiveFactory.astro`'s aria-label
      wording; real logo/icon mark; §9.1's in-action screen recording.
- [x] ~~Downtime-cost calculator — still unbuilt, placement an open human
      call~~ — **resolved this session.** Built as a homepage section
      (`SavingsCalculator.astro`), placed after `UserStory` per human
      direction, not as its own `/product` panel.
- [x] ~~The three illustrative savings figures (€28,400 / €24,300 /
      €32,800)~~ — **appears moot.** A repo-wide search found none of these
      three figures anywhere in current `src/`; only `€24,300` (`UserStory`'s
      Overnight Impact card, now also `savings.ts`'s `OVERNIGHT_IMPACT_EUR`)
      exists today. Whatever prompted the "three figures" note in the
      2026-08-05/06 docs appears to have already been consolidated down to
      one, single-sourced figure by the time this session started.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin
git log --oneline -5      # tip = 1991409 (+ this handover commit) or later?
git status                # expect clean of anything from today's two sessions
git stash list             # expect stash@{0} (superseded Hero.astro WIP, still unresolved — §4) + stash@{1} (pre-existing, unrelated)
npm run build              # must pass; 3 routes build
```

PowerShell: run these one per line (`&&` is a parser error in PowerShell 5.1 —
CLAUDE.md, Platform Agnosticism). Don't pipe the build into `-First N` (prior
session's finding, still true — a truncated pipe fakes a build failure).

- **Branch / commit:** `main` @ `1991409`, identical to `origin/main`, pushed.
- **Build:** passes, 3 pages.
- **Uncommitted:** nothing from either of today's sessions — working tree
  clean of ours. `stash@{0}`/`stash@{1}` still sit there (see §4); re-check
  `git status`/`git stash list` fresh regardless, since this doc is a
  snapshot and this repo routinely has more than one active committer.
- **Canonical sources:** [`CLAUDE.md`](../CLAUDE.md) (rules, now Contracts
  1–7) · [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) (design why) ·
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
  This session hit that literally — the remote moved twice in under an hour.
- **Staleness guard.** If `updated` >1 working day old or `head_sha` ≠ `origin`,
  trust §5's live commands over anything written here.
- **Right-tier rule.** Durable *design why* → `ARCHITECTURE.md`. Durable
  *engineering rules* → `CLAUDE.md`. Image assets + prompts → `IMAGE_ASSETS.md`.
  History → `git log`. Only *current state + next action* → here.
- **Every push to `main` is a live release.** Verify `npm run build` first.
