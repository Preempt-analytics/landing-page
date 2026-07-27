# Image Asset Requirements

A single inventory of every image/visual asset the landing page uses or still
needs — real photos, illustrations, and marks — written so each entry can be
pasted straight into an image-generation tool (ChatGPT/DALL·E, Midjourney,
etc.) as a prompt starting point. Cross-references `docs/ARCHITECTURE.md` §7
(open items) and §11 (asset production plan); update both docs together if an
asset's status changes.

**This doc does not replace §11's SVG/CSS assets** (the how-it-works loop
icons, benefit-tile icons, timeline avatar, etc.) — those are built directly in
code, not sourced as images, and stay specified in ARCHITECTURE.md. This doc
covers only assets that are (or should be) actual image files.

---

## Using these prompts (current ChatGPT — gpt-image-2)

Prompts below are written for and validated (2026-07-27) against OpenAI's
current image model, **gpt-image-2** (live since 2026-04-21; it replaced the
gpt-image-1 generation that had fixed 1024/1536 output sizes). How to read an
entry and get a usable image in the fewest generations:

- **Each generated-image entry is self-contained** — copy its **Prompt** block
  verbatim into ChatGPT. Blocks are written as labeled segments
  (`SUBJECT / SCENE / COMPOSITION / STYLE / LIGHT / COLOR / EXCLUDE`); gpt-image-2
  follows segmented prompts more reliably than one run-on paragraph.
