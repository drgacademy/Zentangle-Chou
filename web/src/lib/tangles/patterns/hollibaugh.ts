import type { Pattern, Stroke } from '../types';
import { fmt } from '../geometry';

/**
 * Hollibaugh — Maria Thomas's woven ribbons that pass over and under each other.
 * Implementation: covers the region with a black ink ground, then lays 4 ribbons
 * (centerlines + paper-fill polygons + outlines + end caps) so that each ribbon
 * "knocks out" the black ground and reads as paper-coloured against ink.
 */
export const hollibaugh: Pattern = {
  slug: 'hollibaugh',
  steps: [
    { labelZh: '1. 鋪黑底', labelEn: '1. Ink ground' },
    { labelZh: '2. 飄帶輪廓', labelEn: '2. Ribbon outlines' },
    { labelZh: '3. 收口', labelEn: '3. Caps' }
  ],
  build(rect, ctx) {
    const strokes: Stroke[] = [];
    const { x, y, w, h } = rect;
    const r = ctx.rng;
    let id = 0;

    // Ground: solid ink covering the region.
    strokes.push({
      id: `ho-bg-${id++}`,
      d: `M${fmt(x - 4)} ${fmt(y - 4)} L${fmt(x + w + 4)} ${fmt(y - 4)} L${fmt(x + w + 4)} ${fmt(y + h + 4)} L${fmt(x - 4)} ${fmt(y + h + 4)} Z`,
      layer: 'ink',
      fill: '#1A1410',
      stepIndex: 0,
      drawMs: 600
    });

    type Ribbon = { centerline: { x: number; y: number }[]; halfWidth: number };
    const ribbons: Ribbon[] = [];

    // 4 ribbons crossing the region at varied angles.
    const orientations = [0, 1, 0, 1]; // alternating mostly-horizontal / mostly-vertical
    for (let k = 0; k < 4; k++) {
      const horizontal = orientations[k] === 0;
      const span = horizontal ? w : h;
      const cross = horizontal ? h : w;
      const segs = 4;
      const cl: { x: number; y: number }[] = [];
      const offsetCross = (k + 1) * (cross / 5) + (r() - 0.5) * cross * 0.08;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const wobble = (r() - 0.5) * cross * 0.12;
        if (horizontal) {
          cl.push({ x: x - 8 + (span + 16) * t, y: y + offsetCross + wobble });
        } else {
          cl.push({ x: x + offsetCross + wobble, y: y - 8 + (span + 16) * t });
        }
      }
      ribbons.push({ centerline: cl, halfWidth: 14 + r() * 6 });
    }

    // For each ribbon: emit paper-fill polygon (knockout), then outlines.
    for (const rib of ribbons) {
      const top: { x: number; y: number }[] = [];
      const bot: { x: number; y: number }[] = [];
      const cl = rib.centerline;
      for (let i = 0; i < cl.length; i++) {
        const p = cl[i];
        let dx, dy;
        if (i === 0) {
          dx = cl[1].x - p.x;
          dy = cl[1].y - p.y;
        } else if (i === cl.length - 1) {
          dx = p.x - cl[i - 1].x;
          dy = p.y - cl[i - 1].y;
        } else {
          dx = cl[i + 1].x - cl[i - 1].x;
          dy = cl[i + 1].y - cl[i - 1].y;
        }
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        top.push({ x: p.x + nx * rib.halfWidth, y: p.y + ny * rib.halfWidth });
        bot.push({ x: p.x - nx * rib.halfWidth, y: p.y - ny * rib.halfWidth });
      }

      // Paper-fill polygon (closed shape: top forwards, bot reversed).
      const polyPts = [...top, ...[...bot].reverse()];
      const polyD =
        'M' +
        polyPts
          .map((p, i) => `${i === 0 ? '' : 'L'}${fmt(p.x)} ${fmt(p.y)}`)
          .join(' ') +
        ' Z';
      strokes.push({
        id: `ho-fill-${id++}`,
        d: polyD,
        layer: 'ink',
        fill: 'var(--paper-tile, #F0E4C8)',
        stepIndex: 1,
        drawMs: 350
      });

      // Top + bottom outline strokes.
      const topD = 'M' + top.map((p, i) => `${i === 0 ? '' : 'L'}${fmt(p.x)} ${fmt(p.y)}`).join(' ');
      const botD = 'M' + bot.map((p, i) => `${i === 0 ? '' : 'L'}${fmt(p.x)} ${fmt(p.y)}`).join(' ');
      strokes.push({
        id: `ho-top-${id++}`,
        d: topD,
        layer: 'ink',
        width: 1.4,
        stepIndex: 1,
        drawMs: 700
      });
      strokes.push({
        id: `ho-bot-${id++}`,
        d: botD,
        layer: 'ink',
        width: 1.4,
        stepIndex: 1,
        drawMs: 700
      });

      // End caps.
      const head = top[0];
      const headBot = bot[0];
      const tail = top[top.length - 1];
      const tailBot = bot[bot.length - 1];
      strokes.push({
        id: `ho-cap-${id++}`,
        d: `M${fmt(head.x)} ${fmt(head.y)} L${fmt(headBot.x)} ${fmt(headBot.y)}`,
        layer: 'ink',
        width: 1.4,
        stepIndex: 2,
        drawMs: 200
      });
      strokes.push({
        id: `ho-cap-${id++}`,
        d: `M${fmt(tail.x)} ${fmt(tail.y)} L${fmt(tailBot.x)} ${fmt(tailBot.y)}`,
        layer: 'ink',
        width: 1.4,
        stepIndex: 2,
        drawMs: 200
      });
    }

    return strokes;
  }
};
