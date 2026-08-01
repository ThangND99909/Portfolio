import Link from 'next/link';
import { PREFETCH_LOCALE_ROOT, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import { profile } from '@/content/profile';
import { Container } from './primitives';
import { LocaleSwitch } from './LocaleSwitch';

/**
 * Deliberately not sticky. A pinned bar is chrome, and the brief asks for a
 * document — so the header sits at the top of the page and the footer carries
 * the same navigation for anyone who has scrolled to the bottom.
 */
export function Header({
  locale,
  dict,
  path,
  breadcrumb,
}: {
  locale: Locale;
  dict: Dictionary;
  /** Route below the locale segment, so the switcher can stay on this page. */
  path: string;
  /** Case study pages pass the project name; the home page passes nothing. */
  breadcrumb?: string;
}) {
  return (
    <header className="border-b border-hairline" data-print="hide">
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="label flex min-w-0 items-center gap-2">
          {breadcrumb ? (
            <>
              <Link
                href={`/${locale}/`}
                prefetch={PREFETCH_LOCALE_ROOT}
                className="tap text-muted transition-colors hover:text-brand"
              >
                {dict.study.backToIndex}
              </Link>
              <span aria-hidden="true" className="text-hairline">
                /
              </span>
              <span className="truncate text-ink">{breadcrumb}</span>
            </>
          ) : (
            <span className="truncate text-ink">
              {(locale === 'vi' ? profile.nameVi : profile.name).toUpperCase()}
              <span aria-hidden="true" className="mx-2 text-hairline">
                ·
              </span>
              <span className="text-muted">{profile.title}</span>
            </span>
          )}
        </div>

        <LocaleSwitch current={locale} dict={dict} path={path} />
      </Container>
    </header>
  );
}
