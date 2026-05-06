import type { Pt, Rect, TangleOptions } from './types';
import { fmt, moveTo, quadTo } from './path';
import { randRange } from './random';

/**
 * Printemps — tight inward spirals, like rosebuds.
 * Renders one spiral by sampling polar coords with shrinking radius.
 */
function spiralPath(cx: number, cy: number, maxR: number, turns: number, rng: () => number): string {
  const segs = Math.max(40, Math.floor(turns * 24));
  const pts: Pt[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const a = t * turns * Math.PI * 2;
    const r = (1 - t) * maxR + (rng() - 0.5) * 0.3;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  let d = moveTo(pts[0]);
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const mid: Pt = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
    d += ' ' + quadTo(prev, mid);
  }
  return d;
}

export function printemps(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.7, density = 1 } = opts;
  const target = Math.max(2, Math.floor(rect.w * rect.h * 0.0008 * density));
  const placed: { x: number; y: number; r: number }[] = [];
  const minR = 5;
  const maxR = 13;

  for (let i = 0; i < target * 6 && placed.length < target; i++) {
    const r = randRange(rng, minR, maxR);
    const x = randRange(rng, rect.x + r + 1, rect.x + rect.w - r - 1);
    const y = randRange(rng, rect.y + r + 1, rect.y + rect.h - r - 1);
    let ok = true;
    for (const q of placed) {
      if (Math.hypot(q.x - x, q.y - y) < r + q.r + 2) {
        ok = false;
        break;
      }
    }
    if (ok) placed.push({ x, y, r });
  }

  const paths = placed
    .map(({ x, y, r }) => {
      const turns = randRange(rng, 2.5, 4);
      return `<path d="${spiralPath(x, y, r, turns, rng)}" />`;
    })
    .join('');

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round">${paths}</g>`;
}
