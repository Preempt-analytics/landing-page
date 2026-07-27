---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-07-27 (image-asset session — MLOps tool descriptions + IMAGE_ASSETS overhaul for gpt-image-2)
updated_by: Claude (image-asset planning + prompt-engineering session)
head_sha: b0d4668
branch: main
status: green
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: green · branch main @ b0d4668, pushed to origin (this handover doc is the commit on top). Build passes (npm run build verified before push).
Just did: (1) implemented the MLOps section's Built With / Powered By tool descriptions — each tool now renders bold name + one-line purpose (MlopsSystem.astro), matching §9.6's mockup; (2) major IMAGE_ASSETS.md overhaul: added a priority table, two now-REQUIRED generated-image entries (Live Factory floor background, "while the employees sleep" center illustration), restructured every generation prompt into labeled skeletons, and added a reusable House Style DNA block; (3) VALIDATED all of it against the CURRENT ChatGPT image model — gpt-image-2 (live 2026-04-21), which supersedes the gpt-image-1 assumptions I started with.
DO NEXT: the 4 required images are human/tool tasks, not code — generate them per IMAGE_ASSETS.md items 1-4 (hero macro-gears, logo, Live Factory background, employee illustration), then integrate (see §1). No code is blocked.
DON'T: don't bake glowing signal lights into the Live Factory image (the animated CSS pin overlay stays and would clash); don't make the employee a photoreal/stock person (illustration only — Governing rule #3); don't regenerate the finished dashboard.png (item 9); don't assume ChatGPT's OLD gpt-image-1 size limits — gpt-image-2 takes flexible sizes.
Blocked on: nothing code-related. Pre-existing opens carry over: DagsHub MLflow 404, hero photo, real logo, in-action clip, Pages/branch-protection.
Ground truth: CLAUDE.md (standing rules) + docs/ARCHITECTURE.md (design why) + docs/IMAGE_ASSETS.md (every image asset + its prompt). Run §5 verify before editing.
```

---

## 1. Resume here

**Next action (concrete):** nothing code-side is blocked. The pending work is
**generating the 4 required images**, which needs a human + ChatGPT
(gpt-image-2), not a coding agent:

- **Items 1-4 in `docs/IMAGE_ASSETS.md`** are the "Required" generated images:
  hero macro-gears (1), logo/brand mark (2), Live Factory floor background (3),
  "while the employees sleep" center illustration (4). Each entry is a
  copy-paste-ready prompt; **attach the named reference screenshot first** where
  one is listed (biggest regeneration saver).
- **Then the integration code changes** (each is a small, separate follow-up,
  none started yet):
  - Item 3 → swap `LiveFactory.astro`'s in-code floor SVG for an `<Image>`,
    keeping the existing animated pin overlay + callout on top. Nudge the pin
    percentages if the generated machines don't line up (coordinates are in the
    item-3 "code-side only" table).
  - Item 4 → replace `UserStory.astro`'s center silhouette SVG (lines ~90-97)
    with the generated illustration.
  - Item 2 → vectorize the raster logo to SVG (ChatGPT can't emit SVG), then
    wire into `Logo.astro` + favicon.
  - Item 6 → add the real brand icons beside the tool descriptions in
    `MlopsSystem.astro` (descriptions already shipped this session; icons from
    Simple Icons, sourced not generated).

**Settled — do NOT re-litigate:**
- Everything from prior handovers (2026-07-22, 2026-07-23): stack, section
  design, hero CTAs, two-loop system, dark-only, no-analytics, CLAUDE.md as
  standing rules, batched commit discipline, platform-agnosticism.
- **The current ChatGPT image model is `gpt-image-2`** (live 2026-04-21;
  supersedes gpt-image-1's fixed 1024/1536 sizes). It takes flexible sizes
  (edges a multiple of 16, ratio ≤ 3:1, up to ~4K), is **raster-only** (no
  SVG), and accepts **reference-image uploads** (up to 16). This was verified
  against OpenAI's current docs this session — see §3.
- **Style consistency across separate generations = repeat a fixed "style DNA"
  block in every prompt** (optionally + a reference image), NOT define-once-
  reference-by-pointer. IMAGE_ASSETS.md's "House Style DNA" is built this way on
  purpose (the two COLOR/EXCLUDE lines are duplicated into each prompt).
- **Live Factory background is now REQUIRED (was "optional v2")** and must be
  generated **without baked-in signal lights** — the animated CSS pin overlay in
  `LiveFactory.astro` is kept, not rebuilt.
- **The "while the employees sleep" figure stays an ILLUSTRATION**, not a
  photoreal/stock person (Governing rule #3 + ARCHITECTURE §9.5 reasoning). A
  literal photo would need an explicit rule-change decision.

## 2. What changed this session
- **Implemented MLOps tool descriptions** (`MlopsSystem.astro`, commit
  `299b21e`): `builtWith`/`poweredBy` went from plain string pills to
  name+description objects; both side panels now render a bold tool name + a
  one-line purpose (e.g. *GitHub Actions — Automated CI/CD for ML*), matching
  §9.6's mockup. Verified in the built HTML.
- **IMAGE_ASSETS.md overhaul** (commit `b0d4668`):
  - Added a **"Using these prompts (gpt-image-2)"** on-ramp and a **priority
    table** (which of the 10 entries actually need image-gen vs. code/done).
  - Added **item 4** ("while the employees sleep" illustration) and rewrote
    **item 3** (Live Factory) from optional-v2 to required, with the
    keep-the-overlay / no-baked-lights constraint and reused pin coordinates.
  - Added a **House Style DNA** block; **restructured items 1, 2, 3, 4, 7**
    into labeled skeletons (`SUBJECT/SCENE/COMPOSITION/STYLE/LIGHT/COLOR/
    EXCLUDE`), moving rationale out of the paste blocks.
  - Corrected for **gpt-image-2**: flexible sizes (fixed the "can't exceed
    1536" assumption that was gpt-image-1-only), raster-only + logo vectorize
    step, reference-image workflow, item-4 dims bumped 800²→1024² (under the
    pixel floor), OG's 630px→1216×640 (not a multiple of 16).
- **ARCHITECTURE.md updates** (same commit): §9.6 (implemented descriptions,
  icons still open), §9.2 (Live Factory background upgrade + overlay
  constraint), §9.5 (center-card illustration plan), §11 (asset-plan entries).
- **Ran a 5-persona virtual panel audit** (UX writer, image-gen specialist,
  prompt engineer, art director, integration eng) of the doc + prompts before
  the overhaul; the human asked me to validate the model limitations with a
  live search first, which flipped the biggest finding (see §3).

## 3. Un-recoverable context
- **My initial image-model assumptions were WRONG and the human caught it.** I
  first wrote the doc against `gpt-image-1`'s constraints (fixed 1024/1536
  sizes, must square-then-crop). The human pushed back and asked me to search
  before assuming. Validated against OpenAI's current docs: the live model is
  **gpt-image-2** (2026-04-21) with flexible sizes up to ~4K. If a future
  session sees "generate at 1600×2000 directly," that's correct for
  gpt-image-2, not a mistake to "fix" back to 1024.
- **The style-consistency approach was also validated by search**, and it
  matched the human's own instinct: gpt-image-2 needs the style description
  **present in each prompt** (OpenAI's "style DNA"/"character bible" pattern),
  reinforced by reference images — not a single shared definition referenced by
  pointer. That's why the House Style DNA lines are duplicated across prompts.
- **The two commits were split at the code/docs boundary, deliberately.** The
  originally-floated split (tool-desc doc prose in commit 1, image prose in
  commit 2) turned out **entangled**: adding the employee entry renumbered
  headings on the same lines as the item-6 tool-desc content, so a clean
  concern-split would have needed mid-hunk surgery. Split instead as: `299b21e`
  = the only functional/code change (MlopsSystem), `b0d4668` = all docs.
- **Every push to main deploys live** — both commits are pushed, so the tool
  descriptions are already on the live site via `deploy.yml`.
- **origin/main did not move during this session** — no collision this time
  (unlike 2026-07-23), but still fetched before push. Nate (`envelopingCODE`)
  remains an active concurrent committer; keep fetching.
- **Verification screenshots** (the two Desktop `Bildschirmfoto…` / mockup PNGs
  the human referenced) were read for context only — none were written into the
  repo tree; nothing to clean up.

## 4. Open questions — need a human, not a guess
- [ ] **Generate the 4 required images** (IMAGE_ASSETS.md items 1-4) — human +
      ChatGPT task; can't be done by a coding agent.
- [ ] Carried over, unchanged: DagsHub MLflow endpoint 404 (test once
      `DAGSHUB_TOKEN` is set), §9.1 in-action clip (team screen recording),
      Pages/branch-protection setup (§7 items 5-6).
- [ ] Item 6 brand icons (Simple Icons) — descriptions shipped; icons are the
      remaining piece, a small `MlopsSystem.astro` addition when someone wants it.
- [ ] Whether the ARCHITECTURE.md should also carry the gpt-image-2 validation
      date (offered to the human; not done — prompt/tool details live in
      IMAGE_ASSETS.md by design).

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin && git log --oneline -5     # tip = b0d4668 (+ this handover commit) or later?
git status                                    # clean?
npm run build                                 # must pass; 3 routes build
```
- **Branch / commit:** `main` @ `b0d4668` (code+docs), pushed to `origin`; this
  handover is the commit on top.
- **Build:** passes.
- **Uncommitted work:** none at push time.
- **Canonical sources:** [`CLAUDE.md`](../CLAUDE.md) (rules) ·
  [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) (design why) ·
  [`docs/IMAGE_ASSETS.md`](../docs/IMAGE_ASSETS.md) (every image asset + prompt).

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
