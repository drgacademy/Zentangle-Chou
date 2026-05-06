import type { Pt, Rect, PatternContext, TanglePattern } from '../types';
import { f, wobLine, arcAB, dotMark, disc, ring, polygon, strokeGroup, fillGroup, halfArc, wobCircle, waveLine } from '../svg';

/* ------------------------------------------------------------------ */
/* Static — meshing zigzag columns                                       */
/* ------------------------------------------------------------------ */
export const staticTangle: TanglePattern = {
  slug: 'static',
  generate(rect, ctx) {
    const cols = Math.max(4, Math.floor(rect.w / 16));
    const cw = rect.w / cols;
    const verticals: string[] = [];
    for (let i = 0; i <= cols; i++) {
      const x = rect.x + i * cw;
      verticals.push(`<path d="${wobLine({ x, y: rect.y }, { x, y: rect.y + rect.h }, ctx.rng, 0.4, 14)}" />`);
    }
    const vertSvg = strokeGroup(verticals.join(''), ctx.strokeWidth);

    // zigzag columns alternating directions
    const zigsA: string[] = [];
    const zigsAll: string[] = [];
    const zigSegs = Math.max(8, Math.floor(rect.h / 12));
    for (let i = 0; i < cols; i++) {
      const xL = rect.x + i * cw;
      const xR = rect.x + (i + 1) * cw;
      let d = `M ${f(xL)} ${f(rect.y)}`;
      const reverse = i % 2 === 1;
      for (let k = 1; k <= zigSegs; k++) {
        const y = rect.y + (k / zigSegs) * rect.h;
        const x = (k % 2 === 0) === reverse ? xR : xL;
        d += ` L ${f(x)} ${f(y)}`;
      }
      const elt = `<path d="${d}" />`;
      zigsAll.push(elt);
      if (i < Math.ceil(cols / 2)) zigsA.push(elt);
    }
    const zigsASvg = strokeGroup(zigsA.join(''), ctx.strokeWidth);
    const zigsAllSvg = strokeGroup(zigsAll.join(''), ctx.strokeWidth);

    // black triangles fills
    const fills: string[] = [];
    for (let i = 0; i < cols; i++) {
      const xL = rect.x + i * cw;
      const xR = rect.x + (i + 1) * cw;
      const reverse = i % 2 === 1;
      for (let k = 1; k <= zigSegs; k++) {
        if (k % 2 === 0) continue;
        const y0 = rect.y + ((k - 1) / zigSegs) * rect.h;
        const y2 = rect.y + ((k + 1) / zigSegs) * rect.h;
        const yMid = rect.y + (k / zigSegs) * rect.h;
        const xPeak = reverse ? xL : xR;
        const xBase = reverse ? xR : xL;
        fills.push(polygon([
          { x: xBase, y: y0 },
          { x: xPeak, y: yMid },
          { x: xBase, y: y2 },
        ]));
      }
    }
    const fillsSvg = `<g fill="currentColor" stroke="none" opacity="0.85">${fills.map(d => `<path d="${d}" />`).join('')}</g>`;

    return [
      { svg: vertSvg, label_zh: '先畫一排垂直線', label_en: 'Draw vertical guide lines' },
      { svg: vertSvg + zigsASvg, label_zh: '從第一條線射出鋸齒狀閃電', label_en: 'Shoot zigzag lightning out from the first line' },
      { svg: vertSvg + zigsAllSvg, label_zh: '相鄰欄位的鋸齒朝向相反，像齒輪互咬', label_en: 'Adjacent columns face the opposite way, like meshing gears' },
      { svg: vertSvg + zigsAllSvg + fillsSvg, label_zh: '視需要把內三角填黑，加強對比', label_en: 'Optionally fill inner triangles black for contrast' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Sez — stacked equilateral triangles                                   */
/* ------------------------------------------------------------------ */
export const sez: TanglePattern = {
  slug: 'sez',
  generate(rect, ctx) {
    const w = Math.max(14, 22 / ctx.density);
    const h = w * Math.sqrt(3) / 2;
    const cols = Math.floor(rect.w / w);
    const rows = Math.floor(rect.h / h);
    const triangles: { pts: Pt[]; up: boolean; row: number; col: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols * 2; c++) {
        const xBase = rect.x + (c / 2) * w;
        const yBase = rect.y + r * h;
        const up = (c + r) % 2 === 0;
        if (up) {
          triangles.push({
            pts: [
              { x: xBase + w / 2, y: yBase },
              { x: xBase + w, y: yBase + h },
              { x: xBase, y: yBase + h },
            ],
            up: true,
            row: r,
            col: c,
          });
        } else {
          triangles.push({
            pts: [
              { x: xBase, y: yBase },
              { x: xBase + w, y: yBase },
              { x: xBase + w / 2, y: yBase + h },
            ],
            up: false,
            row: r,
            col: c,
          });
        }
      }
    }
    const trianglesA = triangles.filter(t => t.row === 0);
    const trianglesB = triangles.filter(t => t.row <= 1);
    const drawTris = (set: typeof triangles) =>
      strokeGroup(set.map(t => `<path d="${polygon(t.pts)}" />`).join(''), ctx.strokeWidth);
    const drawFills = (set: typeof triangles) =>
      `<g fill="currentColor" stroke="none">${set
        .filter(t => (t.col + t.row) % 4 === 0)
        .map(t => `<path d="${polygon(t.pts)}" />`)
        .join('')}</g>`;

    return [
      { svg: drawTris(trianglesA), label_zh: '沿基線畫一排朝上的三角形', label_en: 'Draw a row of upward-pointing triangles along a baseline' },
      { svg: drawTris(trianglesB), label_zh: '上方再畫一排，位於下排兩個尖點之間', label_en: 'Above, place another row between the points of the previous one' },
      { svg: drawTris(triangles), label_zh: '持續往上堆疊，形成三角的鑲嵌結構', label_en: 'Stack upward to form a triangular mosaic' },
      { svg: drawTris(triangles) + drawFills(triangles), label_zh: '把交替的三角形填黑', label_en: 'Fill alternating triangles black' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Paradox — straight lines making spiral illusion                       */
/* ------------------------------------------------------------------ */
export const paradox: TanglePattern = {
  slug: 'paradox',
  generate(rect, ctx) {
    // 4 rotations of triangle quadrants in a 2x2 layout for visual interest
    const cells: Rect[] = [
      { x: rect.x, y: rect.y, w: rect.w / 2, h: rect.h / 2 },
      { x: rect.x + rect.w / 2, y: rect.y, w: rect.w / 2, h: rect.h / 2 },
      { x: rect.x, y: rect.y + rect.h / 2, w: rect.w / 2, h: rect.h / 2 },
      { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, w: rect.w / 2, h: rect.h / 2 },
    ];
    function paradoxQuad(c: Rect, dir: 1 | -1, depth = 14): string {
      // Square that recursively spirals inward
      const lines: string[] = [];
      let p1 = { x: c.x, y: c.y };
      let p2 = { x: c.x + c.w, y: c.y };
      let p3 = { x: c.x + c.w, y: c.y + c.h };
      let p4 = { x: c.x, y: c.y + c.h };
      for (let i = 0; i < depth; i++) {
        // Connect midpoints? Actually spiral by lerping
        const t = 0.12;
        const n1 = { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
        const n2 = { x: p2.x + (p3.x - p2.x) * t, y: p2.y + (p3.y - p2.y) * t };
        const n3 = { x: p3.x + (p4.x - p3.x) * t, y: p3.y + (p4.y - p3.y) * t };
        const n4 = { x: p4.x + (p1.x - p4.x) * t, y: p4.y + (p1.y - p4.y) * t };
        if (dir === 1) {
          lines.push(`<path d="M ${f(p1.x)} ${f(p1.y)} L ${f(n2.x)} ${f(n2.y)}" />`);
          lines.push(`<path d="M ${f(p2.x)} ${f(p2.y)} L ${f(n3.x)} ${f(n3.y)}" />`);
          lines.push(`<path d="M ${f(p3.x)} ${f(p3.y)} L ${f(n4.x)} ${f(n4.y)}" />`);
          lines.push(`<path d="M ${f(p4.x)} ${f(p4.y)} L ${f(n1.x)} ${f(n1.y)}" />`);
        } else {
          lines.push(`<path d="M ${f(p1.x)} ${f(p1.y)} L ${f(n4.x)} ${f(n4.y)}" />`);
          lines.push(`<path d="M ${f(p2.x)} ${f(p2.y)} L ${f(n1.x)} ${f(n1.y)}" />`);
          lines.push(`<path d="M ${f(p3.x)} ${f(p3.y)} L ${f(n2.x)} ${f(n2.y)}" />`);
          lines.push(`<path d="M ${f(p4.x)} ${f(p4.y)} L ${f(n3.x)} ${f(n3.y)}" />`);
        }
        p1 = n1;
        p2 = n2;
        p3 = n3;
        p4 = n4;
      }
      return lines.join('');
    }

    const aSvg = strokeGroup(paradoxQuad(cells[0], 1, 4), ctx.strokeWidth);
    const bSvg = strokeGroup(paradoxQuad(cells[0], 1, 14) + paradoxQuad(cells[1], -1, 14), ctx.strokeWidth);
    const cSvg = strokeGroup(
      paradoxQuad(cells[0], 1, 14) +
        paradoxQuad(cells[1], -1, 14) +
        paradoxQuad(cells[2], -1, 14) +
        paradoxQuad(cells[3], 1, 14),
      ctx.strokeWidth
    );
    return [
      { svg: aSvg, label_zh: '從一個方形（或近正多邊形）開始，從每個頂點向相鄰邊上的某點畫直線', label_en: 'Start with a square; from each vertex, draw a line to a point on the adjacent edge' },
      { svg: bSvg, label_zh: '每條新線在內部創造一個更小的方形；持續向中心螺旋', label_en: 'Each new line creates a smaller inner square — keep spiraling inward' },
      { svg: cSvg, label_zh: '由純直線製造出「螺旋漩渦」的視覺幻覺', label_en: 'Pure straight lines build the illusion of a spiraling vortex' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Beelight — honeycomb cells with flames                                */
/* ------------------------------------------------------------------ */
function hexagonPoints(cx: number, cy: number, r: number, flatTop = true): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + (flatTop ? 0 : Math.PI / 6);
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

export const beelight: TanglePattern = {
  slug: 'beelight',
  generate(rect, ctx) {
    const r = Math.min(rect.w, rect.h) * 0.12;
    const dx = r * 1.5;
    const dy = r * Math.sqrt(3);
    const cells: { cx: number; cy: number }[] = [];
    for (let j = 0; ; j++) {
      const y = rect.y + r + j * (dy * 0.5);
      if (y - r > rect.y + rect.h) break;
      const off = j % 2 === 0 ? 0 : dx;
      for (let i = 0; ; i++) {
        const x = rect.x + r + off + i * (dx * 2);
        if (x - r > rect.x + rect.w) break;
        cells.push({ cx: x, cy: y });
      }
    }
    const cellsSvg = strokeGroup(cells.map(c => `<path d="${polygon(hexagonPoints(c.cx, c.cy, r, true))}" />`).join(''), ctx.strokeWidth);
    const flames: string[] = [];
    for (const c of cells) {
      const top: Pt = { x: c.cx, y: c.cy - r * 0.7 };
      const bot: Pt = { x: c.cx, y: c.cy + r * 0.5 };
      const c1 = { x: c.cx - r * 0.4, y: c.cy };
      const c2 = { x: c.cx + r * 0.3, y: c.cy + r * 0.3 };
      flames.push(`<path d="M ${f(top.x)} ${f(top.y)} C ${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(bot.x)} ${f(bot.y)} C ${f(c.cx + r * 0.3)} ${f(c.cy)} ${f(c.cx - r * 0.1)} ${f(c.cy - r * 0.4)} ${f(top.x)} ${f(top.y)}" />`);
    }
    const flamesSvg = strokeGroup(flames.join(''), ctx.strokeWidth);
    const halfFlames = strokeGroup(flames.slice(0, Math.ceil(flames.length / 2)).join(''), ctx.strokeWidth);
    return [
      { svg: cellsSvg, label_zh: '畫一片六角蜂巢格', label_en: 'Draw a honeycomb of hexagonal cells' },
      { svg: cellsSvg + halfFlames, label_zh: '在格內畫一個彎曲的火焰形', label_en: 'Inside cells, draw curving flame shapes' },
      { svg: cellsSvg + flamesSvg, label_zh: '每個火焰朝向相鄰格的方向變化', label_en: 'Each flame can face a different neighbor' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Shattuck — wave + skirt arcs (filled)                                 */
/* ------------------------------------------------------------------ */
export const shattuck: TanglePattern = {
  slug: 'shattuck',
  generate(rect, ctx) {
    const bands = 3;
    const bandH = rect.h / bands;
    const ampW = rect.w * 0.04;
    const periods = 3.2;

    const waveDs: string[] = [];
    for (let b = 0; b <= bands; b++) {
      const y = rect.y + b * bandH;
      waveDs.push(waveLine(rect.x, y, rect.x + rect.w, y, ampW, periods, ctx.rng));
    }
    const wavesA = strokeGroup(`<path d="${waveDs[0]}" />`, ctx.strokeWidth);

    const skirts: string[] = [];
    const skirtFills: string[] = [];
    const segs = Math.max(6, Math.floor(rect.w / 18));
    for (let b = 0; b < bands; b++) {
      const y0 = rect.y + b * bandH;
      const y1 = rect.y + (b + 1) * bandH;
      for (let i = 0; i < segs; i++) {
        const x = rect.x + (i + 0.5) * (rect.w / segs);
        const half = (rect.w / segs) * 0.4;
        const top: Pt = { x: x - half, y: y0 + ampW * 0.2 };
        const bot: Pt = { x: x - half, y: y1 - ampW * 0.2 };
        const top2: Pt = { x: x + half, y: y0 + ampW * 0.2 };
        const bot2: Pt = { x: x + half, y: y1 - ampW * 0.2 };
        const arcD = `M ${f(top.x)} ${f(top.y)} Q ${f(x)} ${f(y1 - 1)} ${f(top2.x)} ${f(top2.y)}`;
        skirts.push(`<path d="${arcD}" />`);
        skirtFills.push(`M ${f(top.x)} ${f(top.y)} Q ${f(x)} ${f(y1 - 1)} ${f(top2.x)} ${f(top2.y)} L ${f(top2.x)} ${f(top.y)} Z`);
      }
    }
    const wavesAll = strokeGroup(waveDs.map(d => `<path d="${d}" />`).join(''), ctx.strokeWidth);
    const skirtsSvg = strokeGroup(skirts.join(''), ctx.strokeWidth);
    const skirtFillSvg = `<g fill="currentColor" stroke="none">${skirtFills.map(d => `<path d="${d}" />`).join('')}</g>`;

    return [
      { svg: wavesA, label_zh: '在區塊上畫一條波浪狀水平線', label_en: 'Draw a wavy horizontal line across the area' },
      { svg: wavesA + skirtsSvg, label_zh: '從波浪向下畫一連串如「裙擺」的垂直弧', label_en: 'From the wave, draw a row of vertical "skirt" arcs' },
      { svg: wavesAll + skirtsSvg, label_zh: '在弧下方再畫一條呼應的波浪線，繼續堆疊', label_en: 'Add another echoing wave below the arcs and stack' },
      { svg: wavesAll + skirtsSvg + skirtFillSvg, label_zh: '把弧的內部填黑，像懸吊的果實', label_en: 'Fill the arc interiors black — suspended fruit' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* W2 — interlocking W columns                                           */
/* ------------------------------------------------------------------ */
export const w2: TanglePattern = {
  slug: 'w2',
  generate(rect, ctx) {
    const cols = Math.max(3, Math.floor(rect.w / 22));
    const cw = rect.w / cols;
    const wHeight = cw * 0.8;
    const rows = Math.max(3, Math.floor(rect.h / wHeight));
    const colsLines: string[][] = [];
    for (let i = 0; i < cols; i++) {
      const xL = rect.x + i * cw;
      const xR = rect.x + (i + 1) * cw;
      const xMid = (xL + xR) / 2;
      const offset = (i % 2) * (wHeight / 2);
      const lines: string[] = [];
      for (let j = -1; j < rows + 1; j++) {
        const y = rect.y + j * wHeight + offset;
        // W shape down-up-down-up across cell
        const d = `M ${f(xL)} ${f(y)} L ${f(xL + cw * 0.25)} ${f(y + wHeight)} L ${f(xMid)} ${f(y + wHeight * 0.4)} L ${f(xR - cw * 0.25)} ${f(y + wHeight)} L ${f(xR)} ${f(y)}`;
        lines.push(`<path d="${d}" />`);
      }
      colsLines.push(lines);
    }
    const drawCols = (n: number) => strokeGroup(colsLines.slice(0, n).map(arr => arr.join('')).join(''), ctx.strokeWidth);
    // diamond fills — small dots between W tips
    const fills: string[] = [];
    for (let i = 0; i < cols - 1; i++) {
      const x = rect.x + (i + 1) * cw;
      const offset = ((i + 1) % 2) * (wHeight / 2);
      for (let j = 0; j < rows + 1; j++) {
        const y = rect.y + j * wHeight + offset + wHeight * 0.4;
        if (y > rect.y + rect.h) continue;
        fills.push(disc(x, y, 1.4));
      }
    }
    const fillSvg = fillGroup(fills.join(''));

    return [
      { svg: drawCols(1), label_zh: '畫一直行相疊的「W」形', label_en: 'Draw a column of stacked W shapes' },
      { svg: drawCols(2), label_zh: '旁邊再畫一直行 W 形，與前一行錯開半個 W', label_en: 'Add another column offset by half a W to interlock' },
      { svg: drawCols(cols), label_zh: '兩行交織，繼續鋪滿', label_en: 'Continue weaving the columns across the area' },
      { svg: drawCols(cols) + fillSvg, label_zh: '中間夾出的小菱形填黑', label_en: 'Fill the small interior diamonds black' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Zig zag (Zander) — paired zigzags with diamonds                       */
/* ------------------------------------------------------------------ */
export const zigzagZander: TanglePattern = {
  slug: 'zigzag-zander',
  generate(rect, ctx) {
    const rows = Math.max(3, Math.floor(rect.h / 18));
    const rh = rect.h / rows;
    const segs = Math.max(6, Math.floor(rect.w / 16));

    function buildZ(yBase: number, mirror: boolean): string {
      let d = `M ${f(rect.x)} ${f(yBase)}`;
      for (let i = 1; i <= segs; i++) {
        const x = rect.x + (i / segs) * rect.w;
        const dy = (i % 2 === 0) === mirror ? -rh * 0.4 : rh * 0.4;
        d += ` L ${f(x)} ${f(yBase + dy)}`;
      }
      return d;
    }

    const linesA: string[] = [];
    const linesB: string[] = [];
    const fills: string[] = [];
    for (let r = 0; r < rows; r++) {
      const y = rect.y + (r + 0.5) * rh;
      const upD = buildZ(y, false);
      const dnD = buildZ(y, true);
      linesA.push(`<path d="${upD}" />`);
      linesB.push(`<path d="${upD}" />`);
      linesB.push(`<path d="${dnD}" />`);
      // fill diamonds
      for (let i = 1; i <= segs; i++) {
        if (i % 2 !== 0) continue;
        const xL = rect.x + ((i - 1) / segs) * rect.w;
        const xC = rect.x + (i / segs) * rect.w;
        const xR = rect.x + ((i + 1) / segs) * rect.w;
        if (xR > rect.x + rect.w) continue;
        const yc = y;
        fills.push(polygon([
          { x: xL, y: yc + rh * 0.4 },
          { x: xC, y: yc - rh * 0.4 },
          { x: xR, y: yc + rh * 0.4 },
          { x: xC, y: yc + rh * 0.4 + rh * 0.4 },
        ]));
      }
    }
    const aSvg = strokeGroup(linesA.join(''), ctx.strokeWidth);
    const bSvg = strokeGroup(linesB.join(''), ctx.strokeWidth);
    const fillSvg = `<g fill="currentColor" stroke="none" opacity="0.85">${fills.map(d => `<path d="${d}" />`).join('')}</g>`;
    return [
      { svg: aSvg, label_zh: '畫一條連續的鋸齒線——尖峰與尖谷交替', label_en: 'Draw a continuous zigzag line with alternating peaks and valleys' },
      { svg: bSvg, label_zh: '旁邊再畫一條鏡射的鋸齒線，中間形成菱形', label_en: 'Add a mirrored zigzag line; diamonds form between' },
      { svg: bSvg + fillSvg, label_zh: '把菱形填黑', label_en: 'Fill the diamonds with black' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Ahh — small starburst sprinkles                                       */
/* ------------------------------------------------------------------ */
export const ahh: TanglePattern = {
  slug: 'ahh',
  generate(rect, ctx) {
    const stars: { x: number; y: number; r: number }[] = [];
    const target = Math.floor(rect.w * rect.h * 0.0014 * ctx.density);
    for (let i = 0; i < target * 8 && stars.length < target; i++) {
      const r = 4 + ctx.rng() * 5;
      const x = rect.x + r + ctx.rng() * (rect.w - r * 2);
      const y = rect.y + r + ctx.rng() * (rect.h - r * 2);
      let ok = true;
      for (const q of stars) if (Math.hypot(q.x - x, q.y - y) < r + q.r + 4) { ok = false; break; }
      if (ok) stars.push({ x, y, r });
    }
    function starSvg(s: { x: number; y: number; r: number }, rays: number) {
      const lines: string[] = [];
      for (let i = 0; i < rays; i++) {
        const a = (i / rays) * Math.PI * 2 + ctx.rng() * 0.2;
        lines.push(`<path d="M ${f(s.x)} ${f(s.y)} L ${f(s.x + Math.cos(a) * s.r)} ${f(s.y + Math.sin(a) * s.r)}" />`);
      }
      return lines.join('');
    }
    const half = stars.slice(0, Math.ceil(stars.length / 2));
    const aSvg = strokeGroup(half.map(s => starSvg(s, 3)).join(''), ctx.strokeWidth);
    const bSvg = strokeGroup(half.map(s => starSvg(s, 5)).join(''), ctx.strokeWidth);
    const cSvg = strokeGroup(stars.map(s => starSvg(s, 5 + Math.floor(ctx.rng() * 2))).join(''), ctx.strokeWidth);
    // breathing dots between
    const dots: string[] = [];
    for (let i = 0; i < target; i++) {
      const x = rect.x + 4 + ctx.rng() * (rect.w - 8);
      const y = rect.y + 4 + ctx.rng() * (rect.h - 8);
      dots.push(disc(x, y, 0.7));
    }
    const dotSvg = fillGroup(dots.join(''));

    return [
      { svg: aSvg, label_zh: '畫一個小「Y」字，或三線星形', label_en: 'Draw a small Y or three-line star' },
      { svg: bSvg, label_zh: '加上第四、第五條光線，形成放射星芒', label_en: 'Add fourth and fifth rays for a radial starburst' },
      { svg: cSvg, label_zh: '把這種星芒散布在區塊各處，大小變化', label_en: 'Scatter starbursts of varying sizes across the area' },
      { svg: cSvg + dotSvg, label_zh: '在星芒之間點上小點，作為呼吸空間', label_en: 'Drop small dots between as breathing space' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Tortuca — hexagonal honeycomb with markings                           */
/* ------------------------------------------------------------------ */
export const tortuca: TanglePattern = {
  slug: 'tortuca',
  generate(rect, ctx) {
    const r = Math.min(rect.w, rect.h) * 0.11;
    const dx = r * 1.5;
    const dy = r * Math.sqrt(3);
    const cells: { cx: number; cy: number }[] = [];
    for (let j = 0; ; j++) {
      const y = rect.y + r + j * (dy * 0.5);
      if (y - r > rect.y + rect.h) break;
      const off = j % 2 === 0 ? 0 : dx;
      for (let i = 0; ; i++) {
        const x = rect.x + r + off + i * (dx * 2);
        if (x - r > rect.x + rect.w) break;
        cells.push({ cx: x, cy: y });
      }
    }
    const outerSvg = strokeGroup(cells.map(c => `<path d="${polygon(hexagonPoints(c.cx, c.cy, r, true))}" />`).join(''), ctx.strokeWidth);
    const innerSvg = strokeGroup(cells.map(c => `<path d="${polygon(hexagonPoints(c.cx, c.cy, r * 0.7, true))}" />`).join(''), ctx.strokeWidth * 0.8);
    const marks: string[] = [];
    for (const c of cells) {
      const r2 = r * 0.35;
      marks.push(`<path d="M ${f(c.cx - r2)} ${f(c.cy)} L ${f(c.cx + r2)} ${f(c.cy)} M ${f(c.cx)} ${f(c.cy - r2)} L ${f(c.cx)} ${f(c.cy + r2)}" />`);
    }
    const marksSvg = strokeGroup(marks.join(''), ctx.strokeWidth * 0.8);
    return [
      { svg: outerSvg, label_zh: '畫一個六角形，並把整片區塊以六角形蜂巢鑲嵌', label_en: 'Draw hexagons and tile the area with a honeycomb' },
      { svg: outerSvg + innerSvg, label_zh: '每個六角形內畫略小的六角形', label_en: 'Inside each hex, draw a slightly smaller hexagon' },
      { svg: outerSvg + innerSvg + marksSvg, label_zh: '加上小十字、點或弧——像龜殼上的紋路', label_en: 'Add a small cross, dot, or arc — turtle-shell markings' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Quib — vertical lines with paired J-strokes                           */
/* ------------------------------------------------------------------ */
export const quib: TanglePattern = {
  slug: 'quib',
  generate(rect, ctx) {
    const cols = Math.max(3, Math.floor(rect.w / 22));
    const cw = rect.w / cols;
    const verts: string[] = [];
    for (let i = 0; i <= cols; i++) {
      const x = rect.x + i * cw;
      verts.push(`<path d="${wobLine({ x, y: rect.y }, { x, y: rect.y + rect.h }, ctx.rng, 0.4, 14)}" />`);
    }
    const vertSvg = strokeGroup(verts.join(''), ctx.strokeWidth);

    const js: string[] = [];
    for (let i = 0; i < cols; i++) {
      const xL = rect.x + i * cw;
      const xR = rect.x + (i + 1) * cw;
      const direction = i % 2 === 0 ? 1 : -1;
      const ax = direction > 0 ? xL : xR;
      const tipX = direction > 0 ? xL + cw * 0.6 : xR - cw * 0.6;
      const rows = Math.max(5, Math.floor(rect.h / 14));
      const rh = rect.h / rows;
      for (let j = 0; j < rows; j++) {
        const y = rect.y + (j + 0.5) * rh;
        const c = { x: ax + (tipX - ax) * 0.7, y: y - rh * 0.4 };
        js.push(`<path d="M ${f(ax)} ${f(y)} Q ${f(c.x)} ${f(c.y)} ${f(tipX)} ${f(y - rh * 0.5)}" />`);
      }
    }
    const jSvg = strokeGroup(js.join(''), ctx.strokeWidth * 0.9);

    return [
      { svg: vertSvg, label_zh: '畫一條垂直線（再畫第二條垂直線於旁邊）', label_en: 'Draw a vertical line (and another beside it)' },
      { svg: vertSvg + strokeGroup(js.slice(0, Math.floor(js.length / 2)).join(''), ctx.strokeWidth * 0.9), label_zh: '從一條線射出細的向上 J 形筆劃，間距均勻', label_en: 'Shoot thin upward-J strokes from one line at even spacing' },
      { svg: vertSvg + jSvg, label_zh: '另一條線射出反方向的 J 形筆劃，視覺互鎖', label_en: 'From the next line, shoot J-strokes in the opposite direction; the columns interlock' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Zinging Static — Static + extra curls                                 */
/* ------------------------------------------------------------------ */
export const zingingStatic: TanglePattern = {
  slug: 'zinging-static',
  generate(rect, ctx) {
    // Re-use static pattern but add curls at zigzag tips
    const base = staticTangle.generate(rect, ctx);
    const last = base[base.length - 1].svg;
    // small curls scattered along verticals
    const curls: string[] = [];
    const cols = Math.max(4, Math.floor(rect.w / 16));
    const cw = rect.w / cols;
    for (let i = 0; i <= cols; i++) {
      const x = rect.x + i * cw;
      for (let j = 0; j < 4; j++) {
        const y = rect.y + (j + 0.5) * (rect.h / 4) + (ctx.rng() - 0.5) * 4;
        const r = 2.5;
        curls.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="currentColor" stroke-width="${ctx.strokeWidth}" />`);
      }
    }
    const curlsSvg = `<g>${curls.join('')}</g>`;
    return [
      { svg: base[base.length - 1].svg, label_zh: '從基礎 Static 圖樣開始（垂直線與互咬鋸齒）', label_en: 'Start with base Static (verticals and meshing zigzags)' },
      { svg: last + curlsSvg, label_zh: '在線上加一些彈跳的小圓圈，讓圖樣更活潑', label_en: 'Add bouncy small circles to give it extra zing' },
    ];
  },
};
