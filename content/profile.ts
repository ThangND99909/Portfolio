import type { Metric } from './types';

export const profile = {
  name: 'Nguyen Duc Thang',
  nameVi: 'Nguyễn Đức Thắng',
  title: 'AI Engineer',
  location: 'Da Nang, Vietnam',
  email: 'thangnd.pnv@gmail.com',
  phone: '0332201222',
  phoneE164: '+84332201222',
  githubUser: 'ThangND99909',
  githubUrl: 'https://github.com/ThangND99909',

  /**
   * Set to true once /public/cv.pdf exists. While false the contact block
   * renders a disabled control with a note instead of a link to a 404.
   */
  cvAvailable: false,
  cvPath: '/cv.pdf',
};

/**
 * The three figures in the metric band. These are the only three places on the
 * home page that use --data (amber), which is what keeps the colour meaningful.
 *
 * "3 systems in production" counts Arbin, Student Assessment and Smart
 * Calendar. UXO is a training capstone and is presented as a prototype, so it
 * is deliberately not counted here.
 */
export const metrics: Metric[] = [
  {
    figure: '~500',
    label: {
      en: 'Daily users · Arbin',
      vi: 'Người dùng/ngày · Arbin',
    },
  },
  {
    figure: '3',
    label: {
      en: 'AI systems in production',
      vi: 'Hệ thống AI chạy production',
    },
  },
  {
    figure: '9',
    label: {
      en: 'Years backend & integration',
      vi: 'Năm backend & integration',
    },
  },
];
