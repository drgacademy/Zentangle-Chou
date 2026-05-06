import type { Pt, Rect, PatternContext, TanglePattern } from '../types';
import { f, wobLine, arcAB, dotMark, disc, ring, polygon, strokeGroup, fillGroup, halfArc, wobCircle } from '../svg';

/* ------------------------------------------------------------------ */
/* Hollibaugh — ribbons that pass behind one another                    */
/* ------------------------------------------------------------------ */
export const hollibaugh: TanglePattern = {
  slug: 'hollibaugh',
  generate(rect, ctx) {
    const ribbonW = Math.min(rect.w, rect.h) * 0.12;
    const ribbons: { x1: number; y1: number; x2: number; y2: number; w: number; angle: number }[] = [];
    const angles = [0.1, Math.PI / 2 - 0.1, 0.3, Math.PI / 2 + 0.05, -0.2];
    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];
      const cx = rect.x + rect.w * (0.25 + (i % 3) * 0.25);
      const cy = rect.y + rect.h * (0.3 + ((i + 1) % 3) * 0.2);
      const len = Math.max(rect.w, rect.h) * 1.5;
      ribbons.push({
        x1: cx - Math.cos(angle) * len * 0.5,
        y1: cy - Math.sin(angle) * len * 0.5,
        x2: cx + Math.cos(angle) * len * 0.5,
        y2: cy + Math.sin(angle) * len * 0.5,
        w: ribbonW,
        angle,
      });
    }

    function ribbonOutline(rb: typeof ribbons[0]) {
      const nx = -Math.sin(rb.angle);
      const ny = Math.cos(rb.angle);
      const off = rb.w / 2;
      const a1 = { x: rb.x1 + nx * off, y: rb.y1 + ny * off };
      const a2 = { x: rb.x1 - nx * off, y: rb.y1 - ny * off };
      const b1 = { x: rb.x2 + nx * off, y: rb.y2 + ny * off };
      const b2 = { x: rb.x2 - nx * off, y: rb.y2 - ny * off };
      return { a1, a2, b1, b2 };
    }

    function buildLayered(count: number): string {
      const parts: string[] = [];
      for (let i = 0; i < count; i++) {
        const rb = ribbons[i];
        const { a1, a2, b1, b2 } = ribbonOutline(rb);
        // mask: paint paper-coloured polygon to occlude prior ribbons
        parts.push(`<polygon points="${f(a1.x)},${f(a1.y)} ${f(b1.x)},${f(b1.y)} ${f(b2.x)},${f(b2.y)} ${f(a2.x)},${f(a2.y)}" fill="var(--paper-bg, #FAF7F1)" stroke="none" />`);
        parts.push(`<path d="${wobLine(a1, b1, ctx.rng, 0.5, 18)}" fill="none" stroke="currentColor" stroke-width="${ctx.strokeWidth}" />`);
        parts.push(`<path d="${wobLine(a2, b2, ctx.rng, 0.5, 18)}" fill="none" stroke="currentColor" stroke-width="${ctx.strokeWidth}" />`);
      }
      return `<g stroke-linecap="round">${parts.join('')}</g>`;
    }

    const fillBg: string[] = [];
    for (let i = 0; i < ribbons.length; i++) {
      const { a1, a2, b1, b2 } = ribbonOutline(ribbons[i]);
      // a tiny black wedge at one end (decorative)
    }
    // overall background fill (for "between ribbons" reading)
    const bgFill = `<rect x="${f(rect.x)}" y="${f(rect.y)}" width="${f(rect.w)}" height="${f(rect.h)}" fill="currentColor" stroke="none" opacity="0.92" />`;

    return [
      { svg: bgFill + buildLayered(1), label_zh: '畫一條長帶（兩條平行曲線、兩端為圓形）橫越區塊', label_en: 'Draw a long ribbon (two parallel curves) across the area' },
      { svg: bgFill + buildLayered(2), label_zh: '再畫一條帶子，看起來從第一條後面穿過——觸到時提筆，到另一邊再接續', label_en: 'Add a second ribbon that passes behind the first — lift the pen and continue on the other side' },
      { svg: bgFill + buildLayered(ribbons.length), label_zh: '持續加入帶子，每一條都從前面那條後方穿過', label_en: 'Keep adding ribbons; each passes behind the previous' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Munchin — ribbon with diagonal weaves                                 */
/* ------------------------------------------------------------------ */
export const munchin: TanglePattern = {
  slug: 'munchin',
  generate(rect, ctx) {
    const yMid = rect.y + rect.h / 2;
    const halfH = rect.h * 0.25;
    const top = (t: number) => yMid - halfH + Math.sin(t * Math.PI * 1.5) * (rect.h * 0.02);
    const bot = (t: number) => yMid + halfH + Math.sin(t * Math.PI * 1.5) * (rect.h * 0.02);
    const samples = 24;
    let topD = `M ${f(rect.x)} ${f(top(0))}`;
    let botD = `M ${f(rect.x)} ${f(bot(0))}`;
    for (let i = 1; i <= samples; i++) {
      const t = i / samples;
      const x = rect.x + t * rect.w;
      topD += ` L ${f(x)} ${f(top(t))}`;
      botD += ` L ${f(x)} ${f(bot(t))}`;
    }
    const ribbon = strokeGroup(`<path d="${topD}" /><path d="${botD}" />`, ctx.strokeWidth);

    // weave strands
    const strandCount = 8;
    const strands: string[] = [];
    const fills: string[] = [];
    for (let i = 0; i < strandCount; i++) {
      const t = (i + 0.5) / strandCount;
      const x = rect.x + t * rect.w;
      const direction = i % 2 === 0 ? 1 : -1;
      const dx = (rect.w / strandCount) * 0.7;
      const a = { x: x - dx / 2, y: top(t) };
      const b = { x: x + dx / 2, y: bot(t) };
      const c = { x: x - dx / 2 + (direction > 0 ? dx : 0), y: bot(t) };
      const d = { x: x + dx / 2 - (direction > 0 ? dx : 0), y: top(t) };
      strands.push(`<path d="${wobLine(a, b, ctx.rng, 0.4, 6)}" />`);
      if (i % 2 === 0) {
        fills.push(polygon([a, { x: a.x + 4 * direction, y: a.y }, { x: b.x + 4 * direction, y: b.y }, b]));
      }
    }
    const strandsSvg = strokeGroup(strands.join(''), ctx.strokeWidth);
    const fillsSvg = `<g fill="currentColor" stroke="none" opacity="0.18">${fills.map(d => `<path d="${d}" />`).join('')}</g>`;

    return [
      { svg: ribbon, label_zh: '畫兩條平行曲線形成一條帶', label_en: 'Draw two parallel curves to form a ribbon' },
      { svg: ribbon + strandsSvg, label_zh: '帶內畫連續的對角編織', label_en: 'Inside the ribbon, draw continuous diagonal weaves' },
      { svg: ribbon + strandsSvg + fillsSvg, label_zh: '在「下層」緞帶加深陰影，呈現竹編層次', label_en: 'Shade the underlying strands deeper for bamboo-weave depth' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Arukas — radial wedges in concentric rings                            */
/* ------------------------------------------------------------------ */
export const arukas: TanglePattern = {
  slug: 'arukas',
  generate(rect, ctx) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const center = strokeGroup(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(Math.min(rect.w, rect.h) * 0.05)}" />`, ctx.strokeWidth);

    const rays = 12;
    const r0 = Math.min(rect.w, rect.h) * 0.05;
    const rMax = Math.min(rect.w, rect.h) * 0.45;
    const rayLines: string[] = [];
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * r0;
      const y1 = cy + Math.sin(a) * r0;
      const x2 = cx + Math.cos(a) * rMax;
      const y2 = cy + Math.sin(a) * rMax;
      rayLines.push(`<path d="${wobLine({ x: x1, y: y1 }, { x: x2, y: y2 }, ctx.rng, 0.4, 8)}" />`);
    }
    const raysSvg = strokeGroup(rayLines.join(''), ctx.strokeWidth);

    // wedges (curving) between rays at increasing radii
    const wedges: string[] = [];
    const ringCount = 4;
    for (let k = 1; k <= ringCount; k++) {
      const r = r0 + (rMax - r0) * (k / ringCount);
      for (let i = 0; i < rays; i++) {
        const a1 = (i / rays) * Math.PI * 2;
        const a2 = ((i + 1) / rays) * Math.PI * 2;
        const aMid = (a1 + a2) / 2;
        const inner = (k - 1) === 0 ? r0 : r0 + (rMax - r0) * ((k - 1) / ringCount);
        const p1 = { x: cx + Math.cos(a1) * inner, y: cy + Math.sin(a1) * inner };
        const p2 = { x: cx + Math.cos(aMid) * r, y: cy + Math.sin(aMid) * r };
        const p3 = { x: cx + Math.cos(a2) * inner, y: cy + Math.sin(a2) * inner };
        wedges.push(`<path d="M ${f(p1.x)} ${f(p1.y)} Q ${f(p2.x)} ${f(p2.y)} ${f(p3.x)} ${f(p3.y)}" />`);
      }
    }
    const wedgeFirst = strokeGroup(wedges.slice(0, rays).join(''), ctx.strokeWidth);
    const wedgesAll = strokeGroup(wedges.join(''), ctx.strokeWidth);

    return [
      { svg: center, label_zh: '中央畫一個小圓', label_en: 'Draw a small circle in the center' },
      { svg: center + raysSvg, label_zh: '從圓向外射出偶數條直線輻射', label_en: 'Radiate an even number of rays outward' },
      { svg: center + raysSvg + wedgeFirst, label_zh: '每對相鄰輻射之間畫一個三角楔', label_en: 'Between each pair of rays, draw a triangular wedge' },
      { svg: center + raysSvg + wedgesAll, label_zh: '沿輻射往外加一圈又一圈更小的楔', label_en: 'Add outer rings of smaller wedges' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* 'Nzeppel — pillows in irregular grid                                  */
/* ------------------------------------------------------------------ */
export const nzeppel: TanglePattern = {
  slug: 'nzeppel',
  generate(rect, ctx) {
    const cols = Math.max(3, Math.floor(rect.w / 28));
    const rows = Math.max(3, Math.floor(rect.h / 28));
    const xSplits: number[] = [rect.x];
    for (let i = 1; i < cols; i++) {
      xSplits.push(rect.x + (i / cols) * rect.w + (ctx.rng() - 0.5) * 6);
    }
    xSplits.push(rect.x + rect.w);
    const ySplits: number[] = [rect.y];
    for (let j = 1; j < rows; j++) {
      ySplits.push(rect.y + (j / rows) * rect.h + (ctx.rng() - 0.5) * 6);
    }
    ySplits.push(rect.y + rect.h);

    const grid: string[] = [];
    for (let i = 1; i < xSplits.length - 1; i++)
      grid.push(`<path d="${wobLine({ x: xSplits[i], y: rect.y }, { x: xSplits[i], y: rect.y + rect.h }, ctx.rng, 0.5, 14)}" />`);
    for (let j = 1; j < ySplits.length - 1; j++)
      grid.push(`<path d="${wobLine({ x: rect.x, y: ySplits[j] }, { x: rect.x + rect.w, y: ySplits[j] }, ctx.rng, 0.5, 14)}" />`);
    const gridSvg = strokeGroup(grid.join(''), ctx.strokeWidth * 0.6);

    const pillows: string[] = [];
    const shades: string[] = [];
    for (let i = 0; i < xSplits.length - 1; i++) {
      for (let j = 0; j < ySplits.length - 1; j++) {
        const x0 = xSplits[i];
        const x1 = xSplits[i + 1];
        const y0 = ySplits[j];
        const y1 = ySplits[j + 1];
        const cx = (x0 + x1) / 2;
        const cy = (y0 + y1) / 2;
        const w = (x1 - x0) * 0.4;
        const h = (y1 - y0) * 0.4;
        // pillow as rounded rect via path
        const pad = 2;
        const px0 = x0 + pad;
        const px1 = x1 - pad;
        const py0 = y0 + pad;
        const py1 = y1 - pad;
        const radius = Math.min(w, h) * 0.6;
        const d = `M ${f(px0 + radius)} ${f(py0)} L ${f(px1 - radius)} ${f(py0)} Q ${f(px1)} ${f(py0)} ${f(px1)} ${f(py0 + radius)} L ${f(px1)} ${f(py1 - radius)} Q ${f(px1)} ${f(py1)} ${f(px1 - radius)} ${f(py1)} L ${f(px0 + radius)} ${f(py1)} Q ${f(px0)} ${f(py1)} ${f(px0)} ${f(py1 - radius)} L ${f(px0)} ${f(py0 + radius)} Q ${f(px0)} ${f(py0)} ${f(px0 + radius)} ${f(py0)} Z`;
        pillows.push(`<path d="${d}" />`);
        // soft shade arc on lower-right
        shades.push(`<path d="M ${f(px1 - radius)} ${f(py1)} Q ${f(px1)} ${f(py1)} ${f(px1)} ${f(py1 - radius)}" stroke-width="${ctx.strokeWidth * 1.6}" />`);
      }
    }
    const pillowsSvg = strokeGroup(pillows.join(''), ctx.strokeWidth);
    const shadeSvg = `<g fill="none" stroke="currentColor" opacity="0.45" stroke-linecap="round">${shades.join('')}</g>`;

    return [
      { svg: gridSvg, label_zh: '鬆鬆畫不太規則的水平與垂直線，分成許多格', label_en: 'Loosely sketch irregular horizontal and vertical lines into cells' },
      { svg: gridSvg + pillowsSvg, label_zh: '在每格畫一個飽滿的「枕頭形」，幾乎頂到四個邊', label_en: 'In each cell, draw a plump pillow that almost touches the edges' },
      { svg: gridSvg + pillowsSvg + shadeSvg, label_zh: '在枕頭某一側加陰影，產生鵝卵石網格', label_en: 'Shade one side of each pillow for a pebble-like grid' },
    ];
  },
};
