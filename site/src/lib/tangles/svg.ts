import type { Pt, Rng } from './types';

export function f(n: number): string {
  return n.toFixed(2);
}

export function jitter(rng: Rng, amount: number): number {
  return (rng() - 0.5) * amount * 2;
}

export function path(d: string, attrs = ''): string {
  return `<path d="${d}"${attrs ? ' ' + attrs : ''} />`;
}

export function strokePath(d: string): string {
  return `<path d="${d}" />`;
}

export function fillPath(d: string, fill = 'currentColor'): string {
  return `<path d="${d}" fill="${fill}" stroke="none" />`;
}

export function dotMark(x: number, y: number, r = 0.7, fill = 'currentColor'): string {
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" stroke="none" />`;
}

export function ring(cx: number, cy: number, r: number): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" />`;
}

export function disc(cx: number, cy: number, r: number, fill = 'currentColor'): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" stroke="none" />`;
}

export function lineSeg(a: Pt, b: Pt): string {
  return `M ${f(a.x)} ${f(a.y)} L ${f(b.x)} ${f(b.y)}`;
}

/** A faintly wobbly line, sampled `samples` times with perpendicular jitter. */
export function wobLine(a: Pt, b: Pt, rng: Rng, jit = 0.6, samples = 10): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let d = `M ${f(a.x)} ${f(a.y)}`;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const taper = Math.sin(t * Math.PI);
    const off = (rng() - 0.5) * jit * 2 * taper;
    d += ` L ${f(a.x + dx * t + nx * off)} ${f(a.y + dy * t + ny * off)}`;
  }
  return d;
}

/** Curve from a to b, bowed perpendicular by `bow` (positive = right of dir). */
export function arcAB(a: Pt, b: Pt, bow: number, rng?: Rng): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const j = rng ? (rng() - 0.5) * 0.4 : 0;
  const cx = mx + nx * bow + j;
  const cy = my + ny * bow + j;
  return `M ${f(a.x)} ${f(a.y)} Q ${f(cx)} ${f(cy)} ${f(b.x)} ${f(b.y)}`;
}

/** Closed wobbly circle (one revolution). */
export function wobCircle(cx: number, cy: number, r: number, rng: Rng, jit = 0.3, segs = 16): string {
  const pts: Pt[] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const rr = r + (rng() - 0.5) * jit * r;
    pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
  }
  pts.push(pts[0]);
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const mid = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
    d += ` Q ${f(prev.x)} ${f(prev.y)} ${f(mid.x)} ${f(mid.y)}`;
  }
  return d + ' Z';
}

/** Build a polygon path from a point list, closed. */
export function polygon(pts: Pt[]): string {
  if (pts.length === 0) return '';
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${f(pts[i].x)} ${f(pts[i].y)}`;
  return d + ' Z';
}

/** Group SVG content with stroke/fill defaults. */
export function strokeGroup(content: string, strokeWidth = 0.9): string {
  return `<g stroke="currentColor" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round">${content}</g>`;
}

export function fillGroup(content: string): string {
  return `<g fill="currentColor" stroke="none">${content}</g>`;
}

/** Half-circle arc using SVG's elliptical arc; sweep flag picks the side. */
export function halfArc(a: Pt, b: Pt, r: number, sweep: 0 | 1): string {
  return `M ${f(a.x)} ${f(a.y)} A ${f(r)} ${f(r)} 0 0 ${sweep} ${f(b.x)} ${f(b.y)}`;
}

/** Sample a smooth wavy horizontal line as a quadratic-spline path. */
export function waveLine(x0: number, y0: number, x1: number, y1: number, amp: number, periods: number, rng: Rng): string {
  const samples = Math.max(8, Math.floor(periods * 6));
  const pts: Pt[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 2 * periods) * amp + (rng() - 0.5) * 0.4;
    pts.push({ x, y });
  }
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const mid = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
    d += ` Q ${f(prev.x)} ${f(prev.y)} ${f(mid.x)} ${f(mid.y)}`;
  }
  return d;
}
