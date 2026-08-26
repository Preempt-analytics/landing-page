// Build-time helpers for the hero stat tiles. Reads the committed metrics.json
// (overwritten by CI). Nothing here runs in the browser.
import metrics from '../data/metrics.json';
import { DEFAULT_LOCALE, type Locale } from '../i18n';

type Meta = { source?: string; fetched_at?: string | null };

/** True only when CI has fetched genuinely live values from DagsHub MLflow. */
export function isLive(): boolean {
  return (metrics._meta as Meta)?.source === 'live';
}

/** Failure-recall of the current production binary model, as a rounded %. */
export function failureRecallPct(): number {
  return Math.round((metrics.binary_model?.metrics?.recall_test ?? 0) * 100);
}

/** Precision of the current production binary model, as a rounded %. Pairs
    with recall on the hero stat row: recall says "we catch most failures",
    precision says "and we don't cry wolf" — same already-fetched field
    (Contract 2), just not surfaced anywhere until now. */
export function failurePrecisionPct(): number {
  return Math.round((metrics.binary_model?.metrics?.precision_test ?? 0) * 100);
}

/** Brier score of the production binary model — mean squared error of its
    predicted probabilities, so it scores *how confident* the model was, not
    just whether the yes/no call was right. Lower is better; 0 is perfect.
    Returned raw (not rounded) because it lives in the third decimal place. */
export function brierScore(): number {
  return metrics.binary_model?.metrics?.brier_score ?? 0;
}

/** f1_train − f1_test for the production binary model: how much better it
    scores on data it trained on than on data it has never seen. */
export function overfitGap(): number {
  return metrics.binary_model?.metrics?.overfit_delta ?? 0;
}

/** "Misses about 1 in N failures", derived from recall so the prose can't
    drift away from the tile above it after a retrain. Returns null when recall
    is a perfect 100% — not hypothetical, versions 2–4 genuinely scored 1.000,
    and 1/0 would render "1 in Infinity". */
export function missesOneIn(): number | null {
  const missRate = 1 - (metrics.binary_model?.metrics?.recall_test ?? 0);
  if (missRate <= 0) return null;
  return Math.round(1 / missRate);
}

/** False alarms per 100 warnings, derived from precision. Same anti-drift
    reasoning as missesOneIn(). */
export function falseAlarmsPer100(): number {
  return Math.round((1 - (metrics.binary_model?.metrics?.precision_test ?? 0)) * 100);
}

/** How many times the production binary model has been retrained & promoted.
    MLflow version numbers increment monotonically with each registered
    version, so the current version number doubles as a retrain count —
    no new fetching needed, this field was already in metrics.json. */
export function retrainCount(): number {
  return Number(metrics.binary_model?.version ?? 0);
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

/** Human relative time ("2 days ago" / "vor 2 Tagen") from an ISO string,
    frozen at build time. Intl.RelativeTimeFormat (Second Law), not a
    hand-rolled template: English's "X ago" suffix and German's "vor X"
    prefix are different word orders, and German's plural forms don't follow
    English's simple singular/plural split — the platform already gets both
    right, including the phrase order flip, for free. */
export function relativeTime(iso: string | null, locale: Locale = DEFAULT_LOCALE): string {
  if (!iso) return locale === 'de' ? 'kürzlich' : 'recently';
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat(locale === 'de' ? 'de' : 'en', { numeric: 'always' });
  if (mins < 60) return rtf.format(-Math.max(mins, 1), 'minute');
  const hours = Math.round(mins / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  const days = Math.round(hours / 24);
  return rtf.format(-days, 'day');
}
