---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-07-21 12:14 UTC
updated_by: Claude (planning session)
head_sha: 1f512e5
branch: main
status: yellow
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: yellow · branch main @ 1f512e5 (== origin, pushed)
Just did: wrote docs/ARCHITECTURE.md covering the hero section (stack choice, DagsHub data pipeline, merged hero design, hosting/security decisions)
DO NEXT: bring the next mockup(s) for the site's remaining sections and repeat the same review → merge-hybrid → commit-to-ARCHITECTURE.md cycle used for the hero. No Astro code exists yet — scaffolding is blocked on the open items below, not on more planning.
DON'T: reuse any credential from the ML repo's .env.demo/.dvc/config — mint fresh ones. Don't fetch metrics via the Python mlflow client — plain Node fetch() was chosen deliberately.
Blocked on: 4 open decisions only a human can make — see §4.
Ground truth: docs/ARCHITECTURE.md · run §5 verify commands before editing
```

---

## 1. Resume here

**Next action (concrete & executable):**
This project is still in the participatory-design / mockup phase, not the coding
phase. When the next mockup(s) for another section (nav sub-pages, features,
pricing, footer, etc.) arrive: (1) read them alongside the existing hero spec in
`docs/ARCHITECTURE.md` §5, (2) discuss/merge design direction the same
mockup-driven way the hero was done (see `design/mockups/` for the 10 screenshots
already gathered), (3) append a new numbered section to `ARCHITECTURE.md` — don't
start a separate doc. Only once a section's design is settled does it get built in
Astro.

If instead the next step is to start actual code: no Astro project has been
scaffolded yet (`package.json` doesn't exist). That work is gated on the open
items in §4 below, not on more design discussion — logo/photo/token decisions
affect what the scaffold can actually render correctly on first build.

**Settled — do NOT re-litigate:**
- Stack: Astro + Tailwind v4 (CSS-first, no `tailwind.config.mjs`). Rejected Next.js static export and plain HTML/CSS/JS — reasons in `ARCHITECTURE.md` §2.
- Metrics fetch: plain Node `fetch()` against MLflow's REST API, not the Python `mlflow` client — avoids a heavy dependency for two GET requests. `ARCHITECTURE.md` §4.
- One `deploy.yml` workflow (fetch + build + deploy), not two — GitHub's default `GITHUB_TOKEN` can't trigger a second push-based workflow. `ARCHITECTURE.md` §6.
- Hosting: this repo lives under the team's main account/org (`Preempt-analytics/landing-page`), deliberately separate from the ML repo's `Preempt-Analytics-Demo` account. `ARCHITECTURE.md` §7 item 4.
- Nav labels use `Tech stack` / `Project & team`, not generic `Resources` / `Company` — this is a capstone project site, not a generic SaaS.
- Stat-tile styling: all three tile values render the same off-white; teal is reserved for icons only — a deliberate deviation from the mockups, which colored values inconsistently.

## 2. What changed this session
- Wrote `docs/ARCHITECTURE.md` end-to-end for the hero section: stack decision, repo scaffold, DagsHub data pipeline, merged hero spec, deploy workflow — see `ARCHITECTURE.md` §1–§6.
- Investigated whether the ML repo already had a scheduled MLflow→JSON pipeline (it doesn't — only a one-time gate check inside `promote_model.py`, never persisted externally). Recorded in `ARCHITECTURE.md` §4.
- Decided hosting account (main account, not the ML repo's disposable demo account) after tracing the actual credential scope in the ML repo (`.env.demo`'s SSH key is repo-scoped, not account-wide — the real risk is account-level compromise + reputational blast-radius asymmetry, not that specific key). Added as `ARCHITECTURE.md` §7 items 4–6, including branch-protection and secret-scanning requirements.
- Clarified that GitHub-account hosting and DagsHub API access are fully decoupled, and traced exactly what makes a local `docker compose` demo run surface on the live dashboard (a full drift → export → `retrain.yml` → promote cycle — not just running the simulator). `ARCHITECTURE.md` §4.
- Revised nav labels from generic corporate placeholders to `Tech stack` / `Project & team`.

## 3. Un-recoverable context

- **Decision record — rejected because:** Next.js static export dropped because GitHub Pages forecloses the server features that justify React's runtime cost; plain HTML/CSS/JS dropped because Nav/Footer would have to be hand-copy-pasted across every future page. Full reasoning: `ARCHITECTURE.md` §2.
- **Decision record — rejected because:** a separate `refresh-metrics.yml` workflow was considered and dropped — pushes from the default `GITHUB_TOKEN` don't trigger other push-based workflows, so it was folded into one `deploy.yml`. `ARCHITECTURE.md` §6.
- **Landmine:** the cyberpunk mockup's "Trusted by…" logo strip (Advantage MFG, Northridge Industries, etc.) is **fabricated placeholder company names** — do not ship these as real customers. A truthful "Built with MLflow/DagsHub/XGBoost/..." strip was proposed as an alternative, not yet decided. `ARCHITECTURE.md` §5, §7 item 3.
- **Landmine:** never copy the DagsHub token or SSH key out of the ML repo's `.env.demo`/`.dvc/config`, even though those are intentionally disposable demo credentials over there (human explicitly confirmed this is by design, no alarm needed for that repo specifically) — this repo needs its own freshly minted, narrowly scoped credential regardless.
- **Human's stated preference this session:** wants a genuine hybrid of the two mockups — "corporate" mockup's copy/nav/CTA-label framing, "cyberpunk" mockup's imagery/color intensity/stat-tile row — not a pick-one-or-the-other choice. Also explicitly wants the dashboard's "live" numbers to be real DagsHub metrics, not fabricated ones (this shaped which stat tiles were marked live vs. static-illustrative in `ARCHITECTURE.md` §5).
- **Unresolved parallel-work note:** partway through this session, this repo was discovered to already have a GitHub remote (`Preempt-analytics/landing-page`), a README, a `design/mockups/` folder (10 screenshots — more than the 2 discussed in depth so far), and this handover template — added outside this session's own actions (by the human, directly, in parallel). Local and remote are confirmed in sync as of `head_sha` above; no conflict occurred, but it's worth confirming with the human whether other sessions/collaborators are actively working in this repo concurrently before assuming exclusive ownership of it.

## 4. Open questions — need a human, not a guess
- [ ] **Logo/icon** — the triangle/A mark in both mockups is itself a placeholder; no real logo file exists anywhere in the org.
- [ ] **Hero photo** — the macro-gears image needs sourcing (stock license) or generation; nothing exists yet.
- [ ] **Fake customer-logo strip** — omit it, or replace with a truthful "Built with" tech-stack strip?
- [ ] **Fresh DagsHub token** — needs minting (read-only scope if DagsHub's UI allows it) and adding as this repo's GitHub secret; also worth a 2-minute check of whether the DagsHub project is public (possibly allowing anonymous reads with no token at all).
- [ ] Confirm whether other people/sessions are concurrently editing this repo (see the parallel-work note in §3) so handovers don't collide.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin && git log --oneline -5    # current with remote?
git status                                   # anything uncommitted/unexpected?
# No package.json yet — nothing to build/run until the Astro project is scaffolded.
```
- **Branch / last-pushed SHA:** `main` @ `1f512e5` — confirmed matching `origin/main` at handoff time.
- **Uncommitted work:** none.
- **Canonical *why*:** [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)

---

## Protocol & guardrails

**Outgoing session** (before standup / lunch / EOD):
1. Update the frontmatter + context block + §1 next action at minimum.
2. `git commit -m "handover: <one line>"` → `git push`.

**Incoming session** (first message of the day):
> "`git pull`, read `claude-handover/claude-handover-doc.md`, run its §5 verify
> commands, then confirm the plan back to me before editing."

**Guardrails**
- **Single writer.** One person owns this file per handoff — coordinate, don't co-write.
- **Staleness guard.** If `updated` is >1 working day old, or `head_sha` ≠ `origin`, treat this file as stale — trust §5's live commands over anything written here.
- **Right-tier rule.** Durable *why* → `ARCHITECTURE.md`. History → `git log`. Only *current state + next action* → here.
