import type { Locale } from '@/lib/i18n';

/**
 * Every piece of prose on the site is a Bi. Both locales are required, so a
 * missing Vietnamese string is a compile error rather than a blank on the page.
 */
export type Bilingual<T = string> = Record<Locale, T>;

/** Convenience alias used throughout the content files. */
export type Text = Bilingual<string>;
export type TextList = Bilingual<string[]>;

/* -------------------------------------------------------------------------- */
/* Diagram spec — the signature element is data, not hand-drawn SVG.          */
/* -------------------------------------------------------------------------- */

export type DiagramNode = {
  id: string;
  /** Mono label, uppercase. Technical terms stay English in both locales. */
  label: string;
  /** Second mono line inside the node. */
  sub?: string;
  /** Replaces `sub` on hover/focus — must be a real technical fact. */
  hover?: string;
  /** Grid position. The layout engine turns these into coordinates. */
  col: number;
  row: number;
  /** Columns spanned; used where two parallel paths merge into one node. */
  span?: number;
  /** `accent` nodes get a brand fill — reserved for the node that is the
   *  point of the diagram (the vector store, the model router...). */
  tone?: 'default' | 'accent';
};

export type DiagramEdge = {
  from: string;
  to: string;
  /** Mono annotation drawn beside the edge. Real figures only. */
  note?: string;
  /** Dashed = fallback / error path rather than the happy path. */
  dashed?: boolean;
  /** Draws arrowheads at both ends (two-way sync). */
  biDirectional?: boolean;
};

export type DiagramSpec = {
  /** Mono caption above the frame. */
  caption: string;
  /** Number of grid columns; the engine derives the viewBox from this. */
  cols: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

/* -------------------------------------------------------------------------- */
/* Case study                                                                 */
/* -------------------------------------------------------------------------- */

export type SpecRow = {
  /** Mono key, e.g. "ROLE". Translated via the dictionary, not here. */
  key: 'role' | 'timeline' | 'users' | 'stack' | 'status' | 'source' | 'client';
  /** Either a bilingual string or a language-neutral list (stack names). */
  value: Text | string[];
};

export type ArchLayer = {
  /** Mono heading, e.g. "INGESTION". */
  name: string;
  body: Text;
};

export type Decision = {
  /** Mono title framed as the decision itself, e.g. "QDRANT VS PINECONE". */
  title: string;
  problem: Text;
  choice: Text;
  tradeoff: Text;
  /** True while the real answer is still owed by the site owner. */
  todo?: boolean;
};

export type ResultFigure = {
  /** The number. Rendered large in --data; the only place that colour appears
   *  on a case study page. */
  figure: string;
  label: Text;
};

export type MediaSlot = {
  kind: 'screenshot' | 'video';
  /** 16 / 9 style aspect ratio for the reserved box. */
  ratio: '16/9' | '4/3';
  /** Note telling the owner exactly which file to drop in. */
  path: string;
  caption: Text;
};

export type Project = {
  slug: string;
  /** Product name — not translated. */
  name: string;
  role: Text;
  org: string;
  /** Mono eyebrow: real dates + status, never a decorative 01/02/03.
   *  Bilingual because the open end reads "now" in English and "nay" in
   *  Vietnamese — a shared string leaves one locale half-translated. */
  period: Text;
  status: 'production' | 'prototype';
  /** One line of business outcome. Leads every card and every page. */
  outcome: Text;
  /** Stack chips for the index row. Language-neutral. */
  stack: string[];
  source: { kind: 'public'; url: string } | { kind: 'private'; reason: Text };
  spec: SpecRow[];
  problem: Text;
  constraints: TextList;
  diagram: DiagramSpec;
  layers: ArchLayer[];
  decisions: Decision[];
  results: ResultFigure[];
  resultNote: Text;
  media: MediaSlot[];
};

export type TimelineEntry = {
  /** Year label on the rail. Repeat years are rendered once. */
  year: string;
  period: string;
  title: Text;
  org: string;
  detail: Text;
  /** Entries from the 2025 pivot onward. The rail switches weight here. */
  era: 'ai' | 'systems' | 'education';
};

export type SkillLayer = {
  /** Mono layer name, mirroring the architecture diagrams. */
  name: Text;
  items: string[];
};

export type Metric = {
  figure: string;
  label: Text;
};
