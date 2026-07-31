#!/usr/bin/env node
// Refresh live GitHub Actions stats from the ML repo's public REST API
// (Preempt-Analytics-Demo/predictive-maintenance-demo — the repo
// src/lib/site.ts's REPO_URL points at, not this landing-page repo).
//
// Runs ONLY in CI. Writes src/data/ci-stats.json. No auth required for public
// repo read access; GITHUB_TOKEN (auto-provided in every Actions run, no repo
// secret to configure) is passed through only to raise the unauthenticated
// 60-req/hour rate limit, the same "optional defense-in-depth" spirit as
// DAGSHUB_TOKEN in fetch-metrics.mjs.
//
// FAILS OPEN: any error keeps the last-committed values and logs a warning, so
// a GitHub API outage or rate limit can never break the build or show
// `undefined` (mirrors fetch-metrics.mjs's contract exactly — see that file's
// header before changing either).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/ci-stats.json');
const SAMPLE = resolve(__dirname, '../src/data/ci-stats.sample.json');

const OWNER = 'Preempt-Analytics-Demo';
const REPO = 'predictive-maintenance-demo';
const TOKEN = process.env.GITHUB_TOKEN || '';

function loadExisting() {
  const file = existsSync(OUT) ? OUT : SAMPLE;
  return JSON.parse(readFileSync(file, 'utf8'));
}

async function main() {
  const existing = loadExisting();

  const headers = { Accept: 'application/vnd.github+json' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs?per_page=1`,
    { headers }
  );
  if (!res.ok) throw new Error(`actions/runs → HTTP ${res.status}`);
  const body = await res.json();
  const latest = body.workflow_runs?.[0];
  if (!latest) throw new Error('no workflow runs returned');

  const fresh = {
    total_runs: body.total_count,
    last_run_at: latest.created_at,
    last_run_status: latest.conclusion || latest.status,
  };

  const changed =
    fresh.total_runs !== existing.total_runs ||
    fresh.last_run_at !== existing.last_run_at;

  if (!changed) {
    console.log('No CI stat changes — leaving ci-stats.json untouched.');
    return;
  }

  const data = {
    _meta: {
      source: 'live',
      note: existing._meta?.note ?? '',
      fetched_at: new Date().toISOString(),
    },
    ...fresh,
  };

  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`ci-stats.json written (${fresh.total_runs} runs, source: live).`);
}

// Never fail the build.
main().catch((err) => {
  console.warn(`⚠ fetch-ci-stats failed, leaving ci-stats.json untouched: ${err.message}`);
  process.exit(0);
});
