import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import type { Project } from '@/content/types';

/**
 * The left column of a case study: a spec table, sticky on desktop so the
 * numbers stay next to the prose that explains them.
 *
 * A private source is rendered as an ordinary data field with its reason — not
 * as an apology and not as a dead link.
 */
export function SpecSheet({
  project,
  locale,
  dict,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="md:sticky md:top-10">
      <p className="label mb-4 text-muted">{dict.spec.title}</p>

      <dl className="border-t border-hairline">
        {project.spec.map((row) => (
          <div key={row.key} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-hairline py-3">
            <dt className="label pt-1 text-muted">{dict.spec.keys[row.key]}</dt>
            <dd className="label-val text-ink">
              {Array.isArray(row.value) ? (
                <ul>
                  {row.value.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                row.value[locale]
              )}
            </dd>
          </div>
        ))}

        <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-hairline py-3">
          <dt className="label pt-1 text-muted">{dict.spec.keys.source}</dt>
          <dd className="label-val break-words">
            {project.source.kind === 'public' ? (
              <a
                href={project.source.url}
                // Shown as owner/repo: the full URL does not fit this column,
                // and it is still spelled out in the print stylesheet.
                className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
                data-print-url={project.source.url}
              >
                {project.source.url.replace('https://github.com/', '')}
              </a>
            ) : (
              <span className="text-muted">{project.source.reason[locale]}</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
