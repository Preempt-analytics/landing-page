# The Preempt Protocol — How Our Ways of Working Evolved

*Compiled from git history across both repositories (`predictive-maintenance-demo`
and `preempt-analytics-landing`), `CLAUDE.md`'s own revision history, and the nine
dated handover docs from 2026-07-21 through 2026-08-07. Every citation below
resolves to a real commit or a real file in the working tree — nothing here is
reconstructed from memory.*

Predictive-maintenance-demo, the ML capstone, ran for months as ordinary commit
history — EDA notebooks, model families, a DVC pipeline — before anyone wrote
down a rule. The landing page repo started three weeks later with nothing but
ten mockup screenshots and a blank repo. Neither began with a "way of working."
Both grew one, the same way the product itself grew: by hitting something real,
writing down what it taught, and building the next session on top of that
instead of relearning it.

What follows is that history, organized in three parts: a timeline of how the
practice evolved, our own five learnings traced back to where they actually
came from, and four more patterns the history made visible that weren't in the
original notes.

---

## Part One — How the practice evolved

Ten stops, in order. Read as a sequence, the pattern is consistent: nothing was
drafted speculatively. Every standing rule below was written the same week as
the incident that made it necessary.

### 2026-07-01 · ML repo — No constitution, then a first one
Three hundred commits of pure modeling work — EDA, feature engineering, six
competing model families — precede any written rule. The first `CLAUDE.md`
lands the same day as an educational-comments standard and a commit-and-push
protocol. The earliest instinct is **"write down what good looks like,"** not
yet "prevent what goes wrong."
`7f383c6 claude.md` · `374fde7 comments law` · `6d4975a commit protocol`

### 2026-07-01 · ML repo — The externality that wrote a law
A five-seat **UXD/HCI virtual panel** audits the simulation scripts and finds
five real fixes — but the durable output is a new Standing Protocol,
*Downstream Effects & Pre-Push Verification*: "name every file, script, and
workflow that consumes what you just changed." This is the first rule written
directly from watching the model make an unreviewed change ripple somewhere
else, not from a hypothetical.
`9b02cc8 downstream-effects protocol`

### 2026-07-21 · Landing page — A second repo, kept deliberately lighter
The landing page begins in a pure participatory-design phase — no code, ten
screenshots, and the invention of `ARCHITECTURE.md` as a durable "why" ledger,
argued through section-by-section before a single Astro file exists. The first
handover doc's own rule: *"only current state and next action live here —
durable why goes in ARCHITECTURE.md, history stays in git log."*
`1f512e5` · `claude-handover/2026-07-21`

### 2026-07-22 · Landing page — Panel before pixels
A six-seat expert panel — UX, web systems, MLOps, content, accessibility,
target-user — reviews the whole design before v1 is built. Its accepted
findings (honest "sample metric" labelling, the two-verb CTA system, a
cross-cutting accessibility section) are written into `ARCHITECTURE.md` the
same day the site actually ships.
`192fc92 build v1`

### 2026-07-23 · Landing page — A constitution ported, not copied
A Windows-only dependency bug (`@rolldown/binding-*` missing on a fresh
install) is fixed the same day `CLAUDE.md` arrives on the landing page — and
the platform-agnosticism law is written straight from that bug. Its opening
line makes the method explicit: this constitution is **"scaled to that
reality, not copy-pasted from the ML repo's."**
`cb07d75` · `de41dfe CLAUDE.md landed`

### 2026-07-23 · Landing page — Two more incidents, two more protocols
A personal global `~/.npmrc` silently points a regenerated lockfile at a
China-hosted npm mirror; separately, a teammate's uncommitted edits are
discovered mid-session, live, in the same working tree. Both become named
Standing Protocols the same week: *Digital Sovereignty & Privacy*, and
*Multi-Instance Collaboration*.
`58a266f regenerate lockfile` · `744a747 two protocols`

### 2026-07-27 · Landing page — Aiming, and being aimed at
A five-seat panel — UX writer, image-gen specialist, prompt engineer, art
director, integration engineer — overhauls the image-asset spec. But the
session's real lesson runs the other way: the human catches the model's own
wrong assumption about an image generator's actual capabilities, and asks for
a live check before anything is built on it. Aiming isn't only the human
pointing the model at a direction — it's knowing when to make the model verify
itself.
`claude-handover/2026-07-27`

### 2026-07-28 · Landing page — A near-miss, handled by reading first
An external `git reset` silently discards a full turn of uncommitted edits
mid-session. Rather than re-deriving the lost work from memory, the session
reads the teammate's just-landed parallel commit first — and finds it already
solved the identical problem, independently, with a real photo already wired
in. The fix lands on *that* version instead of overwriting it. Verification
Artifact Hygiene is added as a protocol the same day.
`claude-handover/2026-07-28`

### 2026-08-04 · Landing page — Audit before you aim
Before one line of dashboard code is written, a full data audit maps every
real data source against every claim the mockup makes — producing an
explicit, checkable list: *"no RUL model exists in this project — don't ship
time-to-failure as real."* This is "aiming" turned into a repeatable step:
survey the terrain honestly before pointing the model at it.
`claude-handover/2026-08-04`

