import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/i18n';

/**
 * Generated at build time as /robots.txt.
 *
 * Two reasons this file exists. The obvious one is SEO. The less obvious one:
 * every route on this site lives under app/[locale], so any unmatched top-level
 * path can be matched against `/[locale]` before locale validation.
 * Crawlers ask for /robots.txt on every visit, so it is worth having as a real
 * file. Same reasoning behind public/favicon.ico.
 */
// This route is deterministic and safe to prerender.
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
