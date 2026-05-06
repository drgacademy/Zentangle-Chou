import type { Pt, Rng } from './types';

export function jitterPt(p: Pt, rng: Rng, amount = 1): Pt {
  return {
    x: p.x + (rng() - 0.5) * amount * 2,
    y: p.y + (rng() - 0.5) * amount * 2,
  };
}

export function fmt(n: number): string {
  return n.toFixed(2);
}

export function moveTo(p: Pt): string {
  return `M ${fmt(p.x)} ${fmt(p.y)}`;
}

export function lineTo(p: Pt): string {
  return `L ${fmt(p.x)} ${fmt(p.y)}`;
}

export function quadTo(c: Pt, p: Pt): string {
  return `Q ${fmt(c.x)} ${fmt(c.y)} ${fmt(p.x)} ${fmt(p.y)}`;
}

export function cubicTo(c1: Pt, c2: Pt, p: Pt): string {
  return `C ${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(p.x)} ${fmt(p.y)}`;
}

/**
 * Build a wobbly polyline path between two points by sampling along the line
 * and offsetting each sample by a small jitter perpendicular to the line.
 */
export function wobblyLine(a: Pt, b: Pt, rng: Rng, jitter = 1, samples = 8): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  const parts: string[] = [moveTo(a)];
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const offset = (rng() - 0.5) * jitter * 2 * (1 - Math.abs(t - 0.5) * 1.6);
    parts.push(
      lineTo({
        x: a.x + dx * t + nx * offset,
        y: a.y + dy * t + ny * offset,
      })
    );
  }
  return parts.join(' ');
}

/**
 * A loose hand-drawn arc between two points, bowed by `bow` units along the
 * perpendicular. Useful for crescents, auras, etc.
 */
export function bowedArc(a: Pt, b: Pt, bow: number, rng: Rng): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bow + (rng() - 0.5) * 0.6;
  const cy = my + ny * bow + (rng() - 0.5) * 0.6;
  return `${moveTo(a)} ${quadTo({ x: cx, y: cy }, b)}`;
}

/**
 * Closed wobbly circle (one revolution). Returns a path "d" string.
 */
export function wobblyCircle(cx: number, cy: number, r: number, rng: Rng, jitter = 0.4, segs = 14): string {
  const pts: Pt[] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const rr = r + (rng() - 0.5) * jitter * r * 0.4;
    pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
  }
  pts.push(pts[0]);
  let d = moveTo(pts[0]);
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const mid: Pt = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
    d += ' ' + quadTo(prev, mid);
  }
  d += ' Z';
  return d;
}
