---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-07-28 (visual-bug-fix session — real photo integration + section polish)
updated_by: Claude (Hero/LiveFactory/HowItWorks/MlopsSystem/Benefits fix session)
head_sha: cc0e404
branch: main
status: green (site build/deploy build-job green; Pages deploy-job red — see §4, needs a human)
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: main @ cc0e404, pushed to origin (this handover is the commit on top). npm run build passes locally and in CI every run today. GitHub Pages deploy is currently RED — not a code problem, see DON'T below.
Just did: integrated the two real generated images (hero macro-gears photo, Live Factory floor photo) that arrived mid-session from a teammate (Nate) and from the human directly; fixed a shared CSS stacking-context bug that was hiding both photos; fixed and iteratively polished the MLOps circular diagram's connector arrows, the How It Works section's loop arrows (desktop + newly-added mobile/stacked versions), two broken icons (magnifying glass, dollar sign), and the Benefits tile layout; capitalized nav labels; reworded one copy line.
DO NEXT: **GitHub Pages isn't deploying** — Settings → Pages → Source needs to be set to "GitHub Actions" by someone with admin rights on the repo (I don't have that access). The build job has gone green on every run today; only the `actions/deploy-pages@v5` step fails, every single time, back through at least 8 runs / commits before today too. This is a one-time repo-settings toggle, not a code fix. See §4.
DON'T: don't add z-index to a `position:relative` section without knowing why (see §3 — it's the fix for a real, repeatable bug, not decoration). Don't assume an SVG sized via `inset-y-0` alone will stretch to its parent — it won't; needs an explicit height (`h-full`) — see §3. Don't re-break the MLOps circle's arrows by routing them back onto the same radius as the node tiles (they'll cross the tile text again — keep them on the smaller inner ring).
Blocked on: GitHub Pages source setting (needs human/repo-admin, §4). Nothing else code-side is blocked.
Ground truth: CLAUDE.md (standing rules) + docs/ARCHITECTURE.md (design why) + docs/IMAGE_ASSETS.md (image prompts). Run §5 verify before editing.
```

---

## 1. Resume here

**Next action (concrete, needs a human):** GitHub Pages deploy is failing on
every run — **not a code bug**. Fix: repo **Settings → Pages → Build and
deployment → Source → "GitHub Actions"**. This is a documented first-time-setup
step already called out in `deploy.yml`'s own top comment; it was apparently
never done. Once set, either push again or manually re-run the latest failed
workflow run to confirm green. I don't have `gh` CLI or repo-admin access in
this environment, so I can diagnose but not flip this switch — see §4 for the
full diagnosis (I confirmed via the GitHub REST API that the `build` job has
been green on every single run checked, and only `deploy`'s `actions/
deploy-pages@v5` step fails, consistently, across at least 8 runs going back
before today).

**Settled — do NOT re-litigate:**
- Everything from prior handovers (2026-07-22 through 2026-07-27): stack,
  section design, hero CTAs, two-loop system, dark-only, no-analytics,
  CLAUDE.md as standing rules, batched commit discipline, gpt-image-2 facts.
- **Hero and Live Factory now use real generated images, not placeholders.**
  `public/images/hero/prototype-1-hero-image.png` (macro-gears photo — Nate
  wired this in independently, mid-session) and `public/images/live-factory/
  cnc-factory-floor.png` (human dropped this in directly, from `design/
  visual-assets/`). Both render full-bleed behind their section's copy, faded
  via CSS gradients/masks, not boxed cards — this was the whole point of
  today's Hero/LiveFactory work, don't revert to boxed placeholders.
- **The z-index stacking-context bug is real and will recur if reintroduced.**
  `position:relative` alone does **not** create a CSS stacking context — it
  needs an explicit `z-index` (`z-0` is enough) too. Without it, `position:
  absolute` children with negative `z-index` (used for background image/glow
  layers) can render *behind the page's own background*, fully invisible, even
  though they look correct in the DOM. This bit both my own draft Hero.astro
  **and independently Nate's real-photo version** — same root cause, same fix
  (`<section class="relative z-0 overflow-hidden">`). Grep for `-z-` before
  assuming a layering bug is something else.
- **An SVG sized only via `inset-y-0` (top:0;bottom:0) does not reliably
  stretch to fill its parent.** SVG is a "replaced element" with an intrinsic
  aspect ratio from its `viewBox`; with no explicit height, browsers fall back
  to sizing height as `width × (viewBox aspect ratio)`, ignoring the intended
  stretch. Confirmed empirically today across 10 viewport widths — height was
  *exactly* `width × 10` (the viewBox's 30:300 ratio) every time, regardless of
  actual content height, which is why a mobile connector arrow visually ran
  hundreds of pixels into unrelated sections at wider (tablet) widths. Fix:
  give the SVG an explicit height class (`h-full`), don't rely on `inset-y-0`
  alone.
- **The MLOps circular diagram's connector arrows live on a smaller INNER
  ring** (`ARC_R = 26`, vs. the node tiles' `R = 42`), not the tiles' own
  radius. Drawing them at the tiles' radius (even painted on top, z-order-wise)
  ran the arrow line straight across each tile's own text — this is the fix,
  not a stylistic choice to relitigate.
- **Style consistency across separate gpt-image-2 generations** = repeat a
  fixed "style DNA" block in every prompt (unchanged from 2026-07-27).

## 2. What changed this session

- **Recovered from a real data-loss event early in the session.** A `git
  reset` + `pull` (run by something/someone outside my control — visible in
  the reflog) silently discarded a full round of my uncommitted edits and
  fast-forwarded in a new commit from Nate. I caught it via a system-reminder
  showing files reverted to pre-edit state, confirmed via `git reflog`, and
  redid the lost work rather than re-deriving it from scratch (I still had it
  in context). See §3 for what was actually in that commit.
- **Hero.astro:** kept Nate's real-photo structure (he'd independently built
  the same "full-bleed image behind copy, not boxed" fix I was also drafting)
  and fixed the shared z-index stacking bug (§1) that was hiding his photo
  entirely. Extended it to render at every breakpoint with a near-opaque wash
  below `lg` (mobile reads as faint texture, not a distinct photo — human's
  explicit choice from an earlier `AskUserQuestion`).
- **LiveFactory.astro:** replaced the in-code SVG factory-floor placeholder
  with the real `cnc-factory-floor.png` (human-provided), blended into the
  section background via a radial CSS mask (no card border), same technique
  validated for the Hero placeholder earlier in the week.
- **HowItWorks.astro** (multiple rounds of fixes, in order):
  1. Added the previously-missing top feed-forward arc (Collect → Business
     Impact), enlarged/centered the inter-tile connector arrows, removed an
     awkward tablet 2-column grid break.
  2. Fixed both desktop loop arrowheads' tips getting clipped — SVG's default
     `overflow:hidden` was cutting off the marker where it overshot the
     viewBox; fixed with `overflow-visible`.
  3. Added mobile/stacked-view connector arrows (previously: zero visual
     connectors below `lg`, just a text caption).
  4. Fixed the mobile connector arrows initially overlapping each icon ring's
     "air space" — increased the stacked gap and repositioned.
  5. Added the mobile loop-back arrow (Business Impact → Collect) by capping
     card width and freeing a side gutter — per the human's own suggested
     approach.
  6. Fixed that arrow being bulky, and reaching into the sections below (the
     `inset-y-0`/SVG-stretch bug, §1) — and added the missing **second** mobile
     arrow (Collect → Business Impact, mirroring the desktop top arc) by
     centering cards instead of left-aligning them, opening a gutter on both
     sides.
  7. Fixed the magnifying-glass ("Detect") icon — the old path had two
     overlapping circle definitions baked in by mistake (a real rendering
     bug, not a style choice); replaced with a clean single circle + handle,
     verified via an isolated render before integrating.
- **MlopsSystem.astro:** added the circular diagram's 6 connector arrows
  (previously just a plain dashed guide circle, no direction/flow shown);
  first attempt painted them at the tiles' own radius (crossed the tile text,
  looked broken); fixed by moving them to a smaller inner ring (§1). Also kept
  the circle diagram at every breakpoint (no mobile text-list fallback) from
  earlier in the week.
- **Benefits.astro:** rebuilt each tile from icon-above-text to icon-beside-
  text (bigger icon, vertically centered with the text), matching a mockup
  reference; then widened tiles from 4 columns to 2 at desktop after the human
  flagged the 4-column version as too narrow/compressed.
- **Fixed a mirror-inverted dollar-sign icon** (Benefits' "Lower Maintenance
  Costs" tile) — verified by rendering the original path against a real `$`
  character side by side before committing to a fix; the circle part was
  already symmetric, only the S-curve was reversed.
- **Nav labels capitalized** to "Tech Stack" / "Project & Team" (`site.ts`,
  `Footer.astro`, `CLAUDE.md`, `ARCHITECTURE.md`) — this was lost once in the
  reset (§3) and redone identically.
- **Copy fix:** UserStory's subhead "The system watches over the factory all
  night" → "The system monitors your machines all night" — the original could
  read as the system operating the CNC machines, when it only analyzes tool/
  sensor health overnight.
- **Diagnosed (not fixed — can't, no admin access) the GitHub Pages deploy
  failure.** See §4.
- Committed across several batches today; merged with Nate's concurrent work
  twice (both times cleanly, no conflicts — his commits touched `UserStory.
  astro`'s animation timing/glow-color, mine touched other files or different
  lines). Final state pushed and confirmed byte-identical with `origin/main`.

## 3. Un-recoverable context

- **The mid-session data-loss event, in detail:** partway through implementing
  the Hero.astro restructure, a `git reset` (to `HEAD`, per the reflog) plus a
  `git pull` fast-forward ran outside of anything I did, wiping every
  uncommitted edit from that turn across 8 files (Hero, LiveFactory,
  HowItWorks, MlopsSystem, site.ts, Footer, CLAUDE.md, ARCHITECTURE.md) and
  pulling in Nate's new commit "Visual assets subfolder." I noticed via a
  system-reminder showing the files' *actual* on-disk content reverted to
  pre-edit state, confirmed with `git reflog` (`HEAD@{1}: reset: moving to
  HEAD`), and chose to re-implement rather than re-derive from scratch since I
  still had the correct versions in context. **Before blindly redoing
  anything, I read Nate's actual new Hero.astro/UserStory.astro first** — good
  thing, since his Hero.astro already solved the "photo behind text, not
  boxed" problem independently (with a real photo, no less) and had the exact
  same z-index bug mine did. Redoing my draft on top would have thrown away
  real, working progress; instead I fixed the shared bug in *his* version.
- **Where the real photos actually came from:** `prototype-1-hero-image.png`
  arrived via Nate's own commit (already in `public/images/hero/` and `design/
  visual-assets/` when I found it). `cnc_factory_floor.png` arrived via a
  direct mid-turn instruction from the human, sourced from `design/
  visual-assets/cnc_factory_floor.png` — I copied it to `public/images/
  live-factory/cnc-factory-floor.png` myself, following Nate's established
  `public/images/<section>/` convention.
- **The SVG-height bug took real debugging effort, not guesswork — worth
  trusting the finding.** The human reported "the arrow reaches into the next
  sections"; my first instinct (recompute a percentage/pixel error) didn't
  reproduce at the viewport width I tested. I only found it by measuring
  `getBoundingClientRect()` across 10 widths (320–1023px) and noticing height
  was *exactly* `width × 10` every time — a dead giveaway for the
  viewBox-aspect-ratio fallback, not a rounding error. Documented as a
  first-class "settled" fact above so it isn't rediscovered the hard way again.
- **The MLOps arrow z-order fix from earlier in the week was NOT the final
  fix.** I initially "solved" arrows-hidden-behind-tiles by painting the arrow
  SVG after (on top of) the tiles. That made them *visible* but ran the line
  straight across the tile text, which the human correctly called
  unprofessional. The actual fix was moving the arrows to a smaller-radius
  inner ring, not a z-order trick — don't regress to the z-order-only version.
- **Icon fixes were verified, not eyeballed.** Both the magnifying-glass and
  dollar-sign fixes were checked by rendering the proposed path in isolation
  (a throwaway HTML file via Playwright) *before* editing the real component —
  for the dollar sign specifically, side-by-side against an actual `$`
  character glyph, which made the original's mirroring unambiguous.
- **Every commit today deployed live via `deploy.yml` once the Pages source is
  fixed** — none of today's pushes have actually gone live yet, because the
  Pages deploy step has been failing since before this session (see §4);
  today's work is sitting in the built artifact, ready to serve the moment
  Pages is switched on.
- **Nate remains an active concurrent committer.** Two more real collisions
  today, both resolved cleanly via fetch + merge (never force-pushed, never
  discarded his work). Keep fetching before every push.

## 4. Open questions — need a human, not a guess

- [ ] **GitHub Pages Source setting** — Settings → Pages → Build and
      deployment → Source → "GitHub Actions". Confirmed via the GitHub REST
      API (`/repos/.../actions/runs`, `/jobs`) that the `build` job is green on
      every run and only `deploy`'s `actions/deploy-pages@v5` step fails, on
      every run checked (at least 8, spanning before today through `cc0e404`).
      `deploy.yml` itself already documents this exact first-time-setup step
      in its own header comment — it just hasn't been done. I have no `gh` CLI
      or repo-admin access in this environment to flip it myself.
- [ ] Once Pages is fixed, worth a manual re-run of the latest workflow (or
      just push again) to confirm the site actually goes live with today's
      real photos and section fixes.
- [ ] Carried over, unchanged: DagsHub MLflow endpoint 404, §9.1 in-action
      clip, real logo/icon mark, MLOps tool brand icons (Simple Icons —
      descriptions already shipped).
- [ ] The employee/"while the employees sleep" illustration (IMAGE_ASSETS.md
      item 4) is still the placeholder SVG — not touched today.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin && git log --oneline -5     # tip = cc0e404 (+ this handover commit) or later?
git status                                    # clean?
npm run build                                 # must pass; 3 routes build
```
- **Branch / commit:** `main` @ `cc0e404`, pushed to `origin`; this handover
  is the commit on top.
- **Build:** passes locally and in CI (build job). **Pages deploy job fails**
  — see §4, needs a human with repo-admin access, not a code fix.
- **Uncommitted work:** none at push time.
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
