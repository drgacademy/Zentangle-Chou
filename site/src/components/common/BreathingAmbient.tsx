import { useEffect } from 'react';

/**
 * BreathingAmbient — invisible component that drives a site-wide breath rhythm
 * by writing the `--breath-phase` CSS variable on :root. Components that
 * read this variable (or wear `.breathe`) animate in sync with everyone else.
 *
 * Phase: 0 → 1 over 4s (inhale), 1 → 0 over 4s (exhale).
 */
export default function BreathingAmbient() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const cycleMs = 8000;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) % cycleMs;
      const t = elapsed / cycleMs; // 0..1
      // triangle wave: 0..1..0
      const phase = t < 0.5 ? t * 2 : (1 - t) * 2;
      // smooth with cosine ease
      const eased = (1 - Math.cos(phase * Math.PI)) / 2;
      root.style.setProperty('--breath-phase', eased.toFixed(3));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
