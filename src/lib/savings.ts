// Shared assumptions behind the homepage's savings calculator
// (SavingsCalculator.astro) and the "days like this, every month" line it
// drives inside UserStory.astro's Overnight Impact card. Centralized so both
// components read one number instead of two inline constants that can
// quietly drift apart — same single-source-of-truth reasoning as site.ts.
import { DEFAULT_LOCALE, type Locale } from '../i18n';

/** UserStory.astro's one-night example. Defined here, not just inline in
    that component, so the calculator can reference the exact same figure
    when it says "≈ N days like this, every month." ("Days", not "nights" —
    the thing being counted is a prevented-failure event, not something that
    only happens at night.) */
export const OVERNIGHT_IMPACT_EUR = 24_300;

export const SAVINGS_SLIDER = {
  min: 1_000,
  max: 50_000,
  step: 500,
  default: 15_000,
} as const;

/** Illustrative monthly savings: the production model's own live recall rate
    (src/lib/metrics.ts, Contract 2) applied directly to the visitor's
    monthly unplanned-downtime cost — the share of failures the model
    currently catches in advance is treated as the share of that cost
    avoided. Deliberately no second, invented multiplier stacked on top of
    the one real number — same one-number honesty as UserStory's Overnight
    Impact card. Still an estimate, not a quote (see the calculator's own
    InfoTip disclosure). */
export function estimateMonthlySavings(monthlyCostEur: number, recallPct: number): number {
  return monthlyCostEur * (recallPct / 100);
}

/** "€12,345"-style formatting, shared so the calculator and UserStory's card
    never render the same kind of number two different ways. Locale-aware via
    Intl.NumberFormat (Second Law: the platform already knows German's
    period-thousands/comma-decimal convention and post-number € placement —
    hand-rolling a second currency formatter would just be a second place to
    get it wrong). SavingsCalculator.astro's client-side `fmt()` mirrors this
    exact call for its live-drag updates; keep the two in sync if this ever
    changes. */
export function formatEur(amount: number, locale: Locale = DEFAULT_LOCALE): string {
  const intlLocale = locale === 'de' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/** Illustrative €-to-trees ratio for the calculator's "trees saved" figure
    (human-requested, 2026-08-07) — unlike estimateMonthlySavings above, this
    one has no real production number to anchor to (this project's model
    predicts failures, not energy/carbon), so it's a deliberately round,
    easy-to-explain illustrative comparison rather than a chain of invented
    intermediate stats (kWh avoided, grid carbon intensity, etc. stacked on
    top of each other would each need their own justification and just move
    the honesty problem around instead of solving it). Loosely grounded in
    two widely-cited public figures — a mature tree absorbs roughly 21kg CO2
    per year, and unplanned industrial downtime commonly correlates with
    wasted energy (idle machines, restart surges, scrapped material) — but
    treat this as "roughly the scale of," not a carbon-accounting result.
    Always disclosed as illustrative next to where it's shown, same as the
    Overnight Impact card's own €24,300 example. */
export const EUR_PER_TREE_EQUIVALENT = 1_500;

/** Annual, not monthly — "2.3 trees saved per month" reads oddly (trees are
    naturally an annual/CO2-per-year comparison), where "28 trees a year"
    reads the way sustainability figures normally get communicated. */
export function estimateTreesSaved(monthlySavingsEur: number): number {
  const annualSavings = monthlySavingsEur * 12;
  return annualSavings / EUR_PER_TREE_EQUIVALENT;
}
