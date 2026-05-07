import type { Pattern, Stroke } from '../types';
import { fmt } from '../geometry';

/**
 * 'Nzeppel — organic chain-link cells. We grid the region into jittered
 * cells, then in each cell draw a soft pillow-shaped quadrilateral with
 * Q-curve sides and a small filled centre dot.
 */
export const nzeppel: Pattern = {
  slug: 'nzeppel',
  steps: [
    { labelZh: '1. 細胞網', labelEn: '1. Cell grid' },
    { labelZh: '2. 中心點', labelEn: '2. Centre dot' }
  ],
  build(rect, ctx) {
    const strokes: Stroke[] = [];
    const { x, y, w, h } = rect;
    const r = ctx.rng;
    let id = 0;

    const cellSize = Math.max(28, Math.min(w, h) / 6);
    const cols = Math.max(2, Math.floor(w / cellSize));
    const rows = Math.max(2, Math.floor(h / cellSize));
    const cw = w / cols;
    const ch = h / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const jx = (r() - 0.5) * cw * 0.18;
        const jy = (r() - 0.5) * ch * 0.18;
        const cx = x + (col + 0.5) * cw + jx;
        const cy = y + (row + 0.5) * ch + jy;
        const halfW = cw * 0.45;
        const halfH = ch * 0.45;
        const j = (r() - 0.5) * 3.2;

        const path =
          `M${fmt(cx - halfW + j)} ${fmt(cy - halfH * 0.95)} ` +
          `Q${fmt(cx + halfW * 0.1)} ${fmt(cy - halfH)} ${fmt(cx + halfW)} ${fmt(cy - halfH * 0.95 + j)} ` +
          `Q${fmt(cx + halfW * 1.05)} ${fmt(cy + halfH * 0.1)} ${fmt(cx + halfW - j)} ${fmt(cy + halfH * 0.95)} ` +
          `Q${fmt(cx - halfW * 0.1)} ${fmt(cy + halfH * 1.05)} ${fmt(cx - halfW)} ${fmt(cy + halfH * 0.95 - j)} ` +
          `Q${fmt(cx - halfW * 1.05)} ${fmt(cy - halfH * 0.1)} ${fmt(cx - halfW + j)} ${fmt(cy - halfH * 0.95)} Z`;

        strokes.push({
          id: `nz-c-${id++}`,
          d: path,
          layer: 'ink',
          width: 1.3,
          stepIndex: 0,
          drawMs: 320
        });

        // Centre dot.
        const dr = 1.6;
        strokes.push({
          id: `nz-d-${id++}`,
          d: `M${fmt(cx - dr)} ${fmt(cy)} a${fmt(dr)} ${fmt(dr)} 0 1 0 ${fmt(dr * 2)} 0 a${fmt(dr)} ${fmt(dr)} 0 1 0 ${fmt(-dr * 2)} 0 Z`,
          layer: 'ink',
          width: 0.8,
          fill: 'currentColor',
          stepIndex: 1,
          drawMs: 100
        });
      }
    }

    return strokes;
  }
};
