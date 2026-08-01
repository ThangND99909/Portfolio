import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import type { Decision } from '@/content/types';

/**
 * Problem → choice → trade-off, in that order, every time. The shape is the
 * argument: a decision with no stated cost is not a decision.
 *
 * Callers only pass decisions with publishable content. Draft prompts never
 * enter the rendered tree.
 */
export function DecisionCard({
  decision,
  locale,
  dict,
}: {
  decision: Decision;
  locale: Locale;
  dict: Dictionary;
}) {
  if (!decision.content) return null;

  const rows = [
    { key: dict.study.decision.problem, value: decision.content.problem[locale] },
    { key: dict.study.decision.choice, value: decision.content.choice[locale] },
    { key: dict.study.decision.tradeoff, value: decision.content.tradeoff[locale] },
  ];

  return (
    <article className="rounded-node border border-hairline bg-panel p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="label text-brand">{decision.title}</h3>
      </div>

      <dl className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key} className="grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
            <dt className="label pt-1.5 text-muted">{row.key}</dt>
            <dd className="text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
