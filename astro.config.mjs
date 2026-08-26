// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Project-pages deploy target (confirmed 2026-07-22):
//   https://preempt-analytics.github.io/landing-page
// If a custom domain is ever added, set base: '/' and update site.
export default defineConfig({
  site: 'https://preempt-analytics.github.io',
  base: '/landing-page',
  // German is a full parallel content tree, not a client-side string swap —
  // Astro's built-in i18n routing emits real static pages per locale (zero
  // added client JS, matching the Second Law) rather than one page whose
  // English HTML gets rewritten in the browser. `prefixDefaultLocale: false`
  // keeps English at today's unprefixed URLs (no /en/ break for existing
  // links); German pages live under /landing-page/de/*, mirrored from
  // src/pages/de/*. See src/i18n/ for the translation dictionary consumed via
  // `Astro.currentLocale` in each component.
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
