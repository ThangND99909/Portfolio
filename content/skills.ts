import type { SkillLayer } from './types';

/**
 * Grouped by the layer each tool occupies in a pipeline, mirroring the
 * architecture diagrams — not dumped as one tag cloud. Layer names are the same
 * vocabulary the diagrams use, so the two sections reinforce each other.
 */
export const skills: SkillLayer[] = [
  {
    name: { en: 'Ingestion & data', vi: 'Ingestion & data' },
    items: ['Python', 'Java', 'SQL', 'PostgreSQL', 'Google Sheets/Drive/Docs API', 'Roboflow'],
  },
  {
    name: { en: 'Retrieval & vector', vi: 'Retrieval & vector' },
    items: ['LangChain', 'LlamaIndex', 'Qdrant', 'Pinecone', 'Chroma', 'FAISS'],
  },
  {
    name: { en: 'Serving & infra', vi: 'Serving & infra' },
    items: ['FastAPI', 'React', 'Streamlit', 'AWS EC2', 'REST', 'GraphQL', 'Git', 'Postman'],
  },
  {
    name: { en: 'ML & vision', vi: 'ML & vision' },
    items: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'YOLOv8'],
  },
];
