import type { Pt, Rect, TangleOptions } from './types';
import { fmt } from './path';
import { randRange } from './random';

/**
 * Tipple — loose clusters of small wobbly circles, like soap bubbles.
 * Generates non-overlapping circle centers via a poisson-disk-ish reject sampler.
 */
export function tipple(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.7, density = 1 } = opts;
  const minR = 2.2;
  const maxR = 5.5;
  const target = Math.floor(rect.w * rect.h * 0.012 * density);
  const placed: { p: Pt; r: number }[] = [];
  const maxAttempts = target * 8;

  for (let i = 0; i < maxAttempts && placed.length < target; i++) {
    const r = randRange(rng, minR, maxR);
    const p: Pt = {
      x: randRange(rng, rect.x + r + 1, rect.x + rect.w - r - 1),
      y: randRange(rng, rect.y + r + 1, rect.y + rect.h - r - 1),
    };
    let ok = true;
    for (const { p: q, r: qr } of placed) {
      if (Math.hypot(p.x - q.x, p.y - q.y) < r + qr + 1) {
        ok = false;
        break;
      }
    }
    if (ok) placed.push({ p, r });
  }

  const circles = placed
    .map(({ p, r }) => `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${fmt(r)}" fill="none" />`)
    .join('');

  // tiny dot inside each circle for character
  const dots = placed
    .filter(() => rng() < 0.55)
    .map(({ p, r }) => `<circle cx="${fmt(p.x + (rng() - 0.5) * r * 0.4)}" cy="${fmt(p.y + (rng() - 0.5) * r * 0.4)}" r="${fmt(0.5)}" fill="${stroke}" />`)
    .join('');

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none">${circles}${dots}</g>`;
}