### 2026-08-05 – 08-06 · Landing page — Contracts, not just laws
As the dashboard, the live-machines replay, and per-panel switching all ship
for real, `CLAUDE.md` grows a new kind of rule — Integration Contracts —
tables naming exactly which fields are locked and which files break if they
drift unaccompanied. The constitution's shape changes with the codebase's
actual complexity, instead of being drafted ahead of it.
`abc2af6 sidebar shell` · `a7ba5b0 Contract 6`

### 2026-08-07 · Landing page — Distrust the screenshot
A raw headless-browser capture reports a mobile layout bug that turns out not
to exist. Real Playwright automation — measuring `scrollWidth`, forcing
genuine focus events on iOS Safari — replaces "eyeball a screenshot" as the
accepted standard of evidence, on the second time it happens.
`1991409 mobile audit`

---

## Part Two — What we learned

The five threads from our own notes, each traced back to where it actually
came from.

### 1. Prompt Engineering (global) — Scope the fence, not just the target
Every handover doc's context block carries an explicit **DON'T** line — and
it's often the highest-value sentence in the whole document. Telling the model
what to build is necessary; telling it what to leave alone is what actually
prevents the wasted round-trip.

> "Don't build a screen that shows time-to-failure — no RUL model exists in
> this project, it cannot be backed."
> — `claude-handover/2026-08-04`

### 2. Prompt Engineering (project) — Aiming works both directions
Domain knowledge is what lets you point the model at a fruitful direction
before firing — the data audit that turned "94% fleet health" into "misses 1
in 6 failures, and here's the number" is aiming in its purest form. But the
sharpest instance of aiming this project produced was the human catching the
*model's own* unverified assumption and sending it back to check a live
source first.

> "The human pushed back and asked me to search before assuming."
> — `claude-handover/2026-07-27`

### 3. AI harness / constitution doc — Write the rule at the point of the incident
Not one Standing Protocol in either repo was drafted speculatively. The
downstream-effects rule, the npm-mirror rule, the multi-instance rule — each
reads as a direct answer to something that actually happened that week. And
porting a constitution between repos meant rewriting it, not copying it:
rules scaled to this repo's real coupling, never to the sibling's.

> "Scaled to that reality, not copy-pasted from the ML repo's CLAUDE.md."
> — `CLAUDE.md`, preamble

### 4. Virtual panel — Borrowed judgment, before code exists
Three separate panels, three different rosters — a UXD/HCI pair in the ML
repo, a six-seat expert panel for the landing page's v1, a five-seat panel for
the image-asset overhaul — but one throughline: critique happens *before*
building, and its findings get written into a durable doc, not just spoken
aloud and forgotten by the next session.

> "Ran a 5-persona virtual panel audit... before the overhaul."
> — `claude-handover/2026-07-27`

### 5. Systems thinking — From one paragraph to eight numbered contracts
The Downstream Effects protocol was a single paragraph on 2026-07-01. By
2026-08-07 it had grown into eight Integration Contracts, each with an
explicit "if changed without updating dependents" column. The rule didn't
just get followed — it compounded, turning into structure the moment the
codebase got complex enough to need it.

> "Claude became much better at flagging when changes in one part could have
> negative effects in another."
> — team notes

---

## Part Three — Also worth keeping

Four more patterns the history made visible, not yet written into the
original notes.

**Memory by half-life.** Three documents, three different rates of change:
`CLAUDE.md` (rules, changes rarely), `ARCHITECTURE.md` (design "why",
append-only), and dated handover docs (current state, newest wins, superseded
within a day). Splitting memory by how fast it goes stale — rather than
keeping one growing doc — is what let nine sessions hand off cleanly without
re-deriving context each time. *(Source: every handover doc's closing
"Right-tier rule.")*

**Distrust your own screenshot.** Twice, a raw headless-browser capture
reported a bug that real automation then disproved — once from a viewport
that silently rendered wider than requested, once from a screenshot taken
before scroll-triggered animations had a chance to fire. The fix wasn't "test
more," it was "corroborate any screenshot against a measurement before
trusting it." *(Source: `claude-handover/2026-08-05`, `2026-08-07`.)*

**Concurrent editing as the normal case.** With two teammates and a standing
AI collaborator all committing to the same `main`, "assume a live session
owns any uncommitted change; ask before touching it" was tested for real more
than once — a conflicting stash was deliberately left unresolved rather than
guessed at — and held every time. *(Source: `claude-handover/2026-08-07`,
§2.)*

**Honesty as a locked design constraint.** Live vs. sample metrics,
"Illustrative example" captions, the "Dashboard preview" badge on every
fabricated concept screenshot — the discipline of never letting an invented
number read as a real one shows up in almost every session, and is one of the
few rules that never needed a second incident to get taken seriously.
*(Source: `CLAUDE.md`, Danger Zones.)*
