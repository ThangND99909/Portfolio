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

  rows.splice(2, 0, {
    key: dict.contact.linkedin,
    node: (
      <a
        href={profile.linkedinUrl}
        className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
        data-print-url={profile.linkedinUrl}
      >
        linkedin.com/in/{profile.linkedinUser}
      </a>
    ),
  });

  rows.splice(3, 0, {
    key: dict.contact.zalo,
    node: (
      <>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={profile.zaloUrl}
            target="_blank"
            rel="noreferrer"
            className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
            data-print-url={profile.zaloUrl}
          >
            {dict.contact.messageOnZalo}
            <span className="ml-2" aria-hidden="true">
              ↗
            </span>
          </a>
          <span className="text-hairline" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
            data-open-zalo-qr
            data-print="hide"
          >
            {dict.contact.scanZaloQr}
          </button>
        </div>

        <dialog
          className="zalo-qr-dialog"
          aria-labelledby="zalo-qr-title"
          data-zalo-qr-dialog
          data-print="hide"
        >
          <div className="relative flex flex-col items-center p-6 sm:p-8">
            <button
              type="button"
              className="zalo-qr-close"
              aria-label={dict.contact.closeZaloQr}
              data-close-zalo-qr
            >
              <span aria-hidden="true">×</span>
            </button>
            <p id="zalo-qr-title" className="font-display text-d3 text-ink">
              {dict.contact.scanZaloQr}
            </p>
            <img
              src="/zalo-qr.svg"
              width="320"
              height="320"
              alt=""
              className="mt-5 size-64 sm:size-72"
            />
            <p className="mt-4 max-w-[32ch] text-center text-muted">
              {dict.contact.zaloQrHelp}
            </p>
            <a
              href={profile.zaloUrl}
              target="_blank"
              rel="noreferrer"
              className="label mt-5 inline-flex items-center gap-2 rounded-ctl border border-brand px-5 py-3 text-brand transition-colors hover:bg-brand hover:text-surface"
            >
              {dict.contact.messageOnZalo}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </dialog>
      </>
    ),
  });

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
