import type { Project } from '../types';

export const smartCalendar: Project = {
  slug: 'smart-calendar',
  order: 3,
  section: 'selected',
  name: 'Smart Calendar',
  role: { en: 'Freelance AI Engineer', vi: 'AI Engineer freelance' },
  org: 'Zencity Foundation',
  period: { en: '06/2025 — now', vi: '06/2025 — nay' },
  status: 'live',

  outcome: {
    en: 'Scheduling app used by 20 teachers, with a recommendation engine that analyses availability and two-way Google Calendar sync.',
    vi: 'App xếp lịch cho 20 giáo viên, với recommendation engine phân tích lịch rảnh và đồng bộ hai chiều Google Calendar.',
  },

  stack: ['React', 'FullCalendar', 'FastAPI', 'Google Calendar API'],

  source: {
    kind: 'public',
    url: 'https://github.com/ThangND99909/Zencity',
  },

  spec: [
    { key: 'role', value: { en: 'Freelance AI Engineer', vi: 'AI Engineer freelance' } },
    { key: 'client', value: { en: 'Zencity Foundation (nonprofit)', vi: 'Zencity Foundation (phi lợi nhuận)' } },
    { key: 'timeline', value: { en: '06/2025 — now', vi: '06/2025 — nay' } },
    { key: 'users', value: { en: '20 teachers', vi: '20 giáo viên' } },
    { key: 'stack', value: ['React', 'FullCalendar', 'FastAPI', 'Google Calendar API'] },
  ],

  problem: {
    en: 'Twenty teachers each keep their own availability, and classes have to be placed into the gaps. Done by hand it means chasing people for free time, then discovering the clash after the calendar invite has gone out.',
    vi: 'Hai mươi giáo viên mỗi người tự giữ lịch rảnh của mình, và lớp phải nhét được vào các khoảng trống đó. Làm tay thì phải đi hỏi từng người, rồi phát hiện trùng lịch sau khi lời mời đã gửi.',
  },

  constraints: {
    en: [
      'Nonprofit budget: no paid scheduling service, and hosting has to stay cheap.',
      "Teachers already live in Google Calendar. The app cannot ask them to keep a second calendar up to date.",
      'Coordinators work in spreadsheets, so the schedule has to leave the app as XLSX.',
      'Real users from day one — 20 teachers, so a broken schedule is 20 people rearranging their week.',
    ],
    vi: [
      'Ngân sách phi lợi nhuận: không dùng dịch vụ xếp lịch trả phí, và chi phí hosting phải thấp.',
      'Giáo viên vốn đã sống trong Google Calendar. App không thể bắt họ duy trì thêm một lịch thứ hai.',
      'Người điều phối làm việc trên bảng tính, nên lịch phải xuất ra được dạng XLSX.',
      'Có người dùng thật ngay từ đầu — 20 giáo viên, nên một lịch sai là 20 người phải xếp lại cả tuần.',
    ],
  },

  diagram: {
    caption: 'SMART CALENDAR · AVAILABILITY → SCHEDULE',
    cols: 2,
    nodes: [
      { id: 'avail', label: 'AVAILABILITY', sub: '20 TEACHERS', col: 0, row: 0 },
      {
        id: 'engine',
        label: 'SLOT ENGINE',
        sub: 'FREE/BUSY ANALYSIS',
        hover: 'RANKED SUGGESTIONS',
        col: 0,
        row: 1,
        tone: 'accent',
      },
      { id: 'api', label: 'FASTAPI', sub: 'REST', col: 0, row: 2 },
      { id: 'ui', label: 'REACT + FULLCALENDAR', sub: 'DRAG TO PLACE', col: 0, row: 3 },
      { id: 'xlsx', label: 'XLSX EXPORT', sub: 'FOR COORDINATORS', col: 1, row: 3 },
      { id: 'gcal', label: 'GOOGLE CALENDAR', sub: 'REALTIME SYNC', col: 0, row: 4 },
    ],
    edges: [
      { from: 'avail', to: 'engine' },
      { from: 'engine', to: 'api', note: 'SUGGESTED SLOTS' },
      { from: 'api', to: 'ui' },
      { from: 'ui', to: 'xlsx' },
      { from: 'ui', to: 'gcal', note: 'TWO-WAY', biDirectional: true },
    ],
  },

  layers: [
    {
      name: 'AVAILABILITY',
      body: {
        en: "Each teacher's free time is read rather than re-entered: the app works from the calendar they already keep.",
        vi: 'Khoảng rảnh của mỗi giáo viên được đọc vào chứ không nhập lại: app làm việc trên lịch họ vốn đã dùng.',
      },
    },
    {
      name: 'SUGGESTION',
      body: {
        en: 'The engine analyses the free/busy picture across teachers and proposes slots. A human still places the class — the suggestion narrows the choice, it does not make it.',
        vi: 'Engine phân tích bức tranh rảnh/bận của các giáo viên và đề xuất slot. Người vẫn là người chốt lớp — gợi ý chỉ thu hẹp lựa chọn, không tự quyết.',
      },
    },
    {
      name: 'INTERFACE',
      body: {
        en: 'React with FullCalendar, so placing a class is a drag rather than a form. FastAPI serves the schedule and the suggestions over REST.',
        vi: 'React với FullCalendar, nên đặt một lớp là kéo thả chứ không phải điền form. FastAPI phục vụ lịch và gợi ý qua REST.',
      },
    },
    {
      name: 'SYNC & EXPORT',
      body: {
        en: 'Changes sync to Google Calendar in real time in both directions, and the whole schedule exports to XLSX for the coordinators who work in spreadsheets.',
        vi: 'Thay đổi đồng bộ realtime hai chiều với Google Calendar, và toàn bộ lịch xuất ra XLSX cho những người điều phối làm việc trên bảng tính.',
      },
    },
  ],

  decisions: [
    {
      title: 'SUGGEST, DO NOT AUTO-ASSIGN',
      todo: true,
      problem: {
        en: 'To fill in — full auto-scheduling is technically possible. What made you stop at suggestions? Teacher preferences the data does not capture, or trust?',
        vi: 'Cần bổ sung — xếp lịch tự động hoàn toàn là làm được. Điều gì khiến chỉ dừng ở gợi ý? Ý muốn của giáo viên mà dữ liệu không thấy, hay vấn đề tin tưởng?',
      },
      choice: {
        en: 'To fill in — what the engine ranks on, and where the human decides.',
        vi: 'Cần bổ sung — engine xếp hạng theo gì, và người quyết ở bước nào.',
      },
      tradeoff: {
        en: 'To fill in — a coordinator still spends time; nobody gets an unusable slot.',
        vi: 'Cần bổ sung — người điều phối vẫn mất thời gian; bù lại không ai bị đặt vào slot không dùng được.',
      },
    },
    {
      title: 'TWO-WAY SYNC & CONFLICTS',
      todo: true,
      problem: {
        en: 'To fill in — an event can change on both sides. What happens when the app and Google Calendar disagree?',
        vi: 'Cần bổ sung — một event có thể bị sửa ở cả hai phía. Khi app và Google Calendar lệch nhau thì xử lý thế nào?',
      },
      choice: {
        en: 'To fill in — which side wins, how you detect the change (polling, webhook, push notifications).',
        vi: 'Cần bổ sung — bên nào thắng, phát hiện thay đổi bằng cách nào (polling, webhook, push notification).',
      },
      tradeoff: {
        en: 'To fill in — API quota and latency against how fresh the calendar looks.',
        vi: 'Cần bổ sung — quota API và latency đổi lấy độ tươi của lịch hiển thị.',
      },
    },
    {
      title: 'XLSX AS AN OUTPUT FORMAT',
      todo: true,
      problem: {
        en: 'To fill in — why an export at all, when the schedule is already on screen?',
        vi: 'Cần bổ sung — vì sao vẫn cần export, khi lịch đã hiện trên màn hình?',
      },
      choice: {
        en: 'To fill in — what the exported sheet contains and who consumes it.',
        vi: 'Cần bổ sung — file xuất ra chứa gì và ai là người dùng nó.',
      },
      tradeoff: {
        en: 'To fill in — an exported file is stale the moment the schedule changes.',
        vi: 'Cần bổ sung — file đã xuất là lạc hậu ngay khi lịch thay đổi.',
      },
    },
  ],

  results: [
    { figure: '20', label: { en: 'teachers using it daily', vi: 'giáo viên dùng hằng ngày' } },
  ],

  resultNote: {
    en: 'In production since June 2025. Source is public, so the scheduling logic can be read rather than taken on trust.',
    vi: 'Chạy production từ tháng 6/2025. Source công khai, nên logic xếp lịch có thể đọc trực tiếp thay vì phải tin lời.',
  },

  media: [
    {
      kind: 'screenshot',
      ratio: '16/9',
      path: '/media/calendar/01-week-view.png',
      caption: {
        en: 'Week view with suggested slots highlighted.',
        vi: 'Khung xem tuần với các slot được gợi ý.',
      },
    },
    {
      kind: 'video',
      ratio: '16/9',
      path: '/media/calendar/demo.mp4',
      caption: {
        en: 'Placing a class and watching it land in Google Calendar.',
        vi: 'Đặt một lớp và xem nó xuất hiện trong Google Calendar.',
      },
    },
  ],
};
