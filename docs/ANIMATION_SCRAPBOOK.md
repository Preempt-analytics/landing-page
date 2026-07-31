# Animation Scrapbook

A portable reference of web-animation patterns — copy-paste starting points, not
project-specific. Every snippet below uses generic class names and a small set
of CSS custom properties you define once per project. Swap the token values,
not the patterns.

Every pattern here defaults to **CSS-only** unless the effect genuinely
requires JS (cross-element interaction, cursor tracking). Reach for JS only
when CSS can't express the relationship.

---

## Table of contents

1. [Foundations](#foundations)
   - [Motion tokens](#motion-tokens)
   - [The reduced-motion blanket rule](#the-reduced-motion-blanket-rule)
   - [⚠️ The transform-composition gotcha](#️-the-transform-composition-gotcha)
2. [Entrances & reveals](#entrances--reveals)
   - [Scroll-reveal (IntersectionObserver)](#scroll-reveal-intersectionobserver)
   - [Non-diagonal reveal variant](#non-diagonal-reveal-variant)
   - [Staggered list cascade](#staggered-list-cascade)
   - [Load-triggered stagger (above the fold)](#load-triggered-stagger-above-the-fold)
   - [One-time gated animation ("power-up")](#one-time-gated-animation-power-up)
     - [Variant: many elements, staggered, sharing the same property](#variant-many-elements-staggered-sharing-the-same-property)
3. [Hover & press feedback](#hover--press-feedback)
   - [Button press/lift/glow](#button-presslift-glow)
   - [Card hover-lift utility](#card-hover-lift-utility)
   - [Animated underline](#animated-underline)
   - [Accessible hover+focus popover](#accessible-hoverfocus-popover)
4. [Ambient "alive" loops](#ambient-alive-loops)
   - [Breathing glow](#breathing-glow)
   - [Roaming spotlight](#roaming-spotlight)
   - [Occasional flicker (industrial lights)](#occasional-flicker-industrial-lights)
   - [SVG stroke draw-in](#svg-stroke-draw-in)
5. [Path-based motion](#path-based-motion)
   - [Traveling dot along an SVG path](#traveling-dot-along-an-svg-path)
6. [Depth & parallax](#depth--parallax)
   - [Cursor-parallax tilt](#cursor-parallax-tilt)
   - [Foreground-only parallax (floating card)](#foreground-only-parallax-floating-card)
   - [Scroll-driven parallax](#scroll-driven-parallax)
7. [Cross-element interaction](#cross-element-interaction)
   - [Cross-highlight bridge](#cross-highlight-bridge)
8. [Page transitions](#page-transitions)
   - [View Transitions API](#view-transitions-api)
9. [Rules of thumb](#rules-of-thumb)

---

## Foundations

### Motion tokens

Define durations and easing curves once, reference them everywhere. This is
what makes a whole site's motion read as *one system* instead of every
component inventing its own timing.

```css
:root {
  --dur-fast: 150ms;   /* press/tap feedback — must feel instant */
  --dur-base: 300ms;   /* ordinary hover/reveal transitions */
  --dur-slow: 500ms;   /* bigger reveals, page-level moments */

  /* Apple's standard decelerate curve — sheets, pushes, most reveals */
  --ease-ios: cubic-bezier(0.16, 1, 0.3, 1);
  /* Symmetric, for simple hover color/opacity swaps */
  --ease-ios-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  /* A slight overshoot — reserve for rare "discovery" moments (a card
     popping into view). Using it everywhere reads as bouncy/toy-like. */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Tips:**
- Keep `--dur-fast` snappy even when you slow everything else down — press
  feedback that lags feels broken in a way a slightly-slower hover never does.
- If a design direction shifts ("more sophisticated," "snappier"), you re-tune
  the whole site by editing these three durations, nothing else.

### The reduced-motion blanket rule

One rule, once, instead of remembering to gate every animation individually.

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Tips:**
- View Transitions (see below) live in a separate pseudo-element tree that
  isn't always caught by the universal selector in every engine — add an
  explicit belt-and-suspenders rule:
  ```css
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) { animation: none !important; }
  }
  ```
- For JS-driven effects (cursor-parallax, mousemove tracking), don't just rely
  on the CSS override — check `prefers-reduced-motion` in the script and skip
  attaching the listener entirely. Continuous pointer-follow motion is exactly
  the kind of thing that setting exists to opt out of, not merely soften.

### ⚠️ The transform-composition gotcha

**The single most common bug in this scrapbook.** If you center an element
with a `transform` (e.g. `translate(-50%, -50%)` to center it on a coordinate)
and then *also* animate `transform` (a hover scale, a pulse keyframe, a tilt),
the animated value **replaces** the resting value outright — it does not
combine with it. `transform` is one property with one computed value; there's
no "add this scale on top of whatever transform is already there."

**Broken:**
```css
.dot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); /* centers it */
  animation: pulse 2s infinite;
}
@keyframes pulse {
  50% { transform: scale(1.3); } /* the moment this keyframe applies,
                                     translate(-50%,-50%) is GONE — the dot
                                     jumps to its un-centered corner and
                                     scales from there. Reads as a shake/jump,
                                     not a smooth pulse. */
}
```

**Fixed** — repeat the full transform in every keyframe stop:
```css
@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%      { transform: translate(-50%, -50%) scale(1.3); }
}
```

This also bites you across *resting vs. hover* states, not just keyframes —
and it's sneakier there, because a CSS-framework's utility classes (Tailwind,
etc.) often build `transform` out of several composed pieces
(`translate + rotate + skew + scale`) via internal custom properties. A hover
rule that sets a plain `transform: translate(...) scale(...)` doesn't share
that internal composition, so the browser can't interpolate translate/scale
independently between states — it falls back to full matrix decomposition,
which can visibly **drift diagonally** during the transition even though both
the start and end states look individually correct.

**Fix:** author the resting transform in the *same rule*, in the *same
function shape*, as every other state that touches `transform` on that
element — don't let a utility framework and a hand-written hover rule each
own a different slice of it.

```css
/* One rule owns the whole lifecycle of this element's transform. */
.node {
  transform: translate(-50%, -50%) scale(1);
  transition: transform var(--dur-base) var(--ease-ios);
}
.node:hover {
  transform: translate(-50%, -50%) scale(1.05); /* same shape, just a new scale */
}
```

**Tips:**
- If an element needs to rotate *and* stay centered, put the rotation on a
  separate **inner** element and keep the centering transform on the outer
  wrapper untouched. Two elements, two single-purpose transforms, zero
  conflict.
- If you only need to *move* an element along one axis (no simultaneous
  scale/rotate), consider animating `left`/`top` directly instead of
  `transform: translate()` — a plain position animation is simply immune to
  this whole class of bug, at the cost of not being GPU-composited.
- Two *different* CSS rules that both set the `transition` shorthand for the
  same property have an analogous gotcha: same-specificity rules don't merge,
  the later one in source order wins outright. If an element needs, say, a
  scroll-reveal transition AND a hover-lift transition on the same property,
  author the **union** explicitly in one combined-specificity selector
  (e.g. `.reveal.hoverable { transition: opacity 500ms, transform 300ms; }`)
  rather than hoping two separate rules compose.

---

## Entrances & reveals

### Scroll-reveal (IntersectionObserver)

The standard "fade + slide up once, the first time it's scrolled into view"
pattern, shared across an entire page from one observer.

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--dur-slow) var(--ease-ios),
              transform var(--dur-slow) var(--ease-ios);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}
```

```html
<noscript>
  <style>[data-reveal] { opacity: 1 !important; transform: none !important; }</style>
</noscript>
```

```js
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  els.forEach((el) => observer.observe(el));
});
```

**Tips:**
- The `<noscript>` fallback matters — without it, a no-JS visitor is stuck
  with permanently invisible content, not a "no animation" degrade.
- One shared observer for the whole page beats one per component — cheaper,
  and every section's reveal is guaranteed to use the same timing feel.
- If you have a client-side router doing page transitions without a full
  reload, rebind this on your router's "page ready" event, not just
  `DOMContentLoaded` — a fresh page's content needs the observer re-attached.

### Non-diagonal reveal variant

`translateY` reveals can read as "sliding in diagonally" when they play out
*while the page is still scrolling* — a vertical element-motion plus a
vertical page-scroll combine, visually, into a diagonal. If a specific section
triggers late (near the bottom of a fast scroll) and this bothers you, drop
the translate component entirely and reveal via scale + opacity (+ optionally
a brief brightness/glow bloom) instead — there's no direction left for it to
read as diagonal, regardless of scroll speed.

```css
.reveal-bloom {
  transform: none;
  transition: none;
}
.reveal-bloom.is-visible {
  animation: reveal-bloom-in var(--dur-slow) var(--ease-ios) both;
}
@keyframes reveal-bloom-in {
  0%   { opacity: 0; transform: scale(0.94); filter: brightness(1); box-shadow: 0 0 0 0 transparent; }
  55%  { opacity: 1; filter: brightness(1.15); box-shadow: 0 0 30px -6px rgba(80, 200, 255, 0.45); }
  100% { opacity: 1; transform: scale(1); filter: brightness(1); box-shadow: 0 0 0 0 transparent; }
}
```

Still keep the `[data-reveal]` attribute on the element so a shared observer
(above) picks it up and adds `.is-visible` normally — you're only swapping
*what happens visually* on reveal, not the trigger mechanism.

### Staggered list cascade

Children of a revealed container populate one after another instead of all
at once.

```css
.list-reveal > * {
  opacity: 0;
  transform: scale(0.94);
}
.list-reveal.is-visible > * {
  animation: item-in var(--dur-base) var(--ease-ios) both;
}
.list-reveal.is-visible > *:nth-child(1) { animation-delay: 0ms; }
.list-reveal.is-visible > *:nth-child(2) { animation-delay: 60ms; }
.list-reveal.is-visible > *:nth-child(3) { animation-delay: 120ms; }
.list-reveal.is-visible > *:nth-child(4) { animation-delay: 180ms; }
@keyframes item-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: none; }
}
```

**Tips:**
- If the list sits *inside* an already-staggered parent panel, start this
  cascade's delays *after* the parent's own reveal has mostly finished
  (parent delay + ~150–200ms), so it reads as "frame appears, then items
  populate," not two competing fades at once.
- Beyond 5–6 items, either cap the stagger (don't let item #40 wait 3 extra
  seconds) or switch to a fixed small increment with a max.

### Load-triggered stagger (above the fold)

Content already in view on first paint has nothing to "scroll into" — trigger
its entrance from page load instead of an observer.

```css
.hero-fade-in {
  animation: fade-up var(--dur-slow) var(--ease-ios) both;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
```

```html
<p class="hero-fade-in" style="animation-delay: 0ms">Eyebrow text</p>
<h1 class="hero-fade-in" style="animation-delay: 60ms">Headline</h1>
<p class="hero-fade-in" style="animation-delay: 140ms">Subtext</p>
```

Plain CSS animations replay automatically whenever the element is freshly
inserted into the DOM — including on a client-side page-router navigation
back to that page — so this needs no JS re-trigger logic at all.

### One-time gated animation ("power-up")

An animation that should play exactly once, the first time an element
actually enters the viewport — not on page load if it's off-screen, and not
every time it's re-observed. The trick: give the element **two** animations
from the start (never redeclare the `animation` shorthand later), and gate
the one-time effect with `animation-play-state` instead of adding/removing
`animation-name`.

```css
.pin {
  animation: pulse 3s ease-in-out infinite,      /* continuous ambient loop */
             boot-flash 0.7s ease-out both;       /* one-time cue */
  animation-play-state: running, paused;          /* boot-flash starts frozen */
}
.scene.is-visible .pin {
  animation-play-state: running, running;         /* unpause it once, ever */
}
@keyframes boot-flash {
  0%   { filter: brightness(1); }
  40%  { filter: brightness(2.2); }
  100% { filter: brightness(1); }
}
```

**Why not just add `animation-name` via a class instead?** Redeclaring the
whole `animation` shorthand later resets `animation-delay` for every listed
animation to its default, silently breaking any per-element delay stagger set
inline (`style="animation-delay: 150ms, -2s"`, one value per animation,
matched positionally). Keeping the animation-name list constant and only
toggling `animation-play-state` sidesteps that entirely.

**Why a filter, not opacity/transform?** So it doesn't fight with whatever the
*continuous* loop animation is already doing to those properties on the same
element — pick a property the other animation doesn't touch.

#### Variant: many elements, staggered, sharing the same property

The single-pin case above sidesteps property conflicts by putting the
one-time cue on a *different* property (`filter`) than the loop (`opacity`/
`transform`). Sometimes that's not available — e.g. a scattered field of tiny
"indicator lights" that already blink via `opacity`, which should *also* get
a one-time "powering on unevenly" burst that's just a more dramatic version
of the same flicker. Two things change:

```css
.light {
  opacity: 0.15;
  animation-name: blink, boot-flicker;              /* both share `opacity` */
  animation-timing-function: ease-out, linear;
  animation-iteration-count: infinite, 1;            /* boot-flicker: no fill-mode */
  animation-play-state: running, paused;
}
.scene.is-visible .light {
  animation-play-state: running, running;
}
@keyframes blink {
  0%, 90%, 100% { opacity: 0.15; }
  93%           { opacity: 1; }
  96%           { opacity: 0.15; }
}
@keyframes boot-flicker {
  /* ends back at 0.15 — the SAME idle value `blink` sits at most of the
     time — so handing control back to it is visually seamless */
  0%   { opacity: 0.15; }
  8%   { opacity: 1; }
  14%  { opacity: 0.15; }
  22%  { opacity: 1; }
  40%  { opacity: 0.9; }
  70%  { opacity: 1; }
  100% { opacity: 0.15; }
}
```

```html
<span class="light"
      style="animation-duration: 5.2s, 1.3s; animation-delay: 0s, 0.3s;"></span>
<span class="light"
      style="animation-duration: 7.4s, 1.3s; animation-delay: 1.1s, 0.6s;"></span>
<!-- one <span> per light; each gets its own two-value duration/delay pair,
     matched positionally to animation-name's two-item list, so every
     light's *ambient* rhythm AND *boot* stagger are independently random -->
```

**⚠️ The gotcha this variant runs into:** when two animations on one element
target the *same* CSS property, the browser composites them "last listed
wins" by default (`animation-composition: replace`) — they don't blend or
average. That's fine while `boot-flicker` is actively running (it's meant to
win). The trap is **after** it finishes: if it has `fill-mode: both` or
`forwards` (as the single-property `boot-flash` example above safely does,
since nothing else there competes for `filter`), it keeps "winning" forever
— a finished-but-filled animation still counts as present for compositing
purposes. `blink` would keep running underneath, completely invisibly,
forever after. **Give the one-time animation no fill-mode at all** when it
shares a property with a permanent loop, so it stops influencing that
property the instant it ends and control reverts to whatever's running
underneath — cleanly, with no visible seam, as long as both animations'
"idle" values roughly agree (both sit at `opacity: 0.15` above).

---

## Hover & press feedback

### Button press/lift/glow

```css
.btn {
  transition: transform var(--dur-base) var(--ease-ios),
              box-shadow var(--dur-base) var(--ease-ios);
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -8px rgba(80, 200, 255, 0.45);
}
.btn:active {
  transform: translateY(0) scale(0.97);
  transition-duration: var(--dur-fast); /* press feedback must feel instant */
}
```

### Card hover-lift utility

One shared utility class instead of a bespoke hover rule per card component.

```css
.tile-hover {
  transition: transform var(--dur-base) var(--ease-ios),
              box-shadow var(--dur-base) var(--ease-ios),
              border-color var(--dur-base) var(--ease-ios);
}
@media (hover: hover) and (pointer: fine) {
  .tile-hover:hover {
    transform: translateY(-4px);
    border-color: rgba(80, 200, 255, 0.4);
    box-shadow: 0 16px 40px -20px rgba(0, 0, 0, 0.55);
  }
}
.tile-hover:active {
  transform: translateY(-1px) scale(0.99);
}
```

**Tips:**
- Gate the `:hover` styles behind `(hover: hover) and (pointer: fine)` so
  touch devices don't get a hover state "stuck" on after a tap — but leave
  `:active` (press feedback) ungated, since that works correctly on touch too.
- **Don't** use this generic utility on an element that already carries its
  own centering `transform` (a radially/absolutely positioned node) — see the
  [transform-composition gotcha](#️-the-transform-composition-gotcha) above.
  Give that element a bespoke rule instead.

### Animated underline

```css
.link {
  position: relative;
}
.link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-base) var(--ease-ios);
}
.link:hover::after,
.link:focus-visible::after {
  transform: scaleX(1);
}
```

### Accessible hover+focus popover

A tooltip/popover that works for both mouse and keyboard, and doesn't trap
focus inside an invisible element while hidden.

```css
.tip-pop {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(2px) scale(0.97);
  transition: opacity var(--dur-fast) var(--ease-ios),
              transform var(--dur-base) var(--ease-ios),
              visibility 0s linear var(--dur-base); /* delay hiding until faded out */
}
.tip:hover .tip-pop,
.tip:focus-within .tip-pop {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  transition: opacity var(--dur-fast) var(--ease-ios),
              transform var(--dur-base) var(--ease-ios),
              visibility 0s; /* show it immediately */
}
```

```html
<span class="tip">
  <button type="button" aria-label="What is this?">?</button>
  <span class="tip-pop" role="tooltip">Explanation text here.</span>
</span>
```

**Tips:**
- `visibility` (not just `opacity: 0`) is what removes the hidden popover
  from the tab order and from screen-reader traversal — `opacity` alone
  leaves it focusable/reachable while invisible.
- The asymmetric `visibility` transition delay is the trick: hide
  *instantly* on the way in (so it appears the moment opacity starts
  rising), but delay the `visibility: hidden` until the fade-out transition
  has actually finished (so it doesn't vanish before the fade completes).

---

## Ambient "alive" loops

### Breathing glow

A slow, passive loop for background elements not tied to any interaction —
reads as "this scene is alive" without asking for attention the way a hover
effect does.

```css
.ambient-glow {
  animation: breathe 12s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.7; transform: scale(1.07); }
}
```

**Tip:** if a page has multiple ambient glow layers, give each one its own
`animation-duration`/`animation-delay` inline so they drift out of phase with
each other — several layers breathing in exact unison reads as one robotic
pulse instead of an atmosphere.

### Roaming spotlight

A large, dim, heavily-blurred glow that slowly drifts between several
positions — meaningful when it's tied to something (attention moving between
items on the screen), decorative otherwise.

```css
.spotlight {
  position: absolute;
  width: 40%;
  aspect-ratio: 1;
  border-radius: 9999px;
  transform: translate(-50%, -50%); /* static — this animates left/top, not transform */
  background: radial-gradient(circle, rgba(80, 200, 255, 0.16), transparent 70%);
  filter: blur(24px);
  animation: roam 28s ease-in-out infinite;
}
@keyframes roam {
  0%, 12%   { left: 20%; top: 30%; }
  24%, 36%  { left: 60%; top: 25%; }
  48%, 60%  { left: 80%; top: 55%; }
  72%, 84%  { left: 35%; top: 60%; }
  96%, 100% { left: 20%; top: 30%; } /* loop back to start */
}
```

**Tip:** animate `left`/`top` here, not `transform`, specifically so the
static centering `transform` never has to be repeated inside the keyframe —
sidesteps the [transform-composition gotcha](#️-the-transform-composition-gotcha)
entirely rather than working around it.

### Occasional flicker (industrial lights)

A scattered field of small indicator dots that flicker irregularly and
independently — reads as "a real, slightly imperfect place" (catwalk lights,
server rack LEDs, distant windows) rather than one polished, uniform pulse.
Chosen over the roaming spotlight above when the goal is grit/atmosphere
rather than a single meaningful focal point.

```css
.indicator {
  width: 3px;
  height: 3px;
  border-radius: 9999px;
  opacity: 0.15;
  background: #eafffb;
  box-shadow: 0 0 4px 1px rgba(234, 255, 251, 0.8);
  animation: flicker 6s ease-out infinite; /* duration set per-element inline instead — see below */
}
@keyframes flicker {
  0%, 90%, 100% { opacity: 0.15; } /* dim almost the entire cycle */
  93%           { opacity: 1; }    /* one brief, sharp spike */
  96%           { opacity: 0.15; }
}
```

```html
<!-- Each dot gets its own duration/delay so none of them ever visibly
     sync up — deliberately NOT round numbers or simple multiples of each
     other (5.2s/7.4s/6.1s.../not 5s/6s/7s), which reduces how often their
     cycles line up even coincidentally over a long viewing session. -->
<span class="indicator" style="left: 8%; top: 18%; animation-duration: 5.2s; animation-delay: 0s;"></span>
<span class="indicator" style="left: 92%; top: 14%; animation-duration: 7.4s; animation-delay: 1.1s;"></span>
<span class="indicator" style="left: 14%; top: 62%; animation-duration: 6.1s; animation-delay: 2.6s;"></span>
```

**Tips:**
- Keep these dots genuinely secondary — smaller, dimmer, and more numerous
  than whatever your scene's *actual* status indicators are (if there are
  named/meaningful pins elsewhere in the same scene, these should read as
  clearly a different, lesser layer, not "five more of those").
- Scatter them away from any existing focal point (a callout, a badge, a
  headline) in the same composition — they're meant to be peripheral
  texture, not additional things competing for attention.
- Want these lights to *also* do something more dramatic once, the first
  time the scene is actually seen (a "power coming on" moment)? See the
  [multi-element boot-flicker variant](#variant-many-elements-staggered-sharing-the-same-property)
  above — same dots, an extra layered one-time animation.

### SVG stroke draw-in

A checkmark (or any short path) that draws itself rather than just fading in.

```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" pathLength="1" />
</svg>
```

```css
.check-draw path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.is-visible .check-draw path {
  animation: draw 0.5s ease-out forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

**Tip:** `pathLength="1"` on the `<path>` lets you author the dash values in
simple `0`–`1` units regardless of the path's real geometric length — no need
to measure the path in a browser devtool first.

---

## Path-based motion

### Traveling dot along an SVG path

A glowing dot that glides continuously along an arbitrary curve — a
"data/energy flowing" cue.

```html
<svg viewBox="0 0 100 100">
  <!-- ...your existing paths/shapes... -->
  <circle class="travel-dot" r="1.3" fill="#fff" />
</svg>
```

```css
.travel-dot {
  offset-path: path("M 10 50 A 40 40 0 1 1 90 50 A 40 40 0 1 1 10 50");
  offset-rotate: 0deg; /* irrelevant for a symmetric dot; skip the default
                           "auto" rotation-to-path-tangent for a plain circle */
  animation: travel 10s linear infinite;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.9));
}
@keyframes travel {
  from { offset-distance: 0%; }
  to   { offset-distance: 100%; }
}
```

**Tips:**
- Keep this dot as an **SVG child element**, not a plain HTML `<div>`. Applied
  to SVG content, `offset-path`'s coordinates use the SVG's own viewBox
  units, so the path stays perfectly aligned with everything else in the same
  SVG at every screen size. Applied to an HTML element, the same coordinates
  resolve in CSS *pixels* of that element's own box — it won't scale with a
  responsive parent, and will visibly drift out of alignment across
  breakpoints unless you hand-write separate pixel values per breakpoint.
- Don't over-speed this. A full-loop-in-a-few-seconds pace on a small path
  reads as "a roller coaster," not "sleek." A slow, ambient pace (matching
  other passive loops on the same page) reads as considered.

---

## Depth & parallax

### Cursor-parallax tilt

A few degrees of 3D perspective tilt following the pointer — the classic
"product photo" hover trick.

```js
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.tilt-target');
  const canTilt =
    el &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canTilt) return;

  const MAX_TILT_DEG = 4; // keep this small — see tips below
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform =
      `perspective(1000px) rotateX(${(-y * MAX_TILT_DEG * 2).toFixed(2)}deg) ` +
      `rotateY(${(x * MAX_TILT_DEG * 2).toFixed(2)}deg)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});
```

```css
.tilt-target {
  transition: transform 300ms ease; /* smooths the return-to-neutral on mouseleave */
}
```

**Tips (learned the hard way):**
- **Pick the target carefully.** Tilting a single coherent object (a product
  photo, a device mockup) reads as intentional depth. Tilting a *whole busy
  scene* that already has several independent hover interactions inside it
  (highlighting, popovers, other hover states) reads as one effect too many —
  the tilt competes with, rather than points at, whatever the scene actually
  wants seen. If a section already has 2+ other hover interactions, this
  probably isn't the section for a tilt.
- **Don't tilt live text at any real angle.** A few degrees is imperceptible;
  double it and body copy starts to visibly skew and become harder to read.
  Fine on a screenshot/photo (no live text to distort); be more conservative
  on a card with real DOM text.
- Skip this feature entirely — don't just slow it down — for
  `prefers-reduced-motion` and for touch/no-hover devices (checked in JS, not
  just via a CSS media query, since the *listener itself* shouldn't attach).

### Foreground-only parallax (floating card)

A variant on the above: instead of tilting an entire scene as one rigid
plane, let only a **foreground element** (a badge, callout, or notification)
shift toward the pointer while the background stays completely still. This is
real parallax logic (near objects move more than far ones for the same
viewpoint change) and it has a practical advantage over tilting everything:
it puts the motion exactly on the element you want the eye drawn to, instead
of spreading it across a whole scene.

```js
const region = document.querySelector('.tracking-region'); // the big area to watch the pointer over
const card = document.querySelector('.floating-card');     // the small thing that actually moves
// ...same capability checks as above...
const MAX_SHIFT_PX = 6;
const MAX_TILT_DEG = 3; // smaller than a full-scene tilt — this is a subtler effect
region.addEventListener('mousemove', (e) => {
  const rect = region.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  card.style.transform =
    `translate(${(x * MAX_SHIFT_PX * 2).toFixed(1)}px, ${(y * MAX_SHIFT_PX * 2).toFixed(1)}px) ` +
    `perspective(600px) rotateX(${(-y * MAX_TILT_DEG * 2).toFixed(1)}deg) ` +
    `rotateY(${(x * MAX_TILT_DEG * 2).toFixed(1)}deg)`;
});
region.addEventListener('mouseleave', () => { card.style.transform = ''; });
```

The listener tracks pointer position across the **whole region**, but only
the small card element moves — so it starts responding as soon as the
pointer is anywhere nearby, not only once it's directly over the tiny target.

### Scroll-driven parallax

Depth cue driven by scroll position instead of the cursor — works on touch,
costs no hover attention, and (with the `@supports` guard below) needs zero
JavaScript.

```css
/* Scoped in @supports so unsupporting browsers get the plain, static image —
   NOT frozen at this animation's un-timed end keyframe. Without this guard,
   a browser that doesn't understand animation-timeline still runs the
   animation shorthand with its default (zero) time-based duration, which
   effectively snaps straight to the last keyframe and *stays there* — a
   real visual regression, not a graceful no-op. */
@supports (animation-timeline: view()) {
  .parallax-photo {
    animation: drift linear both;
    animation-timeline: view();
    animation-range: cover 0% cover 100%;
  }
  @keyframes drift {
    /* scale supplies the overscan the translateY needs so the shift never
       uncovers empty space at the image's own edges */
    from { transform: scale(1.06) translateY(-2.5%); }
    to   { transform: scale(1.06) translateY(2.5%); }
  }
}
```

**Tip:** if the element the parallax applies to is clipped by an
`overflow: hidden` parent (typical for a framed photo), the built-in
`scale(1.06)` overscan is what prevents the vertical drift from revealing a
gap at the top or bottom edge — don't drop it thinking it's just decorative.

---

## Cross-element interaction

### Cross-highlight bridge

Hovering one element highlights a *different*, unrelated-in-the-DOM element
elsewhere on the page (a legend item highlighting a chart segment, a list
item highlighting a diagram node). CSS sibling combinators can't reach across
separate subtrees — this is the one place in this scrapbook that genuinely
needs a few lines of JS.

```html
<li data-links-to="node-3">Some list item</li>
<!-- ...elsewhere in the DOM entirely... -->
<div class="node" data-node-id="node-3">A diagram node</div>
```

```js
document.querySelectorAll('[data-links-to]').forEach((item) => {
  const target = document.querySelector(`[data-node-id="${item.dataset.linksTo}"]`);
  if (!target) return;
  const on = () => { item.classList.add('is-linked'); target.classList.add('is-linked'); };
  const off = () => { item.classList.remove('is-linked'); target.classList.remove('is-linked'); };
  item.addEventListener('mouseenter', on);
  item.addEventListener('mouseleave', off);
});
```

```css
.is-linked { /* whatever highlight treatment matches this element's own hover state */ }
```

**Tip:** reuse the *exact same* visual treatment your target element already
has for its own `:hover` state, just triggered via a class instead of the
pseudo-class — keeps "hovering it directly" and "hovering its linked partner"
visually consistent.

---

## Page transitions

### View Transitions API

Native browser support for smooth crossfades between full page navigations —
zero extra dependency in a modern browser, and it degrades to a normal hard
navigation wherever it isn't supported.

```html
<!-- Plain HTML/vanilla: opt in with one meta tag -->
<meta name="view-transition" content="same-origin">
```

```css
/* Customize the default crossfade, or scope specific elements to a shared
   "morph" transition across pages by naming them */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 300ms;
}
.persistent-header {
  view-transition-name: site-header; /* same name on both pages = morphs, doesn't refade */
}
```

**Tips:**
- Elements you want to persist visually across the transition (a nav bar, a
  logo) need the *same* `view-transition-name` on both the outgoing and
  incoming page — otherwise they cross-fade like everything else, which for
  a static header/footer just looks like a flicker.
- If a framework provides its own wrapper around this (Astro's
  `ClientRouter`, etc.), check whether any of your existing page scripts
  assume they only ever run once per real page load (`DOMContentLoaded`,
  top-level script execution). Scripts scoped to non-persisted content need
  to rebind on the framework's post-transition lifecycle event instead, since
  a client-side transition doesn't re-fire `DOMContentLoaded`.

---

## Rules of thumb

- **One motion system, not per-component invention.** Duration/easing tokens
  defined once, referenced everywhere — see [Motion tokens](#motion-tokens).
- **Centering transform + animated transform is the #1 recurring bug.**
  Check every keyframe and every hover/active state against the
  [gotcha above](#️-the-transform-composition-gotcha) before shipping.
- **Reduced motion is a skip, not just a slow-down**, for anything
  cursor-driven or continuously looping. For simple transitions/keyframes,
  the blanket CSS override is enough.
- **Gate `:hover`-only decoration behind `(hover: hover) and (pointer: fine)`**
  so touch devices don't get a state stuck on after a tap. Leave `:active`
  (press feedback) ungated — that works correctly everywhere.
- **Pick one ambient/attention effect per section, not several at once.**
  A scanline sweep *and* a roaming spotlight *and* randomized flicker *and* a
  cursor tilt on the same scene reads as busy, not alive. Choose the one that
  best serves what that section is actually trying to say.
- **Motion should mean something where it can.** A hover that highlights a
  genuinely-related element elsewhere, a spotlight that visits real items in
  sequence — these read as more considered than the equivalent decoration
  with no underlying relationship, for roughly the same implementation cost.
