import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
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
  const links = [
    { href: `/${locale}/#work`, label: dict.nav.work },
    { href: `/${locale}/#skills`, label: dict.nav.skills },
    { href: `/${locale}/#career`, label: dict.nav.timeline },
    { href: `/${locale}/#contact`, label: dict.nav.contact },
  ];

  const navigation = (
    <>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="tap text-muted transition-colors hover:text-brand">
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <a
          href={profile.cvPath}
          download
          className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
        >
          CV ↓
        </a>
      </li>
    </>
  );

  return (
    <header
      className="sticky top-0 z-40 border-b border-hairline bg-surface/95 backdrop-blur-sm"
      data-print="hide"
    >
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="label flex min-w-0 items-center gap-2">
          {breadcrumb ? (
            <>
              <Link
                href={`/${locale}/`}
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
              <span aria-hidden="true" className="mx-2 hidden text-hairline sm:inline">
                ·
              </span>
              <span className="hidden text-muted sm:inline">{profile.title}</span>
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <nav aria-label={dict.nav.index} className="hidden lg:block">
            <ul className="label flex items-center gap-5">{navigation}</ul>
          </nav>
          <LocaleSwitch current={locale} dict={dict} path={path} />
        </div>
      </Container>

      <div className="border-t border-hairline lg:hidden">
        <Container className="overflow-x-auto">
          <nav aria-label={dict.nav.index}>
            <ul className="label flex min-w-max items-center gap-5 py-2">{navigation}</ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
