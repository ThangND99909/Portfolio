import type { Locale } from '@/lib/i18n';
import { skills } from '@/content/skills';

/**
 * A spec table, not a tag cloud. The left column names the layer the tools
 * occupy in a pipeline, using the same vocabulary as the architecture diagrams,
 * so the two sections describe the same system from different angles.
 */
export function SkillTable({ locale }: { locale: Locale }) {
  return (
    <dl className="border-t border-hairline">
      {skills.map((layer) => (
        <div
          key={layer.name.en}
          className="grid gap-2 border-b border-hairline py-6 sm:grid-cols-[13rem_1fr] sm:gap-8"
        >
          <dt className="label pt-0.5 text-brand">{layer.name[locale]}</dt>
          <dd className="label-val text-ink">
            {layer.items.map((item, i) => (
              <span key={item}>
                {i > 0 ? (
                  <span aria-hidden="true" className="text-hairline">
                    {'  ·  '}
                  </span>
                ) : null}
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
