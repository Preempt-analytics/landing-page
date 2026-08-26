// Locale plumbing shared by every component that renders translated copy.
// The dictionary itself lives in ./en (canonical shape) and ./de (professional
// German translation, typed against that same shape so a missing key is a
// build-time TS error, not a silently-blank string in production).
import { en } from './en';
import { de } from './de';

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, de };

/** `Astro.currentLocale` is `string | undefined`; this narrows it to a known
    Dictionary and falls back to English for anything else (should never
    happen given astro.config.mjs's `locales` list, but keeps this total). */
export function useTranslations(locale: string | undefined): Dictionary {
  return dictionaries[locale as Locale] ?? en;
}
