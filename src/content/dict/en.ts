/**
 * English is the source of truth. vi.ts is typed against this shape, so adding
 * a key here without translating it fails the build.
 */
export const en = {
  meta: {
    title: 'Nguyen Duc Thang — Applied AI Engineer',
    description:
      'Applied AI Engineer in Da Nang, Vietnam. Nine years in backend and enterprise integrations; shipping production RAG, AI agent and automation systems since 2025.',
    ogAlt: 'Nguyen Duc Thang, AI Engineer — pipeline diagram',
  },

  nav: {
    skipToContent: 'Skip to content',
    backToTop: 'Back to top',
    index: 'Index',
    work: 'Work',
    timeline: 'Career',
    skills: 'Skills',
    contact: 'Contact',
  },

  locale: {
    legend: 'Language',
    toEnglish: 'Read this page in English',
    toVietnamese: 'Read this page in Vietnamese',
  },

  hero: {
    eyebrow: 'Da Nang, Vietnam · Applied AI Engineer',
    name: 'Nguyen Duc Thang',
    viewWork: 'View selected work',
    positioning:
      'I build production AI systems—from RAG assistants serving hundreds of users to AI agents that automate business workflows—drawing on nine years of backend engineering and enterprise integration experience.',
    diagramA11y:
      'Data flow of the Arbin AI assistant, from document ingestion through to the response returned to the user.',
  },

  work: {
    eyebrow: 'Production work · 2025—2026',
    title: 'Selected work',
    experimentsEyebrow: 'Personal capstone · prototype',
    experimentsTitle: 'Experiments',
    readSpec: 'Read spec',
    roleAt: 'at',
  },

  timeline: {
    eyebrow: '2015 → 2026',
    title: 'Career',
    pivot: 'Moved to AI engineering',
    eras: {
      ai: 'AI',
      systems: 'Systems & integration',
      education: 'Education',
    },
  },

  skills: {
    eyebrow: 'Grouped by pipeline layer',
    title: 'Skills',
  },

  contact: {
    eyebrow: 'Da Nang · UTC+7 · remote',
    title: 'Contact',
    availability: 'Open to full-time remote roles and freelance projects.',
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    zalo: 'Zalo',
    messageOnZalo: 'Message on Zalo',
    scanZaloQr: 'Scan QR code',
    zaloQrHelp: 'Scan with your phone camera or Zalo to open this contact.',
    closeZaloQr: 'Close Zalo QR code',
    phone: 'Phone',
    downloadCv: 'Download CV (PDF)',
    cvPending: 'CV file not added yet',
  },

  spec: {
    title: 'Spec',
    keys: {
      role: 'Role',
      timeline: 'Timeline',
      users: 'Users',
      stack: 'Stack',
      status: 'Status',
      source: 'Source',
      client: 'Client',
    },
    status: {
      live: 'Live',
      'in-progress': 'In progress',
      prototype: 'Prototype',
    },
    sourcePublic: 'Public repository',
  },

  study: {
    navLabel: 'Case study sections',
    demoNav: 'Demo',
    problem: 'Problem',
    constraints: 'Constraints',
    architecture: 'Architecture',
    layers: 'Layer by layer',
    decisions: 'Key decisions',
    decisionsIntro:
      'Every choice below had a cheaper or faster alternative. What follows is the problem, the call I made, and what it cost.',
    decision: {
      problem: 'Problem',
      choice: 'Choice',
      tradeoff: 'Trade-off',
    },
    todoBadge: 'Draft — to be filled in',
    result: 'Result',
    media: 'Screenshots & demo',
    mediaHint: 'Reserved space. Drop the file at',
    slot: {
      screenshot: 'Screenshot',
      video: 'Demo video',
    },
    backToIndex: 'All work',
    nextProject: 'Next',
  },

  footer: {
    updated: 'Last updated August 2026',
    build: 'Server-rendered · no analytics, no third-party scripts',
  },
};

/** Not `as const`: vi.ts must satisfy the *shape*, not the literal strings. */
export type Dictionary = typeof en;
