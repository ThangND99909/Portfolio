import type { MetadataRoute } from 'next';
import { locales, SITE_URL, type Locale } from '@/lib/i18n';
import { projects } from '@/content/projects';

/**
 * Generated at build time as /sitemap.xml, from the same project list the
 * pages are generated from — add a project to content/projects/index.ts and it
 * appears here without anyone remembering to update a second file.
 *
 * `alternates.languages` emits the xhtml:link hreflang pairs, matching the
 * <link rel="alternate"> tags in each page's head. No lastModified: a build
 * timestamp would claim every page changed on every deploy, which is worse than
 * saying nothing.
 */
// This route is deterministic and safe to prerender.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...projects.map((p) => `work/${p.slug}`)];

  const url = (locale: Locale, path: string) =>
    `${SITE_URL}/${locale}/${path ? `${path}/` : ''}`;

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: url(locale, path),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])),
      },
    })),
  );
}
