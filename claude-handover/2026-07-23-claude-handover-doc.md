---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-07-27 (human-review feedback pass — IA restructure, new UX components, copy audit, timeline animation)
updated_by: Claude (feedback-implementation session)
head_sha: 5dae703
branch: main
status: green (build passes; HEAD is a local, unpushed commit — see §3)
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: green · branch main @ 5dae703, NOT pushed to origin. npm run build passes (verified repeatedly through the session).
Just did: worked through two rounds of the human's screenshot-based review feedback: extracted the Product Preview
section to its own /product subpage; rebuilt the HowItWorks loop diagram (gradient icon rings, feedback-loop arrow);
added wide-screen fluid type/layout tuning; wrote docs/IMAGE_ASSETS.md (full image-asset inventory, prompt-ready);
built two new reusable components (InfoTip.astro — hover glossary popover, BeginnersTrail.astro — hover-expand/
click-to-pin guidance panel); overhauled try-it-yourself.astro (Docker link, git-free ZIP path, Krug/Redish copy
audit, fixed a real "menu before docker compose" sequencing confusion); reworked UserStory.astro's timeline (AM
times, +8min realistic retrain delay, contrast color on headings not the clock, a new CTA-label exception, and a
scroll-triggered red→white-travel→green animated reveal); added a Verification Artifact Hygiene protocol to
CLAUDE.md.
DO NEXT: human should (1) review the diff — nothing was committed by Claude this session, see §3's note on the
"5dae703 Unpushed changes" commit; (2) decide whether to push as one commit or split it; (3) verify the ZIP-
download URL's assumed `main` branch name is correct (no network access this session to confirm — see §4);
(4) if happy with the timeline animation and BeginnersTrail interaction, no further action needed, they're built
and verified.
DON'T: don't assume "5dae703 Unpushed changes" describes what's in it — it's a generic auto-commit message, not
authored by Claude or the human describing intent. Don't re-litigate the Product Preview subpage move or the
"See the dashboard" CTA exception — both were explicit human decisions this session, recorded in CLAUDE.md.
Blocked on: nothing code-related. Still open (all pre-existing, carried forward): DagsHub MLflow endpoint
confirmation, hero macro-gears photo, real logo, §9.1's in-action clip, MLOps rotating center-emblem (now spec'd
in IMAGE_ASSETS.md but not yet built), Built-With/Powered-By real tool logos (also spec'd, not yet built).
Ground truth: CLAUDE.md (standing rules, updated this session) + docs/ARCHITECTURE.md (design why) +
docs/IMAGE_ASSETS.md (new — image asset inventory) · run §5 verify commands below before editing.
```

---

## 1. Resume here

**Next action (concrete & executable):** nothing is blocked. The human asked
several review-feedback rounds be implemented (see §2) — all done and
`npm run build`-verified. If picking this up cold: skim this doc, then
`git log -1 --stat` to see the actual diff before assuming anything about the
generic "Unpushed changes" commit message (§3).

**Settled — do NOT re-litigate:**
- Everything from 2026-07-22 and the earlier 2026-07-23 governance session
  (stack, section design, `CLAUDE.md` as the standing-rules doc, platform-
  agnostic hardening, fetch-metrics no-op-commit fix).
- **Product Preview now lives at its own `/product` subpage**, not an early
  homepage section — an explicit human decision this session (they were
  offered "reorder down the scroll" vs. "extract to a subpage" and chose the
  latter). Every "See it in action" CTA (Hero, HowItWorks, UserStory, Nav,
  Footer) and the skip-link now target `/product` / `#main-content`
  accordingly. Don't move it back without a similarly explicit call.
- **UserStory.astro's CTA reads "See the dashboard,"** not the site's usual
  "See it in action" — a deliberate, human-approved one-off exception to the
  two-verb CTA rule, recorded in `CLAUDE.md`'s Danger Zones. Don't generalize
  this wording elsewhere without an equally explicit ask.
- **`BeginnersTrail.astro`'s hover-expand/click-to-pin/auto-collapse
  interaction was explicitly modeled on a reference project** the human
  pointed at (`C:\Users\actor\Webdesign_projects\IP\Gamified Task Webb App`'s
  distraction-capture panel) — the small client script it needs is a
  deliberate, requested exception to this repo's usual zero-JS default, not
  scope creep.
- **`--color-success-400` is a new, deliberate one-off token** in
  `global.css` — the site's first non-teal "positive" color, added
  specifically for the UserStory timeline's red/green status semantics at the
  human's explicit request. Not a general-purpose success color to reach for
  elsewhere.

## 2. What changed this session

Two rounds of human review feedback (screenshots + written notes), implemented
in full:

**Round 1:**
- Extracted Product Preview to `src/pages/product.astro`; removed it from
  `index.astro`'s scroll; repointed `site.ts`'s `NAV_LINKS`, `Hero.astro`,
  `HowItWorks.astro`, `UserStory.astro`, `Footer.astro` (added a matching
  "See it in action" footer link), and `BaseLayout.astro`'s skip-link
  (now targets a universal `#main-content`, not a homepage-only anchor).
- Rewrote the CNC copy in `LiveFactory.astro` (Ginny Redish pass — shorter
  sentences, concrete language).
- Rebuilt `HowItWorks.astro`'s loop diagram: gradient icon rings straddling
  each card's top edge (half in/half out), a curved SVG feedback-loop arrow
  under the row (desktop), a text loop-back cue on mobile. Gradients recombine
  existing teal/blue tokens rather than introducing new hues (Contract 4).
- Added centralized wide-screen tuning to `global.css` (`.max-w-7xl`/
  `.max-w-6xl` widen past the 1536px breakpoint) plus `2xl:text-*` bumps on
  every major heading.
- Wrote `docs/IMAGE_ASSETS.md` from scratch — full image-asset inventory
  (hero photo, logo, Live Factory v2, OG image, favicon, the already-finished
  dashboard screenshot, the out-of-scope-for-image-gen in-action clip),
  prompt-ready for an image-generation tool.
- Built `src/components/InfoTip.astro` (CSS-only hover/focus glossary
  popover) and wired a Docker Desktop link + tip into `try-it-yourself.astro`.
- Built `src/components/BeginnersTrail.astro` (see interaction note above),
  added a git-free "Download ZIP" path (GitHub archive URL — **branch name
  `main` assumed, not verified**, see §4) alongside the existing git-clone
  path, and fixed wording that referenced "cloning" before explaining it.

**Round 2** (after the human reviewed round 1's screenshots + two actual
mockup files in `design/mockups/`):
- `UserStory.astro`: timestamps got `AM` suffixes; retrain/promote shifted
  +8min (`02:20→02:28`, `02:37→02:45`) to reflect a realistic GitHub Actions
  queue delay; headings now carry the teal contrast color instead of the
  clock; short scannable status-label headings matching the actual mockup
  (Drift Detected / Pipeline Triggered / Model Retrained / Model Promoted /
  System Healthy) replaced the earlier active-voice sentence headings; body
  copy tightened and given a narrower wrap; CTA renamed "See the dashboard"
  (see §1).
- Added the MLOps rotating center-emblem and Built-With/Powered-By real
  tool-logo requirements to `IMAGE_ASSETS.md` as items 4–5, sourced by
  actually opening `design/mockups/Screenshot 2026-07-21 112150.png` (not
  guessed) — both flagged as **not image-generation tasks**: the emblem is a
  CSS/SVG animation spec (there's an unused `ring-rotate` keyframe already
  sitting in `global.css` from an earlier pass, likely intended for exactly
  this and never wired up), the logos are real third-party marks to source
  from Simple Icons, not to prompt-generate.
- All new external links (Docker Desktop, ZIP download, view-source-on-GitHub)
  got `target="_blank" rel="noopener"`.
- Redesigned `BeginnersTrail.astro`'s interaction per the human's explicit
  reference project (see §1) — collapsed by default, hover-expands, click
  pins it open, auto-collapses otherwise.
- Built a scroll-triggered, one-time animated reveal for `UserStory.astro`'s
  timeline (opened `design/mockups/Screenshot 2026-07-21 112223.png` to get
  the exact color/label reference): Drift Detected flashes red and holds red,
  a white light travels node to node lighting each one, System Healthy
  flashes green at the end. A small `IntersectionObserver` script (the same
  low-JS-by-default-except-when-genuinely-needed pattern as `Nav.astro`'s
  mobile menu and `BeginnersTrail.astro`) adds an `is-playing` class once;
  without it, the timeline just shows today's plain teal dots — never a
  broken/half-lit state.
- Did a full Steve Krug / Ginny Redish audit of `try-it-yourself.astro` at
  the human's request, and fixed a real sequencing bug it surfaced: "The easy
  way" section described running a menu script and pressing a number, without
  ever saying that script also starts the Docker stack — a reader would hit
  it before ever seeing `docker compose up` (only introduced later, in the
  manual-commands section) and reasonably wonder if they'd missed a step.
  Fixed by stating explicitly the menu script "starts everything for you,"
  and adding a line to the manual-commands section clarifying it's a complete
  *alternative* to the sections above it, not a next step after them.
- Added a **Standing Protocol — Verification Artifact Hygiene** section to
  `CLAUDE.md` (screenshots/scratch files made only to verify a change get
  deleted after, not left to accumulate) at the human's explicit ask, and
  actually cleaned up this session's own verification screenshots
  (`/tmp/shots`, `/tmp/verify` — this Windows box's Bash `/tmp` resolves to a
  real temp folder, not the repo, but the new protocol says use the harness
  scratchpad instead going forward).
- Updated the Danger Zones' two-verb CTA entry to say `/product` (not the old
  `#product` anchor) and to record the "See the dashboard" exception.

