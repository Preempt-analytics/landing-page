---
type: claude-handover
schema: v1
project: preempt-analytics-landing
updated: 2026-07-22 (build session — landing-page v1 implemented)
updated_by: Claude (design → build session)
head_sha: 192fc92
branch: main
status: yellow
---

# Claude Session Handover

## 📋 Context block — paste this into the fresh session first

```
Project: preempt-analytics-landing — public marketing site for Preempt Analytics (predictive-maintenance ML capstone)
State: yellow · branch main @ 192fc92 (+ this handover commit on top), pushed to origin.
Just did: BUILT landing-page v1 end-to-end (Astro + Tailwind v4) from docs/ARCHITECTURE.md — full homepage (7 sections) + Try-It-Yourself subpage + live-metrics pipeline + deploy workflow. `npm run build` passes; both routes verified 200 with correct base paths and honest sample-metric labels. Earlier today: refined the below-fold plan with real ML-repo README content, ran an expert panel audit, and folded accepted findings into ARCHITECTURE.md.
DO NEXT: (1) human visual review via `npm run dev`; (2) enable GitHub Pages + add DagsHub secrets so deploy goes green and live metrics replace sample data; (3) verify/fix the DagsHub MLflow endpoint (anonymous read 404'd — see §3); then iterate on review feedback + source open assets.
DON'T: add a Google Fonts <link> (deliberate no-third-party/GDPR stance, §12 — self-host if needed). Don't hardcode root-absolute internal links (base=/landing-page — use withBase()). Don't embed the ML repo's Retraining Loop.png raster (§9.6 is a rebuilt SVG by design). Don't copy any DagsHub credential from the ML repo — mint fresh.
Blocked on: human setup (Pages + fresh token) + asset sourcing — see §4. None block local dev/build.
Ground truth: docs/ARCHITECTURE.md · run §5 verify commands before editing.
```

---

## 1. Resume here

**Next action (concrete & executable):**
1. **Visual review.** `npm install && npm run dev` → open `http://localhost:4321/landing-page/`.
   This is the first *human* look at the rendered site; the build is verified but
   the pixels haven't been eyeballed by a person. Note anything to adjust.
2. **Make the deploy go green** (currently red until configured): GitHub
   **Settings → Pages → Source → "GitHub Actions"**, then add repo secrets
   `DAGSHUB_USERNAME` + `DAGSHUB_TOKEN` (token minted **fresh** for this repo) and
   variable `MLFLOW_TRACKING_URI`. Until then the site correctly ships **sample**
   metrics (labelled "sample metric," never faked as live).
3. **Verify the MLflow endpoint** — see the §3 landmine: the anonymous read of
   `model-versions/get-by-alias` returned HTTP 404 "unsupported endpoint." Confirm
   whether it works *with* a token; if DagsHub's MLflow proxy doesn't support that
   path, adjust `scripts/fetch-metrics.mjs`. It fails open, so nothing breaks
   meanwhile — but live numbers won't appear until this is sorted.
4. Then iterate on review feedback and source the open assets (§4).

**Settled — do NOT re-litigate:**
- Stack, structure, hosting, live-metrics-via-fetch, one deploy workflow — all as
  in `ARCHITECTURE.md` §2–§6 and the two prior handovers.
- Two-verb CTA system (`See it in action` = look → `#product`; `Test it on your
  device` = do → `/try-it-yourself`). §5.
- Two loops kept: §9.3 birds-eye (no tool logos) vs §9.6 technical (with stack,
  positioned late) — "one system, two zoom levels."
