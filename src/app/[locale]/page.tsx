import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from '@/lib/i18n';
import { alternatesFor, personJsonLd } from '@/lib/seo';
import { getDictionary } from '@/content/dict';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MetricBand } from '@/components/MetricBand';
import { WorkIndex } from '@/components/WorkIndex';
import { Timeline } from '@/components/Timeline';
import { SkillTable } from '@/components/SkillTable';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { PageScript } from '@/components/PageScript';
import { Section, SectionHead } from '@/components/primitives';
import { experimentProjects, selectedProjects } from '@/content/projects';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: alternatesFor(locale),
    openGraph: {
      type: 'profile',
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? 'en_US' : 'vi_VN',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/og.png'],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const l = locale as Locale;
  const dict = getDictionary(l);

  return (
    <>
      <Header locale={l} dict={dict} path="" />

      <main id="main">
        <Hero locale={l} dict={dict} />

        <MetricBand locale={l} />

        <Section id="work" divide={false}>
          <SectionHead eyebrow={dict.work.eyebrow} title={dict.work.title} />
          <WorkIndex locale={l} dict={dict} projects={selectedProjects} />
        </Section>

        <Section id="skills">
          <SectionHead eyebrow={dict.skills.eyebrow} title={dict.skills.title} />
          <SkillTable locale={l} />
        </Section>

        <Section id="career">
          <SectionHead eyebrow={dict.timeline.eyebrow} title={dict.timeline.title} />
          <Timeline locale={l} dict={dict} />
        </Section>

        <Section id="experiments">
          <SectionHead eyebrow={dict.work.experimentsEyebrow} title={dict.work.experimentsTitle} />
          <WorkIndex locale={l} dict={dict} projects={experimentProjects} compact />
        </Section>

        <Section id="contact">
          <SectionHead eyebrow={dict.contact.eyebrow} title={dict.contact.title} />
          <Contact dict={dict} />
        </Section>
      </main>

      <Footer locale={l} dict={dict} path="" />

      <script
        type="application/ld+json"
        // Generated from src/content/profile.ts — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(l)) }}
      />

      <PageScript />
    </>
  );
}
