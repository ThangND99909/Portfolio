import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import { profile } from '@/content/profile';
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
      <Container className="grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex flex-col gap-5">
          <p className="font-display text-d3 text-ink">
            {locale === 'vi' ? profile.nameVi : profile.name}
          </p>
          <p className="max-w-[48ch] text-muted">{dict.contact.availability}</p>

          <nav aria-label={dict.nav.index} data-print="hide">
            <ul className="label flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="tap text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="label-val flex flex-wrap gap-x-5 gap-y-2" data-print="hide">
            <a
              href={`mailto:${profile.email}`}
              className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 hover:decoration-brand"
            >
              {dict.contact.email}
            </a>
            <a
              href={profile.linkedinUrl}
              className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 hover:decoration-brand"
            >
              {dict.contact.linkedin}
            </a>
            <a
              href={profile.cvPath}
              download
              className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 hover:decoration-brand"
            >
              {dict.contact.downloadCv}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <p className="label text-muted">{dict.footer.updated}</p>
          <p className="label text-muted">
            {profile.title} · {profile.location}
          </p>
          <div data-print="hide">
            <LocaleSwitch current={locale} dict={dict} path={path} />
          </div>
        </div>
      </Container>
    </footer>
  );
}
