// Shared assumptions behind the homepage's savings calculator
// (SavingsCalculator.astro) and the "days like this, every month" line it
// drives inside UserStory.astro's Overnight Impact card. Centralized so both
// components read one number instead of two inline constants that can
// quietly drift apart — same single-source-of-truth reasoning as site.ts.

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
    never render the same kind of number two different ways. */
export function formatEur(amount: number): string {
  return `€${Math.round(amount).toLocaleString('en-US')}`;
}
