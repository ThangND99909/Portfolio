import { locales, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';

/**
 * Switches locale while staying on the same page.
 *
 * `path` is the route below the locale segment ('' for the home page,
 * 'work/<slug>' for a case study), passed down from the page that already knows
 * it. That keeps this a server component: reading the current path with
 * usePathname would otherwise require client-side hydration.
 *
 * Locale changes use a native GET form because [locale] owns the root layout.
 * This guarantees a new document and reruns the diagram bootstrap without
 * adding a client component or React hydration.
 */
export function LocaleSwitch({
  current,
  dict,
  path,
}: {
  current: Locale;
  dict: Dictionary;
  path: string;
}) {
  const label: Record<Locale, string> = {
    en: dict.locale.toEnglish,
    vi: dict.locale.toVietnamese,
  };

  const clean = path.replace(/^\/+|\/+$/g, '');
  const hrefFor = (locale: Locale) => `/${locale}/${clean ? `${clean}/` : ''}`;

  return (
    <nav aria-label={dict.locale.legend} className="label flex items-center gap-1.5">
      {locales.map((locale, i) => {
        const isCurrent = locale === current;
        return (
          <span key={locale} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span aria-hidden="true" className="text-hairline">
                /
              </span>
            ) : null}
            {isCurrent ? (
              <span aria-current="true" lang={locale} className="text-ink">
                {locale.toUpperCase()}
              </span>
            ) : (
              <form action={hrefFor(locale)} method="get">
                <button
                  type="submit"
                  lang={locale}
                  aria-label={`${locale.toUpperCase()} — ${label[locale]}`}
                  className="tap cursor-pointer px-1 text-muted underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  {locale.toUpperCase()}
                </button>
              </form>
            )}
          </span>
        );
      })}
    </nav>
  );
}
