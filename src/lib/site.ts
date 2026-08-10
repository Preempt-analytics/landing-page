// Shared site constants. Single source of truth for links/copy reused across
// components — keeps the footer, nav, and CTAs from drifting apart.

/** Prefix an internal path with the configured base (e.g. "/landing-page"). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}

export const REPO_URL =
  'https://github.com/Preempt-Analytics-Demo/predictive-maintenance-demo';

export const TEAM = [
  { name: 'Nate', handle: '@envelopingCODE', url: 'https://github.com/envelopingCODE' },
  { name: 'Ivo', handle: '@undorigo', url: 'https://github.com/undorigo' },
];

export const PROGRAM = 'neuefische AI Engineering Bootcamp · Cohort 2026';

// The real-world dataset behind every failure-mode number/label on the site
// (Hero's TWF/PWF/HDF markers, the model's own training data) — credited once
// here, footer-only for now, so a future second reference can't drift onto a
// different URL/name for the same dataset.
export const KAGGLE_DATASET_URL =
  'https://www.kaggle.com/datasets/stephanmatzka/predictive-maintenance-dataset-ai4i-2020';
export const KAGGLE_DATASET_NAME = 'AI4I 2020 Predictive Maintenance Dataset';

// Nav order is settled in ARCHITECTURE.md §5 — do not re-litigate. Label on
// the first item changed 'Product' → 'Dashboard' (human-requested, 2026-08-07;
// ARCHITECTURE.md §5 updated to match in the same change).
// Points at its own subpage (not a homepage anchor) — see product.astro.
// The other four are anchors on the homepage itself, so they need the homepage's
// own path in front of the hash — a bare '#how-it-works' only works when you're
// already on the homepage; from any other page (e.g. /try-it-yourself) it tries
// to scroll to an id that doesn't exist on that page and silently does nothing.
const HOME = withBase('/');
export const NAV_LINKS = [
  { label: 'Dashboard', href: withBase('/product') },
  { label: 'How It Works', href: `${HOME}#how-it-works` },
  { label: 'Solutions', href: `${HOME}#solutions` },
  { label: 'Tech Stack', href: `${HOME}#tech-stack` },
  { label: 'Project & Team', href: `${HOME}#project-team` },
];
