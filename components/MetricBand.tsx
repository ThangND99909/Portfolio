import type { Locale } from '@/lib/i18n';
import { metrics } from '@/content/profile';
import { Container, Figure } from './primitives';

/**
 * A datasheet band, not three centred hero stats: hairline top and bottom,
 * cells divided by a rule, every value left-aligned in its cell like a row in a
 * spec table.
 *
 * These three figures are the only use of --data on the home page. Result lines
 * elsewhere carry numbers too, but they stay in --ink so this band keeps the
 * colour to itself.
 */
export function MetricBand({ locale }: { locale: Locale }) {
  return (
    <div className="border-y border-hairline bg-panel/50">
      <Container>
        <dl className="grid grid-cols-1 divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {metrics.map((metric, i) => (
            <div
              key={metric.figure + i}
              className={`flex flex-col gap-2 py-7 ${i === 0 ? 'sm:pr-8' : 'sm:px-8'} ${
                i === metrics.length - 1 ? 'sm:pr-0' : ''
              }`}
            >
              <dd className="order-1">
                <Figure>{metric.figure}</Figure>
              </dd>
              <dt className="label order-2 text-muted">{metric.label[locale]}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
