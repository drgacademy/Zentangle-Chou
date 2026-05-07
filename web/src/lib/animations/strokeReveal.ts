import { getGsap } from './gsapClient';

/**
 * Animate an SVG <path> as if it's being drawn.
 * Uses stroke-dashoffset (no DrawSVG plugin needed).
 *
 * Returns a paused gsap timeline; consumers call .play() or feed it to
 * ScrollTrigger as the `animation` for scrub-driven scenes.
 */
export function strokeRevealTimeline(
  paths: SVGPathElement[],
  opts: {
    perStrokeMs?: number;
    staggerMs?: number;
    fromAlpha?: number;
    autoPlay?: boolean;
  } = {}
) {
  const gsap = getGsap();
  const tl = gsap.timeline({ paused: !opts.autoPlay });
  const stagger = (opts.staggerMs ?? 80) / 1000;
  const baseMs = opts.perStrokeMs;

  paths.forEach((p, i) => {
    let len = 1;
    try {
      len = p.getTotalLength();
    } catch {
      // detached or unrendered — fall back to visible state.
      p.style.strokeDasharray = '';
      p.style.strokeDashoffset = '';
      return;
    }
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    p.style.opacity = String(opts.fromAlpha ?? 1);
    const dur = (baseMs ?? Math.max(180, Math.min(1400, len * 4))) / 1000;
    tl.to(
      p,
      { strokeDashoffset: 0, duration: dur, ease: 'power2.out' },
      i === 0 ? 0 : `>-${Math.max(dur - stagger, 0)}`
    );
  });

  return tl;
}

/** Snap a list of paths to their final state — used under reduced motion. */
export function snapStrokes(paths: SVGPathElement[]) {
  paths.forEach((p) => {
    p.style.strokeDasharray = '';
    p.style.strokeDashoffset = '';
    p.style.opacity = '1';
  });
}
