# Portfolio — Nguyen Duc Thang

Bilingual (EN/VI) portfolio for an AI engineer, built as a technical datasheet
rather than a landing page. Next.js App Router, Tailwind CSS, static export.

```bash
npm install
npm run dev        # http://localhost:3000 — see the note on "/" below
npm run build      # writes the static site to out/
npm run typecheck
```

## Deploy

Target is **Vercel**, so there is no `basePath`. Import the repo and accept the
defaults; Vercel detects Next.js and serves the `out/` directory produced by
`output: 'export'`.

**Before the first deploy**, set the real domain in two places:

1. `lib/i18n.ts` → `SITE_URL`. Drives canonical URLs, `hreflang`, Open Graph and
   the JSON-LD.
2. `public/index.html` → the four absolute URLs in `<head>`.

If you ever move to GitHub Pages instead, that repo is a *project* page, so it
needs `basePath: '/Portfolio'` and `assetPrefix` in `next.config.ts` plus a
`.nojekyll` file. Nothing else changes.

## Editing content

No copy lives in a component. Everything is in `content/`:

| File | What it holds |
| --- | --- |
| `content/dict/en.ts` | Every UI string, English. This is the source of truth for the dictionary's shape. |
| `content/dict/vi.ts` | The same strings in Vietnamese, typed against `en.ts` — **adding a key to `en.ts` without translating it fails the build**. |
| `content/profile.ts` | Name, email, phone, GitHub, the CV flag, and the three figures in the metric band. |
| `content/projects/*.ts` | One file per case study: prose, spec sheet, architecture diagram, decisions, results, media slots. |
| `content/timeline.ts` | Career entries, newest first. |
| `content/skills.ts` | Skills grouped by pipeline layer. |

Every prose field is `{ en: '…', vi: '…' }`. Technical terms stay in English in
the Vietnamese copy on purpose (RAG, pipeline, embedding, retrieval, vector
store, prompt engineering) — forcing them into Vietnamese reads worse than
leaving them.

### Adding a project

1. Copy `content/projects/smart-calendar.ts` and edit it.
2. Add it to the array in `content/projects/index.ts`. Order there is the order
   on the home page.

The route, the static params, the `hreflang` pair and the JSON-LD all follow from
that. Nothing else to register.

### Filling in a "Draft — to be filled in" card

Decision cards with `todo: true` render with a dashed border and a visible badge.
The placeholder text is the question that needs answering. Replace the three
fields and delete the `todo: true` line.

### Adding the CV

Drop the file at `public/cv.pdf` and set `cvAvailable: true` in
`content/profile.ts`. Until then the contact block shows an inert control with a
note instead of a link to a 404.

### Adding screenshots and demo videos

Each case study reserves boxes at its real aspect ratio. The path printed in the
box is where the file goes, e.g. `public/media/arbin/01-chat.png`. Dropping a file
in does not move anything on the page.

## Architecture notes

### The diagrams are data

`content/projects/*.ts` describes each diagram as nodes on a grid plus edges:

```ts
{ id: 'qdrant', label: 'QDRANT', sub: 'VECTOR STORE', col: 0, row: 2, tone: 'accent' }
{ from: 'chunk', to: 'qdrant', note: 'EMBEDDINGS' }
```

`lib/diagram-layout.ts` turns that into coordinates and `components/PipelineDiagram.tsx`
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

### There are no client components

The whole site renders on the server. The only client-side behaviour is
`components/PageScript.tsx` — an inline script that adds `is-drawn` to a diagram
when it scrolls into view and records the current locale in `localStorage`.

This was a measured decision, not a preference: with `PipelineDiagram` and
`LocaleSwitch` as client components, throttled-mobile TBT was 302ms and
Performance 87. Moving both to the server took TBT to ~200ms, and the font change
below finished the job.

### Font loading

`preload: false` on all three families. With the fonts preloaded, the LCP element
on every page is a paragraph that repaints when the webfont lands, which put
throttled-mobile LCP at ~2.8s. Without preload, text paints immediately in
next/font's metric-adjusted fallback and LCP drops to ~1.7s — with CLS still 0.
See the comment in `app/[locale]/layout.tsx`.

Also rejected after measuring: `experimental.inlineCss`. Inlining the ~7KB
stylesheet removed a render-blocking request but pushed FCP from 777ms to 953ms,
because the HTML document is itself the critical resource.

### Locale routing without middleware

Middleware does not run under `output: 'export'`, so:

- Every route lives under `app/[locale]/`, and that layout is the root layout —
  which is what gets `<html lang>` right for both locales.
- `/` is `public/index.html`, a hand-written redirect that reads `localStorage`
  and falls back to English. It runs before any framework JavaScript.
- The language switcher takes the current path as a prop from the page, so it
  stays on the page you were reading without needing `usePathname`.
- Links to a locale root have `prefetch={false}`: Next builds a malformed RSC
  payload URL (`/vi/__next.$d$locale.__PAGE__.txt`) for a route whose only
  dynamic segment is the locale, and it 404s. Links to `work/[slug]` are fine.

In dev, `/` is not served by the router — go to `/en/` or `/vi/` directly. The
redirect works in the built output.

### Design tokens

All in the `@theme` block at the top of `app/globals.css`. Two rules the code
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

Lighthouse, against the built output served with the `Cache-Control` headers
Vercel sets:

| Page | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/en/` desktop | 100 | 100 | 100 | 100 |
| `/en/` mobile | 98 | 100 | 100 | 100 |
| `/vi/` mobile | 98 | 100 | 100 | 100 |
| `/en/work/arbin-ai-assistant/` mobile | 99 | 100 | 100 | 100 |
| `/vi/work/uxo-chatbot-detection/` mobile | 98 | 100 | 100 | 100 |

Also checked by hand: no horizontal overflow at 320/360/375/414/768/1024/1440/1920px;
every text node meets AA contrast for its size; every tap target ≥ 28px; console
clean on all routes in both locales; `prefers-reduced-motion` shows finished
diagrams; the root redirect honours a stored locale and defaults to English.

## Regenerating the Open Graph image

`scripts/og-source.html` is the source for `public/og.png` (1200×630). It is not
served to visitors. Edit it, then render it to a PNG with headless Chrome at that
window size — the instructions are in a comment at the top of the file.
