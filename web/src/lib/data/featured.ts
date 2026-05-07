export type FeaturedWork = {
  src: string;
  alt: string;
  captionZh: string;
  captionEn: string;
  rotate: number;
  seed: string;
};

// Until real artwork photos arrive, all polaroids point at the favicon as a
// placeholder. Replace with /static/artworks/*.jpg when YuChiao provides them.
export const featured: FeaturedWork[] = [
  {
    src: '/favicon.svg',
    alt: 'Florz · 初春',
    captionZh: 'Florz・初春',
    captionEn: 'Florz · Early Spring',
    rotate: -3,
    seed: 'work-1'
  },
  {
    src: '/favicon.svg',
    alt: 'Crescent Moon · 夜雨',
    captionZh: 'Crescent Moon・夜雨',
    captionEn: 'Crescent Moon · Night Rain',
    rotate: 2,
    seed: 'work-2'
  },
  {
    src: '/favicon.svg',
    alt: 'Mooka · 南風',
    captionZh: 'Mooka・南風',
    captionEn: 'Mooka · South Wind',
    rotate: -1,
    seed: 'work-3'
  }
];
