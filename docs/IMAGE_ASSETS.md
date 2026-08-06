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

## Sprite-sheet batch generation — conserving image-gen tokens

Borrowed from game-industry practice (one sprite sheet instead of one call per
frame): whenever an entry needs **several small, same-style icons** rather than
one large scene, generate them **together in a single image** — laid out as an
even grid — then crop the grid into individual files afterward. One generation
call instead of N cuts image-gen token spend roughly N-to-1. Confirmed working
(2026-07-31) by a teammate on other images in other projects; item 6 below is
this project's first application of it.

- **Describe the grid explicitly in the prompt**, not just the icons —
  gpt-image-2 needs the layout stated as its own instruction, e.g. *"a 2×2 grid
  of four icons, one per quadrant, each centered in generous even padding, with
  a consistent empty gutter between cells and no shared background elements
  crossing a cell boundary."* Without this, icons drift off-grid or bleed into
  each other and the sheet can't be cleanly cropped.
- **Pick a canvas size that divides evenly by the grid.** A 2×2 sheet at
  1024×1024 crops into four clean 512×512 cells; a 1×4 strip at 1024×256 (if a
  row reads better for a given set) crops into four 256×256 cells. Keep both
  the sheet's and each resulting crop's edges multiples of 16 (per the gpt-image-2
  constraint above).
- **Crop after generating**, not before — any image editor's rectangular
  crop/slice tool works; no vectorization or AI step needed for this part.
  Discard the sheet file once the individual crops are saved (Verification
  Artifact Hygiene doesn't apply here since the crops *are* the deliverable,
  not a one-off check, but don't leave the uncropped sheet sitting in the repo
  alongside them).
- **Same House Style DNA discipline applies within one sheet** — since all four
  icons come from one generation call, style drift *between* them is far less
  likely than across separate calls, which is the other reason this technique
  helps (not just token cost).
- **Not a fit for every entry.** This only helps when an entry needs *multiple*
  small same-style marks at once (item 6 below). A single large scene (items 1,
  3, 4, 7) gets no benefit from a grid and should stay a single generation.

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
sync). **The logo (item 2) and the tool-brand icon sprite sheets (item 6) are
the deliberate exceptions** — the logo is a single-color vector mark, not a
scene, and item 6's icons must carry each tool's own authentic brand colors
(Python's blue/yellow, GitHub's black/white, etc.), not a teal-restricted
palette, to stay recognizable as real brand marks. The shared block's
`EXCLUDE` line is also a hard conflict for item 6 specifically — it says *"no
logos, no brand marks,"* the opposite of that entry's goal — so pasting it in
verbatim would work against the prompt, not just add noise. Both item 2 and
item 6 use a **transparent background** rather than the shared block's baked
navy-900, since both are meant to composite cleanly onto whatever exact
surface they're placed on (nav bar, favicon, or a tool-panel row) rather than
carry their own background color; neither carries this block verbatim.

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
| 1 | Hero background photo | **No** — done | Required |
| 2 | Logo / brand mark | Yes (vector) | Required |
| 3 | Live Factory background upgrade | Yes | Required |
| 4 | "While the employees sleep" center illustration | **No** — done | Required |
| 5 | MLOps rotating center emblem | **No** — CSS/SVG build | Nice-to-have |
| 6 | Built With / Powered By tool marks | **No** — done | Nice-to-have (icons only) |
| 7 | OG / social-preview image | Yes, if pursued | Optional — open decision, don't generate until the reuse-vs-new-image question is settled |
| 8 | Favicon | **No** — derive from #2 | Not a separate task |
| 9 | Product Preview screenshot | **No** — done | Do not regenerate |
| 10 | §9.1 in-action clip | **No** — screen recording | Not an image-gen task |
| 11 | Try It Yourself banner (macro-gears reuse) | **No** — reused existing asset | Done |
| 12 | Product Preview — Alerts concept screenshot | **No** — done | Do not regenerate |
| 13 | Product Preview — Predictions concept screenshot | **No** — done | Do not regenerate |

