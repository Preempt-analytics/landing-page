---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-07-23 (governance session — CLAUDE.md + platform-agnostic hardening)
updated_by: Claude (governance → cross-platform fix session)
head_sha: 3a1039e
branch: main
status: green
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: green · branch main @ 3a1039e, pushed to origin. Build passes (npm run build verified after every change below).
Just did: wrote CLAUDE.md (Laws/Contracts/Danger-Zones/Quick-ref, scaled from the ML repo's pattern); merged it with a real conflicting CLAUDE.md a teammate (Nate, envelopingCODE) pushed independently after hitting a genuine Windows bug; adopted his lockfile fix (rolldown-vite chain was missing the Windows native binary — mine had drifted onto it too); ran a full platform-agnostic audit and closed the two gaps it found (.gitattributes, package.json engines); fixed fetch-metrics.mjs committing to main every hour for no real reason.
DO NEXT: no code is blocked. Human should: (1) skim CLAUDE.md — first real cross-session review since teammates are now actively editing this repo too; (2) confirm Nate is aware his original throwaway CLAUDE.md got merged into the fuller one, not silently discarded; (3) continue whatever landing-page content/section work was in progress.
DON'T: don't try to "clean up" the ~10 existing "chore: refresh live model metrics" commits already in history — that's a rewrite of shared history nobody asked for; the fix only stops new noise. Don't assume you're the only one pushing to main — this session hit two live collisions with a teammate's session in about an hour.
Blocked on: nothing code-related. Still open: DagsHub MLflow endpoint 404 (unconfirmed even with a token), hero photo, real logo — all pre-existing, unrelated to today.
Ground truth: CLAUDE.md (now the standing-rules doc) + docs/ARCHITECTURE.md (the design *why*) · run §5 verify commands below before editing.
```

---

## 1. Resume here

**Next action (concrete & executable):** nothing is blocked. If picking this up
cold: skim `CLAUDE.md` (new since 2026-07-22, and already merged with a
teammate's independent edit once — see §3), then continue whatever
landing-page section/content work is next per `docs/ARCHITECTURE.md`'s roadmap.

**Settled — do NOT re-litigate:**
- Everything from the 2026-07-22 handover (stack, section design, hero CTAs,
  two-loop system, honest claim strip, dark-only, no-analytics).
- `CLAUDE.md` exists at repo root and is the standing-rules doc (Laws →
  Integration Contracts → Pre-Change Checklist → Danger Zones →
  Component Quick-Reference), scaled down from the ML repo's version — not a
  copy of it. Commit discipline is explicitly **batched**, not the ML repo's
  "commit after every change" (a deliberate, discussed deviation).
- **Platform-agnosticism is a first-class standing rule now**, not just a
  nice-to-have: `CLAUDE.md`'s "Standing Protocol — Platform Agnosticism" +
  matching Danger Zones entries. `.gitattributes` (LF everywhere) and
  `package.json`'s `engines: { node: ">=22" }` are both in place.
- `fetch-metrics.mjs` only writes/commits `metrics.json` when a value actually
  changed — no more hourly no-op commits to `main`.

## 2. What changed this session
- **Wrote `CLAUDE.md`** from scratch: 3 Laws (Intent Fidelity, Outcome
  Integrity, Elegant Sufficiency) + Standing Protocols (Platform Agnosticism,
  Transparency, Comments, Commit Discipline, Pre-Push Verification) + Meta-Law,
  4 Integration Contracts specific to this repo (`site.ts`, `metrics.json`
  shape, base path, design tokens), a Pre-Change Checklist, Danger Zones, and a
  Component Quick-Reference — adapted from the ML repo's `CLAUDE.md` pattern
  but scaled to a single static site instead of a 5-component coupled system.
- **Iterated on it with the human** twice: clarified and then rewrote the First
  Law's "fails open" reasoning to state *why* (the live outcome matters, live
  metrics are a bonus on top — not the reverse); widened the Comments protocol
  from "why-only" to "brief educational signposts," still short, not the ML
  repo's mandatory two-layer version.
- **Collided with a teammate's parallel session — twice, both resolved
  live, nothing lost:**
  1. A stray `src/styles/global.css` → `/styles/global.css` move surfaced in
     someone else's session dialog (a screenshot the human showed me); traced,
     confirmed unaffected here, advised "Restore to `src/styles/`" (matches
     `CLAUDE.md` Contract 4, which was already written by that point).
  2. A real push collision: origin had 9 automated metrics-bot commits plus one
     **real commit from Nate (`envelopingCODE`)** — he'd independently hit a
     genuine Windows bug (`npm run dev` failing with `Cannot find native
     binding` / `@rolldown/binding-*`) and pushed his own from-scratch
     `CLAUDE.md` plus a lockfile fix. Rebased, merged both `CLAUDE.md`s by hand
     (kept my structure, folded his battle-tested findings — the exact
     PowerShell 5.1 `&&`-chaining failure, the npm optional-deps native-binding
     bug, [npm/cli#4828](https://github.com/npm/cli/issues/4828) — into the
     Platform Agnosticism protocol and Danger Zones), and took his
     `package-lock.json` wholesale rather than hand-merging a generated file.
- **Verified the adopted fix for real**, not just trusted the diff: `rm -rf
  node_modules && npm ci && npm run build` — 295 packages (vs 303 before,
  dropped the whole rolldown chain), 0 "rolldown" hits in the new lockfile,
  clean build.
- **Ran a full platform-agnostic audit** of everything built 2026-07-22 at the
  human's request (their teammate is on Windows): checked `package.json`
  scripts for shell-specific syntax, `fetch-metrics.mjs`'s path handling, every
  relative import's case against the actual filesystem, and the
  `try-it-yourself.astro` command blocks. All clean *except* the lockfile
  (already fixed above). Found two real gaps and closed both:
  - Added `.gitattributes` — normalizes every text file to LF regardless of a
    contributor's local `core.autocrlf`; explicit `binary` markers for images.
    Ran `git add --renormalize .` (found nothing to change — repo was already
    all-LF).
  - Added `"engines": { "node": ">=22" }` to `package.json`, matching what
    `README.md`/`deploy.yml` already required but never declared.
- **Fixed a real, live bug in `fetch-metrics.mjs`**: `_meta.fetched_at` was
  stamped with `new Date()` on every CI run regardless of whether any metric
  value changed, so `deploy.yml`'s "commit if changed" step always saw a diff
  and committed — hourly, forever, evidenced by the ~10 "chore: refresh live
  model metrics" commits already in history. Added a `metricsEqual()`
  value-comparison and an early return when nothing meaningful changed;
  verified locally (`npm run fetch-metrics` → correctly fails open on the
  still-unresolved DagsHub 404, correctly leaves `metrics.json` byte-identical,
  `git status` shows no diff).

## 3. Un-recoverable context

- **This repo now has active concurrent editors beyond this session.** Nate
  (`envelopingCODE`) is pushing real commits directly to `main`, not just
  running a parallel Claude session that mirrors this one. Every push this
  session needed a `git fetch && git rebase` first, and one needed a real
  content merge, not just a mechanical replay. **Always fetch before pushing;
  never assume `main` hasn't moved.**
- **Nate's original `CLAUDE.md` was not discarded, it was merged in** — his
  Platform Agnosticism findings (the `&&`/PowerShell 5.1 bug, the
  rolldown-vite native-binding bug + npm issue link) are now inside this
  session's fuller `CLAUDE.md` under "Standing Protocol — Platform
  Agnosticism" and in Danger Zones. If he looks for his original short version
  and doesn't find it standalone, point him at those sections — the content
  survived, the file didn't stay separate.
- **The rolldown-vite lockfile bug was real and already live in the committed
  lockfile** (not hypothetical) — my own `npm install` from the 2026-07-22
  build session had drifted onto it too (53 "rolldown" references in that
  lockfile, confirmed by grep). It would have broken `npm run dev`/`build` for
  any Windows contributor pulling `main` before Nate's fix landed. Worth
  remembering as a concrete argument for why the Platform Agnosticism protocol
  isn't theoretical.
- **`~/predictive-maintenance-demo` (the ML repo) is where Nate's GitHub
  handle and the "Windows teammate" context come from** — confirmed via that
  repo's own `README.md` "Team" table, already the source for this repo's
  footer content (see the 2026-07-22 handover).
- **Existing bot-commit history (~10 "chore: refresh…" commits) was left
  alone on purpose.** The fix stops *new* no-op commits; it does not rewrite
  history. Don't be tempted to squash/clean these later without asking — it's
  shared branch history now, with a second active committer.
- **Nothing was force-pushed.** Every collision this session was resolved with
  `git fetch` + `git rebase` (clean, or hand-resolved on real conflicts) +
  a normal push. No `--force` used anywhere.

## 4. Open questions — need a human, not a guess
- [ ] Let Nate know his `CLAUDE.md` was merged, not overwritten (see §3) —
      purely a courtesy heads-up, not a technical blocker.
- [ ] Carried over, unchanged from 2026-07-22: DagsHub MLflow endpoint 404
      (unconfirmed whether it works even with a real token — test once
      `DAGSHUB_TOKEN` is actually set), hero macro-gears photo, real logo/icon,
      §9.1's in-action clip, Pages/branch-protection setup.
- [ ] Nothing new and platform-agnostic-related is outstanding — the audit
      this session was thorough and closed what it found.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin && git log --oneline -5     # tip = 3a1039e or later?
git status                                    # clean?
rm -rf node_modules && npm ci && npm run build   # must pass; watch package count (~295, not ~303)
grep -c rolldown package-lock.json            # expect 0
npm run fetch-metrics                         # expect "No metric changes" + git status clean after
```
- **Branch / commit:** `main` @ `3a1039e`, pushed to `origin`.
- **Build:** passes. Lockfile confirmed clean of the rolldown chain.
- **Uncommitted work:** none.
- **Canonical *why*:** [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) (design)
  + [`CLAUDE.md`](../CLAUDE.md) (standing engineering rules, new this session).

---

## Protocol & guardrails

**Outgoing session** (before standup / lunch / EOD):
1. Update frontmatter + context block + §1 next action.
2. Create a **new dated** handover (`YYYY-MM-DD-…`) — never overwrite prior days'.
3. `git fetch` first — this repo now has more than one active committer.
4. `git commit` → `git push` (rebase onto any new remote commits first).

**Incoming session** (first message of the day):
> "`git pull`, read the latest dated `claude-handover/…-claude-handover-doc.md`,
> read `CLAUDE.md`, run the §5 verify commands, then confirm the plan back to
> me before editing."

**Guardrails**
- **Single writer** *for this file* — but not for the repo anymore (see §3).
  Coordinate the handover doc; expect `main` itself to move between sessions.
- **Staleness guard.** If `updated` >1 working day old or `head_sha` ≠ `origin`,
  trust §5's live commands over anything written here.
- **Right-tier rule.** Durable *design why* → `ARCHITECTURE.md`. Durable
  *engineering rules* → `CLAUDE.md`. History → `git log`. Only *current state +
  next action* → here.
