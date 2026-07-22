// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Project-pages deploy target (confirmed 2026-07-22):
//   https://preempt-analytics.github.io/landing-page
// If a custom domain is ever added, set base: '/' and update site.
export default defineConfig({
  site: 'https://preempt-analytics.github.io',
  base: '/landing-page',
  vite: {
    plugins: [tailwindcss()],
  },
});
