export const animations = {
  durationSlow: 4000,    // ms
  durationMedium: 1500,  // ms
  durationFast: 300,     // ms

  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    out: 'ease-out',
  },
} as const;

export const animationLayers = {
  slow: {
    duration: '4–6s',
    use: 'Slow draw: background tangle, scroll cue, hero complete animation',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  medium: {
    duration: '1.5–3s',
    use: 'Page transition, section reveal, tangle step animation',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  fast: {
    duration: '0.3–0.6s',
    use: 'Hover feedback, button interaction, cursor trail',
    easing: 'ease-out or cubic-bezier(0.0, 0, 0.2, 1)',
  },
} as const;

export const pathAnimation = {
  drawPath: {
    strokeDasharray: 'var(--length, 1000)',
    strokeDashoffset: 'var(--length, 1000)',
    animation: 'draw 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  },
} as const;
