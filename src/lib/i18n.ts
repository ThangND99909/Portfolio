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
export const SITE_URL = 'https://thangnguyen-ai-portfolio.vercel.app';
