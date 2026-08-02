import type { TimelineEntry } from './types';

/**
 * Newest first. `era` drives the rail weight: entries marked 'ai' sit on a
 * solid brand rail, everything before 2025 on a hairline. That switch is the
 * only visual marker for the career pivot — no badge, no accent colour.
 *
 * Magrabbit (10/2015 – 10/2017) flows directly into Trucommerce
 * (11/2017 – 04/2025), with no overlap or gap.
 */
export const timeline: TimelineEntry[] = [
  {
    year: '2026',
    period: '04/2026 — now',
    title: { en: 'AI Agent for Student Assessment', vi: 'AI Agent đánh giá học viên' },
    org: 'Zencity Foundation · freelance',
    detail: {
      en: 'Transcript-to-report pipeline built on the Claude API.',
      vi: 'Pipeline từ transcript ra báo cáo, xây trên Claude API.',
    },
    era: 'ai',
  },
  {
    year: '2025',
    period: '10/2025 — now',
    title: { en: 'AI Engineer & Team Leader', vi: 'AI Engineer & Team Leader' },
    org: 'AZVision Company',
    detail: {
      en: 'Arbin AI assistant: RAG service for ~500 users a day across three permission tiers.',
      vi: 'Trợ lý AI Arbin: dịch vụ RAG cho ~500 người dùng/ngày, ba tầng quyền.',
    },
    era: 'ai',
  },
  {
    year: '2025',
    period: '07/2025 — now',
    title: { en: 'UXO Chatbot & Detection System', vi: 'UXO Chatbot & Detection System' },
    org: 'iViettech',
    detail: {
      en: 'Multimodal capstone: RAG chatbot plus a self-trained YOLOv8 detector.',
      vi: 'Capstone multimodal: RAG chatbot cùng detector YOLOv8 tự train.',
    },
    era: 'ai',
  },
  {
    year: '2025',
    period: '06/2025 — now',
    title: { en: 'Smart Calendar', vi: 'Smart Calendar' },
    org: 'Zencity Foundation · freelance',
    detail: {
      en: 'Scheduling web app used daily by 20 teachers.',
      vi: 'Web app xếp lịch, 20 giáo viên dùng hằng ngày.',
    },
    era: 'ai',
  },
  {
    year: '2025',
    period: '2025',
    title: { en: 'AI Engineer programme', vi: 'Chương trình AI Engineer' },
    org: 'iViettech',
    detail: {
      en: 'AI Engineer programme at the Professional Programmer Training Center.',
      vi: 'Chương trình AI Engineer tại Trung tâm Đào tạo Lập trình viên Chuyên nghiệp.',
    },
    era: 'education',
  },
  {
    year: '2017',
    period: '11/2017 — 04/2025',
    title: {
      en: 'Integration Specialist → Business Solution Leader',
      vi: 'Integration Specialist → Business Solution Leader',
    },
    org: 'Trucommerce & Dicentral',
    detail: {
      en: 'EDI and e-commerce integrations across Shopify, BigCommerce and Salesforce; REST and GraphQL services, data pipelines, and the business analysis around them.',
      vi: 'Integration EDI và e-commerce cho Shopify, BigCommerce, Salesforce; dịch vụ REST và GraphQL, data pipeline, kèm phần phân tích nghiệp vụ đi cùng.',
    },
    era: 'systems',
  },
  {
    year: '2015',
    period: '10/2015 — 10/2017',
    title: { en: 'Programmer', vi: 'Programmer' },
    org: 'Magrabbit',
    detail: {
      en: 'E-commerce backend in Java and Spring Boot.',
      vi: 'Backend e-commerce với Java và Spring Boot.',
    },
    era: 'systems',
  },
  {
    year: '2015',
    period: '2015',
    title: { en: 'Software Developer', vi: 'Software Developer' },
    org: 'Passerelles Numériques Vietnam',
    detail: {
      en: 'Graduated from the Software Developer programme.',
      vi: 'Tốt nghiệp chương trình Software Developer.',
    },
    era: 'education',
  },
];
