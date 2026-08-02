import type { Project } from '../types';

/**
 * Arbin AI Assistant — AZVision.
 *
 * Prose here is written only from facts that are known. Anything that would
 * require inventing a number or a mechanism lives in `decisions` with
 * `todo: true`, where the placeholder text states the question that still needs
 * answering. Fill those in and delete the flag.
 */
export const arbin: Project = {
  slug: 'arbin-ai-assistant',
  order: 1,
  section: 'selected',
  name: 'Arbin AI Assistant',
  role: { en: 'AI Engineer & Team Leader', vi: 'AI Engineer & Team Leader' },
  org: 'AZVision Company',
  period: { en: '10/2025 — now', vi: '10/2025 — nay' },
  status: 'live',

  outcome: {
    en: 'A RAG assistant answering ~500 users a day across three permission tiers, over a knowledge base built from 100+ PDFs and 400+ website pages.',
    vi: 'Trợ lý RAG trả lời ~500 người dùng/ngày qua ba tầng quyền, trên knowledge base dựng từ 100+ PDF và 400+ trang website.',
  },

  stack: ['FastAPI', 'LangChain', 'Qdrant', 'PostgreSQL', 'AWS EC2'],

  source: {
    kind: 'private',
    reason: {
      en: 'Client project — source not public',
      vi: 'Dự án khách hàng — không public source',
    },
  },

  spec: [
    { key: 'role', value: { en: 'AI Engineer & Team Leader', vi: 'AI Engineer & Team Leader' } },
    { key: 'client', value: { en: 'AZVision Company', vi: 'AZVision Company' } },
    { key: 'timeline', value: { en: '10/2025 — now', vi: '10/2025 — nay' } },
    { key: 'users', value: { en: '~500 / day', vi: '~500 / ngày' } },
    { key: 'stack', value: ['FastAPI', 'LangChain', 'Qdrant', 'PostgreSQL', 'AWS EC2'] },
  ],

  problem: {
    en: "AZVision's product knowledge sat in 100+ PDF documents and 400+ pages of website content. Three different audiences needed answers out of it — anonymous visitors, support staff, and admins — and each is allowed to see a different amount of it.",
    vi: 'Kiến thức sản phẩm của AZVision nằm rải trong 100+ tài liệu PDF và 400+ trang nội dung website. Ba nhóm cần tra cứu từ đó — khách vô danh, supporter, admin — và mỗi nhóm được phép thấy lượng thông tin khác nhau.',
  },

  constraints: {
    en: [
      'Client project: the source cannot be published. The architecture below is described from the design, not from a public repository.',
      'Retrieval has to respect three permission tiers, so it cannot be one flat index searched by everyone.',
      'Answer quality is judged by non-engineers — around 10 supporters and admins compare model outputs themselves.',
    ],
    vi: [
      'Dự án khách hàng: không được public source. Phần kiến trúc dưới đây mô tả từ thiết kế, không dẫn từ repository công khai.',
      'Retrieval phải tôn trọng ba tầng quyền, nên không thể là một index phẳng mà ai cũng tra như nhau.',
      'Chất lượng câu trả lời do người không phải engineer đánh giá — khoảng 10 supporter và admin tự so sánh output giữa các model.',
    ],
  },

  diagram: {
    caption: 'ARBIN · INGESTION → RESPONSE',
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
      { id: 'pg', label: 'POSTGRESQL', sub: 'ACCOUNTS · TIERS · LOG', col: 1, row: 2 },
      { id: 'retrieval', label: 'RETRIEVAL', sub: 'TIER-SCOPED', col: 0, row: 3 },
      { id: 'llm', label: 'LLM ROUTER', sub: 'MULTI-PROVIDER', col: 0, row: 4 },
      { id: 'compare', label: 'MODEL COMPARE', sub: '10 REVIEWERS', col: 1, row: 4 },
      { id: 'response', label: 'RESPONSE', sub: '~500 USERS / DAY', col: 0, row: 5 },
    ],
    edges: [
      { from: 'ingest', to: 'chunk', note: '100+ PDF · 400+ URL' },
      { from: 'chunk', to: 'qdrant', note: 'EMBEDDINGS' },
      { from: 'qdrant', to: 'retrieval' },
      { from: 'pg', to: 'retrieval', note: 'TIER FILTER' },
      { from: 'retrieval', to: 'llm', note: 'CONTEXT' },
      { from: 'llm', to: 'compare', note: 'A/B EVAL', dashed: true },
      { from: 'llm', to: 'response' },
    ],
  },

  layers: [
    {
      name: 'INGESTION',
      body: {
        en: 'A web crawler and a PDF loader feed one normalisation step, so a website page and a document reach the chunker in the same shape. The knowledge base is built from 100+ PDFs and 400+ URLs.',
        vi: 'Một crawler website và một PDF loader cùng đổ vào một bước normalise, nên một trang web và một tài liệu tới chunker ở cùng một dạng. Knowledge base dựng từ 100+ PDF và 400+ URL.',
      },
    },
    {
      name: 'INDEX',
      body: {
        en: 'Qdrant stores the embeddings. PostgreSQL stores what a vector store should not: accounts, permission tier, and conversation history.',
        vi: 'Qdrant giữ embedding. PostgreSQL giữ phần mà vector store không nên giữ: tài khoản, tầng quyền, và lịch sử hội thoại.',
      },
    },
    {
      name: 'RETRIEVAL',
      body: {
        en: "A question is answered from the slice of the index the caller's tier allows — anonymous, supporter, or admin. The tier comes out of PostgreSQL and scopes the Qdrant query.",
        vi: 'Câu hỏi được trả lời từ phần index mà tầng quyền của người gọi cho phép — anonymous, supporter, hay admin. Tầng quyền lấy từ PostgreSQL và giới hạn phạm vi truy vấn Qdrant.',
      },
    },
    {
      name: 'SERVING',
      body: {
        en: 'FastAPI on AWS EC2. The LLM call sits behind a provider-agnostic interface; that indirection is what makes the comparison feature possible at all.',
        vi: 'FastAPI trên AWS EC2. Lời gọi LLM nằm sau một interface không phụ thuộc provider; chính lớp gián tiếp đó mới cho phép làm tính năng so sánh model.',
      },
    },
    {
      name: 'REVIEW',
      body: {
        en: 'Around 10 supporters and admins can run the same question through several LLM providers and rate the answers side by side, so answer quality is judged by the people who own the domain rather than by me.',
        vi: 'Khoảng 10 supporter và admin có thể chạy cùng một câu hỏi qua nhiều LLM provider và chấm điểm câu trả lời cạnh nhau, nên chất lượng do người hiểu nghiệp vụ đánh giá chứ không phải tôi.',
      },
    },
  ],

  decisions: [
    {
      title: 'QDRANT VS PINECONE',
      todo: true,
      problem: {
        en: 'To fill in — what forced a choice here? Self-hosting requirement, cost ceiling, latency target, metadata filtering needs?',
        vi: 'Cần bổ sung — điều gì buộc phải chọn ở đây? Yêu cầu self-host, giới hạn chi phí, mục tiêu latency, hay nhu cầu filter theo metadata?',
      },
      choice: {
        en: 'To fill in — Qdrant, and what specifically about it settled it.',
        vi: 'Cần bổ sung — chọn Qdrant, và cụ thể điểm nào của nó quyết định.',
      },
      tradeoff: {
        en: 'To fill in — what you gave up (managed ops, scaling story, team familiarity).',
        vi: 'Cần bổ sung — đánh đổi gì (không có managed ops, câu chuyện scaling, độ quen của team).',
      },
    },
    {
      title: 'CHUNKING STRATEGY',
      todo: true,
      problem: {
        en: 'To fill in — PDFs and crawled pages have very different structure. What broke with a naive split?',
        vi: 'Cần bổ sung — PDF và trang crawl có cấu trúc rất khác nhau. Cách split đơn giản đã hỏng ở đâu?',
      },
      choice: {
        en: 'To fill in — chunk size, overlap, and whether splitting follows document structure or a fixed token count.',
        vi: 'Cần bổ sung — chunk size, overlap, và việc split theo cấu trúc tài liệu hay theo số token cố định.',
      },
      tradeoff: {
        en: 'To fill in — index size and cost against retrieval precision.',
        vi: 'Cần bổ sung — kích thước index và chi phí đổi lấy độ chính xác của retrieval.',
      },
    },
    {
      title: 'MULTI-TURN CONTEXT',
      todo: true,
      problem: {
        en: 'To fill in — follow-up questions lose their referent. How did that show up in real conversations?',
        vi: 'Cần bổ sung — câu hỏi tiếp nối mất mất đối tượng đang nói tới. Chuyện đó biểu hiện thế nào trong hội thoại thật?',
      },
      choice: {
        en: 'To fill in — query rewriting, a rolling summary, a fixed window of turns, or something else.',
        vi: 'Cần bổ sung — rewrite query, summary cuộn, cửa sổ cố định số lượt, hay cách khác.',
      },
      tradeoff: {
        en: 'To fill in — extra latency and token cost per turn against answer relevance.',
        vi: 'Cần bổ sung — thêm latency và token cost mỗi lượt đổi lấy độ liên quan của câu trả lời.',
      },
    },
    {
      title: 'PERMISSION TIERS IN RETRIEVAL',
      todo: true,
      problem: {
        en: 'To fill in — three tiers over one corpus. Filter at query time, or keep separate collections?',
        vi: 'Cần bổ sung — ba tầng quyền trên một corpus. Filter lúc truy vấn, hay tách collection riêng?',
      },
      choice: {
        en: 'To fill in — where the tier check happens and what enforces it.',
        vi: 'Cần bổ sung — việc kiểm tra tầng quyền diễn ra ở đâu và cái gì cưỡng chế nó.',
      },
      tradeoff: {
        en: 'To fill in — duplicated index vs a filter that must never be forgotten.',
        vi: 'Cần bổ sung — index bị lặp, đổi lấy một filter tuyệt đối không được quên.',
      },
    },
  ],

  results: [
    { figure: '~500', label: { en: 'daily users', vi: 'người dùng/ngày' } },
    { figure: '3', label: { en: 'permission tiers', vi: 'tầng quyền' } },
    { figure: '500+', label: { en: 'documents & pages indexed', vi: 'tài liệu & trang đã index' } },
  ],

  resultNote: {
    en: 'In production since October 2025. Model comparison is used by around 10 supporters and admins to review answer quality.',
    vi: 'Chạy production từ tháng 10/2025. Tính năng so sánh model được khoảng 10 supporter và admin dùng để soát chất lượng câu trả lời.',
  },

  media: [
    {
      kind: 'screenshot',
      ratio: '16/9',
      path: '/media/arbin/01-chat.png',
      caption: {
        en: 'Assistant answering a question with its sources.',
        vi: 'Trợ lý trả lời một câu hỏi kèm nguồn dẫn.',
      },
    },
    {
      kind: 'screenshot',
      ratio: '16/9',
      path: '/media/arbin/02-model-compare.png',
      caption: {
        en: 'Model comparison view used by supporters and admins.',
        vi: 'Màn hình so sánh model mà supporter và admin dùng.',
      },
    },
    {
      kind: 'video',
      ratio: '16/9',
      path: '/media/arbin/demo.mp4',
      caption: {
        en: 'Short walkthrough of a support session.',
        vi: 'Video ngắn đi qua một phiên hỗ trợ.',
      },
    },
  ],
};
