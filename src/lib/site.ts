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

// Nav order is settled in ARCHITECTURE.md §5 — do not re-litigate.
// 'Product' points at its own subpage (not a homepage anchor) — see product.astro.
// The other four are anchors on the homepage itself, so they need the homepage's
// own path in front of the hash — a bare '#how-it-works' only works when you're
// already on the homepage; from any other page (e.g. /try-it-yourself) it tries
// to scroll to an id that doesn't exist on that page and silently does nothing.
const HOME = withBase('/');
export const NAV_LINKS = [
  { label: 'Product', href: withBase('/product') },
  { label: 'How It Works', href: `${HOME}#how-it-works` },
  { label: 'Solutions', href: `${HOME}#solutions` },
  { label: 'Tech Stack', href: `${HOME}#tech-stack` },
  { label: 'Project & Team', href: `${HOME}#project-team` },
];
