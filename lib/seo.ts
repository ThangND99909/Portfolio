import type { Metadata } from 'next';
import { SITE_URL, type Locale } from './i18n';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';

/**
 * Canonical + hreflang for a page, given the path *after* the locale segment.
 * Both locales are always listed, with English as x-default.
 */
export function alternatesFor(locale: Locale, path = ''): Metadata['alternates'] {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const url = (l: Locale) => `${SITE_URL}/${l}/${clean ? `${clean}/` : ''}`;

  return {
    canonical: url(locale),
    languages: {
      en: url('en'),
      vi: url('vi'),
      'x-default': url('en'),
    },
  };
}

/** schema.org Person. Only facts that appear on the page itself. */
export function personJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: locale === 'vi' ? profile.nameVi : profile.name,
    alternateName: locale === 'vi' ? profile.name : profile.nameVi,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    telephone: profile.phoneE164,
    url: `${SITE_URL}/${locale}/`,
    sameAs: [profile.githubUrl],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Da Nang',
      addressCountry: 'VN',
    },
    knowsAbout: [
      'Retrieval-augmented generation',
      'Vector databases',
      'LLM application engineering',
      'Systems integration',
      'Backend engineering',
    ],
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Passerelles Numériques Vietnam' },
      { '@type': 'EducationalOrganization', name: 'iViettech' },
    ],
  };
}

/** schema.org for a single case study, so a project page is not just prose. */
export function projectJsonLd(slug: string, locale: Locale) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    abstract: project.outcome[locale],
    url: `${SITE_URL}/${locale}/work/${project.slug}/`,
    inLanguage: locale,
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    keywords: project.stack.join(', '),
    ...(project.source.kind === 'public' ? { codeRepository: project.source.url } : {}),
  };
}
