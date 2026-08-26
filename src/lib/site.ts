// Shared site constants. Single source of truth for links/copy reused across
// components — keeps the footer, nav, and CTAs from drifting apart.
import { useTranslations, DEFAULT_LOCALE, type Locale } from '../i18n';

/** Prefix an internal path with the configured base (e.g. "/landing-page")
    and, for a non-default locale, that locale's own URL segment (Contract 3
    now covers base + locale together — see astro.config.mjs's `i18n` block).
    Hand-rolled rather than delegating to astro:i18n's getRelativeLocaleUrl:
    that helper treats every path as a page ROUTE and appends a trailing
    slash (e.g. "/landing-page/images/hero/foo.png/"), which is harmless for
    a page href but silently 404s an image `src` — this function is used for
    both, so it must never add a slash that isn't already there. Since
    `defaultLocale: 'en'` is unprefixed, calling this with no `locale` arg
    reproduces the exact pre-i18n behavior, which is why every existing
    asset-path call site (image `src`s) needed no changes when this went
    locale-aware. */
export function withBase(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  const localePrefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  return clean ? `${base}/${localePrefix}${clean}` : `${base}/${localePrefix}`;
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
//
// A function, not a precomputed constant, since German-locale hrefs need
// their own /de/ segment (withBase's `locale` param) — the labels come from
// the i18n dictionary rather than being hardcoded here, so this is the one
// place nav copy and nav routing meet.
export function getNavLinks(locale: Locale = DEFAULT_LOCALE) {
  const t = useTranslations(locale);
  const home = withBase('/', locale);
  return [
    { label: t.nav.dashboard, href: withBase('/product', locale) },
    { label: t.nav.howItWorks, href: `${home}#how-it-works` },
    { label: t.nav.solutions, href: `${home}#solutions` },
    { label: t.nav.techStack, href: `${home}#tech-stack` },
    { label: t.nav.projectTeam, href: `${home}#project-team` },
  ];
}