`npm run build` was run and passed after every batch of changes, not just
once at the end. Visual verification used headless Edge screenshots
(`msedge --headless=new --screenshot=...`) since no `chromium-cli` or
Playwright was available in this environment — each screenshot was deleted
once reviewed, per the new hygiene protocol.

## 3. Un-recoverable context

- **A commit appeared at HEAD that Claude did not intentionally create.**
  `5dae703`, message "Unpushed changes", author `envelopingCODE
  <envelopingCODE@pm.me>` (the human's own git identity), timestamp
  2026-07-27 11:07:55 — containing the *entire* diff described in §2 (18
  files). No `git commit` was run via any tool call this session; this looks
  like an automatic checkpoint/hook external to Claude's own actions, not a
  deliberate commit. **Flagged to the human directly; they chose "leave it
  as-is"** rather than reword or investigate the cause. A future session
  should not assume the message describes the contents, and should not be
  surprised if the same thing happens again — it wasn't chased down.
- **The ZIP-download URL is an educated guess, not a verified fact.** No
  network access was available this session (`curl`, `WebFetch`, and `gh`
  all failed to reach GitHub) to confirm the ML repo's default branch is
  `main`. The URL `${REPO_URL}/archive/refs/heads/main.zip` in
  `try-it-yourself.astro` assumes it is (a safe-ish bet — GitHub's default
  since Oct 2020 — but genuinely unconfirmed). The adjacent "or view the
  source on GitHub" link was added specifically as a fallback in case this
  guess is wrong. Worth an actual `curl -I` check once network access exists.
- **Two mockup files in `design/mockups/` were opened and read directly this
  session** to source exact copy/color/layout, not guessed from the human's
  prose alone: `Screenshot 2026-07-21 112150.png` (MLOps System diagram —
  rotating center emblem, Built With/Powered By tool logos) and
  `Screenshot 2026-07-21 112223.png` (UserStory timeline — exact status
  labels, AM suffixes, teal contrast-on-headings pattern). Both are now the
  ground truth backing the corresponding `IMAGE_ASSETS.md` entries and the
  `UserStory.astro` rewrite — if either mockup is later revised, those
  downstream artifacts should be revisited too.
- **Carried forward from the earlier 2026-07-23 governance session** (still
  true, not re-verified this session): this repo has active concurrent
  editors beyond any single Claude session — always `git fetch` before
  pushing. The git identity on this machine (`envelopingCODE`) is Nate, one
  of the two teammates listed in `site.ts`'s `TEAM` constant (the other is
  Ivo, `@undorigo`) — his platform-agnostic findings from that session are
  folded into `CLAUDE.md`'s Standing Protocols and Danger Zones, not kept as
  a separate file. The rolldown-vite lockfile bug was real and already
  fixed; don't reintroduce it by regenerating the lockfile carelessly (see
  `CLAUDE.md` Danger Zones).

