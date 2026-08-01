import type { ReactNode } from 'react';

export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-content px-6 md:px-10 ${className}`}>{children}</div>
  );
}

/**
 * The only vertical rhythm on the site. Every section uses --section-y and none
 * overrides it, which is what keeps the spacing identical down the page.
 * `divide` draws the hairline that separates one section from the next.
 */
export function Section({
  id,
  children,
  divide = true,
  className = '',
}: {
  id?: string;
  children: ReactNode;
  divide?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`${divide ? 'border-t border-hairline' : ''} ${className}`}
      style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Mono eyebrow. Always carries real information — a year range, a layer name,
 *  a status — never a decorative 01/02/03. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`label text-muted ${className}`}>{children}</p>;
}

export function SectionHead({
  eyebrow,
  title,
  className = '',
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <header className={`mb-12 ${className}`}>
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h2 className="font-display text-d2 text-ink">{title}</h2>
    </header>
  );
}

/** A large figure in --data. Only ever used at display sizes: amber holds
 *  3.64:1 on the page background, which passes AA for large text but not for
 *  body copy, so it must never appear inline in a paragraph. */
export function Figure({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[2rem] leading-none font-medium text-data ${className}`}>
      {children}
    </span>
  );
}
