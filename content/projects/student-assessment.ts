import type { Project } from '../types';

export const studentAssessment: Project = {
  slug: 'student-assessment-agent',
  name: 'AI Agent for Student Assessment',
  role: { en: 'Freelance AI Engineer', vi: 'AI Engineer freelance' },
  org: 'Zencity Foundation',
  period: { en: '04/2026 — now', vi: '04/2026 — nay' },
  status: 'production',

  outcome: {
    en: 'Class transcripts go in, per-student assessment reports come out — extracted, stored and mailed without anyone reading a transcript by hand.',
    vi: 'Đưa transcript buổi học vào, nhận ra báo cáo đánh giá từng học viên — trích xuất, lưu và gửi mail mà không ai phải đọc tay transcript.',
  },

  stack: ['Python', 'Claude API', 'Google Sheets API', 'Google Drive API', 'Google Docs API'],

  source: {
    kind: 'private',
    reason: {
      en: 'Client project — source not public',
      vi: 'Dự án khách hàng — không public source',
    },
  },

  spec: [
    { key: 'role', value: { en: 'Freelance AI Engineer', vi: 'AI Engineer freelance' } },
    { key: 'client', value: { en: 'Zencity Foundation (nonprofit)', vi: 'Zencity Foundation (phi lợi nhuận)' } },
    { key: 'timeline', value: { en: '04/2026 — now', vi: '04/2026 — nay' } },
    { key: 'stack', value: ['Python', 'Claude API', 'Google Sheets/Drive/Docs API'] },
    { key: 'status', value: { en: 'In production', vi: 'Đang chạy production' } },
  ],

  problem: {
    en: 'Assessing students meant reading class transcripts end to end and writing up each student by hand. It is slow, it is inconsistent between reviewers, and it does not scale with the number of classes.',
    vi: 'Đánh giá học viên nghĩa là đọc hết transcript buổi học rồi viết nhận xét từng người bằng tay. Chậm, không đồng nhất giữa người đánh giá, và không mở rộng được theo số lớp.',
  },

  constraints: {
    en: [
      'Nonprofit budget: no per-seat SaaS, and API spend has to stay predictable. That is why the work is batched rather than run per request.',
      'Client project: the source cannot be published.',
      'The client already works in Google Sheets, Drive and Docs. The output has to land there, not in a new tool nobody will open.',
      'Transcripts are student data, so they are processed and stored inside the accounts the client already controls.',
    ],
    vi: [
      'Ngân sách phi lợi nhuận: không mua SaaS theo đầu người, và chi phí API phải dự đoán được. Vì vậy việc chạy theo batch chứ không theo từng request.',
      'Dự án khách hàng: không được public source.',
      'Khách hàng vốn đã làm việc trên Google Sheets, Drive, Docs. Kết quả phải rơi vào đó, không phải một công cụ mới không ai mở.',
      'Transcript là dữ liệu học viên, nên được xử lý và lưu trong chính các tài khoản khách hàng đang kiểm soát.',
    ],
  },

  diagram: {
    caption: 'ASSESSMENT AGENT · TRANSCRIPT → REPORT',
    cols: 2,
    nodes: [
      { id: 'ingest', label: 'TRANSCRIPT IN', sub: 'GOOGLE DRIVE', col: 0, row: 0 },
      { id: 'batch', label: 'BATCH RUNNER', sub: 'RETRY + BACKOFF', col: 0, row: 1 },
      { id: 'failed', label: 'FAILED BATCH', sub: 'HELD FOR RE-RUN', col: 1, row: 1 },
      {
        id: 'claude',
        label: 'CLAUDE API',
        sub: 'STRUCTURED PROMPT',
        hover: 'JSON PER STUDENT',
        col: 0,
        row: 2,
        tone: 'accent',
      },
      { id: 'validate', label: 'VALIDATE', sub: 'SCHEMA CHECK', col: 0, row: 3 },
      { id: 'store', label: 'SHEETS + DOCS', sub: 'STRUCTURED STORE', col: 0, row: 4 },
      { id: 'mail', label: 'EMAIL NOTIFY', sub: 'REPORT READY', col: 0, row: 5 },
    ],
    edges: [
      { from: 'ingest', to: 'batch' },
      { from: 'batch', to: 'claude', note: 'BATCHED CALLS' },
      { from: 'batch', to: 'failed', note: 'ON ERROR', dashed: true },
      { from: 'claude', to: 'validate', note: 'JSON' },
      { from: 'validate', to: 'store', note: 'PER-STUDENT METRICS' },
      { from: 'store', to: 'mail' },
    ],
  },

  layers: [
    {
      name: 'INGESTION',
      body: {
        en: 'Transcripts arrive as files in Google Drive. Nothing is uploaded anywhere new — the pipeline reads from where the client already puts them.',
        vi: 'Transcript tới dưới dạng file trên Google Drive. Không upload đi đâu mới — pipeline đọc thẳng từ chỗ khách hàng vẫn đặt file.',
      },
    },
    {
      name: 'EXTRACTION',
      body: {
        en: 'One prompt does the extraction: participation score, comprehension level, and notable quotes, returned as JSON keyed by student. Prompt engineering here is about making the model return the same shape every time, not about making it sound good.',
        vi: 'Một prompt lo phần trích xuất: điểm tham gia, mức độ hiểu bài, và các trích dẫn đáng chú ý, trả về JSON theo từng học viên. Prompt engineering ở đây là để model trả về đúng một cấu trúc mọi lần, không phải để câu trả lời nghe hay.',
      },
    },
    {
      name: 'RELIABILITY',
      body: {
        en: 'Work runs in batches with retry and backoff. A batch that fails is held rather than dropped, so a bad run costs a re-run and not a missing report.',
        vi: 'Việc chạy theo batch, có retry và backoff. Batch lỗi được giữ lại thay vì bỏ đi, nên một lần chạy hỏng chỉ tốn thêm một lần chạy lại chứ không mất báo cáo.',
      },
    },
    {
      name: 'OUTPUT',
      body: {
        en: 'Validated JSON is written into Google Sheets as structured rows and rendered into Docs as the readable report, then an email tells the client it is ready.',
        vi: 'JSON đã validate được ghi vào Google Sheets thành dòng có cấu trúc và render sang Docs thành báo cáo đọc được, rồi một email báo cho khách hàng là đã xong.',
      },
    },
  ],

  decisions: [
    {
      title: 'STRUCTURED OUTPUT, NOT PROSE',
      todo: true,
      problem: {
        en: 'To fill in — what went wrong when the model answered in free text? Parsing failures, missing fields, invented students?',
        vi: 'Cần bổ sung — chuyện gì xảy ra khi model trả lời bằng văn xuôi tự do? Parse lỗi, thiếu field, hay bịa ra học viên?',
      },
      choice: {
        en: 'To fill in — the JSON schema you settled on, and how the prompt enforces it.',
        vi: 'Cần bổ sung — schema JSON đã chốt, và prompt cưỡng chế nó bằng cách nào.',
      },
      tradeoff: {
        en: 'To fill in — a rigid schema loses nuance a human reviewer would have written.',
        vi: 'Cần bổ sung — schema cứng làm mất những sắc thái mà người đánh giá sẽ viết ra.',
      },
    },
    {
      title: 'BATCH VS PER-REQUEST',
      todo: true,
      problem: {
        en: 'To fill in — what made real-time processing the wrong shape here? Cost, rate limits, or that nobody needs the answer within seconds?',
        vi: 'Cần bổ sung — vì sao xử lý realtime không phù hợp ở đây? Chi phí, rate limit, hay vì không ai cần kết quả trong vài giây?',
      },
      choice: {
        en: 'To fill in — batch size, schedule, and what a single run costs.',
        vi: 'Cần bổ sung — batch size, lịch chạy, và một lần chạy tốn bao nhiêu.',
      },
      tradeoff: {
        en: 'To fill in — reports are not instant; a mistake is only visible after the run.',
        vi: 'Cần bổ sung — báo cáo không tức thời; lỗi chỉ lộ ra sau khi chạy xong.',
      },
    },
    {
      title: 'RETRY & FAILURE HANDLING',
      todo: true,
      problem: {
        en: 'To fill in — which failures actually occurred: rate limits, timeouts, malformed JSON, partial batches?',
        vi: 'Cần bổ sung — lỗi nào thực sự đã xảy ra: rate limit, timeout, JSON sai dạng, hay batch chạy dở?',
      },
      choice: {
        en: 'To fill in — retry count, backoff shape, and what happens to a batch that never succeeds.',
        vi: 'Cần bổ sung — số lần retry, kiểu backoff, và batch không bao giờ thành công thì xử lý thế nào.',
      },
      tradeoff: {
        en: 'To fill in — retries cost tokens; giving up early costs a missing student.',
        vi: 'Cần bổ sung — retry tốn token; bỏ sớm thì mất một học viên trong báo cáo.',
      },
    },
    {
      title: 'GOOGLE WORKSPACE AS THE DATABASE',
      todo: true,
      problem: {
        en: 'To fill in — a real database would be cleaner. Why did Sheets and Docs win?',
        vi: 'Cần bổ sung — dùng database thật sẽ gọn hơn. Vì sao Sheets và Docs thắng?',
      },
      choice: {
        en: 'To fill in — the sheet layout and how reports are generated into Docs.',
        vi: 'Cần bổ sung — cách bố trí sheet và cách sinh báo cáo sang Docs.',
      },
      tradeoff: {
        en: 'To fill in — API quotas, no transactions, and a human can edit the store by accident.',
        vi: 'Cần bổ sung — quota API, không có transaction, và người dùng có thể sửa nhầm dữ liệu.',
      },
    },
  ],

  // Only one figure is known for certain here: the three metrics the prompt
  // extracts per student. Counts of students, classes or hours saved are not
  // invented — they belong in this array once measured.
  results: [
    {
      figure: '3',
      label: {
        en: 'metrics extracted per student',
        vi: 'chỉ số trích xuất mỗi học viên',
      },
    },
  ],

  resultNote: {
    en: 'In production since April 2026. Reports for every student in a class are produced from one run and delivered into the client’s existing Google Workspace.',
    vi: 'Chạy production từ tháng 4/2026. Báo cáo cho toàn bộ học viên một lớp được sinh ra từ một lần chạy và giao thẳng vào Google Workspace mà khách hàng đang dùng.',
  },

  media: [
    {
      kind: 'screenshot',
      ratio: '16/9',
      path: '/media/assessment/01-report.png',
      caption: {
        en: 'Generated report for one student.',
        vi: 'Báo cáo sinh ra cho một học viên.',
      },
    },
    {
      kind: 'screenshot',
      ratio: '16/9',
      path: '/media/assessment/02-sheet.png',
      caption: {
        en: 'Structured metrics as written into Google Sheets.',
        vi: 'Chỉ số có cấu trúc khi đã ghi vào Google Sheets.',
      },
    },
  ],
};
