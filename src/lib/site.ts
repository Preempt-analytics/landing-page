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
export const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Tech stack', href: '#tech-stack' },
  { label: 'Project & team', href: '#project-team' },
];
