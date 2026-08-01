import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { htmlLang, isLocale, locales, SITE_URL, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dict';
import '../globals.css';

/**
 * This is the root layout. Every route lives under [locale], so the layout that
 * owns <html> is also the one that knows the language — which is the only way
 * to get `lang` right on both locales without middleware (unavailable under
 * output: 'export'). The `/` entry point is a hand-written redirect at
 * public/index.html.
 */

/*
 * Font loading, and why it looks like this.
 *
 * Subsets: `latin` + `vietnamese` only. `latin-ext` covers Central and Eastern
 * European glyphs this site never renders.
 *
 * Faces: exactly the ones the stylesheet asks for. Archivo is loaded as a
 * variable font, so one file per subset covers both the 600 and the 700 in the
 * type scale. IBM Plex Sans is 400 only — no rule anywhere sets body text to
 * 500; every weight-500 declaration is on the mono face.
 *
 * preload: false on all three. This is the single largest performance decision
 * on the site, and it was measured rather than assumed. With the fonts
 * preloaded, the LCP element on every page is a paragraph that repaints when the
 * webfont lands, so throttled-mobile LCP sat at ~2.8s and Performance at 91-92.
 * Without preload, text paints immediately in next/font's metric-adjusted
 * fallback, the swap does not create a new LCP candidate, and LCP drops to
 * ~1.7s with Performance at 98 — while CLS stays at 0, which is the number that
 * would have made this a bad trade.
 */
const archivo = Archivo({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-archivo',
  display: 'swap',
  preload: false,
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400'],
  variable: '--font-plex-sans',
  display: 'swap',
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: 'Nguyen Duc Thang', url: SITE_URL }],
  creator: 'Nguyen Duc Thang',
  robots: { index: true, follow: true },
  // Declared explicitly rather than via the app/icon file convention: the root
  // layout sits under a dynamic [locale] segment, and a declared <link rel=icon>
  // also stops the browser probing /favicon.ico and logging a 404.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);

  return (
    <html lang={htmlLang[locale as Locale]}>
      <head>
        {/* Without JS the IntersectionObserver never runs, so the diagrams
            would stay hidden. This shows them finished instead. */}
        <noscript>
          <style>{`.diagram-edge{stroke-dashoffset:0}.diagram-edge--dashed,.diagram-node,.diagram-edge-note,.diagram-arrow{opacity:1}`}</style>
        </noscript>
      </head>
      <body
        className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} bg-surface text-ink antialiased`}
      >
        <a
          href="#main"
          className="label sr-only rounded-ctl focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-brand focus:bg-surface focus:px-4 focus:py-2 focus:text-brand"
        >
          {dict.nav.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
