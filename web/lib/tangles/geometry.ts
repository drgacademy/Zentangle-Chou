/**
 * Hand-drawn geometry helpers for the new tangle engine and SketchBorder.
 *
 * Everything returns SVG path "d" strings. Wobble is intentional and
 * driven by a seeded RNG — the same seed always produces the same shape.
 */

import type { Pt, Rect } from './types';

export function fmt(n: number): string {
  return n.toFixed(2);
}

export function dist(a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

/** Cosine-eased lerp to keep wobble samples smooth. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Wobbly polyline between two points, sampled along the segment with
 * perpendicular jitter. Returns an SVG path "M ... L ... L ..." string.
 */
export function wobblyLine(
  a: Pt,
  b: Pt,
  rng: () => number,
  jitter = 1.5,
  samples = 18
): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  let d = `M${fmt(a.x)} ${fmt(a.y)}`;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const px = lerp(a.x, b.x, t);
    const py = lerp(a.y, b.y, t);
    // Triangle window so jitter starts and ends at zero (snaps to endpoints).
    const window = 1 - Math.abs(t - 0.5) * 2;
    const j = (rng() - 0.5) * 2 * jitter * window;
    d += ` L${fmt(px + nx * j)} ${fmt(py + ny * j)}`;
  }
  return d;
}

/** Wobbly closed rectangle border — used for tile borders and SketchBorder. */
export function wobblyRect(
  rect: Rect,
  rng: () => number,
  jitter = 2,
  samplesPerSide = 16
): string {
  const { x, y, w, h } = rect;
  const tl = { x, y };
  const tr = { x: x + w, y };
  const br = { x: x + w, y: y + h };
  const bl = { x, y: y + h };
  const top = wobblyLine(tl, tr, rng, jitter, samplesPerSide);
  const right = wobblyLine(tr, br, rng, jitter, samplesPerSide).slice(top.indexOf(' L') > -1 ? 0 : 0);
  const bottom = wobblyLine(br, bl, rng, jitter, samplesPerSide);
  const left = wobblyLine(bl, tl, rng, jitter, samplesPerSide);
  // Stitch by stripping leading "M" of subsequent segments and appending.
  return [top, right.replace(/^M[^L]*/, ''), bottom.replace(/^M[^L]*/, ''), left.replace(/^M[^L]*/, ''), 'Z'].join(' ');
}

/** Wobbly circle approximated as a sampled polyline. */
export function wobblyCircle(
  cx: number,
  cy: number,
  r: number,
  rng: () => number,
  jitter = 0.6,
  samples = 36
): string {
  let d = '';
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const rr = r + (rng() - 0.5) * 2 * jitter;
    const x = cx + Math.cos(t) * rr;
    const y = cy + Math.sin(t) * rr;
    d += i === 0 ? `M${fmt(x)} ${fmt(y)}` : ` L${fmt(x)} ${fmt(y)}`;
  }
  return d + ' Z';
}

/** Quadratic bowed arc between two points; bows away from the segment center. */
export function bowedArc(a: Pt, b: Pt, bow: number): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bow;
  const cy = my + ny * bow;
  return `M${fmt(a.x)} ${fmt(a.y)} Q${fmt(cx)} ${fmt(cy)} ${fmt(b.x)} ${fmt(b.y)}`;
}

/** A small dot rendered as a tiny circle path (avoids needing &lt;circle&gt;). */
export function dot(cx: number, cy: number, r = 1.3): string {
  // Two-arc circle — works as a closed path that getTotalLength() handles fine.
  return `M${fmt(cx - r)} ${fmt(cy)} a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(r * 2)} 0 a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-r * 2)} 0 Z`;
}

/** Hand-drawn freeform "string" — a slow S curve with two random control points. */
export function pencilString(rect: Rect, rng: () => number): string {
  const { x, y, w, h } = rect;
  // Anchor entry/exit on opposite sides; pick from a small set of layouts.
  const anchors: [Pt, Pt][] = [
    [{ x, y: y + h * 0.35 }, { x: x + w, y: y + h * 0.7 }],
    [{ x: x + w * 0.25, y }, { x: x + w * 0.75, y: y + h }],
    [{ x, y: y + h * 0.6 }, { x: x + w * 0.7, y }]
  ];
  const [a, b] = anchors[Math.floor(rng() * anchors.length)];
  const c1 = { x: x + w * (0.3 + rng() * 0.3), y: y + h * (0.2 + rng() * 0.3) };
  const c2 = { x: x + w * (0.4 + rng() * 0.3), y: y + h * (0.5 + rng() * 0.3) };
  return `M${fmt(a.x)} ${fmt(a.y)} C${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(b.x)} ${fmt(b.y)}`;
}
