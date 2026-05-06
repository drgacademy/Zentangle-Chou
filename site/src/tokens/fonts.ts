export const fonts = {
  displayEn: ['"Caveat Brush"', '"Caveat"', 'cursive'],
  displayZh: ['"王漢宗中楷體"', '"Noto Serif TC"', 'serif'],
  headingEn: ['"Crimson Pro"', '"Lora"', 'Georgia', 'serif'],
  headingZh: ['"思源宋體"', '"Noto Serif TC"', 'serif'],
  bodyEn: ['"Lora"', 'Georgia', '"Times New Roman"', 'serif'],
  bodyZh: ['"思源宋體"', '"Noto Serif TC"', '"PMingLiU"', 'serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace', '"Consolas"', 'monospace'],
  signatureEn: ['"Allura"', '"Great Vibes"', 'cursive'],
  signatureZh: ['"王漢宗自由字型"', '"標楷體"', 'cursive'],
} as const;

export const fontSizes = {
  xs: '0.80rem',
  sm: '0.90rem',
  base: '1.00rem',
  md: '1.125rem',
  lg: '1.25rem',
  xl: '1.563rem',
  '2xl': '1.953rem',
  '3xl': '2.441rem',
  '4xl': '3.052rem',
  '5xl': '3.815rem',
  hero: '4.768rem',
} as const;

export const lineHeights = {
  tight: 1.20,
  snug: 1.45,
  relaxed: 1.75,
  zhBody: 1.85,
  loose: 2.00,
} as const;

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.04em',
  wider: '0.08em',
} as const;
