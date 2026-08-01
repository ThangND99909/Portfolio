import type { Project } from '../types';

/**
 * Presented as a prototype, not a production system: this is the capstone of
 * the iViettech AI Engineer programme. It is deliberately excluded from the
 * "3 AI systems in production" figure on the home page.
 */
export const uxo: Project = {
  slug: 'uxo-chatbot-detection',
  order: 4,
  section: 'experiment',
  name: 'UXO Chatbot & Detection System',
  role: { en: 'AI Engineer (capstone)', vi: 'AI Engineer (capstone)' },
  org: 'iViettech',
  period: { en: '07/2025 — now', vi: '07/2025 — nay' },
  status: 'prototype',

  outcome: {
    en: 'Multimodal prototype for unexploded ordnance safety: a RAG chatbot for the written guidance, and a self-trained YOLOv8 detector that flags ordnance in an image.',
    vi: 'Prototype multimodal về an toàn vật liệu nổ còn sót: một RAG chatbot cho phần tài liệu hướng dẫn, và một detector YOLOv8 tự train để cảnh báo vật liệu nổ trong ảnh.',
  },

  stack: ['YOLOv8', 'Roboflow', 'LangChain', 'Chroma', 'FastAPI', 'Streamlit'],

  source: {
    kind: 'public',
    url: 'https://github.com/ThangND99909/UXO-Chatbot',
  },

  spec: [
    { key: 'role', value: { en: 'AI Engineer (capstone)', vi: 'AI Engineer (capstone)' } },
    { key: 'client', value: { en: 'iViettech — AI Engineer programme', vi: 'iViettech — chương trình AI Engineer' } },
    { key: 'timeline', value: { en: '07/2025 — now', vi: '07/2025 — nay' } },
    { key: 'stack', value: ['YOLOv8', 'Roboflow', 'LangChain', 'Chroma', 'FastAPI', 'Streamlit'] },
  ],

  problem: {
    en: 'Guidance on unexploded ordnance exists as written documents, but the question in the field is visual: is the thing in front of me dangerous? Text search and image recognition answer two halves of the same question, and neither is useful alone.',
    vi: 'Hướng dẫn về vật liệu nổ còn sót tồn tại dưới dạng tài liệu văn bản, nhưng câu hỏi ngoài thực địa lại là câu hỏi hình ảnh: vật trước mặt tôi có nguy hiểm không? Tìm kiếm văn bản và nhận dạng ảnh trả lời hai nửa của cùng một câu hỏi, và không nửa nào tự đủ.',
  },

  constraints: {
    en: [
      'No off-the-shelf dataset for this domain, so the training images were labelled by hand in Roboflow.',
      'No GPU budget: the detector was trained on Kaggle.',
      'A capstone rather than a deployed system. It is presented here as a prototype, and it is not counted among the production systems on the home page.',
    ],
    vi: [
      'Không có dataset sẵn cho lĩnh vực này, nên ảnh huấn luyện được gán nhãn tay bằng Roboflow.',
      'Không có ngân sách GPU: detector được train trên Kaggle.',
      'Đây là capstone chứ không phải hệ thống đã triển khai. Trang này trình bày nó như một prototype, và nó không được tính vào số hệ thống production ở trang chủ.',
    ],
  },

  diagram: {
    caption: 'UXO · TEXT PATH + VISION PATH → ONE INTERFACE',
    cols: 2,
    nodes: [
      { id: 'docs', label: 'DOC CORPUS', sub: 'SAFETY GUIDANCE', col: 0, row: 0 },
      { id: 'images', label: 'IMAGE DATASET', sub: 'ROBOFLOW LABELS', col: 1, row: 0 },
      { id: 'chunk', label: 'CHUNK + EMBED', sub: 'LANGCHAIN', col: 0, row: 1 },
      { id: 'train', label: 'YOLOV8 TRAIN', sub: 'KAGGLE GPU', col: 1, row: 1 },
      {
        id: 'chroma',
        label: 'CHROMA',
        sub: 'VECTOR STORE',
        col: 0,
        row: 2,
        tone: 'accent',
      },
      {
        id: 'detector',
        label: 'DETECTOR',
        sub: 'BBOX + CONFIDENCE',
        col: 1,
        row: 2,
        tone: 'accent',
      },
      { id: 'rag', label: 'RAG ANSWER', sub: 'CITED GUIDANCE', col: 0, row: 3 },
      { id: 'alert', label: 'ALERT', sub: 'ON DETECTION', col: 1, row: 3 },
      { id: 'ui', label: 'STREAMLIT', sub: 'CHAT + IMAGE UPLOAD', col: 0, row: 4, span: 2 },
    ],
    edges: [
      { from: 'docs', to: 'chunk' },
      { from: 'chunk', to: 'chroma', note: 'EMBEDDINGS' },
      { from: 'chroma', to: 'rag' },
      { from: 'images', to: 'train', note: 'HAND-LABELLED' },
      { from: 'train', to: 'detector', note: 'WEIGHTS' },
      { from: 'detector', to: 'alert' },
      { from: 'rag', to: 'ui' },
      { from: 'alert', to: 'ui' },
    ],
  },

  layers: [
    {
      name: 'TEXT PATH',
      body: {
        en: 'Safety documents are chunked, embedded and stored in Chroma. LangChain retrieves the relevant passages so an answer can cite the guidance it came from rather than paraphrase it.',
        vi: 'Tài liệu an toàn được chunk, embed và lưu trong Chroma. LangChain lấy ra đoạn liên quan để câu trả lời dẫn được đúng nguồn hướng dẫn thay vì diễn giải lại.',
      },
    },
    {
      name: 'VISION PATH',
      body: {
        en: 'The dataset was labelled by hand in Roboflow because nothing suitable existed. YOLOv8 was trained on Kaggle, and the resulting weights produce bounding boxes with a confidence score.',
        vi: 'Dataset được gán nhãn tay trong Roboflow vì không có bộ nào phù hợp. YOLOv8 được train trên Kaggle, và bộ weight thu được cho ra bounding box kèm điểm tin cậy.',
      },
    },
    {
      name: 'MERGE',
      body: {
        en: 'Both paths surface in one Streamlit interface: ask a question, or upload an image and get a warning. The two are separate models, not one multimodal model — which keeps each one debuggable on its own.',
        vi: 'Cả hai luồng hiện ra trong một interface Streamlit: hỏi một câu, hoặc upload một ảnh và nhận cảnh báo. Đây là hai model riêng chứ không phải một model multimodal — nhờ vậy mỗi phần vẫn debug được độc lập.',
      },
    },
  ],

  decisions: [
    {
      title: 'TWO MODELS, NOT ONE MULTIMODAL MODEL',
      todo: true,
      problem: {
        en: 'To fill in — a single vision-language model could answer both kinds of question. Why keep the paths separate?',
        vi: 'Cần bổ sung — một vision-language model duy nhất có thể trả lời cả hai loại câu hỏi. Vì sao vẫn tách hai luồng?',
      },
      choice: {
        en: 'To fill in — separate RAG and detection paths joined only at the interface.',
        vi: 'Cần bổ sung — tách RAG và detection, chỉ nối lại ở tầng interface.',
      },
      tradeoff: {
        en: 'To fill in — two models to maintain; no reasoning that spans text and image together.',
        vi: 'Cần bổ sung — phải bảo trì hai model; không có suy luận nối liền văn bản và hình ảnh.',
      },
    },
    {
      title: 'LABELLING THE DATASET BY HAND',
      todo: true,
      problem: {
        en: 'To fill in — how many images, how many classes, and where did the images come from?',
        vi: 'Cần bổ sung — bao nhiêu ảnh, bao nhiêu class, và ảnh lấy từ đâu?',
      },
      choice: {
        en: 'To fill in — Roboflow, the class taxonomy, and the augmentations applied.',
        vi: 'Cần bổ sung — dùng Roboflow, hệ class đã định, và các augmentation đã áp dụng.',
      },
      tradeoff: {
        en: 'To fill in — a small hand-labelled set limits how far the detector generalises.',
        vi: 'Cần bổ sung — bộ dữ liệu nhỏ gán nhãn tay giới hạn khả năng tổng quát hoá của detector.',
      },
    },
    {
      title: 'CONFIDENCE THRESHOLD FOR A SAFETY ALERT',
      todo: true,
      problem: {
        en: 'To fill in — in this domain a false negative is far worse than a false positive. Where did you set the threshold and why?',
        vi: 'Cần bổ sung — trong lĩnh vực này, bỏ sót nguy hiểm hơn báo nhầm rất nhiều. Ngưỡng được đặt ở đâu và vì sao?',
      },
      choice: {
        en: 'To fill in — the threshold, and how the alert is worded so a low-confidence hit is not read as certainty.',
        vi: 'Cần bổ sung — ngưỡng đã chọn, và cảnh báo được viết thế nào để một kết quả tin cậy thấp không bị hiểu là chắc chắn.',
      },
      tradeoff: {
        en: 'To fill in — a low threshold means alert fatigue; a high one means missed ordnance.',
        vi: 'Cần bổ sung — ngưỡng thấp gây mệt vì báo động liên tục; ngưỡng cao thì bỏ sót vật liệu nổ.',
      },
    },
  ],

  // Training metrics (mAP, precision/recall, dataset size) are not filled in
  // because they have to come from the actual training run, not from a guess.
  results: [
    { figure: '2', label: { en: 'modalities in one interface', vi: 'modality trong một interface' } },
  ],

  resultNote: {
    en: 'Prototype, source public. Detector metrics from the training run are not published here yet — they belong in this section once read off the actual run rather than estimated.',
    vi: 'Prototype, source công khai. Chỉ số của detector từ lần train chưa đưa lên đây — chúng sẽ nằm ở phần này khi đọc ra từ lần train thật chứ không phải ước lượng.',
  },

  media: [
    {
      kind: 'screenshot',
      ratio: '16/9',
      path: '/media/uxo/01-detection.png',
      caption: {
        en: 'Detection on an uploaded image, with bounding box and confidence.',
        vi: 'Kết quả detect trên ảnh upload, kèm bounding box và độ tin cậy.',
      },
    },
    {
      kind: 'screenshot',
      ratio: '16/9',
      path: '/media/uxo/02-chat.png',
      caption: {
        en: 'Chatbot answering from the safety guidance corpus.',
        vi: 'Chatbot trả lời từ corpus tài liệu an toàn.',
      },
    },
  ],
};