## 4. Open questions — need a human, not a guess

- [ ] **Commit hygiene:** the human chose to leave "5dae703 Unpushed changes"
      as-is rather than reword/split it. Still worth deciding before pushing
      to `origin` whether that generic message is acceptable in shared
      history, or whether to amend it then (amending is still safe pre-push).
- [ ] **Verify the ZIP download URL** once network access exists — confirm
      `predictive-maintenance-demo`'s default branch really is `main`.
- [ ] **Built-With/Powered-By logo color** (flagged in `IMAGE_ASSETS.md`
      item 5): keep tool logos in authentic brand colors (as the mockup
      shows), or recolor to the teal palette? Not decided, don't assume.
- [ ] **MLOps rotating center-emblem** (`IMAGE_ASSETS.md` item 4) is spec'd
      but not built — the unused `ring-rotate` keyframe in `global.css` is
      likely intended for it. A reasonable next task if picked up, but wasn't
      asked for explicitly this session (only the doc entry was).
- [ ] Carried over, unchanged: DagsHub MLflow endpoint confirmation, hero
      macro-gears photo, real logo/icon, §9.1's in-action clip,
      Pages/branch-protection setup.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git log -1 --stat                              # HEAD should be 5dae703 with the 18-file diff described in §2
git status                                      # expect clean (nothing uncommitted)
git log --oneline -5                            # confirm 5dae703 hasn't been pushed/rebased since
npm run build                                   # must pass — verified repeatedly this session
grep -n "success-400" src/styles/global.css     # confirm the new token is present
ls src/components/InfoTip.astro src/components/BeginnersTrail.astro src/pages/product.astro docs/IMAGE_ASSETS.md
```
- **Branch / commit:** `main` @ `5dae703`, **not pushed** to `origin`.
- **Build:** passes (`npm run build`, verified after every batch of edits).
- **Uncommitted work:** none — everything from this session is in `5dae703`
  (see §3 for the caveat on how that commit came to exist).
- **Canonical *why*:** [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
  (design) + [`CLAUDE.md`](../CLAUDE.md) (standing engineering rules) +
  [`docs/IMAGE_ASSETS.md`](../docs/IMAGE_ASSETS.md) (new — image asset
  inventory, prompt-ready for an image-gen tool).

---

## Protocol & guardrails

**Outgoing session** (before standup / lunch / EOD):
1. Update frontmatter + context block + §1 next action.
2. Create a **new dated** handover (`YYYY-MM-DD-…`) — never overwrite prior
   days'. (This file updates the *same* 2026-07-23 doc rather than adding a
   same-day duplicate, since no multi-per-day naming convention exists yet —
   worth establishing one if same-day handovers become routine.)
3. `git fetch` first — this repo has more than one active committer.
4. `git commit` → `git push` (rebase onto any new remote commits first).

**Incoming session** (first message of the day):
> "`git pull`, read the latest dated `claude-handover/…-claude-handover-doc.md`,
> read `CLAUDE.md`, run the §5 verify commands, then confirm the plan back to
> me before editing."

**Guardrails**
- **Single writer** *for this file* — but not for the repo (see §3 in the
  earlier governance-session content, still true). Coordinate the handover
  doc; expect `main` itself to move between sessions.
- **Staleness guard.** If `updated` >1 working day old or `head_sha` ≠
  `origin`, trust §5's live commands over anything written here.
- **Right-tier rule.** Durable *design why* → `ARCHITECTURE.md`. Durable
  *engineering rules* → `CLAUDE.md`. Image-asset specs → `IMAGE_ASSETS.md`.
  History → `git log`. Only *current state + next action* → here.
