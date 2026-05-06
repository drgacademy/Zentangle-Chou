import type { Pt, Rect, Rng } from './types';
import { fmt } from './path';
import { randRange } from './random';

/**
 * Generates a "string" — a meandering hand-drawn curve that divides a tile
 * into 2-5 organic regions. Returns the SVG path "d" string.
 */
export function stringPath(rect: Rect, rng: Rng): string {
  const startSide = Math.floor(rng() * 4);
  const endSide = (startSide + 2) % 4; // opposite side

  const sidePoint = (side: number, t: number): Pt => {
    switch (side) {
      case 0: return { x: rect.x + t * rect.w, y: rect.y };
      case 1: return { x: rect.x + rect.w, y: rect.y + t * rect.h };
      case 2: return { x: rect.x + (1 - t) * rect.w, y: rect.y + rect.h };
      default: return { x: rect.x, y: rect.y + (1 - t) * rect.h };
    }
  };

  const start = sidePoint(startSide, randRange(rng, 0.2, 0.8));
  const end = sidePoint(endSide, randRange(rng, 0.2, 0.8));

  // 2-3 control waypoints
  const wpCount = Math.floor(randRange(rng, 2, 4));
  const wps: Pt[] = [];
  for (let i = 1; i <= wpCount; i++) {
    const t = i / (wpCount + 1);
    wps.push({
      x: start.x + (end.x - start.x) * t + (rng() - 0.5) * rect.w * 0.5,
      y: start.y + (end.y - start.y) * t + (rng() - 0.5) * rect.h * 0.5,
    });
  }

  let d = `M ${fmt(start.x)} ${fmt(start.y)}`;
  let prev = start;
  for (const wp of wps) {
    const c1: Pt = {
      x: prev.x + (wp.x - prev.x) * 0.5 + (rng() - 0.5) * 30,
      y: prev.y + (wp.y - prev.y) * 0.5 + (rng() - 0.5) * 30,
    };
    d += ` Q ${fmt(c1.x)} ${fmt(c1.y)} ${fmt(wp.x)} ${fmt(wp.y)}`;
    prev = wp;
  }
  d += ` Q ${fmt((prev.x + end.x) / 2 + (rng() - 0.5) * 30)} ${fmt(
    (prev.y + end.y) / 2 + (rng() - 0.5) * 30
  )} ${fmt(end.x)} ${fmt(end.y)}`;

  return d;
}

/**
 * Generates a soft section divider — a flowing horizontal curve to use
 * between page sections instead of a horizontal rule.
 */
export function sectionDivider(width: number, rng: Rng, height = 24): string {
  const samples = 6;
  const pts: Pt[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = t * width;
    const yBase = height / 2;
    const y = yBase + Math.sin(t * Math.PI * 1.5 + rng() * 0.5) * (height * 0.35) + (rng() - 0.5) * 1.2;
    pts.push({ x, y });
  }
  let d = `M ${fmt(pts[0].x)} ${fmt(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const cx = (prev.x + cur.x) / 2;
    const cy = (prev.y + cur.y) / 2;
    d += ` Q ${fmt(prev.x + (cx - prev.x))} ${fmt(prev.y + (cy - prev.y))} ${fmt(cur.x)} ${fmt(cur.y)}`;
  }
  return d;
}
