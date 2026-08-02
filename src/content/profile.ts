import type { Metric } from './types';
import { projects } from './projects';

export const profile = {
  name: 'Nguyen Duc Thang',
  nameVi: 'Nguyễn Đức Thắng',
  title: 'Applied AI Engineer',
  location: 'Da Nang, Vietnam',
  email: 'thangnd.pnv@gmail.com',
  phone: '0332201222',
  phoneE164: '+84332201222',
  zaloUrl: 'https://zalo.me/0332201222',
  githubUser: 'ThangND99909',
  githubUrl: 'https://github.com/ThangND99909',
  linkedinUser: 'thang-nguyen-34aa81388',
  linkedinUrl: 'https://www.linkedin.com/in/thang-nguyen-34aa81388/',

  cvPath: '/Nguyen-Duc-Thang-AI-Engineer-CV.pdf',
};

/**
 * The three figures in the metric band. These are the only three places on the
 * home page that use --data (amber), which is what keeps the colour meaningful.
 *
 * The system count below is derived from project status. UXO is a prototype,
 * so it is deliberately not counted as live.
 */
export function metrics(): Metric[] {
  const live = projects.filter((project) => project.status === 'live').length;
  const inProgress = projects.filter((project) => project.status === 'in-progress').length;
  const systemStatus: Metric = inProgress
    ? {
        figure: `${live} · ${inProgress}`,
        label: {
          en: 'Production systems · in progress',
          vi: 'Hệ thống production · đang phát triển',
        },
      }
    : {
        figure: String(live),
        label: {
          en: live === 1 ? 'Production system live' : 'Production systems live',
          vi: 'Hệ thống production đang hoạt động',
        },
      };

  return [
    {
      figure: '~500',
      label: {
        en: 'Daily users · Arbin',
        vi: 'Người dùng/ngày · Arbin',
      },
    },
    systemStatus,
    {
      figure: '9',
      label: {
        en: 'Years backend & integration',
        vi: 'Năm backend & integration',
      },
    },
  ];
}
