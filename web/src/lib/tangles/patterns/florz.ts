import type { Pattern, Stroke } from '../types';
import { fmt } from '../geometry';

/**
 * Florz — Roberts/Thomas tile-pattern. Diamond grid with filled small diamonds
 * at every grid intersection. Steps:
 *   1. Pencil-light dot grid (we draw it as ink dots for visibility).
 *   2. Diagonal lines connecting dots into standing diamonds.
 *   3. A small filled diamond at each intersection.
 *   4. A central dot inside each large diamond.
 */
export const florz: Pattern = {
  slug: 'florz',
  steps: [
    { labelZh: '1. 鋪格', labelEn: '1. Set the grid' },
    { labelZh: '2. 對角連線', labelEn: '2. Diagonal grid' },
    { labelZh: '3. 點黑菱', labelEn: '3. Fill small diamonds' },
    { labelZh: '4. 中央點', labelEn: '4. Central dot' }
  ],
  build(rect, ctx) {
    const strokes: Stroke[] = [];
    const { x, y, w, h } = rect;
    const cells = Math.max(3, Math.round(5 * ctx.density));
    const sx = w / cells;
    const sy = h / cells;
    let id = 0;

    // Step 1 — dot grid (pencil layer to honour the real Zentangle order).
    for (let i = 0; i <= cells; i++) {
      for (let j = 0; j <= cells; j++) {
        const cx = x + i * sx;
        const cy = y + j * sy;
        strokes.push({
          id: `g${id++}`,
          d: `M${fmt(cx)} ${fmt(cy)} m-0.7 0 a0.7 0.7 0 1 0 1.4 0 a0.7 0.7 0 1 0 -1.4 0 Z`,
          layer: 'pencil-string',
          width: 0.6,
          stepIndex: 0,
          drawMs: 90
        });
      }
    }

    // Step 2 — diagonal lines forming standing-diamond grid.
    for (let i = 0; i <= cells; i++) {
      const y0 = y + i * sy;
      strokes.push({
        id: `dh${id++}`,
        d: `M${fmt(x)} ${fmt(y0)} L${fmt(x + w)} ${fmt(y0 + (i % 2 ? -sy : sy) * 0)}`,
        layer: 'ink',
        width: 0.7,
        stepIndex: 1,
        drawMs: 280
      });
    }
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        const x0 = x + i * sx;
        const y0 = y + j * sy;
        const x1 = x0 + sx;
        const y1 = y0 + sy;
        const cx = (x0 + x1) / 2;
        const cy = (y0 + y1) / 2;
        // diamond outline
        strokes.push({
          id: `d${id++}`,
          d: `M${fmt(cx)} ${fmt(y0)} L${fmt(x1)} ${fmt(cy)} L${fmt(cx)} ${fmt(y1)} L${fmt(x0)} ${fmt(cy)} Z`,
          layer: 'ink',
          width: 0.9,
          stepIndex: 1,
          drawMs: 220
        });
      }
    }

    // Step 3 — small filled diamonds at intersection points.
    const sd = Math.min(sx, sy) * 0.18;
    for (let i = 1; i < cells; i++) {
      for (let j = 1; j < cells; j++) {
        const cx = x + i * sx;
        const cy = y + j * sy;
        strokes.push({
          id: `f${id++}`,
          d: `M${fmt(cx)} ${fmt(cy - sd)} L${fmt(cx + sd)} ${fmt(cy)} L${fmt(cx)} ${fmt(cy + sd)} L${fmt(cx - sd)} ${fmt(cy)} Z`,
          layer: 'ink',
          width: 0.6,
          fill: 'currentColor',
          stepIndex: 2,
          drawMs: 140
        });
      }
    }

    // Step 4 — central dot inside each large diamond.
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        const cx = x + (i + 0.5) * sx;
        const cy = y + (j + 0.5) * sy;
        strokes.push({
          id: `c${id++}`,
          d: `M${fmt(cx)} ${fmt(cy)} m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0 Z`,
          layer: 'ink',
          width: 0.6,
          fill: 'currentColor',
          stepIndex: 3,
          drawMs: 100
        });
      }
    }

    return strokes;
  }
};