**Efficiency tip:** gpt-image-2 accepts an arbitrary size/ratio, so generate
directly at each entry's stated dimensions (edges a multiple of 16, ratio
≤ 3:1) rather than generating square and cropping — a wrong-ratio result is a
common reason an entry needs a second pass. The bigger cost saver: where an
entry names a **reference screenshot, attach it** before prompting (gpt-image-2
takes up to 16 reference images and follows them far more reliably than words),
which cuts the number of regenerations more than any prompt wording does.

---

## 1. Hero background photo — CNC machine, mid-operation

**Status:** DONE (2026-07-31, regenerated 2026-08-05). Replaces the original
macro-gears close-up (`design/visual-assets/gears.png`), which read as generic
"industrial" stock imagery — could be almost any manufacturing product —
rather than this project's actual machine. The gears photo wasn't discarded:
it moved to the Try It Yourself subpage instead (item 11 below). Asset:
`design/visual-assets/hero-image-cnc-dark-realistic.png` →
`public/images/hero/cnc-machine.png`.

**2026-08-05 regeneration ("Detroit style"):** the original render
(`design/mockups/hero-page-cnc.png`, moved out of `visual-assets/` since it's
no longer the live asset) left roughly its left two-thirds nearly flat black —
correct per its own prompt below, but it visually read as if the photo itself
had been narrowed to only the section's right side, not just faded there by
CSS. The replacement keeps dim, low-contrast factory/catwalk detail across the
full frame (same 1672×941, ~16:9 dimensions, so no code-side layout change was
needed) so the photo fills the existing right-62% box edge-to-edge instead of
leaving a visibly empty strip inside it, while staying dark enough for the
headline to still read clearly over it.

**Used in:** [Hero.astro](../src/components/Hero.astro), visual layer behind
the copy (right 62% at `lg:`, full-bleed faded wash below `lg:`).

**Content decision (human-directed, 2026-07-31):** an early direction explored
an *exploded/cutaway* CNC diagram with the machine's assemblies pulled apart.
Superseded before generation — the team found a better composition reference
(a whole, intact machine mid-operation, sparks/chips flying) and preferred it.
**Machine type correction applied to that reference:** the found reference
photo was a CNC *turning* machine (lathe) — this project's dataset is a
*milling* process (confirmed by the Product Preview dashboard's own "CNC-03"
labeling, and already the reason `LiveFactory.astro`'s prompt insists on
"CNC/milling equipment specifically"). The prompt below asks for a milling
machine, not a lathe, to stay consistent with that established constraint.

**Text/labels — deliberately excluded from the image, added in code instead.**
The prompt asks for three specific surfaces to stay plain and neutral (no
glow, no icon, no color) — these become anchor points for a small icon
overlay added afterward in `Hero.astro`, following the same governing
principle as item 3's Live Factory image (bare mounting point in the photo,
animated/interactive layer added in code, never baked into the pixels).

