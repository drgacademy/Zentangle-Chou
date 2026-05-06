import type { Pt, Rect, TangleOptions } from './types';
import { fmt, moveTo, quadTo } from './path';

/**
 * Nautilus — a single oversized spiral, like the chambered seashell that
 * dominates the center of many classic zentangle tiles. Larger and more
 * deliberate than the smaller Printemps clusters.
 */
export function nautilus(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 1.2 } = opts;
  const cx = rect.x + rect.w * 0.45;
  const cy = rect.y + rect.h * 0.55;
  const maxR = Math.min(rect.w, rect.h) * 0.45;
  const turns = 3.2;
  const segs = Math.floor(turns * 36);

  // Outer spiral
  const outerPts: Pt[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const a = t * turns * Math.PI * 2;
    // logarithmic-ish growth: tighter near the center
    const r = maxR * Math.pow(t, 1.3);
    outerPts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  let outer = moveTo(outerPts[0]);
  for (let i = 1; i < outerPts.length; i++) {
    const prev = outerPts[i - 1];
    const cur = outerPts[i];
    const mid: Pt = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
    outer += ' ' + quadTo(prev, mid);
  }

  // Inner echo (offset perpendicular to make it look chambered)
  const innerPts: Pt[] = [];
  const offset = maxR * 0.06;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const a = t * turns * Math.PI * 2;
    const r = Math.max(2, maxR * Math.pow(t, 1.3) - offset);
    innerPts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  let inner = moveTo(innerPts[0]);
  for (let i = 1; i < innerPts.length; i++) {
    const prev = innerPts[i - 1];
    const cur = innerPts[i];
    const mid: Pt = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
    inner += ' ' + quadTo(prev, mid);
  }

  // Cross-hatched "chambers" — short radial lines at intervals
  const chambers: string[] = [];
  const chamberCount = 18;
  for (let i = 0; i < chamberCount; i++) {
    const t = 0.15 + (i / chamberCount) * 0.85;
    const a = t * turns * Math.PI * 2;
    const r1 = Math.max(2, maxR * Math.pow(t, 1.3) - offset);
    const r2 = maxR * Math.pow(t, 1.3);
    const x1 = cx + Math.cos(a) * r1;
    const y1 = cy + Math.sin(a) * r1;
    const x2 = cx + Math.cos(a) * r2;
    const y2 = cy + Math.sin(a) * r2;
    chambers.push(`<path d="M ${fmt(x1)} ${fmt(y1)} L ${fmt(x2)} ${fmt(y2)}" />`);
  }

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round">
    <path d="${outer}" />
    <path d="${inner}" stroke-width="${strokeWidth * 0.6}" opacity="0.7" />
    ${chambers.join('')}
  </g>`;
}
