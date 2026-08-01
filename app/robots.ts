import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/i18n';

/**
 * Generated at build time into out/robots.txt.
 *
 * Two reasons this file exists. The obvious one is SEO. The less obvious one:
 * every route on this site lives under app/[locale], so any unmatched top-level
 * path gets matched against `/[locale]` and — under output: 'export' — throws
 * "missing param in generateStaticParams()" rather than returning a plain 404.
 * Crawlers ask for /robots.txt on every visit, so it is worth having as a real
 * file. Same reasoning behind public/favicon.ico.
 */
// Metadata routes are dynamic by default; output: 'export' requires this to be
// stated explicitly or the build fails collecting page data.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
