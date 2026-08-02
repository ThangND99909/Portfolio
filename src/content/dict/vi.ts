import type { Dictionary } from './en';

/**
 * Rewritten for Vietnamese readers rather than translated line by line.
 * Technical terms stay in English on purpose — RAG, pipeline, embedding,
 * retrieval, vector store, prompt engineering read as themselves to Vietnamese
 * engineers and forcing them into Vietnamese only makes the page harder to
 * trust. Lengths are kept close to the English so the layout does not shift
 * when the language changes.
 */
export const vi: Dictionary = {
  meta: {
    title: 'Nguyễn Đức Thắng — Applied AI Engineer',
    description:
      'Applied AI Engineer tại Đà Nẵng. Chín năm làm backend và enterprise integration; từ 2025 triển khai RAG, AI agent và hệ thống automation trên production.',
    ogAlt: 'Nguyễn Đức Thắng, AI Engineer — sơ đồ pipeline',
  },

  nav: {
    skipToContent: 'Tới nội dung chính',
    backToTop: 'Về đầu trang',
    index: 'Trang chủ',
    work: 'Dự án',
    timeline: 'Quá trình',
    skills: 'Kỹ năng',
    contact: 'Liên hệ',
  },

  locale: {
    legend: 'Ngôn ngữ',
    toEnglish: 'Đọc trang này bằng tiếng Anh',
    toVietnamese: 'Đọc trang này bằng tiếng Việt',
  },

  hero: {
    eyebrow: 'Đà Nẵng, Việt Nam · Applied AI Engineer',
    name: 'Nguyễn Đức Thắng',
    viewWork: 'Xem dự án chọn lọc',
    positioning:
      'Tôi xây các hệ thống AI chạy trên production — từ trợ lý RAG phục vụ hàng trăm người dùng đến AI agent tự động hóa quy trình nghiệp vụ — dựa trên chín năm kinh nghiệm backend engineering và enterprise integration.',
    diagramA11y:
      'Luồng dữ liệu của trợ lý AI Arbin, từ bước ingest tài liệu đến câu trả lời trả về cho người dùng.',
  },

  work: {
    eyebrow: 'Dự án production · 2025—2026',
    title: 'Dự án chọn lọc',
    experimentsEyebrow: 'Capstone cá nhân · prototype',
    experimentsTitle: 'Thử nghiệm',
    readSpec: 'Xem spec',
    roleAt: 'tại',
  },

  timeline: {
    eyebrow: '2015 → 2026',
    title: 'Quá trình làm việc',
    pivot: 'Chuyển sang AI engineering',
    eras: {
      ai: 'AI',
      systems: 'Systems & integration',
      education: 'Học vấn',
    },
  },

  skills: {
    eyebrow: 'Xếp theo tầng trong pipeline',
    title: 'Kỹ năng',
  },

  contact: {
    eyebrow: 'Đà Nẵng · UTC+7 · remote',
    title: 'Liên hệ',
    availability: 'Sẵn sàng cho vị trí full-time remote và dự án freelance.',
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    zalo: 'Zalo',
    messageOnZalo: 'Nhắn qua Zalo',
    scanZaloQr: 'Quét mã QR',
    zaloQrHelp: 'Dùng camera điện thoại hoặc Zalo để mở liên hệ này.',
    closeZaloQr: 'Đóng mã QR Zalo',
    phone: 'Điện thoại',
    downloadCv: 'Tải CV (PDF)',
    cvPending: 'Chưa có file CV',
  },

  spec: {
    title: 'Thông số',
    keys: {
      role: 'Vai trò',
      timeline: 'Thời gian',
      users: 'Người dùng',
      stack: 'Stack',
      status: 'Trạng thái',
      source: 'Source',
      client: 'Khách hàng',
    },
    status: {
      live: 'Đang hoạt động',
      'in-progress': 'Đang phát triển',
      prototype: 'Prototype',
    },
    sourcePublic: 'Repository công khai',
  },

  study: {
    navLabel: 'Các phần trong case study',
    demoNav: 'Demo',
    problem: 'Vấn đề',
    constraints: 'Giới hạn',
    architecture: 'Kiến trúc',
    layers: 'Giải thích từng tầng',
    decisions: 'Quyết định kỹ thuật',
    decisionsIntro:
      'Mỗi lựa chọn dưới đây đều có phương án rẻ hơn hoặc nhanh hơn. Phần này ghi lại vấn đề, quyết định tôi chọn, và cái giá phải trả.',
    decision: {
      problem: 'Vấn đề',
      choice: 'Lựa chọn',
      tradeoff: 'Đánh đổi',
    },
    todoBadge: 'Bản nháp — chờ bổ sung',
    result: 'Kết quả',
    media: 'Screenshot & demo',
    mediaHint: 'Chỗ chừa sẵn. Đặt file tại',
    slot: {
      screenshot: 'Screenshot',
      video: 'Video demo',
    },
    backToIndex: 'Tất cả dự án',
    nextProject: 'Tiếp',
  },

  footer: {
    updated: 'Cập nhật tháng 8/2026',
    build: 'Server-rendered · không analytics, không script bên thứ ba',
  },
};
