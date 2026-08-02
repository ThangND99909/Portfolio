# Portfolio — Nguyen Duc Thang

Bilingual (EN/VI) portfolio for an AI engineer, built as a technical datasheet
rather than a landing page. Next.js App Router, Tailwind CSS, deployed on Vercel.

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /en/)
npm run build      # creates the production Next.js build
npm run preview    # builds and starts it at http://localhost:4321
npm run typecheck
```

`npm run dev` is for editing. `npm run preview` serves the same production mode
used on Vercel and is the right place to verify redirects and metadata routes.

## Deploy

Target is **Vercel**. Import the repo and accept the Next.js defaults.

**Before the first deploy**, set the real domain once at `SITE_URL` in
`src/lib/i18n.ts`. It drives canonical URLs, `hreflang`, Open Graph, JSON-LD,
robots and the sitemap. `/` redirects permanently to `/en` in `next.config.ts`.

## Project structure

```text
src/
├── app/          # Routes, layouts, metadata routes, and global styles
├── components/   # Reusable server-rendered UI components
├── content/      # Typed bilingual copy and project data
└── lib/          # Framework-independent helpers, i18n, and SEO
public/           # Static assets served as-is
scripts/          # Build-time validation and audit tooling
```

Application source lives under `src/`; framework configuration, package files,
static assets, and repository tooling stay at the project root.

## Editing content

No copy lives in a component. Everything is in `src/content/`:

| File | What it holds |
| --- | --- |
| `src/content/dict/en.ts` | Every UI string, English. This is the source of truth for the dictionary's shape. |
| `src/content/dict/vi.ts` | The same strings in Vietnamese, typed against `en.ts` — **adding a key to `en.ts` without translating it fails the build**. |
| `src/content/profile.ts` | Name, email, phone, social links, and profile metrics. |
| `src/content/projects/*.ts` | One file per case study: prose, spec sheet, architecture diagram, decisions, results, media slots. |
| `src/content/timeline.ts` | Career entries, newest first. |
| `src/content/skills.ts` | Skills grouped by pipeline layer. |

Every prose field is `{ en: '…', vi: '…' }`. Technical terms stay in English in
the Vietnamese copy on purpose (RAG, pipeline, embedding, retrieval, vector
store, prompt engineering) — forcing them into Vietnamese reads worse than
leaving them.

### Adding a project

1. Copy `src/content/projects/smart-calendar.ts` and edit it.
2. Add it to the array in `src/content/projects/index.ts` and give it an explicit
   `order`, `section`, and `status` in its content file.

The route, the static params, the `hreflang` pair and the JSON-LD all follow from
that. Nothing else to register.

### Publishing a Key decision

Draft questions live in `CONTENT-TODO.md` and do not render. Add a decision's
`content: { problem, choice, tradeoff }` only when all three are factual. The
build warns for every omitted decision; a page with none hides the whole section.

### Adding the CV

Set `cvPath` in `src/content/profile.ts` to the PDF stored under `public/`. The
server build detects it automatically; the download link is absent until the
file exists.

### Adding screenshots and demo videos

Each case study reserves boxes at its real aspect ratio. The path printed in the
box is where the file goes, e.g. `public/media/arbin/01-chat.png`. Dropping a file
in does not move anything on the page.

## Architecture notes

### The diagrams are data

`src/content/projects/*.ts` describes each diagram as nodes on a grid plus edges:

```ts
{ id: 'qdrant', label: 'QDRANT', sub: 'VECTOR STORE', col: 0, row: 2, tone: 'accent' }
{ from: 'chunk', to: 'qdrant', note: 'EMBEDDINGS' }
```

`src/lib/diagram-layout.ts` turns that into coordinates and `src/components/PipelineDiagram.tsx`
renders it. Consequences worth knowing:

- All five diagrams share one geometry, so they cannot drift out of style.
- The mobile layout is derived, not authored twice: the same spec is laid out
  column-major on one column below `md`.
- An edge that would cross a third node is routed out to a side channel
  automatically.
- Same-row edge notes are centred in a 96px gap and cannot be measured at build
  time — **keep them under ~15 characters** or they will overlap a node.
- The screen-reader description is generated from the spec, so it can never
  disagree with the drawing.

### Server components by default

The whole site renders on the server. The only client-side behaviour is
`src/components/PageScript.tsx` — an inline script that adds `is-drawn` to a diagram
when it scrolls into view.

This was a measured decision, not a preference: with `PipelineDiagram` and
`LocaleSwitch` as client components, throttled-mobile TBT was 302ms and
Performance 87. Moving both to the server took TBT to ~200ms, and the font change
below finished the job.

### Font loading

`preload: false` on all three families. With the fonts preloaded, the LCP element
on every page is a paragraph that repaints when the webfont lands, which put
throttled-mobile LCP at ~2.8s. Without preload, text paints immediately in
next/font's metric-adjusted fallback and LCP drops to ~1.7s — with CLS still 0.
See the comment in `src/app/[locale]/layout.tsx`.

Also rejected after measuring: `experimental.inlineCss`. Inlining the ~7KB
stylesheet removed a render-blocking request but pushed FCP from 777ms to 953ms,
because the HTML document is itself the critical resource.

### Locale routing

Every content route is explicitly locale-scoped:

- Every route lives under `src/app/[locale]/`, and that layout is the root layout,
  which gets `<html lang>` right for both locales.
- `/` is a permanent Next.js redirect to `/en` declared in `next.config.ts`.
- The language switcher takes the current path as a prop from the page, so it
  stays on the page being read without becoming a client component.

`src/app/sitemap.ts` reads the same project list the pages do, so adding a project
does not mean remembering to update a sitemap.

### The favicon

`public/icon.svg` is the source: three stacked bars, widest in the middle. Solid
fills and no connector lines, because at 16px a 1px stroke and a 3px gap merge
into one grey blob — the first version did exactly that. `public/favicon.ico`
holds 16px and 32px rasterisations of it and exists so `/favicon.ico` resolves to
a file rather than falling through to the dynamic route.

### Design tokens

All in the `@theme` block at the top of `src/app/globals.css`. Two rules the code
depends on:

- `--data` (amber) is **only** for figures at display size. It holds 3.64:1 on
  the page background, which passes WCAG AA for large text but not for body copy.
  It never appears at label size.
- `--hairline` is for rules and `aria-hidden` separators only — never for text.
  It is ~1.3:1 on the background.

Vertical rhythm comes from one variable, `--section-y`, applied by `<Section>`.
No section overrides it.

### Print

The brief expects recruiters to print this. `@media print` hides the header,
footer nav and language switcher, resolves diagram animations to their finished
state, converts diagrams to greyscale, and spells out link targets after the link
text via `data-print-url`.

## Verified

Lighthouse, against the production Next.js server:

| Page | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/en/` desktop | 100 | 100 | 100 | 100 |
| `/en/` mobile | 98 | 100 | 100 | 100 |
| `/vi/` mobile | 98 | 100 | 100 | 100 |
| `/en/work/arbin-ai-assistant/` mobile | 99 | 100 | 100 | 100 |
| `/vi/work/uxo-chatbot-detection/` mobile | 98 | 100 | 100 | 100 |

The reproducible browser audit is `npm run audit -- http://localhost:4321`. It
checks horizontal overflow at 320/360/375/414/768/1024/1440/1920px, WCAG A/AA,
keyboard order and focus visibility, content order, hidden drafts/CV, diagram
alternatives, root redirect, colour usage and the first-1.5-screen requirement.

## Regenerating the Open Graph image

`scripts/og-source.html` is the source for `public/og.png` (1200×630). It is not
served to visitors. Edit it, then render it to a PNG with headless Chrome at that
window size — the instructions are in a comment at the top of the file.

link: https://thangnguyen-ai-portfolio.vercel.app/
