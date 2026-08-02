import type { DiagramSpec, Project } from '../types';
import { arbin } from './arbin';
import { studentAssessment } from './student-assessment';
import { smartCalendar } from './smart-calendar';
import { uxo } from './uxo';

const projectContent: Project[] = [arbin, studentAssessment, smartCalendar, uxo];

/** All consumers share the explicit editorial order declared in content. */
export const projects: Project[] = [...projectContent].sort((a, b) => a.order - b.order);
export const selectedProjects = projects.filter((project) => project.section === 'selected');
export const experimentProjects = projects.filter((project) => project.section === 'experiment');

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/**
 * Hero diagram: Arbin's spine only — ingestion through to response, with the
 * tier filter that is the point of the system. The model-comparison branch is a
 * feature detail and lives on the case study page, where there is room to
 * explain it. Same renderer, same geometry, less information.
 */
export const heroDiagram: DiagramSpec = {
  caption: 'ARBIN AI ASSISTANT · INGESTION → RESPONSE',
  cols: 2,
  nodes: [
    { id: 'ingest', label: 'INGEST', sub: 'PDF · WEB CRAWL', col: 0, row: 0 },
    { id: 'chunk', label: 'CHUNK + EMBED', sub: 'NORMALISED TEXT', col: 0, row: 1 },
    {
      id: 'qdrant',
      label: 'QDRANT',
      sub: 'VECTOR STORE',
      hover: '500+ SOURCES INDEXED',
      col: 0,
      row: 2,
      tone: 'accent',
    },
    { id: 'pg', label: 'POSTGRESQL', sub: 'ACCOUNTS · TIERS', col: 1, row: 2 },
    { id: 'retrieval', label: 'RETRIEVAL', sub: 'TIER-SCOPED', col: 0, row: 3 },
    { id: 'llm', label: 'LLM', sub: 'MULTI-PROVIDER', col: 0, row: 4 },
    { id: 'response', label: 'RESPONSE', sub: '~500 USERS / DAY', col: 0, row: 5 },
  ],
  edges: [
    { from: 'ingest', to: 'chunk', note: '100+ PDF · 400+ URL' },
    { from: 'chunk', to: 'qdrant', note: 'EMBEDDINGS' },
    { from: 'qdrant', to: 'retrieval' },
    { from: 'pg', to: 'retrieval', note: '3 TIERS' },
    { from: 'retrieval', to: 'llm', note: 'CONTEXT' },
    { from: 'llm', to: 'response' },
  ],
};
