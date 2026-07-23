#!/usr/bin/env node
// Refresh live model metrics from DagsHub's MLflow REST API (ARCHITECTURE.md §4).
//
// Runs ONLY in CI. Writes src/data/metrics.json. Uses three raw GETs per model —
// no `mlflow` Python client, no heavy deps (Node's built-in fetch).
//
// NOTE: `model-versions/get-by-alias` 404s on DagsHub's MLflow proxy (confirmed
// live, with and without auth — DagsHub just hasn't implemented that route), so
// alias resolution goes through `registered-models/get`'s `aliases` array instead.
//
// FAILS OPEN: any error keeps the last-committed values and logs a warning, so a
// DagsHub outage or a missing token can never break the build or show `undefined%`.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/metrics.json');
const SAMPLE = resolve(__dirname, '../src/data/metrics.sample.json');

const TRACKING_URI =
  process.env.MLFLOW_TRACKING_URI ||
  'https://dagshub.com/Preempt-Analytics-Demo/predictive-maintenance-demo.mlflow';
const USERNAME = process.env.DAGSHUB_USERNAME || '';
const TOKEN = process.env.DAGSHUB_TOKEN || '';

// Fixed integration contract — matches how the ML repo treats these names.
const MODELS = {
  binary_model: 'predictive-maintenance-binary',
  multiclass_model: 'predictive-maintenance-multiclass',
};

function authHeaders() {
  const headers = { Accept: 'application/json' };
  if (USERNAME && TOKEN) {
    headers.Authorization =
      'Basic ' + Buffer.from(`${USERNAME}:${TOKEN}`).toString('base64');
  }
  return headers;
}

async function api(path, params) {
  const url = new URL(`${TRACKING_URI}/api/2.0/mlflow/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

async function fetchModel(registeredName) {
  const registered = await api('registered-models/get', {
    name: registeredName,
  });
  const aliasEntry = (registered.registered_model?.aliases ?? []).find(
    (a) => a.alias === 'production'
  );
  if (!aliasEntry) {
    throw new Error(`no 'production' alias set on ${registeredName}`);
  }

  const versionInfo = await api('model-versions/get', {
    name: registeredName,
    version: aliasEntry.version,
  });
  const version = versionInfo.model_version;
  const run = await api('runs/get', { run_id: version.run_id });
  const m = Object.fromEntries(
    (run.run?.data?.metrics ?? []).map((x) => [x.key, x.value])
  );
  return {
    name: registeredName,
    version: version.version,
    promoted_at: new Date(
      Number(version.last_updated_timestamp)
    ).toISOString(),
    metrics: {
      recall_test: m.recall_test,
      precision_test: m.precision_test,
      f1_test: m.f1_test,
    },
  };
}

function loadExisting() {
  const file = existsSync(OUT) ? OUT : SAMPLE;
  return JSON.parse(readFileSync(file, 'utf8'));
}

// Compare by value, not by JSON key order, so a hand-edited/reformatted
// metrics.json can't produce a false "changed" result.
function metricsEqual(a, b) {
  if (!a || !b) return false;
  return (
    a.version === b.version &&
    a.promoted_at === b.promoted_at &&
    a.metrics?.recall_test === b.metrics?.recall_test &&
    a.metrics?.precision_test === b.metrics?.precision_test &&
    a.metrics?.f1_test === b.metrics?.f1_test
  );
}

async function main() {
  const existing = loadExisting();
  const data = structuredClone(existing);
  let anyLive = false;
  let changed = false;

  for (const [key, registeredName] of Object.entries(MODELS)) {
    try {
      const fresh = await fetchModel(registeredName);
      anyLive = true;
      if (!metricsEqual(fresh, existing[key])) changed = true;
      data[key] = fresh;
      console.log(`✓ ${registeredName}: live metrics fetched`);
    } catch (err) {
      console.warn(
        `⚠ ${registeredName}: keeping last-committed values (${err.message})`
      );
    }
  }

  const source = anyLive ? 'live' : 'sample';
  if (source !== existing._meta?.source) changed = true;

  // Only touch fetched_at (and so only produce a commit-worthy diff) when a
  // value actually changed — this used to bump on every hourly CI run
  // regardless, which committed to main every hour for no real reason.
  if (!changed) {
    console.log('No metric changes — leaving metrics.json untouched.');
    return;
  }

  data._meta = {
    source,
    note: existing._meta?.note ?? '',
    fetched_at: new Date().toISOString(),
  };

  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`metrics.json written (source: ${data._meta.source}).`);
}

// Never fail the build.
main().catch((err) => {
  console.warn(`⚠ fetch-metrics failed, leaving metrics.json untouched: ${err.message}`);
  process.exit(0);
});
