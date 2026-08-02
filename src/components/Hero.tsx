import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import { profile } from '@/content/profile';
import { heroDiagram } from '@/content/projects';
import { Container, Eyebrow } from './primitives';
import { PipelineDiagram } from './PipelineDiagram';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
      <Container>
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Eyebrow className="mb-5">{dict.hero.eyebrow}</Eyebrow>

            <h1 className="font-display text-d1 text-ink">
              {locale === 'vi' ? profile.nameVi : profile.name}
            </h1>

            <p className="mt-6 max-w-[42ch] text-ink">{dict.hero.positioning}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="label tap rounded-ctl border border-brand bg-brand px-5 py-3 text-surface transition-colors hover:bg-surface hover:text-brand"
              >
                {dict.hero.viewWork}
                <span aria-hidden="true" className="ml-2">
                  ↓
                </span>
              </a>
              <a
                href={profile.cvPath}
                download
                className="label tap rounded-ctl border border-brand px-5 py-3 text-brand transition-colors hover:bg-brand hover:text-surface"
              >
                {dict.contact.downloadCv}
                <span aria-hidden="true" className="ml-2">
                  ↓
                </span>
              </a>
            </div>

            {/* label-val, not .label: an email address and a GitHub handle are
                literal strings and uppercasing them misspells them. */}
            <ul className="label-val mt-7 flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.githubUrl}
                  className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
                  data-print-url={profile.githubUrl}
                >
                  github.com/{profile.githubUser}
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedinUrl}
                  className="tap text-brand underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
                  data-print-url={profile.linkedinUrl}
                >
                  linkedin.com/in/{profile.linkedinUser}
                </a>
              </li>
            </ul>
          </div>

          {/* The diagram is the signature element, so it gets the wider half and
              renders above its natural size. Everything else on the page stays
              quiet so this is what the eye lands on. */}
          <div className="md:col-span-7 md:pl-8">
            <PipelineDiagram
              spec={heroDiagram}
              uid="hero"
              a11yLabel={dict.hero.diagramA11y}
              scale={1.25}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
