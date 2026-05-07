import type { Pattern, Stroke } from '../types';
import { fmt } from '../geometry';

/**
 * Paradox — Rick Roberts's recursive vanishing-quadrilateral. Asymmetric
 * inset (toward upper-right) so the optical illusion has a clear focus.
 * Each iteration emits 4 wobbly line segments and (every other level) a
 * black-fill ring, producing the classic alternating-band appearance.
 */
export const paradox: Pattern = {
  slug: 'paradox',
  steps: [
    { labelZh: '1. 四角入', labelEn: '1. Four corners' },
    { labelZh: '2. 遞迴', labelEn: '2. Recurse' },
    { labelZh: '3. 黑帶', labelEn: '3. Alternating bands' }
  ],
  build(rect, ctx) {
    const strokes: Stroke[] = [];
    const { x, y, w, h } = rect;
    const r = ctx.rng;
    let id = 0;
    const jitter = ctx.jitter;

    const corners = [
      { x: x, y: y },
      { x: x + w, y: y },
      { x: x + w, y: y + h },
      { x: x + w * 0.18, y: y + h }
    ];

    const levels = 14;
    const tStep = 0.13;

    const allQuads: { x: number; y: number }[][] = [];
    let current = corners.map((p) => ({ ...p }));
    for (let lev = 0; lev < levels; lev++) {
      allQuads.push(current.map((p) => ({ ...p })));
      const next: { x: number; y: number }[] = [];
      for (let k = 0; k < 4; k++) {
        const p = current[k];
        const q = current[(k + 1) % 4];
        next.push({ x: p.x + (q.x - p.x) * tStep, y: p.y + (q.y - p.y) * tStep });
      }
      current = next;
    }

    // Connection lines from one level to the next (4 per level).
    for (let lev = 0; lev < allQuads.length - 1; lev++) {
      const cur = allQuads[lev];
      const nxt = allQuads[lev + 1];
      for (let k = 0; k < 4; k++) {
        const p = cur[k];
        const q = nxt[k];
        const dx = q.x - p.x;
        const dy = q.y - p.y;
        const len = Math.hypot(dx, dy) || 1;
        const nxv = -dy / len;
        const nyv = dx / len;
        const j = (r() - 0.5) * jitter * 0.6;
        const mx = (p.x + q.x) / 2 + nxv * j;
        const my = (p.y + q.y) / 2 + nyv * j;
        strokes.push({
          id: `pa-${lev}-${k}-${id++}`,
          d: `M${fmt(p.x)} ${fmt(p.y)} Q${fmt(mx)} ${fmt(my)} ${fmt(q.x)} ${fmt(q.y)}`,
          layer: 'ink',
          width: 1.2,
          stepIndex: 1,
          drawMs: 220
        });
      }
    }

    // Alternating fill bands: every other ring filled solid.
    for (let lev = 0; lev < allQuads.length - 1; lev += 2) {
      const cur = allQuads[lev];
      const nxt = allQuads[lev + 1];
      const ringD =
        `M${fmt(cur[0].x)} ${fmt(cur[0].y)} L${fmt(cur[1].x)} ${fmt(cur[1].y)} L${fmt(cur[2].x)} ${fmt(cur[2].y)} L${fmt(cur[3].x)} ${fmt(cur[3].y)} Z ` +
        `M${fmt(nxt[0].x)} ${fmt(nxt[0].y)} L${fmt(nxt[3].x)} ${fmt(nxt[3].y)} L${fmt(nxt[2].x)} ${fmt(nxt[2].y)} L${fmt(nxt[1].x)} ${fmt(nxt[1].y)} Z`;
      strokes.push({
        id: `pa-band-${lev}-${id++}`,
        d: ringD,
        layer: 'ink',
        fill: 'currentColor',
        stepIndex: 2,
        drawMs: 280
      });
    }

    return strokes;
  }
};
