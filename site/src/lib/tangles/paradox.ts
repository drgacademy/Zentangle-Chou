import type { Pt, Rect, TangleOptions } from './types';
import { fmt } from './path';
import { randRange } from './random';

/**
 * Paradox — inside a triangle (or band of triangles), draw straight lines
 * from points on one side to points on the next side, rotating around. The
 * straight segments produce a hypnotic curved-looking spiral inside each
 * triangle. We tile a band of paradox triangles across the rect.
 */
export function paradox(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.7, density = 1 } = opts;
  const triCount = Math.max(3, Math.floor(6 * density));
  const triH = rect.h;
  const triW = rect.w / triCount;

  const parts: string[] = [];
  for (let i = 0; i < triCount; i++) {
    const baseX = rect.x + i * triW;
    const flip = i % 2 === 0;
    let a: Pt, b: Pt, c: Pt;
    if (flip) {
      a = { x: baseX, y: rect.y + triH };
      b = { x: baseX + triW, y: rect.y + triH };
      c = { x: baseX + triW * 0.5, y: rect.y };
    } else {
      a = { x: baseX, y: rect.y };
      b = { x: baseX + triW, y: rect.y };
      c = { x: baseX + triW * 0.5, y: rect.y + triH };
    }
    parts.push(drawParadoxTriangle(a, b, c, rng));
  }

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linejoin="miter">${parts.join('')}</g>`;
}

function drawParadoxTriangle(a: Pt, b: Pt, c: Pt, rng: () => number): string {
  const segs = 8 + Math.floor(rng() * 3);
  const pts: Pt[][] = [
    sample(a, b, segs),
    sample(b, c, segs),
    sample(c, a, segs),
  ];

  const lines: string[] = [];
  // edges
  lines.push(`<path d="M ${fmt(a.x)} ${fmt(a.y)} L ${fmt(b.x)} ${fmt(b.y)} L ${fmt(c.x)} ${fmt(c.y)} Z" />`);

  // For each segment pair, draw lines from side k segment i+1 to side (k+1) segment i
  for (let s = 0; s < 3; s++) {
    const next = (s + 1) % 3;
    const cur = pts[s];
    const nxt = pts[next];
    for (let i = 0; i < segs - 1; i++) {
      const p1 = cur[i + 1];
      const p2 = nxt[segs - 1 - i];
      lines.push(`<path d="M ${fmt(p1.x)} ${fmt(p1.y)} L ${fmt(p2.x)} ${fmt(p2.y)}" />`);
    }
  }

  return lines.join('');
}

function sample(a: Pt, b: Pt, n: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return out;
}