**Prompt:**
> SUBJECT: A single complete, realistic CNC vertical milling machine, shown
> mid-operation — a moving spindle head actively cutting a metal workpiece
> clamped to the machine's table, with fine metal chips and a faint coolant
> mist at the cutting point suggesting real activity. Not an exploded or
> parts-separated view — the machine is fully assembled.
> KEY DETAIL: three distinct surfaces should stay plain, neutral, and
> unlabeled — no glow, no color, no icon baked in — because each becomes an
> overlay anchor point added afterward in code: (1) the spindle head /
> cutting-tool area, (2) the drive motor housing or a heat-vent grille on the
> machine body, (3) an electrical control cabinet or panel mounted to the
> machine (switches/indicators present but unlit). Keep the three spatially
> separated across the machine's body, not clustered together.
> COMPOSITION: Landscape, wide — the full machine reads clearly at a
> mid-distance, not a macro close-up. Keep the machine's most detailed,
> legible silhouette within the right two-thirds and vertical-middle of the
> frame; the final crop fades the left edge and bottom edge into solid navy
> behind the page's headline text, so detail there doesn't need to survive.
> STYLE: Photorealistic, cinematic industrial, matte-to-semi-gloss brushed
> metal — avoid very glossy/wet specular highlights that read as organic
> rather than machined.
> LIGHT: Moody low-key industrial lighting; teal and deep-blue rim light
> picking out the metal edges; small warm highlights only at the actual
> cutting point (chips/coolant), not washing the rest of the machine.
> COLOR: deep navy background (#0d1b2e / navy-900), bright teal-cyan accents
> (#2dd4bf / teal-400) only; low overall contrast; designed to sit on a dark
> website.
> EXCLUDE: no text, no numbers, no logos, no brand marks, no UI panels, no
> glowing icons/indicator lights/gauges baked into the machine — those three
> points are added afterward in code, not rendered here.

Attached the found reference photo as an uploaded reference before pasting
(content/composition only — its warm amber color grade is overridden by this
prompt's own `COLOR` line, not carried over).

**Dimensions delivered:** 1672×941 (~16:9). **Code-side consequence, not just
a file swap:** the previous portrait macro-gears photo (1600×2000) suited
`Hero.astro`'s old `inset-0`-stretched-to-full-section-height container. This
landscape photo does not — stretching a ~16:9 image to fill a much taller
container would `object-cover`-crop away most of its width, defeating the
wide composition entirely. `Hero.astro`'s image wrapper was changed to
`lg:aspect-video` (a near-exact match for 1672:941) plus vertical centering,
decoupling the photo's shape from however tall the copy block next to it
renders.

**Code-side only — icon overlay anchor points (do NOT paste into the
generator).** Like item 3's pin table, these are the alignment reference for
the code side, read directly off the delivered `cnc-machine.png` (percent of
canvas, so they hold regardless of final crop):

| Anchor | Position (% of canvas) | Icon | Failure mode |
|---|---|---|---|
| Spindle / cutting-tool area | 60% across, 46% down | Wrench + low-level bars | TWF (tool wear) |
| Control panel / screen | 73% across, 46% down | Low-battery gauge | PWF (power failure) |
| Vented cabinet, far right | 93% across, 48% down | Thermometer | HDF (heat dissipation) |

Restrained deliberately (human-requested, "very restrained," 2026-07-31):
`lg:`-only (this photo is just a felt-not-seen wash below `lg:`, so a pinned
icon would be nearly invisible there), no hover card, no LiveFactory-style
pulse — just the same slow `ambient-breathe` glow the hero's own light layers
already use. Only 3 of the dataset's 5 real failure classes get an icon
(TWF/HDF/PWF); **OSF is omitted for restraint, and RNF is omitted on
purpose** — random failure has no predictable sensor signature by definition
in the dataset, so giving it an icon here would overclaim what the system
actually does.

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

**Status:** DONE (2026-07-28). Generated per the prompt below
(`design/visual-assets/maintanence-lead.png`), copied into
`src/assets/maintenance-lead.png`, and wired into
[UserStory.astro](../src/components/sections/UserStory.astro)'s center card via
`astro:assets`' `<Image>` (same pattern as item 9's dashboard screenshot),
replacing the abstract teal circle/silhouette SVG placeholder. Previously:
Human review (2026-07-27, screenshot `Bildschirmfoto 2026-07-27 um
11.19.52.png`) flagged that the section read as abstract rather than showing
the system is actually used on a factory floor, and asked for an image of a
person (e.g. the maintenance lead) logging into the Preempt Analytics
dashboard in a factory setting.

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

**Status:** DONE (2026-07-31). MlopsSystem.astro renders each tool as icon +
bold name + one-line purpose description (e.g. *GitHub Actions — Automated
CI/CD for ML*), matching the reference mockup
([design/mockups/Screenshot 2026-07-21 112150.png](../design/mockups/Screenshot%202026-07-21%20112150.png),
same screenshot as item 5) and ARCHITECTURE §9.6. Of the 8 icons: 6 are
gpt-image-2 sprite-sheet crops (Python, Pandas, Scikit-learn, NumPy, DVC,
Evidently AI); 2 failed the dark-background recognizability bar below and
were swapped for a fallback instead of shipped broken — **GitHub Actions**
(manually-sourced asset, black fill stripped to transparent, see
`design/visual-assets/github.png`) and **MLflow** (Simple Icons' official
mark — the generated version's "ml" prefix was too dark to read at display
size). Source files: `src/assets/tools/*.png`, wired via `astro:assets`.

**Used in:** MlopsSystem.astro, "Built With" and "Powered By" side panels.

**Approach changed 2026-07-31 (human-directed):** this entry previously said
"no image-generation tool, no tokens needed — source from Simple Icons only."
It now uses the [sprite-sheet batch technique](#sprite-sheet-batch-generation--conserving-image-gen-tokens)
above as the primary path — generate each panel's 4 icons together as one 2×2
sheet, then crop. This is a deliberate reversal of the prior reasoning below,
not an oversight — read the trade-off before using it:

> **Trade-off, stated plainly:** these are real third-party trademarks
> (Python, GitHub, DVC, MLflow, etc.). An AI-generated icon *approximates* a
> brand mark from training data — it is not guaranteed pixel- or
> shape-accurate the way a sourced [Simple Icons](https://simpleicons.org/)
> SVG is. Accept a generated result only if it reads as clearly, unambiguously
> recognizable as that specific tool at the ~28–32px display size (Layout,
> below) — not merely "a plausible-looking logo-shaped icon." **If any one
> icon in a sheet doesn't clear that bar, don't regenerate the whole sheet
> repeatedly to fix it** — pull that single icon from Simple Icons instead and
> keep the rest of the generated set. Mixing sourced-and-generated icons
> across the 8 is expected and fine; a strip that reads as "obviously not the
> real GitHub mark" is not.

**Spec (icons only — descriptions done, see above):**
- 8 icons total, generated as **two separate 2×2 sprite sheets** (one per
  panel, so a mistake in one doesn't force regenerating both):
  - **Built With sheet:** Python, Pandas, Scikit-learn, NumPy.
  - **Powered By sheet:** GitHub Actions, DVC, MLflow, Evidently AI.
- **Fallback source:** [Simple Icons](https://simpleicons.org/) (SVG,
  permissively licensed) — or each project's own official brand SVG — for any
  individual icon that fails the recognizability bar above.
- **Color — flag before building, don't assume:** the mockup shows each logo
  in its authentic brand colors (Python's blue/yellow, DVC's purple, etc.) —
  standard practice for "built with" attribution, and Contract 4's palette
  rule governs the site's *own* design elements, not a third party's
  trademark colors. Keep them full-color unless the human decides the mix
  clashes too much with the page; don't silently recolor them teal. This is
  why these sheets don't carry the shared House Style DNA `COLOR` line
  verbatim (see that section's exception note) — that includes not baking in
  its navy-900 background either: generate on a **transparent background**
  (background note below), not a filled navy tile, so each icon composites
  cleanly onto the exact row background it ends up next to instead of
  carrying a fixed color that can drift out of sync with it.
- **Layout:** icon (~28–32px) placed beside the name+description block already
  built — a small addition to the existing markup, not a redesign.
- **Dark-background visibility (real issue hit 2026-07-31, not hypothetical):**
  a first Powered By generation rendered GitHub's Octocat in near-black
  outline — invisible against `navy-900` — and the "transparent" background
  came back as a hazy dark gradient with a visible crosshair divider instead
  of true alpha. Root cause: GitHub's mark (like several brand logos) ships
  as **two monochrome variants** — black for light backgrounds, white for
  dark — and "authentic brand colors" alone doesn't tell the model which one
  to pick; left to guess, it defaulted to the light-background (black)
  variant. **Fix, baked into the Powered By prompt below:** name the
  dark-background/white variant explicitly per icon, forbid black/near-black
  fills outright, and forbid background gradient/glow/haze as strongly as
  the flat color fill. Reuse this same fix if the Built With sheet (or any
  future sheet) ever needs regenerating, even though it didn't hit this
  problem the first time.

**Prompt — Built With sheet:**
> SUBJECT: A 2×2 grid of four separate flat brand-style icon marks for
> open-source data/ML tools, one per quadrant: top-left Python (the two-tone
> intertwined-snake mark), top-right Pandas (its official panda/data mark),
> bottom-left Scikit-learn (its blue/orange ribbon mark), bottom-right NumPy
> (its blue grid/square "n" mark).
> COMPOSITION: Square canvas, even 2×2 grid; each icon centered alone within
> roughly the middle 70% of its quadrant with generous uniform padding; a
> consistent empty gutter between all four cells; no shared background
> element crossing a cell boundary, so the sheet crops cleanly into four
> independent icons afterward.
> STYLE: Clean flat vector-style brand-icon rendering; consistent icon size,
> weight, and rendering style across all four; simple recognizable silhouette
> per tool, matching each tool's real public mark as closely as possible.
> LIGHT: Even, flat lighting; no dramatic shadows.
> COLOR: plain transparent background (no filled canvas color) behind all
> four icons; each icon in its own authentic brand colors (not teal-
> restricted) so it stays recognizable as that tool's real mark.
> EXCLUDE: no text or labels under the icons, no numbers, no drawn dividing
> lines/borders between cells, no drop shadows, no 3D, no extra ornament, no
> background color or pattern of any kind.

**Prompt — Powered By sheet (revised 2026-07-31 for dark-background
visibility — see spec note above):**
> SUBJECT: A 2×2 grid of four separate flat brand-style icon marks for
> MLOps tooling, one per quadrant: top-left GitHub Actions (GitHub's Octocat
> mark, rendered in its official **white/light** dark-background variant —
> the version GitHub itself uses on dark UIs — never the black
> light-background variant), top-right DVC (its official mark), bottom-left
> MLflow (its official mark, rendered in its brightest/lightest authentic
> colorway), bottom-right Evidently AI (its official mark, rendered in its
> brightest/most saturated authentic colorway, not a muted or dark tone).
> COMPOSITION: Square canvas, even 2×2 grid; each icon centered alone within
> roughly the middle 70% of its quadrant with generous uniform padding; a
> consistent empty gutter between all four cells; no shared background
> element, line, or divider crossing a cell boundary, so the sheet crops
> cleanly into four independent icons afterward.
> STYLE: Clean flat vector-style brand-icon rendering; consistent icon size,
> weight, and rendering style across all four; simple recognizable silhouette
> per tool, matching each tool's real public mark as closely as possible.
> LIGHT: Even, flat lighting; no dramatic shadows.
> COLOR: fully transparent background — zero fill, zero gradient, zero
> ambient glow or haze anywhere outside each icon's own silhouette — behind
> all four icons; every icon rendered light-colored and high-contrast enough
> to read clearly against a dark navy (`#0d1b2e`) page background; for any
> logo (like GitHub's) that officially ships as separate black and white
> monochrome variants, use the white variant, never black or dark gray;
> otherwise use each tool's authentic brand colors (not teal-restricted).
> EXCLUDE: no text or labels under the icons, no numbers, no drawn dividing
> lines, crosshairs, or borders between cells, no drop shadows, no 3D, no
> extra ornament, no background color, gradient, glow, vignette, or haze of
> any kind, no black or near-black icon fills or strokes that would be
> invisible on a dark background.

**Dimensions:** generate each sheet at 1024×1024 (both edges multiples of
16), crop into four 512×512 cells, then downscale each crop to the ~28–32px
display size. **Don't chase 4K for headroom** — 512×512 is already ~16–18×
the target display size (more than enough margin even for retina), and
gpt-image-2's own guidance (top of this doc) flags anything above 2560×1440
as "experimental and more variable," so a larger canvas trades away
reliability for resolution the icons will never use. Drops into
`public/images/tools/` as 8 individual files (or `src/assets/tools/` if
imported via `astro:assets`, matching item 4's and item 9's pattern) once
cropped.

**Verify transparency before treating a crop as done.** gpt-image-2 doesn't
always deliver a clean alpha channel just because the prompt asked for one —
some generations come back on an opaque fill despite the instruction, or the
"transparent" area is only a checkerboard *preview* convention in the
delivery UI, not real per-pixel alpha in the saved file. Open each cropped
PNG and confirm it actually composites transparently (drag it over a
non-navy background, or check the file's alpha channel) before wiring it
into `MlopsSystem.astro` — if it isn't clean, remove the background in the
same image-editor pass used for cropping rather than re-generating.

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

**Derivative crop (2026-08-04):** `ProductPreview.astro`'s dashboard became a
real clickable sidebar shell (`src/lib/dashboard.ts`'s `DASHBOARD_PANELS`) —
a genuine `<nav>` now sits where this screenshot's baked-in fake sidebar used
to. `src/assets/dashboard-overview.png` is this same image with that column
cropped off (left ~230px of 1536px, found by sampling pixel jumps down the
image rather than eyeballing — the boundary is a clean, consistent edge at
every row sampled). Not a new generation, just a crop of an already-finished
asset; `dashboard.png` itself is untouched and still what this entry
describes.

---

## 10. §9.1 in-action clip — out of scope for image generation

**Status:** open item (ARCHITECTURE §7 item 11). A short muted looping
video (WebM/MP4) of the system actually running — terminal drift check,
GitHub Actions going green, dashboard updating. **This is a screen
recording, not something an image-generation tool can produce** — listed
here only so the full set of pending visual assets is in one place. Needs a
team member to capture it; v1 ships without it (still + "Concept preview"
badge on `/product`).

---

## 11. Try It Yourself banner — macro-gears reuse

**Status:** DONE (2026-07-31). Not a new asset — this is the original hero
macro-gears photo (`design/visual-assets/gears.png`, item 1's image before
the 2026-07-31 swap to a real CNC machine), relocated rather than discarded.
Zero image-generation tokens needed.

**Used in:** [try-it-yourself.astro](../src/pages/try-it-yourself.astro),
fixed-height photo band behind the page header (back link, H1, intro, stat
cards) — fades to solid navy before the instructional content below, so the
plain, scannable setup steps underneath aren't competing with a busy photo.
Same fade/wash technique as `Hero.astro`, scoped to a fixed-height band
instead of the full section since this page has no two-column hero layout to
give the photo its own side.

Asset: `design/visual-assets/gears.png` →
`public/images/try-it-yourself/macro-gears.png`.

---

## 12. Product Preview — Alerts concept screenshot

**Status:** DONE (2026-08-04). Generated from the prompt below (reference:
`src/assets/dashboard.png`), delivered as `design/mockups/ui-Alerts.png`
(1536×1024), then cropped to remove its own baked-in sidebar column (found at
x=247, same pixel-sampling method as item 9's derivative crop — this
generation's sidebar came back slightly wider than the original reference's).
Final asset: `src/assets/dashboard-alerts.png` (1289×1024).

**Content decision (human-directed, 2026-08-04):** this and item 13 exist
because the `/product` dashboard became a real clickable sidebar
(`src/lib/dashboard.ts`), and the human decided per-panel content doesn't
need to be strictly grounded in real/live data — a labelled "Concept
preview" mockup showing how a view *might* look for a real factory
deployment is fine, same latitude the original Overview screenshot (item 9)
already used for its own fabricated numbers.

**Used in:** the `alerts` panel of
[ProductPreview.astro](../src/components/sections/ProductPreview.astro)'s
dashboard shell, badged "Concept preview" like every other `image`-mode
panel.

**Prompt used:**
> SUBJECT: A predictive-maintenance dashboard UI screenshot, "Alerts" view —
> same application chrome as the attached reference screenshot (same left
> sidebar, same top header bar style), showing a different screen of the same
> product: a maintenance alerts / notifications feed instead of the fleet
> overview.
> KEY DETAIL: main content area is a vertical list of 5–6 alert cards, each
> with a severity badge (Critical / High / Medium / Info, in red / orange /
> yellow / blue), a short alert title (e.g. "Drift Detected — Tool Wear
> Shift", "Failure probability exceeded threshold"), a machine identifier, a
> relative timestamp, and a one-line description. Include a small filter row
> above the list (All / Critical / High / Resolved) and a summary stat strip
> at the top (e.g. active alerts, resolved today) in the same stat-tile style
> as the reference's top row.
> COMPOSITION: same layout proportions as the reference — left sidebar column,
> full-width header, content filling the remainder.
> STYLE: same clean modern SaaS dashboard-UI rendering as the reference —
> crisp sans-serif UI text, flat cards, subtle borders, small icons. Not
> photoreal, not illustration.
> LIGHT: flat, even UI lighting, no dramatic shadows.
> COLOR: dark navy dashboard theme matching the reference's own background and
> card surfaces; teal-cyan as the primary accent/highlight color; red / orange
> / yellow used only for severity badges.
> EXCLUDE: no real company names, no real people; all alert text, machine
> names, and numbers are fictional placeholder content for a concept mockup,
> not real data.

Note (deliberate deviation from the shared House Style DNA block, same
exception class as items 2 and 6): this prompt does **not** carry the shared
`COLOR`/`EXCLUDE` lines — it's a UI-screenshot mockup, same category as item
9's original Overview screenshot, not an ambient scene/illustration, so
"no text, no numbers, no UI panels" would work directly against the goal.

**Shell-side honesty note:** the mockup's own sidebar (baked into the
generation, since it was prompted to match the reference's chrome) carried a
"3" notification badge, and a separate generation of this same view carried a
red "7" on its Alerts nav item — both were cropped away along with the rest
of the fake sidebar column, and the *real* HTML sidebar in
`ProductPreview.astro` deliberately carries no such badge on its own Alerts
tab (a live-looking count with nothing behind it, sitting outside the
labelled concept image, would cross back into the fabrication this project's
other honesty rules forbid).

---

## 13. Product Preview — Predictions concept screenshot

**Status:** DONE (2026-08-04). Generated from the prompt below (reference:
`src/assets/dashboard.png`), delivered as `design/mockups/ui_predictions.png`
(1536×1024), then cropped to remove its own baked-in sidebar column (found at
x=227, matching the original reference almost exactly). Final asset:
`src/assets/dashboard-predictions.png` (1309×1024).

**Used in:** the `predictions` panel of `ProductPreview.astro`'s dashboard
shell, badged "Concept preview".

**Prompt used:**
> SUBJECT: A predictive-maintenance dashboard UI screenshot, "Predictions"
> view — same application chrome as the attached reference, showing a ranked
> list of machines by predicted failure probability.
> KEY DETAIL: main content area contains (a) a ranked list/table of 5
> machines with a color-coded failure-probability bar (green/yellow/orange/
> red), a status badge (Healthy/Moderate/High/Critical), and an estimated
> time-to-likely-failure column; (b) a small horizontal legend explaining the
> four probability bands (0–20% low, 20–50% moderate, 50–80% high, 80–100%
> critical); (c) one small trend-line chart showing probability-over-time for
> the top-ranked machine, in the same chart style as the reference's own
> trend chart.
> COMPOSITION: same layout proportions as the reference.
> STYLE: same clean modern SaaS dashboard-UI rendering as the reference.
> LIGHT: flat, even UI lighting.
> COLOR: dark navy dashboard theme matching the reference; teal-cyan primary
> accent; green/yellow/orange/red reserved for probability severity only.
> EXCLUDE: no real company names or people; all machine names, probabilities,
> and time figures are fictional placeholder content for a concept mockup.

Same House Style DNA exception as item 12 above — a UI-screenshot mockup, not
an ambient scene.

**Honesty note:** the est.-time-to-failure column ("6.4 hrs", "2.1 days", …)
is exactly the kind of number `ARCHITECTURE.md`/the project's handover notes
flag as un-backable (no RUL model exists in this project). It ships anyway,
under the same "Concept preview" badge the original Overview screenshot
(item 9) already uses for its own un-backed "1.8 hrs until likely failure" —
consistent with the human's explicit 2026-08-04 direction that per-panel
content can be conceptual/illustrative as long as it's clearly labelled a
concept, not a new deviation invented for this entry alone.
