import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from '@/lib/i18n';
import { alternatesFor, projectJsonLd } from '@/lib/seo';
import { getDictionary } from '@/content/dict';
import { getProject, projects } from '@/content/projects';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SpecSheet } from '@/components/SpecSheet';
import { DecisionCard } from '@/components/DecisionCard';
import { MediaSlot } from '@/components/MediaSlot';
import { PageScript } from '@/components/PageScript';
import { PipelineDiagram } from '@/components/PipelineDiagram';
import { Container, Eyebrow, Figure } from '@/components/primitives';

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};

  const dict = getDictionary(locale);
  const title = `${project.name} — ${dict.meta.title}`;

  return {
    title,
    description: project.outcome[locale],
    alternates: alternatesFor(locale, `work/${slug}`),
    openGraph: {
      type: 'article',
      title,
      description: project.outcome[locale],
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
  };
}

/** Section heading inside a case study. One step down from the page title. */
function StudyHead({ children }: { children: React.ReactNode }) {
  return <h2 className="label mb-5 text-brand">{children}</h2>;
}

function Block({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="border-t border-hairline pt-8 pb-12">
      {children}
    </section>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) notFound();

  const l = locale as Locale;
  const dict = getDictionary(l);

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const jsonLd = projectJsonLd(slug, l);
  const publishedDecisions = project.decisions.filter((decision) => decision.content);

  return (
    <>
      <Header
        locale={l}
        dict={dict}
        path={`work/${project.slug}`}
        breadcrumb={project.name.toUpperCase()}
      />

      <main id="main">
        {/* Title block. The outcome sentence sits directly under the name:
            business result first, technology after. */}
        <Container>
          <div style={{ paddingTop: 'var(--section-y)' }} className="pb-12">
            <Eyebrow className="mb-5">
              {project.period[l]}
              <span aria-hidden="true" className="mx-2 text-hairline">
                ·
              </span>
              {dict.spec.status[project.status]}
              <span aria-hidden="true" className="mx-2 text-hairline">
                ·
              </span>
              {project.org}
            </Eyebrow>

            <h1 className="font-display text-d1 text-ink">{project.name}</h1>

            <p className="mt-6 max-w-[62ch] text-ink">{project.outcome[l]}</p>
          </div>
        </Container>

        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            {/* 4 / gap / 7. Three columns left the spec values wrapping every
                line; seven on the right still caps body copy below its
                max-width, so nothing is lost. */}
            <div className="md:col-span-4">
              <SpecSheet project={project} locale={l} dict={dict} />
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <Block id="problem">
                <StudyHead>{dict.study.problem}</StudyHead>
                <p className="max-w-[68ch] text-ink">{project.problem[l]}</p>
              </Block>

              <Block id="constraints">
                <StudyHead>{dict.study.constraints}</StudyHead>
                <ul className="flex max-w-[68ch] flex-col gap-3">
                  {project.constraints[l].map((item, i) => (
                    <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-2 text-ink">
                      <span aria-hidden="true" className="label pt-1.5 text-hairline">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block id="architecture">
                <StudyHead>{dict.study.architecture}</StudyHead>

                <div className="rounded-node border border-hairline bg-panel/40 px-4 py-8 sm:px-8">
                  <PipelineDiagram
                    spec={project.diagram}
                    uid={project.slug}
                    a11yLabel={`${project.name} — ${dict.study.architecture}`}
                    scale={1.15}
                  />
                </div>

                <p className="label mt-10 mb-5 text-muted">{dict.study.layers}</p>
                <dl className="border-t border-hairline">
                  {project.layers.map((layer) => (
                    <div
                      key={layer.name}
                      className="grid gap-2 border-b border-hairline py-5 sm:grid-cols-[8rem_1fr] sm:gap-8"
                    >
                      <dt className="label pt-1.5 text-brand">{layer.name}</dt>
                      <dd className="max-w-[62ch] text-ink">{layer.body[l]}</dd>
                    </div>
                  ))}
                </dl>
              </Block>

              {publishedDecisions.length > 0 ? (
                <Block id="decisions">
                  <StudyHead>{dict.study.decisions}</StudyHead>
                  <p className="mb-8 max-w-[68ch] text-muted">{dict.study.decisionsIntro}</p>
                  <div className="flex flex-col gap-5">
                    {publishedDecisions.map((decision) => (
                      <DecisionCard
                        key={decision.title}
                        decision={decision}
                        locale={l}
                        dict={dict}
                      />
                    ))}
                  </div>
                </Block>
              ) : null}

              <Block id="result">
                <StudyHead>{dict.study.result}</StudyHead>

                {project.results.length > 0 ? (
                  <dl className="mb-8 flex flex-wrap gap-x-12 gap-y-6">
                    {project.results.map((result) => (
                      <div key={result.figure + result.label.en} className="flex flex-col gap-2">
                        <dd className="order-1">
                          <Figure>{result.figure}</Figure>
                        </dd>
                        <dt className="label order-2 text-muted">{result.label[l]}</dt>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <p className="max-w-[68ch] text-ink">{project.resultNote[l]}</p>
              </Block>

              <Block id="media">
                <StudyHead>{dict.study.media}</StudyHead>
                <div className="flex flex-col gap-8">
                  {project.media.map((slot) => (
                    <MediaSlot key={slot.path} slot={slot} locale={l} dict={dict} />
                  ))}
                </div>
              </Block>

              <nav
                aria-label={dict.study.nextProject}
                className="flex flex-wrap items-baseline justify-between gap-4 border-t border-hairline pt-8"
              >
                <Link
                  href={`/${l}/#work`}
                  className="label tap text-muted transition-colors hover:text-brand"
                >
                  <span aria-hidden="true" className="mr-2">
                    ←
                  </span>
                  {dict.study.backToIndex}
                </Link>

                <Link
                  href={`/${l}/work/${next.slug}/`}
                  className="label tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
                >
                  {dict.study.nextProject}: {next.name}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </nav>
            </div>
          </div>
        </Container>

        <div style={{ height: 'var(--section-y)' }} />
      </main>

      <Footer locale={l} dict={dict} path={`work/${project.slug}`} />

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <PageScript />
    </>
  );
}
