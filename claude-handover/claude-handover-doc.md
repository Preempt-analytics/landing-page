---
type: claude-handover
schema: v1
project: <project-name>              # e.g. preempt-analytics-landing
updated: <YYYY-MM-DD HH:MM tz>       # freshness marker — see "Staleness guard"
updated_by: <name>                   # single writer per handoff
head_sha: <sha>                      # must equal origin/<branch> at handoff
branch: <branch>
status: green | yellow | red         # green=clean · yellow=mid-task · red=broken
---

# Claude Session Handover — Template & Starting Point

> **Purpose.** The *baton* passed between team members' Claude sessions so a
> cold session resumes with the context that git alone can't carry — the *why*,
> the rejected paths, and "where we were mid-thought."
>
> **Where this sits in the memory hierarchy** (context-engineering framing):
>
> | Tier | Store | Holds | Lifetime |
> |---|---|---|---|
> | 🔥 **Working / warm** | **this file** | current state + next action | **overwritten each handoff** |
> | 🧊 **Semantic / cold** | `docs/ARCHITECTURE.md` | durable *why* & design decisions | grows, permanent |
> | 🕓 **Episodic** | `git log` / PRs | the keystroke history | append-only, automatic |
>
> **This file's one job: page the right cold context back into a fresh window.**
> So it *points* into the other tiers — it never duplicates them. If you're
> copying design rationale in here, put it in `ARCHITECTURE.md` and link it.
> Keep this file lean: it is loaded into the next session's context budget every
> single handoff.

---

## 📋 Context block — paste this into the fresh session first

> The single highest-signal payload, ordered most-important-first. Curate it:
> if a line wouldn't change what the incoming session *does*, cut it. This block
> is the whole handover for a quick pickup — everything below is backup detail.

```
Project: <name> — <one-line what-it-is>
State: <status> · branch <branch> @ <sha> (== origin? yes/no)
Just did: <the 1 thing that changed since last handoff>
DO NEXT: <one concrete, executable action>
DON'T: <the settled thing not to re-open / the landmine>
Blocked on: <human decision or external dep, or "nothing">
Ground truth: docs/ARCHITECTURE.md · run §5 verify commands before editing
```

---

## 1. Resume here  ← most important section

**Next action (concrete & executable, not "continue X"):**
> e.g. *"Build `src/components/Nav.astro` per ARCHITECTURE.md §5. Scaffold
> doesn't exist yet — run `npm create astro@latest` first."*

**Settled — do NOT re-litigate or 'fix':**
- <thing that looks unfinished but is intentional>

## 2. What changed this session
*Outcomes/decisions, 3–6 bullets — not a diary (git log is the diary).*
- <decision + a pointer to where its reasoning lives, e.g. "Chose Astro — see ARCHITECTURE.md §2">

## 3. Un-recoverable context  ← the reason this file exists
*Not visible in git or code; a cold session cannot reconstruct it. Be generous.*
- **Decision record — rejected because…:** <alt considered + why dropped, so it isn't re-proposed>
- **Dead ends:** <"looks obvious, fails because Y — don't spend time on it">
- **Human's stated preference this session:** <tone / constraint / "they hate Z">
- **Landmines:** <"mockup has fabricated logos — do NOT ship, see ARCHITECTURE.md §5">

## 4. Open questions — need a human, not a guess
- [ ] <decision only the team can make — asset, direction, tradeoff>
- [ ] <blocked-on: waiting for token / mockup / approval from whom>

---

## 5. Ground truth — verify, don't trust this doc
*Prose drifts; commands don't. Incoming session runs these before touching anything.*

```bash
git fetch origin && git log --oneline -5    # current with remote?
git status                                   # anything uncommitted/unexpected?
# <build/dev/test command — does it still run?>   e.g. npm run build
```
- **Branch / last-pushed SHA:** <branch> @ <sha>  (must match `origin`)
- **Uncommitted work:** <none / stashed as `<name>` / described here>
- **Canonical *why*:** [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)

## 6. If status is 🔴 red — broken handoff
*Delete this section when green.*
- **Symptom:** <what's broken> · **Last known-good SHA:** <sha>
- **What I was mid-attempt when it broke:** <so the next session doesn't repeat it>

---

## Protocol & guardrails

**Outgoing session** (before standup / lunch / EOD):
1. Update the frontmatter + §0 context block + §1 next action at minimum.
2. `git commit -m "handover: <one line>"` → `git push`. The baton travels *with
   the repo* — it's on the other member's machine the moment they `git pull`.

**Incoming session** (first message of the day):
> "`git pull`, read `claude-handover/claude-handover-doc.md`, run its §5 verify
> commands, then confirm the plan back to me before editing."

**Guardrails**
- **Single writer.** One person owns the file per handoff — concurrent edits =
  merge conflicts on your own state. Coordinate, don't co-write.
- **Staleness guard.** If `updated` in the frontmatter is >1 working day old, or
  `head_sha` ≠ `origin`, treat this file as *stale* — trust §5's live commands
  over anything written here, and say so.
- **Right-tier rule.** Durable *why* → `ARCHITECTURE.md`. History → `git log`.
  Only *current state + next action* → here. Wrong tier = the doc rots.
- **Lean = usable.** This gets read into a context budget every handoff. If a
  section is empty, delete it rather than leaving `<placeholders>` behind.
