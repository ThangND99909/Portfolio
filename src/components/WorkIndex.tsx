import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import type { Project } from '@/content/types';

/**
 * An index of systems, not a card grid: four full-width records separated by
 * hairlines, each one reading name / period+status / role / outcome / stack.
 * The outcome line comes before the stack on purpose — the brief's readers want
 * the result first and the technology second.
 */
export function WorkIndex({
  locale,
  dict,
  projects,
  compact = false,
}: {
  locale: Locale;
  dict: Dictionary;
  projects: Project[];
  compact?: boolean;
}) {
  return (
    <ul className="border-t border-hairline">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/${locale}/work/${project.slug}/`}
            className={`group block border-b border-hairline transition-colors hover:border-brand focus-visible:border-brand ${compact ? 'py-5' : 'py-8'}`}
          >
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h3
                className={`font-display text-ink transition-colors group-hover:text-brand ${compact ? 'text-base font-semibold' : 'text-d3'}`}
              >
                {project.name}
              </h3>
              <p className="label shrink-0 text-muted">
                {project.period[locale]}
                <span aria-hidden="true" className="mx-2 text-hairline">
                  ·
                </span>
                {dict.spec.status[project.status]}
              </p>
            </div>

            <p className="label mt-3 text-muted">
              {project.role[locale]}
              <span aria-hidden="true" className="mx-2 text-hairline">
                ·
              </span>
              {project.org}
            </p>

            <p className={`${compact ? 'mt-3 text-sm' : 'mt-4'} max-w-[68ch] text-ink`}>
              {project.outcome[locale]}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <p className="label-val text-muted">
                {project.stack.map((tool, i) => (
                  <span key={tool}>
                    {i > 0 ? (
                      <span aria-hidden="true" className="text-hairline">
                        {'  ·  '}
                      </span>
                    ) : null}
                    {tool}
                  </span>
                ))}
              </p>

              <p className="label shrink-0 text-brand">
                <span>{dict.work.readSpec}</span>
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
