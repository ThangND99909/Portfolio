import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Dictionary } from '@/content/dict';
import { profile } from '@/content/profile';

/**
 * One neutral availability line and the channels, laid out as a spec table.
 * There is no services page, no pricing and no pitch — a page that smells of
 * selling makes full-time recruiters hesitate.
 */
export function Contact({ dict }: { dict: Dictionary }) {
  const cvAvailable = existsSync(join(process.cwd(), 'public', profile.cvPath.slice(1)));
  const rows: Array<{ key: string; node: React.ReactNode }> = [
    {
      key: dict.contact.email,
      node: (
        <a
          href={`mailto:${profile.email}`}
          className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
        >
          {profile.email}
        </a>
      ),
    },
    {
      key: dict.contact.github,
      node: (
        <a
          href={profile.githubUrl}
          className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
          data-print-url={profile.githubUrl}
        >
          github.com/{profile.githubUser}
        </a>
      ),
    },
    {
      key: dict.contact.phone,
      node: (
        <a
          href={`tel:${profile.phoneE164}`}
          className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
        >
          {profile.phone}
        </a>
      ),
    },
  ];

  if (profile.linkedinUrl) {
    rows.splice(2, 0, {
      key: dict.contact.linkedin,
      node: (
        <a
          href={profile.linkedinUrl}
          className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
          data-print-url={profile.linkedinUrl}
        >
          linkedin.com
        </a>
      ),
    });
  }

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-10">
      <p className="max-w-[46ch] text-ink md:col-span-5">{dict.contact.availability}</p>

      <div className="md:col-span-7">
        <dl className="border-t border-hairline">
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[8rem_1fr] sm:gap-8"
            >
              <dt className="label pt-1 text-muted">{row.key}</dt>
              <dd className="label-val text-ink">{row.node}</dd>
            </div>
          ))}
        </dl>

        {cvAvailable ? (
          <div className="mt-8">
            <a
              href={profile.cvPath}
              download
              className="label inline-flex items-center gap-3 rounded-ctl border border-brand px-5 py-3 text-brand transition-colors hover:bg-brand hover:text-surface"
            >
              {dict.contact.downloadCv}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
