import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';

/**
 * Switches locale while staying on the same page.
 *
 * `path` is the route below the locale segment ('' for the home page,
 * 'work/<slug>' for a case study), passed down from the page that already knows
 * it. That is why this is a server component: reading the current path with
 * usePathname would make it a client component, and the only other thing it did
 * — remembering the choice — now happens in <PageScript>, which records the
 * locale of whatever page you land on.
 *
 * No middleware is involved anywhere; middleware does not run under
 * output: 'export'.
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
              <span aria-current="true" className="text-ink">
                {locale.toUpperCase()}
              </span>
            ) : (
              <Link
                href={hrefFor(locale)}
                hrefLang={locale}
                // Prefetch off for two reasons: under output: 'export' Next
                // builds a malformed RSC payload URL for a route whose only
                // dynamic segment is the locale, and pre-loading the other
                // language is wasted bandwidth for the majority who never switch.
                prefetch={false}
                className="tap px-1 text-muted underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
              >
                {/* The full sentence goes in a visually hidden span rather than
                    an aria-label: WCAG 2.5.3 (Label in Name) requires the
                    accessible name to contain the visible text, and an
                    aria-label replaces it instead of extending it. */}
                {locale.toUpperCase()}
                <span className="sr-only"> — {label[locale]}</span>
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
