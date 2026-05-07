import type { Pattern, Stroke } from '../types';
import { fmt } from '../geometry';

/**
 * Printemps + Tipple — packed tight spirals on a soft graphite wash, with
 * shaded crescents underneath each spiral for 3D pop. Small Tipple circles
 * fill the gaps between spirals.
 */
export const printemps: Pattern = {
  slug: 'printemps',
  steps: [
    { labelZh: '1. 灰底', labelEn: '1. Wash' },
    { labelZh: '2. 螺旋', labelEn: '2. Spirals' },
    { labelZh: '3. 立體陰影', labelEn: '3. 3D shading' },
    { labelZh: '4. 點點', labelEn: '4. Tipple' }
  ],
  build(rect, ctx) {
    const strokes: Stroke[] = [];
    const { x, y, w, h } = rect;
    const r = ctx.rng;
    let id = 0;

    // Soft graphite wash background.
    strokes.push({
      id: `pr-wash-${id++}`,
      d: `M${fmt(x - 4)} ${fmt(y - 4)} L${fmt(x + w + 4)} ${fmt(y - 4)} L${fmt(x + w + 4)} ${fmt(y + h + 4)} L${fmt(x - 4)} ${fmt(y + h + 4)} Z`,
      layer: 'shade',
      fill: 'rgba(106,88,71,0.42)',
      stepIndex: 0,
      drawMs: 700
    });

    // Pack spirals with rejection sampling.
    type Spiral = { cx: number; cy: number; r: number; dir: 1 | -1; startA: number };
    const spirals: Spiral[] = [];
    const attempts = 600;
    for (let i = 0; i < attempts; i++) {
      const sizeRoll = r();
      const radius =
        sizeRoll < 0.08
          ? 30 + r() * 14
          : sizeRoll < 0.4
            ? 18 + r() * 10
            : sizeRoll < 0.8
              ? 10 + r() * 8
              : 5 + r() * 5;
      const cx = x + radius + 2 + r() * (w - radius * 2 - 4);
      const cy = y + radius + 2 + r() * (h - radius * 2 - 4);
      let ok = true;
      for (const s of spirals) {
        if (Math.hypot(cx - s.cx, cy - s.cy) < radius + s.r + 1.5) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      spirals.push({
        cx,
        cy,
        r: radius,
        dir: r() > 0.5 ? 1 : -1,
        startA: r() * Math.PI * 2
      });
    }
    spirals.sort((a, b) => b.r - a.r);

    for (const s of spirals) {
      // Paper-fill disc to knock out the wash.
      const discD = `M${fmt(s.cx - s.r)} ${fmt(s.cy)} a${fmt(s.r)} ${fmt(s.r)} 0 1 0 ${fmt(s.r * 2)} 0 a${fmt(s.r)} ${fmt(s.r)} 0 1 0 ${fmt(-s.r * 2)} 0 Z`;
      strokes.push({
        id: `pr-disc-${id++}`,
        d: discD,
        layer: 'ink',
        fill: 'var(--paper-tile, #F0E4C8)',
        stepIndex: 1,
        drawMs: 200
      });

      // Outline circle.
      strokes.push({
        id: `pr-out-${id++}`,
        d: `M${fmt(s.cx - s.r)} ${fmt(s.cy)} a${fmt(s.r)} ${fmt(s.r)} 0 1 0 ${fmt(s.r * 2)} 0 a${fmt(s.r)} ${fmt(s.r)} 0 1 0 ${fmt(-s.r * 2)} 0`,
        layer: 'ink',
        width: 1.3,
        stepIndex: 1,
        drawMs: 220
      });

      // Tight inward spiral via sampled polyline.
      const turns = s.r > 22 ? 6 : s.r > 12 ? 5 : 4;
      const segs = Math.floor(turns * 26);
      let path = '';
      for (let k = 0; k <= segs; k++) {
        const t = k / segs;
        const ang = s.startA + t * turns * 2 * Math.PI;
        const rr = s.r * (1 - t) * 0.95;
        const sx = s.cx + Math.cos(ang * s.dir) * rr;
        const sy = s.cy + Math.sin(ang * s.dir) * rr;
        path += (k === 0 ? 'M' : ' L') + fmt(sx) + ' ' + fmt(sy);
      }
      strokes.push({
        id: `pr-sp-${id++}`,
        d: path,
        layer: 'ink',
        width: 1.1,
        stepIndex: 1,
        drawMs: 480
      });

      // 3D pop crescent on the bottom-right (shade layer).
      const aStart = -Math.PI * 0.18;
      const aEnd = Math.PI * 0.85;
      const innerR = s.r;
      const outerR = s.r * 1.45;
      const cx1 = s.cx + Math.cos(aStart) * innerR;
      const cy1 = s.cy + Math.sin(aStart) * innerR;
      const cx2 = s.cx + Math.cos(aEnd) * innerR;
      const cy2 = s.cy + Math.sin(aEnd) * innerR;
      const cx3 = s.cx + Math.cos(aEnd) * outerR;
      const cy3 = s.cy + Math.sin(aEnd) * outerR;
      const cx4 = s.cx + Math.cos(aStart) * outerR;
      const cy4 = s.cy + Math.sin(aStart) * outerR;
      const shadeD =
        `M${fmt(cx1)} ${fmt(cy1)} ` +
        `A${fmt(innerR)} ${fmt(innerR)} 0 0 1 ${fmt(cx2)} ${fmt(cy2)} ` +
        `L${fmt(cx3)} ${fmt(cy3)} ` +
        `A${fmt(outerR)} ${fmt(outerR)} 0 0 0 ${fmt(cx4)} ${fmt(cy4)} Z`;
      strokes.push({
        id: `pr-shade-${id++}`,
        d: shadeD,
        layer: 'shade',
        fill: 'rgba(40,30,20,0.55)',
        stepIndex: 2,
        drawMs: 400
      });
    }

    // Tipple fillers in the gaps.
    type Tipple = { cx: number; cy: number; r: number; filled: boolean };
    const tipples: Tipple[] = [];
    const tipAttempts = 400;
    for (let i = 0; i < tipAttempts; i++) {
      const tcx = x + 3 + r() * (w - 6);
      const tcy = y + 3 + r() * (h - 6);
      const tr = 1.5 + r() * 2.8;
      let ok = true;
      for (const s of spirals) {
        if (Math.hypot(tcx - s.cx, tcy - s.cy) < tr + s.r * 1.05 + 0.6) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (const tp of tipples) {
        if (Math.hypot(tcx - tp.cx, tcy - tp.cy) < tr + tp.r + 0.6) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      tipples.push({ cx: tcx, cy: tcy, r: tr, filled: r() > 0.5 });
    }
    for (const tp of tipples) {
      // Knock out wash with paper.
      strokes.push({
        id: `pr-tk-${id++}`,
        d: `M${fmt(tp.cx - tp.r - 0.5)} ${fmt(tp.cy)} a${fmt(tp.r + 0.5)} ${fmt(tp.r + 0.5)} 0 1 0 ${fmt((tp.r + 0.5) * 2)} 0 a${fmt(tp.r + 0.5)} ${fmt(tp.r + 0.5)} 0 1 0 ${fmt(-(tp.r + 0.5) * 2)} 0 Z`,
        layer: 'ink',
        fill: 'var(--paper-tile, #F0E4C8)',
        stepIndex: 3,
        drawMs: 80
      });
      strokes.push({
        id: `pr-t-${id++}`,
        d: `M${fmt(tp.cx - tp.r)} ${fmt(tp.cy)} a${fmt(tp.r)} ${fmt(tp.r)} 0 1 0 ${fmt(tp.r * 2)} 0 a${fmt(tp.r)} ${fmt(tp.r)} 0 1 0 ${fmt(-tp.r * 2)} 0`,
        layer: 'ink',
        width: 0.9,
        fill: tp.filled && tp.r > 2 ? 'currentColor' : 'none',
        stepIndex: 3,
        drawMs: 110
      });
    }

    return strokes;
  }
};
