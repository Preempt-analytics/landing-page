// Build-time helpers for the hero stat tiles. Reads the committed metrics.json
// (overwritten by CI). Nothing here runs in the browser.
import metrics from '../data/metrics.json';

type Meta = { source?: string; fetched_at?: string | null };

/** True only when CI has fetched genuinely live values from DagsHub MLflow. */
export function isLive(): boolean {
  return (metrics._meta as Meta)?.source === 'live';
}

/** Failure-recall of the current production binary model, as a rounded %. */
export function failureRecallPct(): number {
  return Math.round((metrics.binary_model?.metrics?.recall_test ?? 0) * 100);
}

/** Most recent promotion across both models, ISO string or null. */
export function lastPromotedAt(): string | null {
  const dates = [
    metrics.binary_model?.promoted_at,
    metrics.multiclass_model?.promoted_at,
  ].filter(Boolean) as string[];
  if (dates.length === 0) return null;
  return dates.sort().at(-1) ?? null;
}

/** Human relative time ("2 days ago") from an ISO string, frozen at build time. */
export function relativeTime(iso: string | null): string {
  if (!iso) return 'recently';
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
