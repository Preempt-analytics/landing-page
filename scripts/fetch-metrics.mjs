#!/usr/bin/env node
// Refresh live model metrics from DagsHub's MLflow REST API (ARCHITECTURE.md §4).
//
// Runs ONLY in CI. Writes src/data/metrics.json. Uses two raw GETs per model —
// no `mlflow` Python client, no heavy deps (Node's built-in fetch).
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
  const alias = await api('model-versions/get-by-alias', {
    name: registeredName,
    alias: 'production',
  });
  const version = alias.model_version;
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

async function main() {
  const data = loadExisting();
  let anyLive = false;

  for (const [key, registeredName] of Object.entries(MODELS)) {
    try {
      data[key] = await fetchModel(registeredName);
      anyLive = true;
      console.log(`✓ ${registeredName}: live metrics fetched`);
    } catch (err) {
      console.warn(
        `⚠ ${registeredName}: keeping last-committed values (${err.message})`
      );
    }
  }

  data._meta = {
    source: anyLive ? 'live' : 'sample',
    note: data._meta?.note ?? '',
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
