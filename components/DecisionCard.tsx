import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import type { Decision } from '@/content/types';

/**
 * Problem → choice → trade-off, in that order, every time. The shape is the
 * argument: a decision with no stated cost is not a decision.
 *
 * `todo` marks a card whose real content is still owed. The placeholder text is
 * the question that needs answering, and the card is visibly flagged so nobody
 * mistakes a prompt for a claim.
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
  const rows = [
    { key: dict.study.decision.problem, value: decision.problem[locale] },
    { key: dict.study.decision.choice, value: decision.choice[locale] },
    { key: dict.study.decision.tradeoff, value: decision.tradeoff[locale] },
  ];

  return (
    <article
      className={`rounded-node border p-6 ${
        decision.todo ? 'border-dashed border-hairline bg-transparent' : 'border-hairline bg-panel'
      }`}
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="label text-brand">{decision.title}</h3>
        {/* --muted, not --data: amber is 3.64:1 on the page background, which
            passes AA for large text only. It never appears at label size. */}
        {decision.todo ? (
          <p className="label rounded-node border border-hairline px-2 py-1 text-muted">
            {dict.study.todoBadge}
          </p>
        ) : null}
      </div>

      <dl className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key} className="grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
            <dt className="label pt-1.5 text-muted">{row.key}</dt>
            <dd className={decision.todo ? 'text-muted italic' : 'text-ink'}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
