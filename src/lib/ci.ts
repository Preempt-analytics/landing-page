// Build-time helpers for GitHub Actions CI stats (fetched by
// scripts/fetch-ci-stats.mjs from the ML repo's public REST API — a separate
// source/contract from metrics.ts's DagsHub model metrics, kept in its own
// file rather than folded into metrics.ts for that reason).
import ciStats from '../data/ci-stats.json';

type Meta = { source?: string; fetched_at?: string | null };

/** True only when CI has fetched genuinely live values from GitHub's API. */
export function isCiLive(): boolean {
  return (ciStats._meta as Meta)?.source === 'live';
}

/** Total GitHub Actions runs across the ML repo. */
export function totalCiRuns(): number {
  return ciStats.total_runs ?? 0;
}

/** Most recent workflow run's start time, ISO string or null. */
export function lastCiRunAt(): string | null {
  return ciStats.last_run_at ?? null;
}
