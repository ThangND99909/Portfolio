import Link from 'next/link';
import { PREFETCH_LOCALE_ROOT, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import { Container } from './primitives';
import { LocaleSwitch } from './LocaleSwitch';

export function Footer({
  locale,
  dict,
  path,
}: {
  locale: Locale;
  dict: Dictionary;
  /** Route below the locale segment, so the switcher can stay on this page. */
  path: string;
}) {
  const links = [
    { href: `/${locale}/#work`, label: dict.nav.work },
    { href: `/${locale}/#career`, label: dict.nav.timeline },
    { href: `/${locale}/#skills`, label: dict.nav.skills },
    { href: `/${locale}/#contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="border-t border-hairline">
      <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label={dict.nav.index} data-print="hide">
          <ul className="label flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={PREFETCH_LOCALE_ROOT}
                  className="tap text-muted transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-2 sm:items-end">
          <p className="label text-muted">{dict.footer.updated}</p>
          {/* --muted, not --hairline: this is information, and hairline on
              surface is ~1.3:1. Hairline is only ever used for rules and for
              aria-hidden separators. */}
          <p className="label text-muted">{dict.footer.build}</p>
          <div data-print="hide" className="mt-2 sm:mt-1">
            <LocaleSwitch current={locale} dict={dict} path={path} />
          </div>
        </div>
      </Container>
    </footer>
  );
}
