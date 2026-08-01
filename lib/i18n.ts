export const locales = ['en', 'vi'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const LOCALE_STORAGE_KEY = 'portfolio.locale';

/** Human label for the switcher. Not translated — a locale names itself. */
export const localeNames: Record<Locale, string> = {
  en: 'EN',
  vi: 'VI',
};

/** BCP 47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  vi: 'vi',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Absolute site origin. Update once here if the domain changes. */
export const SITE_URL = 'https://thangnd-portfolio.vercel.app';

/**
 * Whether <Link> may prefetch a link that points at a locale root (`/en/`).
 *
 * Off, and it has to be: under output: 'export', Next builds the RSC payload URL
 * for a route whose only dynamic segment is the root as
 * `/vi/__next.$d$locale.__PAGE__.txt` — the placeholder is never substituted, so
 * the request 404s and the browser logs an error on every page that carries such
 * a link. Links to `/[locale]/work/[slug]/` are unaffected and still prefetch.
 */
export const PREFETCH_LOCALE_ROOT = false;
