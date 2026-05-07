import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{html,svelte,ts,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--paper-bg)',
          rice: 'var(--paper-rice)',
          cream: 'var(--paper-cream)',
          tea: 'var(--paper-tea)',
          night: 'var(--paper-night)'
        },
        ink: {
          DEFAULT: 'var(--ink)',
          warm: 'var(--ink-warm)',
          cool: 'var(--ink-cool)',
          pencil: 'var(--ink-pencil)',
          shade: 'var(--ink-shade)',
          bleed: 'var(--ink-bleed)',
          stamp: 'var(--ink-red-stamp)'
        },
        sepia: {
          300: 'var(--sepia-300)',
          500: 'var(--sepia-500)',
          700: 'var(--sepia-700)'
        },
        gold: {
          DEFAULT: 'var(--color-accent)',
          300: 'var(--gold-300)',
          500: 'var(--gold-500)',
          700: 'var(--gold-700)'
        }
      },
      fontFamily: {
        masthead: ['var(--font-masthead)', 'serif'],
        body: ['var(--font-body)', 'serif'],
        script: ['var(--font-display-script)', 'cursive'],
        marginal: ['var(--font-marginal)', 'cursive'],
        signature: ['var(--font-signature)', 'cursive'],
        mono: ['var(--font-mono)', 'monospace']
      },
      fontSize: {
        caption: 'var(--fs-caption)',
        body: 'var(--fs-body)',
        lede: 'var(--fs-lede)',
        h3: 'var(--fs-h3)',
        h2: 'var(--fs-h2)',
        h1: 'var(--fs-h1)',
        display: 'var(--fs-display)',
        pull: 'var(--fs-pull)'
      },
      spacing: {
        'margin-l': 'var(--space-margin-l)',
        'margin-r': 'var(--space-margin-r)',
        scene: 'var(--space-7)'
      },
      transitionTimingFunction: {
        breath: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'
      }
    }
  },
  plugins: [typography]
} satisfies Config;
