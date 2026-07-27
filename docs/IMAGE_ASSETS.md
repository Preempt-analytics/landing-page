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

## 1. Hero background photo — macro-gears

**Status:** placeholder. Hero.astro currently renders a navy→teal CSS gradient
panel with a faint gear-silhouette SVG stand-in instead of a real photo. Final
asset drops into `public/images/hero/macro-gears.jpg` with zero code changes
(ARCHITECTURE §5, §7 item 2).

**Used in:** [Hero.astro](../src/components/Hero.astro), visual column (right
side on desktop).

**Prompt:**
> Extreme macro close-up photograph of interlocking industrial steel gears
> and precision machine parts. Dark, moody industrial lighting with teal and
> deep-blue rim light picking out the metal edges. Shallow depth of field,
> high micro-detail, photorealistic. Predominantly dark navy tones so a teal
> glow overlay and dot-grid texture can be layered on top without fighting
> the image's own contrast. Portrait orientation.

**Dimensions:** deliver at least 1600×2000px (crops to `aspect-[4/5]` on
desktop, square on mobile). **Constraint:** no text, no logos, no visible
brand marks baked into the photo.

---

## 2. Real logo / brand mark

**Status:** placeholder. [Logo.astro](../src/components/Logo.astro) is a
hand-drawn triangle/"A" SVG, explicitly flagged as a stand-in (ARCHITECTURE §7
item 1).

**Used in:** Nav, Footer, favicon, OG image (item 6 below).

**Prompt:**
> Minimalist geometric logo mark for an industrial predictive-maintenance AI
> product called "Preempt Analytics." A simple triangular or upward-arrow
> silhouette suggesting foresight and prevention. Clean vector line-art,
> single flat teal color (#2dd4bf) on a transparent background. No gradients,
> no photorealism, no drop shadows.

**Dimensions:** deliver as SVG (vector, not raster) — must stay legible at the
24–30px size the nav bar renders it at today. **Constraint:** simple enough to
still read at favicon size (item 7).

---

## 3. Live Factory section — photoreal/illustrated upgrade (v2)

**Status:** v1 ships as an in-code SVG placeholder (stylized CNC floor,
glowing sensor pins, one drift-alert callout) — fully functional today, this
entry is only for a future visual upgrade (ARCHITECTURE §7 item 3, §11).

**Used in:** [LiveFactory.astro](../src/components/sections/LiveFactory.astro).

**Prompt:**
> Isometric illustration of a modern CNC milling factory floor at night.
> Several dark-toned CNC milling machines (not generic robot arms) arranged
> on a grid floor, each with a small glowing teal sensor light. One machine
> glows amber/red with a "drift detected" warning. Deep navy-blue palette
> with teal and blue accent lighting, clean vector-illustration style (not
> photoreal), cinematic lighting, subtle perspective grid floor.

**Dimensions:** `aspect-[4/3]`, deliver at least 1600×1200px. **Constraint:**
machines must read as CNC/milling equipment specifically (the dataset is a
milling process — confirmed by the Product Preview dashboard's own "CNC-03"
labeling), not arbitrary factory robotics.

---

## 4. MLOps System diagram — rotating center emblem

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

## 5. Built With / Powered By — real tool logos

**Status:** not yet built. MlopsSystem.astro currently renders each tool
(Python, Pandas, Scikit-learn, NumPy / GitHub Actions, DVC, MLflow, Evidently
AI) as a plain text pill with no icon. The reference mockup (same screenshot
as item 4) shows each tool with its real, full-color brand mark next to a
bold name and a one-line description.

**Used in:** MlopsSystem.astro, "Built With" and "Powered By" side panels.

**Note — not an image-generation task.** Like item 2, these are literal
existing third-party logos — source real marks from a permissively-licensed
icon set, don't prompt an image-generation tool to approximate Python's/
GitHub's/etc. actual logo.

**Spec:**
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
- **Layout:** icon (~28–32px) + bold tool name + one-line description per
  entry, matching the mockup's two-line pattern — a layout change to the
  existing pill list, not just an icon bolted onto what's there today.

---

## 6. OG / social-preview image

**Status:** not yet built (ARCHITECTURE §10) — the `<meta property="og:image">`
tag has no image behind it yet. Not a blocker for anything else.

**Used in:** [BaseLayout.astro](../src/layouts/BaseLayout.astro) `<head>`
(once added).

**Prompt:**
> Wide promotional banner, dark navy (#0d1b2e) background with a soft teal
> radial glow and faint dot-grid texture. Industrial gear silhouette motif
> in one corner, kept subtle. Large clean open area in the center-left for
> overlaid title text. Teal (#2dd4bf) and navy color scheme only, minimal
> and uncluttered.

**Dimensions:** 1200×630px (standard Open Graph size). **Open decision, not a
generation requirement:** could instead reuse the hero's own visual treatment
or a framed Product Preview screenshot rather than commissioning a new image —
worth deciding before generating this one from scratch.

---

## 7. Favicon

**Status:** placeholder SVG at `public/favicon.svg`, functional today
(ARCHITECTURE §7 item 1 groups it with the logo). **No separate generation
needed** — once the real logo mark (item 2) exists, derive the favicon from
it rather than generating a third, independent asset.

---

## 8. Product Preview dashboard screenshot — already finished, do not regenerate

**Status:** DONE. `src/assets/dashboard.png`, used inside browser-chrome
framing on the new `/product` subpage
([product.astro](../src/pages/product.astro) →
[ProductPreview.astro](../src/components/sections/ProductPreview.astro)).
Listed here only so this doc is a complete inventory, not a wishlist — this
is a finished, high-quality image and needs no prompt, no regeneration, and
no restyling (ARCHITECTURE §11's one deliberate "used as-is" exception).

---

## 9. §9.1 in-action clip — out of scope for image generation

**Status:** open item (ARCHITECTURE §7 item 11). A short muted looping
video (WebM/MP4) of the system actually running — terminal drift check,
GitHub Actions going green, dashboard updating. **This is a screen
recording, not something an image-generation tool can produce** — listed
here only so the full set of pending visual assets is in one place. Needs a
team member to capture it; v1 ships without it (still + "Concept preview"
badge on `/product`).