- **Every prompt ends with the same two `COLOR` / `EXCLUDE` lines** — the
  [House Style DNA](#house-style-dna--paste-into-every-generated-image-prompt)
  below. Keep them identical across all four generated images so the set reads
  as one system (this repeated-style-block pattern is how gpt-image-2 holds a
  look across *separate* generations — see that section).
- **Attach the reference screenshot whenever an entry names one.** gpt-image-2
  accepts uploaded reference images (up to 16) and follows them far more
  reliably than words alone — the single biggest way to cut regeneration
  cycles (and therefore cost). Upload the mockup, *then* paste the prompt.
- **Generate at each entry's stated dimensions directly.** gpt-image-2 accepts
  an arbitrary size/ratio — constraints: both edges a multiple of 16, ratio
  ≤ 3:1, up to ~4K (anything above 2560×1440 is "experimental" and more
  variable). No more square-then-crop.
- **Output is raster (PNG), never SVG.** Only item 2 (the logo) needs a vector
  file; see that entry for the raster-then-vectorize step.

---

## House Style DNA — paste into every generated-image prompt

gpt-image-2 keeps a consistent look across *separate* generations best when a
fixed style description is **repeated in each prompt** (OpenAI's "style DNA" /
"character bible" pattern), optionally reinforced by passing an earlier
approved image back in as a reference. So every Prompt block below already ends
with these two lines verbatim — **do not** define them once and reference them
by pointer; the model needs them present in each generation call:

> COLOR: deep navy background (#0d1b2e / navy-900), bright teal-cyan accents
> (#2dd4bf / teal-400) only; low overall contrast; designed to sit on a dark
> website.
> EXCLUDE: no text, no numbers, no logos, no brand marks, no UI panels.

Only the palette/exclusion lines are shared verbatim — the **per-asset render
style** (photoreal vs. flat-vector) stays in each prompt's own `STYLE` line,
since the hero is a photo and the others are illustrations. If you ever change
these two lines, change them in **every** prompt block below (they're
duplicated on purpose, for copy-paste — that's the one drift risk to keep in
sync). **The logo (item 2) is the deliberate exception** — a single-color
vector mark, not a scene, so it does not carry this block.

---

## Governing rules for any generated asset

Apply these to every prompt below before accepting a generated image:

1. **Align, don't pixel-copy** (ARCHITECTURE §11) — a generated image is a
   *content reference*, restyled to fit the site, not dropped in as-is if it
   clashes with the design system.
2. **Palette discipline** (Contract 4) — must read comfortably against
   `navy-900`/`navy-950` backgrounds with `teal-400` as the accent. Don't
   accept a result with a color palette so far off-system that it'd need a new
   `@theme` token to display correctly.
3. **No fabricated people or customers** — no stock-photo employees, no
   invented company logos (this sank the earlier fake customer-logo strip;
   see ARCHITECTURE §5). Illustration/silhouette only where a human figure is
   needed.
4. **Dark-only** — every asset must work on a dark background; don't generate
   anything designed for a light canvas (§12, dark-only is deliberate).
5. **No baked-in text claiming real data** — if a generated image includes any
   number or stat, it must be clearly fictional/decorative, never mistaken for
   a real metric (the same "illustrative" discipline as the hero's `2.3M` tile).

---

## Generation priority — spend image-gen tokens here first

Not every entry below needs an image-generation tool run. Check this table
before generating anything, so effort goes to what's actually blocking a
visual, not to items already solved in code, already finished, or not yet
decided.

| # | Asset | Needs image-gen? | Priority |
|---|---|---|---|
| 1 | Hero background photo | Yes | Required |
| 2 | Logo / brand mark | Yes (vector) | Required |
| 3 | Live Factory background upgrade | Yes | Required |
| 4 | "While the employees sleep" center illustration | Yes | Required |
| 5 | MLOps rotating center emblem | **No** — CSS/SVG build | Nice-to-have |
| 6 | Built With / Powered By tool marks | **No** — sourced from Simple Icons, not generated; descriptions already implemented | Nice-to-have (icons only) |
| 7 | OG / social-preview image | Yes, if pursued | Optional — open decision, don't generate until the reuse-vs-new-image question is settled |
| 8 | Favicon | **No** — derive from #2 | Not a separate task |
| 9 | Product Preview screenshot | **No** — done | Do not regenerate |
| 10 | §9.1 in-action clip | **No** — screen recording | Not an image-gen task |

**Efficiency tip:** gpt-image-2 accepts an arbitrary size/ratio, so generate
directly at each entry's stated dimensions (edges a multiple of 16, ratio
≤ 3:1) rather than generating square and cropping — a wrong-ratio result is a
common reason an entry needs a second pass. The bigger cost saver: where an
entry names a **reference screenshot, attach it** before prompting (gpt-image-2
takes up to 16 reference images and follows them far more reliably than words),
which cuts the number of regenerations more than any prompt wording does.

---

## 1. Hero background photo — macro-gears

**Status:** placeholder. Hero.astro currently renders a navy→teal CSS gradient
panel with a faint gear-silhouette SVG stand-in instead of a real photo. Final
asset drops into `public/images/hero/macro-gears.jpg` with zero code changes
(ARCHITECTURE §5, §7 item 2).

**Used in:** [Hero.astro](../src/components/Hero.astro), visual column (right
side on desktop).

The `low overall contrast` / darker-negative-space direction below is what lets
Hero.astro's teal glow overlay and dot-grid texture sit on top without fighting
the photo — kept as a composition instruction, not as rationale inside the
prompt.

**Prompt:**
> SUBJECT: Extreme macro close-up of interlocking industrial steel gears and
> precision machine parts, filling the frame.
> COMPOSITION: Portrait 4:5; shallow depth of field; keep the upper third
> darker and emptier so headline text and a glow overlay can be layered on top.
> STYLE: Photorealistic, high micro-detail, cinematic industrial.
> LIGHT: Moody low-key industrial lighting; teal and deep-blue rim light
> picking out the metal edges.
> COLOR: deep navy background (#0d1b2e / navy-900), bright teal-cyan accents
> (#2dd4bf / teal-400) only; low overall contrast; designed to sit on a dark
> website.
> EXCLUDE: no text, no numbers, no logos, no brand marks, no UI panels.

**Dimensions:** 1600×2000px (`aspect-[4/5]` on desktop, square on mobile);
both edges are multiples of 16, so gpt-image-2 renders this size directly.
Drops into `public/images/hero/macro-gears.jpg`.

---

## 2. Real logo / brand mark

**Status:** placeholder. [Logo.astro](../src/components/Logo.astro) is a
hand-drawn triangle/"A" SVG, explicitly flagged as a stand-in (ARCHITECTURE §7
item 1).

**Used in:** Nav, Footer, favicon, OG image (item 7 below).

**Format reality (validated 2026-07-27): ChatGPT/gpt-image-2 cannot output
SVG — it is raster-only.** The nav needs a real vector file, so this is not a
one-step image-gen task. Two viable paths:
- **Generate raster → vectorize (recommended for a polished mark):** run the
  prompt below to get a clean, high-contrast PNG, then trace it to SVG
  (Illustrator *Image Trace*, or a vectorizer service — pick a European/EU-
  operated one per the Digital Sovereignty protocol). Hand-clean the paths.
- **Ask ChatGPT for SVG *code* directly (viable because this mark is simple
  geometry):** a single triangle/arrow is within what the text model can emit
  as hand-editable `<svg>` markup — skip the image tool entirely for this one
  and refine the path by hand. Won't work for anything detailed, but a
  geometric mark is exactly the case where it can.

This entry is the deliberate exception to the House Style DNA (it's a
single-color mark, not a scene), so its prompt does not carry the shared
`COLOR`/`EXCLUDE` block.

**Prompt (raster concept):**
> SUBJECT: Minimalist geometric logo mark for an industrial
> predictive-maintenance AI product, "Preempt Analytics" — a single upward
> triangle / upward-arrow silhouette suggesting foresight and prevention.
> STYLE: Clean flat vector-style line-art, single even weight, geometric; no
> photorealism, no gradients, no drop shadows, no 3D.
> COLOR: one flat bright teal-cyan (#2dd4bf) mark on a plain transparent
> background.
> EXCLUDE: no text or wordmark, no shading, no extra ornament.

**Dimensions:** generate large and square (e.g. 1024×1024) for a clean trace,
then deliver the final as **SVG** (via the vectorize step above) — must stay
legible at the 24–30px size the nav renders it at, and simple enough to still
read at favicon size (item 8).

---

## 3. Live Factory section — factory-floor background upgrade

**Status:** required (raised from "optional v2" — human review, 2026-07-27).
v1's in-code SVG placeholder (`LiveFactory.astro`) ships today and stays live
until this drops in.

**Used in:** [LiveFactory.astro](../src/components/sections/LiveFactory.astro),
right-column visual.

**Reference — attach this to ChatGPT before prompting:**
[design/mockups/Screenshot 2026-07-21 112329.png](../design/mockups/Screenshot%202026-07-21%20112329.png).
Upload it as a reference image (gpt-image-2 follows an attached composition far
more reliably than a text description of it — the biggest regeneration saver
here), then paste the prompt with its explicit "no glowing lights" change. The
mockup is the *content reference* for richness/composition only (align, don't
pixel-copy — Governing rule #1); its baked-in signal lights are exactly what
the prompt overrides.

**Integration constraint that shapes this prompt (read before generating).**
`LiveFactory.astro` already has a **working, animated signal-light overlay** —
4 teal "healthy" pins + 1 red "alert" pin, each with a CSS glow/pulse
animation (`pulse-pin` keyframe), plus the DOM "Drift Detected" callout card.
**That code stays — it is not being rebuilt or thrown away.** So, unlike the
mockup (which bakes its glowing lights into the pixels), the generated image
must ship **with no glowing/lit/colored signal lights anywhere in it** — a
static baked-in light sitting under an animated overlay light in the same
spot would either double up or visibly clash. Each machine should show only a
small, unlit, neutral mounting detail (dark metal bracket/antenna stub, no
color or glow) where a sensor would sit — the color and pulse come from the
overlay, layered on top, afterward.

**Prompt:**
> SCENE: Modern CNC milling factory floor at night, isometric / three-quarter
> view; reflective floor with a subtle perspective grid; catwalk framing and
> structural beams in the background for depth.
> SUBJECT: Five CNC milling machines of varied heights (industrial milling
> equipment — not humanoid robots or robot arms), arranged in two loose rows.
> KEY DETAIL: each machine carries only a small, bare, dark-metal sensor mount
> or short antenna stub on its top surface, unlit and colorless — leave those
> spots dark, because the glowing status lights are added afterward in code as
> an animated overlay.
> STYLE: Clean modern flat-vector product-marketing render (not photoreal);
> moody industrial atmosphere; ambient blue rim lighting on the machinery.
> COLOR: deep navy background (#0d1b2e / navy-900), bright teal-cyan accents
> (#2dd4bf / teal-400) only; low overall contrast; designed to sit on a dark
> website.
> EXCLUDE: no glowing or colored sensor lights / LEDs / warning indicators,
> no text, no numbers, no logos, no callout cards, no UI panels.

Note the positive `KEY DETAIL` phrasing ("bare dark-metal mount, leave dark")
carries the real work — gpt-image-2 follows a described desired state more
reliably than the `EXCLUDE` negation alone, so both are present on purpose.

**Code-side only — overlay pin coordinates (do NOT paste into the generator).**
gpt-image-2 can't place machines at exact percentages, so this table is not
prompt material — it's the alignment reference for the *code* side. These are
`LiveFactory.astro`'s current pin coordinates (its 400×300 SVG viewBox),
converted to percent-of-canvas so they hold regardless of final image
resolution:

| Machine | Sensor-mount position (% of canvas, from top-left) | Overlay signal |
|---|---|---|
| A | 23% across, 39% down | teal (healthy) |
| B | 53% across, 33% down | teal (healthy) |
| C | 81% across, 43% down | **red (alert / drift-detected)** |
| D | 38% across, 66% down | teal (healthy) |
| E | 71% across, 69% down | teal (healthy) |

Note machine C isn't called out as special in the prompt itself — all 5 are
described identically (neutral, unlit) so the generator doesn't bake in a
color the overlay already owns. Which machine is "the alerting one" is purely
a code-side fact (the overlay's red pin), not something the image needs to
show.

**Exact pixel alignment is not required from the generator** — approximate
machine placement within each region is enough. If the final image lands
close but not exact, nudge the percentage values in `LiveFactory.astro`'s pin
arrays by a few points to snap onto it — a minute CSS edit, not a reason to
re-run generation.

**Dimensions:** 1600×1200px (`aspect-[4/3]`); both edges are multiples of 16,
so gpt-image-2 renders this size directly. **Constraint:** machines must read
as CNC/milling equipment specifically (the dataset is a milling process —
confirmed by the Product Preview dashboard's own "CNC-03" labeling), not
arbitrary factory robotics or humanoid robots.

**Once generated:** drops into `public/images/live-factory/` as the new
background layer behind the existing pin-overlay + callout card. Swapping
`LiveFactory.astro`'s in-code floor/machine SVG for an `<Image>` (keeping the
overlay layer as-is) is a follow-up code change once the asset exists, not
part of this prompt-only pass.

---

## 4. "While the employees sleep" — center illustration

**Status:** not yet built. [UserStory.astro](../src/components/sections/UserStory.astro)'s
center card currently renders an abstract teal circle/silhouette SVG
(ARCHITECTURE §9.5, §11) — a deliberate placeholder chosen specifically to
avoid a fabricated-employee photo. Human review (2026-07-27, screenshot
`Bildschirmfoto 2026-07-27 um 11.19.52.png`) flagged that the section reads as
abstract rather than showing the system is actually used on a factory floor,
and asked for an image of a person (e.g. the maintenance lead) logging into
the Preempt Analytics dashboard in a factory setting.

**Flagged before generating (Zeroth Law):** this sits right next to Governing
rule #3 above ("no stock-photo employees... illustration/silhouette only where
a human figure is needed") and ARCHITECTURE §9.5's explicit reasoning — *"a
stock/AI-generated photo of a person would imply a real employee the same way
the fake customer logos implied real customers."* Resolution: keep this an
**illustration**, not a photoreal/stock-photo person — same vector style as
item 3's factory scene — so it reads as "used on a real factory floor" without
crossing into a fabricated real person. If a literal photoreal photo is
wanted instead, that's a deliberate rule change to flag and make explicitly,
not a default to slide into via this entry.

**Used in:** [UserStory.astro](../src/components/sections/UserStory.astro),
center column of the 3-card grid (replaces the current inline SVG at
lines ~90–97).

**Optional reference:** for the factory-floor *setting* (not the figure),
attaching item 3's mockup or its generated result as a reference keeps this
illustration's environment visually consistent with the Live Factory section.

**Prompt:**
> SUBJECT: A single anonymous factory maintenance worker in dark work overalls,
> seen from behind or in profile with no detailed or identifiable face, holding
> and looking at a handheld tablet.
> KEY DETAIL: the tablet screen shows a simplified, abstract glowing-teal
> dashboard — blurred bars and shapes only, no readable numbers or real UI.
> SCENE: Standing on a softly blurred industrial factory floor at night; CNC
> machine silhouettes and ambient teal/blue lighting behind.
> COMPOSITION: Square 1:1; figure slightly off-center; the tablet's teal glow
> is the focal point.
> STYLE: Clean modern flat-vector illustration (not photoreal); generic
> faceless figure, no realistic skin or facial detail.
> COLOR: deep navy background (#0d1b2e / navy-900), bright teal-cyan accents
> (#2dd4bf / teal-400) only; low overall contrast; designed to sit on a dark
> website.
> EXCLUDE: no identifiable face, no readable text or numbers, no logos, no
> brand marks.

**Dimensions:** 1024×1024px (square, matches the card's `aspect-square`-ish
center column). *Not* 800×800 — that's below gpt-image-2's ~655k-pixel minimum;
1024×1024 is the smallest clean square it renders. **Constraint:** figure must
stay anonymous (no identifiable face, per Rule #3 above) and the tablet's mockup
must stay abstract — never real-looking numbers mistakable for actual product
UI (Rule #5 above).

---

## 5. MLOps System diagram — rotating center emblem

**Status:** not yet built. [MlopsSystem.astro](../src/components/sections/MlopsSystem.astro)'s
center mark is currently a static teal triangle inside a static dashed circle.
The reference mockup
([design/mockups/Screenshot 2026-07-21 112150.png](../design/mockups/Screenshot%202026-07-21%20112150.png))
shows a glowing, layered emblem — concentric rings around the triangle — that
reads as a continuously-rotating "engine" at the center of the loop. Human
review (2026-07-23) flagged this gap.

**Used in:** MlopsSystem.astro, center of the circular diagram (desktop only —
the mobile view linearizes to a list, §12).

**Note — not an image-generation task.** Unlike every other entry in this doc,
this is a CSS/SVG animation spec to build directly in code, not a prompt for an
image tool. Listed here anyway so the full set of visual gaps stays in one
place.

**Spec (from the mockup):**
- At least 2–3 nested concentric rings around the central triangle mark, with
  a soft outer glow, recolored to the site's `teal-400`/`blue-500` tokens (the
  mockup's brand-blue doesn't match Contract 4's palette).
- The outer ring rotates continuously and slowly — an "always on" cue, not a
  fast spin. `global.css` already has an unused
  `@keyframes ring-rotate { to { transform: rotate(360deg); } }` stub, almost
  certainly intended for exactly this and never wired up.
- Must settle to a static frame under `prefers-reduced-motion` (§12), same as
  every other animated element on the site.
- The mockup's 6 node tiles are brighter, glowing rounded squares (glass/blur
  treatment) rather than the current flat `navy-800` tiles — a matching small
  styling bump, not a new asset, if this gets built.

**Dimensions:** scales with the existing circular diagram's center mark
(currently ~80px within a `max-w-md` circle) — no fixed pixel size needed.

---

## 6. Built With / Powered By — real tool logos

**Status:** partially built. **Descriptions are now implemented** (2026-07-27)
— MlopsSystem.astro renders each tool as a bold name + one-line purpose
description (e.g. *GitHub Actions — Automated CI/CD for ML*), matching the
reference mockup
([design/mockups/Screenshot 2026-07-21 112150.png](../design/mockups/Screenshot%202026-07-21%20112150.png),
same screenshot as item 5) and ARCHITECTURE §9.6. **Still missing:** the
mockup's real, full-color brand icon next to each name — that part alone is
what remains open below.

**Used in:** MlopsSystem.astro, "Built With" and "Powered By" side panels.

**Note — not an image-generation task, and no image-gen tokens needed at
all.** Like item 2, these are literal existing third-party logos — source
real marks from a permissively-licensed icon set, don't prompt an
image-generation tool to approximate Python's/GitHub's/etc. actual logo.

**Spec (icons only — descriptions done, see above):**
- 8 icons total: Python, Pandas, Scikit-learn, NumPy (Built With) · GitHub
  Actions, DVC, MLflow, Evidently AI (Powered By).
- **Source:** [Simple Icons](https://simpleicons.org/) (SVG, permissively
  licensed) — already the tool ARCHITECTURE §9.6/§11 names for this — or each
  project's own official brand SVG.
- **Color — flag before building, don't assume:** the mockup shows each logo
  in its authentic brand colors (Python's blue/yellow, DVC's purple, etc.) on
  a dark tile — standard practice for "built with" attribution, and Contract
  4's palette rule governs the site's *own* design elements, not a third
  party's trademark colors. Keep them full-color unless the human decides the
  mix clashes too much with the page; don't silently recolor them teal.
- **Layout:** icon (~28–32px) placed beside the name+description block already
  built — a small addition to the existing markup, not a redesign.

---

## 7. OG / social-preview image

**Status:** not yet built (ARCHITECTURE §10) — the `<meta property="og:image">`
tag has no image behind it yet. Not a blocker for anything else.

**Used in:** [BaseLayout.astro](../src/layouts/BaseLayout.astro) `<head>`
(once added).

**Prompt:**
> SCENE: Wide promotional banner / social-share card.
> SUBJECT: Deep-navy field with a soft teal radial glow and a faint dot-grid
> texture; a subtle industrial gear silhouette motif in one corner, kept low
> and quiet.
> COMPOSITION: Landscape ~1.9:1; a large clean empty area in the center-left
> reserved for title text that is added later — leave it uncluttered.
> STYLE: Minimal, modern flat graphic (not photoreal).
> COLOR: deep navy background (#0d1b2e / navy-900), bright teal-cyan accents
> (#2dd4bf / teal-400) only; low overall contrast; designed to sit on a dark
> website.
> EXCLUDE: no text, no numbers, no logos, no brand marks, no UI panels.

**Dimensions:** final target is 1200×630px (standard Open Graph size), but
**630 isn't a multiple of 16**, so gpt-image-2 won't emit it directly —
generate at **1216×640** (nearest valid 16-multiple size at the same ~1.9:1
ratio) and resize/crop to 1200×630. **Open decision, not a generation
requirement:** could instead reuse the hero's own visual treatment or a framed
Product Preview screenshot rather than commissioning a new image — worth
deciding before generating this from scratch.

---

## 8. Favicon

**Status:** placeholder SVG at `public/favicon.svg`, functional today
(ARCHITECTURE §7 item 1 groups it with the logo). **No separate generation
needed** — once the real logo mark (item 2) exists, derive the favicon from
it rather than generating a third, independent asset.

---

## 9. Product Preview dashboard screenshot — already finished, do not regenerate

**Status:** DONE. `src/assets/dashboard.png`, used inside browser-chrome
framing on the new `/product` subpage
([product.astro](../src/pages/product.astro) →
[ProductPreview.astro](../src/components/sections/ProductPreview.astro)).
Listed here only so this doc is a complete inventory, not a wishlist — this
is a finished, high-quality image and needs no prompt, no regeneration, and
no restyling (ARCHITECTURE §11's one deliberate "used as-is" exception).

---

## 10. §9.1 in-action clip — out of scope for image generation

**Status:** open item (ARCHITECTURE §7 item 11). A short muted looping
video (WebM/MP4) of the system actually running — terminal drift check,
GitHub Actions going green, dashboard updating. **This is a screen
recording, not something an image-generation tool can produce** — listed
here only so the full set of pending visual assets is in one place. Needs a
team member to capture it; v1 ships without it (still + "Concept preview"
badge on `/product`).