- Honest framing everywhere: capstone-showcase footer, `Illustrative example`
  label on the user-story numbers, `sample metric` on non-live tiles, honest
  `Automated / Reproducible / Monitored / Open-source stack` claim strip (NOT the
  mockup's "Enterprise ready / Scalable").
- Dark-only, no analytics/tracking, `prefers-reduced-motion` honored — §12.

## 2. What changed this session (the whole of 2026-07-22)
- **Planning refinement:** reviewed all 11 mockups (incl. the easily-missed
  `ChatGPT Image…png` dashboard), resolved CTA routing, and pulled **real content**
  from the ML repo's `README.md` into `ARCHITECTURE.md` §9 (repo URL + docker
  commands, team, `preempt.sh` menu, the real pipeline for §9.6's diagram).
- **Expert panel audit** (UX / web-systems / MLOps / content / a11y / target-user)
  run and its accepted findings folded into `ARCHITECTURE.md`: two-verb CTAs,
  honest claim strip, `Illustrative example` microcopy, concept-preview cue,
  menu-first Try-It, and a new **§12 cross-cutting build standards** (responsive,
  reduced-motion, alt-text, focus, dark-only, no-analytics). Deferred items
  (audience signposting, deep ARIA, "get in touch") recorded in §12.
- **BUILT v1** (commit `192fc92`): Astro + Tailwind v4 scaffold; `BaseLayout`,
  `Nav` (mobile menu), `Footer`, `Button`, `Logo`, `StatCard/StatRow`, `Hero`,
  and all six section components (`ProductPreview`, `LiveFactory`, `HowItWorks`,
  `Benefits`, `UserStory`, `MlopsSystem`); `index.astro` + `try-it-yourself.astro`;
  `scripts/fetch-metrics.mjs` + `metrics.json`/`metrics.sample.json`;
  `.github/workflows/deploy.yml`; project README.
- **Verified:** `npm run build` passes; dashboard PNG auto-optimized to WebP
  (1.6MB → 31–123KB); both routes serve 200; base paths, section anchors, and
  honest sample/illustrative labels all confirmed in the built HTML.

## 3. Un-recoverable context

- **Landmine — DagsHub MLflow endpoint 404.** An anonymous GET to
  `…​.mlflow/api/2.0/mlflow/model-versions/get-by-alias?...` returned **HTTP 404
  "unsupported endpoint, please contact support@dagshub.com."** So (a) there's no
  anonymous-read shortcut, and (b) it's **unconfirmed** that DagsHub's MLflow proxy
  supports this exact REST path even *with* auth — the `ARCHITECTURE.md` §4
  endpoints were taken from MLflow's generic REST docs, not tested against DagsHub.
  `fetch-metrics.mjs` fails open (keeps sample values), so this never breaks the
  build — but before expecting live numbers, test the path with a real token and
  adjust the script if DagsHub uses a different route.
- **Intentional placeholders shipped (not bugs):** text-wordmark + triangle-SVG
  logo (no real logo yet); hero is a navy→teal gradient panel (no macro-gears
  photo); §9.1 Product Preview is a static screenshot + "Concept preview" badge
  (in-action clip pending); §9.2 factory is a stylized SVG, not photoreal.
- **§9.6 diagram is a rebuilt SVG, on purpose.** The ML repo's tool-branded
  `Retraining Loop.png` was deliberately NOT copied in (align-don't-copy, §11).
  Tool names render as text chips, not brand logos — real logos (Simple Icons) are
  a documented polish item, not an oversight.
- **Fonts are a system stack, deliberately** — no Google Fonts, to honor the
  no-third-party/GDPR stance (§12). Self-host if a custom font is wanted; do not
  add a remote `<link>`.
- **`base: '/landing-page'`** — internal links go through `withBase()` /
  `import.meta.env.BASE_URL` (`src/lib/site.ts`). Root-absolute internal hrefs
  will 404 on the deployed Pages site.
- **`metrics.json` is committed and CI-overwritten;** `metrics.sample.json` is the
  never-overwritten seed. Both currently hold the same sample values.
- **Handover convention confirmed:** dated files, newest wins; the old generic
  `claude-handover-doc.md` is deleted. This 2026-07-22 file is the day's finalized
  handover (it superseded an earlier same-day draft that covered only the planning
  half — that draft was never committed).

## 4. Open questions — need a human, not a guess
- [ ] **Pages + fresh DagsHub token** — enable Pages (Actions source); mint a
      read-only token FRESH for this repo (never copy the ML repo's) and add
      secrets/vars. (`ARCHITECTURE.md` §7 items 4.)
- [ ] **MLflow endpoint** — verify/adjust per the §3 404 finding.
- [ ] **Open assets** — real logo, hero macro-gears photo, the §9.1 in-action
      clip, and a photoreal §9.2 factory. Source or keep placeholders.
- [ ] **Sophie de Vries persona** in the dashboard screenshot — crop/blur or leave
      (current recommendation: leave). `ARCHITECTURE.md` §7 item 10.
- [ ] **Branch protection on `main`** — the workflow auto-deploys on every push;
      add a PR gate before wider release. §7 item 5.
- [ ] Real logos for §9.6 tool chips (Simple Icons) — polish, optional.

---

## 5. Ground truth — verify, don't trust this doc

```bash
git fetch origin && git log --oneline -5   # tip = this handover commit atop 192fc92?
git status                                  # clean after push?
npm install && npm run build                # must pass (Node 22+; Node 25 works locally)
npm run dev                                  # visual review → http://localhost:4321/landing-page/
# Routes: /landing-page/  and  /landing-page/try-it-yourself/
```
- **Branch / build commit:** `main` @ `192fc92` (+ handover commit on top),
  pushed to `origin`.
- **Build:** passes; 2 pages; dashboard optimized to WebP.
- **Uncommitted work:** none after push.
- **Canonical *why*:** [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — now 12
  sections incl. §12 cross-cutting standards.

---

## Protocol & guardrails

**Outgoing session** (before standup / lunch / EOD):
1. Update frontmatter + context block + §1 next action.
2. Create a **new dated** handover (`YYYY-MM-DD-…`) — never overwrite prior days'.
3. `git commit` → `git push`.

**Incoming session** (first message of the day):
> "`git pull`, read the latest dated `claude-handover/…-claude-handover-doc.md`,
> run its §5 verify commands, then confirm the plan back to me before editing."

**Guardrails**
- **Single writer.** One owner per handoff — coordinate.
- **Staleness guard.** If `updated` >1 working day old or `head_sha` ≠ `origin`,
  trust §5's live commands over anything written here.
- **Right-tier rule.** Durable *why* → `ARCHITECTURE.md`. History → `git log`.
  Only *current state + next action* → here.
