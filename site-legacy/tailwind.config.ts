import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,tsx,jsx,ts,js,mdx,html}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#FAFAFA',
          100: '#F5F4F1',
          200: '#E8E6E1',
          300: '#C9C6BF',
          400: '#8E8B85',
          500: '#5A5854',
          600: '#2E2D2A',
          700: '#1A1917',
          900: '#0A0A0A',
        },
        sepia: {
          300: '#D4C4A8',
          500: '#8B7355',
          700: '#5C4A33',
        },
        gold: {
          300: '#E8D5A8',
          500: '#C9A961',
          700: '#8B7335',
        },
      },
      fontFamily: {
        'display-en': ['"Caveat Brush"', '"Caveat"', 'cursive'],
        'display-zh': ['"王漢宗中楷體"', '"Noto Serif TC"', 'serif'],
        'heading':    ['"Crimson Pro"', '"Lora"', '"思源宋體"', 'Georgia', 'serif'],
        'body':       ['"Lora"', '"思源宋體"', 'Georgia', 'serif'],
        'signature':  ['"Allura"', '"王漢宗自由字型"', 'cursive'],
        'mono':       ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.80rem', { lineHeight: '1.45' }],
        'sm':   ['0.90rem', { lineHeight: '1.45' }],
        'base': ['1.00rem', { lineHeight: '1.75' }],
        'md':   ['1.125rem', { lineHeight: '1.75' }],
        'lg':   ['1.25rem', { lineHeight: '1.45' }],
        'xl':   ['1.563rem', { lineHeight: '1.45' }],
        '2xl':  ['1.953rem', { lineHeight: '1.20' }],
        '3xl':  ['2.441rem', { lineHeight: '1.20' }],
        '4xl':  ['3.052rem', { lineHeight: '1.20' }],
        '5xl':  ['3.815rem', { lineHeight: '1.10' }],
        'hero': ['4.768rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tight:  '-0.02em',
        normal: '0',
        wide:   '0.04em',
        wider:  '0.08em',
      },
    },
  },
  plugins: [],
} satisfies Config;
