import type { Pt, Rect, PatternContext, TanglePattern } from '../types';
import { f, wobLine, arcAB, dotMark, disc, ring, polygon, strokeGroup, fillGroup, halfArc, wobCircle, waveLine } from '../svg';

/* ------------------------------------------------------------------ */
/* Crescent Moon — half-moons filled black, with auras outside          */
/* ------------------------------------------------------------------ */
export const crescentMoon: TanglePattern = {
  slug: 'crescent-moon',
  generate(rect, ctx) {
    const r = Math.min(rect.w, rect.h) * 0.12;
    const stepX = r * 2.4;
    const cx0 = rect.x + r * 1.2;
    const cy = rect.y + rect.h / 2 - r * 0.4;
    const moons: { cx: number; cy: number; r: number }[] = [];
    let x = cx0;
    while (x + r * 1.2 < rect.x + rect.w) {
      moons.push({ cx: x, cy, r });
      x += stepX;
    }

    // step 1: outline arcs (half-moons before fill)
    const arcs = strokeGroup(
      moons.map(m => `<path d="${halfArc({ x: m.cx - m.r, y: m.cy }, { x: m.cx + m.r, y: m.cy }, m.r, 1)}" />`).join('') +
        moons.map(m => `<path d="${wobLine({ x: m.cx - m.r, y: m.cy }, { x: m.cx + m.r, y: m.cy }, ctx.rng, 0.4, 6)}" />`).join(''),
      ctx.strokeWidth
    );

    // step 2: fill them black
    const fills = `<g fill="currentColor" stroke="none">${moons
      .map(m => `<path d="M ${f(m.cx - m.r)} ${f(m.cy)} A ${f(m.r)} ${f(m.r)} 0 0 1 ${f(m.cx + m.r)} ${f(m.cy)} L ${f(m.cx + m.r)} ${f(m.cy)} Z" />`)
      .join('')}</g>`;

    // step 3: first aura
    const aura1 = strokeGroup(
      moons.map(m => `<path d="${halfArc({ x: m.cx - m.r * 1.35, y: m.cy }, { x: m.cx + m.r * 1.35, y: m.cy }, m.r * 1.35, 1)}" />`).join(''),
      ctx.strokeWidth
    );
    // step 4: more auras
    const aurasMore = strokeGroup(
      [1.7, 2.05, 2.4]
        .map(k => moons.map(m => `<path d="${halfArc({ x: m.cx - m.r * k, y: m.cy }, { x: m.cx + m.r * k, y: m.cy }, m.r * k, 1)}" />`).join(''))
        .join(''),
      ctx.strokeWidth
    );

    return [
      { svg: arcs, label_zh: '沿邊緣畫一排朝內的半月形', label_en: 'Draw a row of inward-facing half-moons' },
      { svg: arcs + fills, label_zh: '把每個半月填滿黑色', label_en: 'Fill each half-moon solid black' },
      { svg: arcs + fills + aura1, label_zh: '在每個黑色凸起外側畫第一道光環', label_en: 'Draw the first thin aura outside each bump' },
      { svg: arcs + fills + aura1 + aurasMore, label_zh: '繼續往外畫更多光環直到填滿', label_en: 'Add more auras outward until the area fills' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Auras — concentric echoes around a shape                             */
/* ------------------------------------------------------------------ */
export const auras: TanglePattern = {
  slug: 'auras',
  generate(rect, ctx) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const baseR = Math.min(rect.w, rect.h) * 0.12;
    const center = strokeGroup(`<path d="${wobCircle(cx, cy, baseR, ctx.rng, 0.2, 16)}" />`, ctx.strokeWidth * 1.2);
    const aura1 = strokeGroup(`<path d="${wobCircle(cx, cy, baseR * 1.45, ctx.rng, 0.2, 16)}" />`, ctx.strokeWidth);
    const aura2 = strokeGroup(`<path d="${wobCircle(cx, cy, baseR * 1.85, ctx.rng, 0.2, 16)}" />`, ctx.strokeWidth);
    const aura3 = strokeGroup(`<path d="${wobCircle(cx, cy, baseR * 2.25, ctx.rng, 0.2, 18)}" />`, ctx.strokeWidth);
    const aura4 = strokeGroup(`<path d="${wobCircle(cx, cy, baseR * 2.7, ctx.rng, 0.2, 20)}" />`, ctx.strokeWidth);

    return [
      { svg: center, label_zh: '先畫一個基礎形狀', label_en: 'Draw a base shape' },
      { svg: center + aura1, label_zh: '在外側畫一道細的偏移輪廓線（光環）', label_en: 'Draw a thin offset contour outside it — the aura' },
      { svg: center + aura1 + aura2, label_zh: '再畫第二道光環', label_en: 'Draw a second aura' },
      { svg: center + aura1 + aura2 + aura3 + aura4, label_zh: '繼續向外回應，直到光暈擴散開', label_en: 'Keep echoing outward until the glow spreads' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Onamato — staggered circles with inside auras                        */
/* ------------------------------------------------------------------ */
export const onamato: TanglePattern = {
  slug: 'onamato',
  generate(rect, ctx) {
    const r = Math.min(rect.w, rect.h) * 0.09;
    const stepX = r * 2;
    const stepY = r * 1.7;
    const cols = Math.max(3, Math.floor(rect.w / stepX));
    const rows = Math.max(3, Math.floor(rect.h / stepY));
    const circles: { cx: number; cy: number }[] = [];
    for (let j = 0; j < rows; j++) {
      const offset = (j % 2) * r;
      for (let i = 0; i < cols; i++) {
        const cx = rect.x + r + offset + i * stepX;
        const cy = rect.y + r + j * stepY;
        if (cx + r > rect.x + rect.w + 0.5) continue;
        if (cy + r > rect.y + rect.h + 0.5) continue;
        circles.push({ cx, cy });
      }
    }

    const row1 = circles.filter((_, i) => i < Math.ceil(circles.length / 2));
    const ringsHalf = strokeGroup(row1.map(c => `<path d="${wobCircle(c.cx, c.cy, r, ctx.rng, 0.18, 14)}" />`).join(''), ctx.strokeWidth);
    const ringsAll = strokeGroup(circles.map(c => `<path d="${wobCircle(c.cx, c.cy, r, ctx.rng, 0.18, 14)}" />`).join(''), ctx.strokeWidth);
    const insideAuras = strokeGroup(circles.map(c => `<path d="${wobCircle(c.cx, c.cy, r * 0.7, ctx.rng, 0.18, 14)}" />`).join(''), ctx.strokeWidth);

    // black triangles where 3 circles nearly meet (between offset rows)
    const triangles: string[] = [];
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const cx = rect.x + r + i * stepX + (j % 2 === 0 ? r : 0) + r;
        const cy = rect.y + r + j * stepY + stepY * 0.5;
        if (cx > rect.x + rect.w || cy > rect.y + rect.h) continue;
        triangles.push(disc(cx, cy, 1.6));
      }
    }
    const trianglesSvg = fillGroup(triangles.join(''));

    return [
      { svg: ringsHalf, label_zh: '沿基線畫一排相鄰的圓', label_en: 'Draw a row of adjacent circles along a baseline' },
      { svg: ringsAll, label_zh: '上方再畫一排錯開半個圓的相鄰圓', label_en: 'Draw a second row offset by half a circle' },
      { svg: ringsAll + insideAuras, label_zh: '在每個圓的內側畫一道細光環', label_en: 'Draw a thin aura inside each circle' },
      { svg: ringsAll + insideAuras + trianglesSvg, label_zh: '三個圓交會的小縫處填黑', label_en: 'Fill the triangular intersections solid black' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Sparkle — long shape with intentional unbroken white highlight       */
/* ------------------------------------------------------------------ */
export const sparkle: TanglePattern = {
  slug: 'sparkle',
  generate(rect, ctx) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const w = rect.w * 0.3;
    const h = rect.h * 0.65;
    // teardrop / leaf shape via bezier
    const top: Pt = { x: cx, y: cy - h / 2 };
    const bot: Pt = { x: cx, y: cy + h / 2 };
    const left: Pt = { x: cx - w / 2, y: cy };
    const right: Pt = { x: cx + w / 2, y: cy };
    const leafD = `M ${f(top.x)} ${f(top.y)} Q ${f(left.x)} ${f(top.y + h * 0.2)} ${f(left.x)} ${f(cy)} Q ${f(left.x)} ${f(bot.y - h * 0.2)} ${f(bot.x)} ${f(bot.y)} Q ${f(right.x)} ${f(bot.y - h * 0.2)} ${f(right.x)} ${f(cy)} Q ${f(right.x)} ${f(top.y + h * 0.2)} ${f(top.x)} ${f(top.y)} Z`;
    const leaf = `<g stroke="currentColor" stroke-width="${ctx.strokeWidth}" fill="none" stroke-linecap="round"><path d="${leafD}" /></g>`;

    // shading lines that skip a gap (the "sparkle")
    const shadeLines: string[] = [];
    const gapStart = 0.42;
    const gapEnd = 0.58;
    for (let t = 0.1; t < 0.9; t += 0.07) {
      const y = top.y + t * h;
      const xL = cx - w / 2 + Math.sin(t * Math.PI) * (w * 0.05);
      const xR = cx + w / 2 - Math.sin(t * Math.PI) * (w * 0.05);
      const span = xR - xL;
      // first segment up to gapStart
      const a1 = { x: xL + 1, y };
      const b1 = { x: xL + span * gapStart, y };
      const a2 = { x: xL + span * gapEnd, y };
      const b2 = { x: xR - 1, y };
      shadeLines.push(`<path d="${wobLine(a1, b1, ctx.rng, 0.2, 4)}" />`);
      shadeLines.push(`<path d="${wobLine(a2, b2, ctx.rng, 0.2, 4)}" />`);
    }
    const shade = strokeGroup(shadeLines.join(''), ctx.strokeWidth * 0.6);

    return [
      { svg: leaf, label_zh: '畫一個長形物——葉、捲，或一道光環', label_en: 'Draw a long shape — a leaf, a curl, or an aura' },
      { svg: leaf + shade, label_zh: '描影或填線時刻意跳過 1–2mm 留白，那條未斷白線就是高光', label_en: 'When shading, skip a 1-2mm gap — the unbroken white line is the highlight' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Drawings (string) — pencil string dividing area into zones           */
/* ------------------------------------------------------------------ */
export const drawingsString: TanglePattern = {
  slug: 'drawings-string',
  generate(rect, ctx) {
    // outer square (the tile boundary)
    const tile = `<rect x="${f(rect.x)}" y="${f(rect.y)}" width="${f(rect.w)}" height="${f(rect.h)}" fill="none" stroke="currentColor" stroke-width="${ctx.strokeWidth * 0.8}" />`;
    // 4 corner dots
    const dots = fillGroup(
      [
        dotMark(rect.x, rect.y, 1.2),
        dotMark(rect.x + rect.w, rect.y, 1.2),
        dotMark(rect.x + rect.w, rect.y + rect.h, 1.2),
        dotMark(rect.x, rect.y + rect.h, 1.2),
      ].join('')
    );

    // the meandering pencil string
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const stringD = `M ${f(rect.x)} ${f(cy - rect.h * 0.1)} Q ${f(cx - rect.w * 0.2)} ${f(cy - rect.h * 0.4)} ${f(cx)} ${f(cy)} Q ${f(cx + rect.w * 0.2)} ${f(cy + rect.h * 0.3)} ${f(rect.x + rect.w)} ${f(cy + rect.h * 0.05)}`;
    const stringSvg = `<g stroke="currentColor" stroke-width="${ctx.strokeWidth * 0.8}" fill="none" opacity="0.55" stroke-dasharray="4 3"><path d="${stringD}" /></g>`;

    // sample tangles in regions (just little hints)
    const hints: string[] = [];
    // upper region: tipple-like dots
    for (let i = 0; i < 5; i++) {
      const x = rect.x + rect.w * (0.18 + i * 0.13);
      const y = rect.y + rect.h * (0.18 + (i % 2) * 0.05);
      hints.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(rect.w * 0.025)}" fill="none" stroke="currentColor" stroke-width="${ctx.strokeWidth * 0.7}" />`);
    }
    // lower region: stripes
    for (let i = 0; i < 4; i++) {
      const y = rect.y + rect.h * (0.7 + i * 0.06);
      hints.push(`<path d="${wobLine({ x: rect.x + rect.w * 0.1, y }, { x: rect.x + rect.w * 0.9, y }, ctx.rng, 0.3, 8)}" stroke="currentColor" stroke-width="${ctx.strokeWidth * 0.7}" fill="none" />`);
    }
    const hintsSvg = `<g stroke-linecap="round">${hints.join('')}</g>`;

    return [
      { svg: tile + dots, label_zh: '在紙磚上輕點四個角', label_en: 'Lightly dot the four corners of the tile' },
      { svg: tile + dots + stringSvg, label_zh: '輕輕用鉛筆畫一條自由曲線——把方形分成 3–6 個區塊', label_en: 'Lightly pencil a free curve — split the square into 3–6 areas' },
      { svg: tile + dots + stringSvg + hintsSvg, label_zh: '每個區塊就是一個圖樣的畫布', label_en: 'Each zone becomes the canvas for one tangle' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Striping — parallel thick/thin stripes                                */
/* ------------------------------------------------------------------ */
export const striping: TanglePattern = {
  slug: 'striping',
  generate(rect, ctx) {
    const widths = [0.4, 1.4, 0.4, 0.6, 1.8, 0.4, 0.4, 1.0, 0.4];
    const total = widths.reduce((s, v) => s + v, 0) + widths.length * 1.4;
    const scale = rect.w / total;
    let xs = rect.x;
    const linesA: string[] = [];
    const linesB: string[] = [];
    const linesC: string[] = [];
    let count = 0;
    for (const w of widths) {
      const sw = w * scale;
      const x = xs + sw / 2;
      const path = `<path d="${wobLine({ x, y: rect.y }, { x, y: rect.y + rect.h }, ctx.rng, 0.5, 14)}" stroke-width="${f(sw * 0.6 + 0.3)}" />`;
      if (count < 3) linesA.push(path);
      if (count < 6) linesB.push(path);
      linesC.push(path);
      xs += sw + 1.4 * scale;
      count++;
    }
    const a = `<g stroke="currentColor" fill="none" stroke-linecap="round">${linesA.join('')}</g>`;
    const b = `<g stroke="currentColor" fill="none" stroke-linecap="round">${linesB.join('')}</g>`;
    const c = `<g stroke="currentColor" fill="none" stroke-linecap="round">${linesC.join('')}</g>`;
    return [
      { svg: a, label_zh: '畫第一組粗細不一的平行線', label_en: 'Draw a first group of parallel lines with varying thickness' },
      { svg: b, label_zh: '繼續加入更多平行線，間距與粗細交錯', label_en: 'Add more parallel lines with alternating spacing' },
      { svg: c, label_zh: '完成整片條紋；視需要讓線條跟隨輪廓彎曲', label_en: 'Finish the stripes; optionally curve to follow the contour' },
    ];
  },
};
