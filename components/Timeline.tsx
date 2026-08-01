import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import { timeline } from '@/content/timeline';

/** The pivot year. Entries from here on sit on the solid rail. */
const PIVOT_YEAR = 2025;

/**
 * One continuous vertical rail, every entry to the right of it. No alternating
 * sides, no dots, no numbered markers.
 *
 * The 2025 career pivot is marked by the rail itself changing weight — solid
 * brand from 2025 onward, hairline before it — rather than by a badge or an
 * accent colour. The rail is absolutely positioned so the two weights share the
 * same left edge and the text never shifts between eras.
 */
export function Timeline({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const lastPivotIndex = timeline.reduce(
    (last, entry, i) => (Number(entry.year) >= PIVOT_YEAR ? i : last),
    -1,
  );

  return (
    <ol className="relative">
      {timeline.map((entry, i) => {
        const postPivot = i <= lastPivotIndex;
        const isPivot = i === lastPivotIndex;
        const showYear = i === 0 || timeline[i - 1].year !== entry.year;
        const isLast = i === timeline.length - 1;

        return (
          <li
            key={`${entry.year}-${entry.org}-${i}`}
            className="grid grid-cols-[3rem_1fr] gap-x-4 sm:grid-cols-[4.5rem_1fr] sm:gap-x-8"
          >
            <p className="label pt-0.5 text-right text-muted">
              {showYear ? entry.year : <span className="sr-only">{entry.year}</span>}
            </p>

            <div className={`relative pl-6 sm:pl-8 ${isLast ? 'pb-0' : 'pb-10'}`}>
              <span
                aria-hidden="true"
                className={`absolute top-0 left-0 h-full ${
                  postPivot ? 'w-[2px] bg-brand' : 'w-px bg-hairline'
                }`}
              />

              <p className="label text-muted">{entry.period}</p>

              <h3 className="mt-1.5 font-display text-d3 text-ink">{entry.title[locale]}</h3>

              <p className="label-val mt-1 text-brand">{entry.org}</p>

              <p className="mt-3 max-w-[64ch] text-muted">{entry.detail[locale]}</p>

              {isPivot ? (
                <p className="label mt-6 flex items-center gap-3 text-ink">
                  <span aria-hidden="true" className="h-px w-6 shrink-0 bg-hairline" />
                  {dict.timeline.pivot}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
