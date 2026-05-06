import type { Pt, Rect, PatternContext, TanglePattern } from '../types';
import { f, wobLine, arcAB, dotMark, disc, ring, polygon, strokeGroup, fillGroup, halfArc } from '../svg';

/* ------------------------------------------------------------------ */
/* Florz — diagonal grid with intersection dots                        */
/* ------------------------------------------------------------------ */
export const florz: TanglePattern = {
  slug: 'florz',
  generate(rect, ctx) {
    const step = Math.max(12, 22 / ctx.density);
    const cols = Math.max(3, Math.floor(rect.w / step));
    const rows = Math.max(3, Math.floor(rect.h / step));
    const cw = rect.w / cols;
    const ch = rect.h / rows;
    const dots: Pt[] = [];
    for (let i = 0; i <= cols; i++)
      for (let j = 0; j <= rows; j++) dots.push({ x: rect.x + i * cw, y: rect.y + j * ch });

    const dotsSvg = fillGroup(dots.map(p => dotMark(p.x, p.y, 0.9)).join(''));

    // diagonals connecting dots in both directions
    const lines: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const a = { x: rect.x + i * cw, y: rect.y + j * ch };
        const b = { x: rect.x + (i + 1) * cw, y: rect.y + (j + 1) * ch };
        const c = { x: rect.x + (i + 1) * cw, y: rect.y + j * ch };
        const d = { x: rect.x + i * cw, y: rect.y + (j + 1) * ch };
        lines.push(`<path d="${wobLine(a, b, ctx.rng, 0.4, 6)}" />`);
        lines.push(`<path d="${wobLine(c, d, ctx.rng, 0.4, 6)}" />`);
      }
    const linesSvg = strokeGroup(lines.join(''), ctx.strokeWidth);

    // black diamonds at every grid dot
    const fillD: string[] = [];
    for (const p of dots) {
      const r = Math.min(cw, ch) * 0.18;
      fillD.push(polygon([
        { x: p.x, y: p.y - r },
        { x: p.x + r, y: p.y },
        { x: p.x, y: p.y + r },
        { x: p.x - r, y: p.y },
      ]));
    }
    const fillSvg = `<g fill="currentColor" stroke="none">${fillD.map(d => `<path d="${d}" />`).join('')}</g>`;

    // tiny center dots in each cell
    const centers: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        centers.push(dotMark(rect.x + (i + 0.5) * cw, rect.y + (j + 0.5) * ch, 0.5));
      }
    const centersSvg = fillGroup(centers.join(''));

    return [
      { svg: dotsSvg, label_zh: '輕點一格網狀的點', label_en: 'Dot a square grid lightly' },
      { svg: dotsSvg + linesSvg, label_zh: '對角連線形成立菱形', label_en: 'Connect dots diagonally into diamonds' },
      { svg: dotsSvg + linesSvg + fillSvg, label_zh: '在四菱相交處填上小黑菱', label_en: 'Drop a black diamond at every intersection' },
      { svg: dotsSvg + linesSvg + fillSvg + centersSvg, label_zh: '視需要在大菱形中心點上小點', label_en: 'Optionally add a dot in each large diamond' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Knightsbridge — chessboard                                          */
/* ------------------------------------------------------------------ */
export const knightsbridge: TanglePattern = {
  slug: 'knightsbridge',
  generate(rect, ctx) {
    const step = Math.max(12, 18 / ctx.density);
    const cols = Math.max(4, Math.floor(rect.w / step));
    const rows = Math.max(4, Math.floor(rect.h / step));
    const cw = rect.w / cols;
    const ch = rect.h / rows;
    const lines: string[] = [];
    for (let i = 0; i <= cols; i++) {
      const x = rect.x + i * cw;
      lines.push(`<path d="${wobLine({ x, y: rect.y }, { x, y: rect.y + rect.h }, ctx.rng, 0.5, 14)}" />`);
    }
    for (let j = 0; j <= rows; j++) {
      const y = rect.y + j * ch;
      lines.push(`<path d="${wobLine({ x: rect.x, y }, { x: rect.x + rect.w, y }, ctx.rng, 0.5, 14)}" />`);
    }
    const grid = strokeGroup(lines.join(''), ctx.strokeWidth);

    const blacks: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        if ((i + j) % 2 === 0) {
          blacks.push(`<rect x="${f(rect.x + i * cw + 0.5)}" y="${f(rect.y + j * ch + 0.5)}" width="${f(cw - 1)}" height="${f(ch - 1)}" />`);
        }
      }
    const fillSvg = `<g fill="currentColor" stroke="none">${blacks.join('')}</g>`;

    // partial fill (half) for step 2 to show progression
    const partial: string[] = [];
    let count = 0;
    const target = Math.ceil(blacks.length / 2);
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        if ((i + j) % 2 === 0 && count < target) {
          partial.push(`<rect x="${f(rect.x + i * cw + 0.5)}" y="${f(rect.y + j * ch + 0.5)}" width="${f(cw - 1)}" height="${f(ch - 1)}" />`);
          count++;
        }
      }
    const partialSvg = `<g fill="currentColor" stroke="none">${partial.join('')}</g>`;

    return [
      { svg: grid, label_zh: '畫一格方格網', label_en: 'Draw a square grid' },
      { svg: grid + partialSvg, label_zh: '開始把交錯方格填黑', label_en: 'Start filling alternating squares with black' },
      { svg: grid + fillSvg, label_zh: '完成棋盤式黑白交錯', label_en: 'Complete the chessboard alternation' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Cadent — concave-edged diamonds (outward arcs between grid dots)    */
/* ------------------------------------------------------------------ */
export const cadent: TanglePattern = {
  slug: 'cadent',
  generate(rect, ctx) {
    const step = Math.max(14, 22 / ctx.density);
    const cols = Math.max(3, Math.floor(rect.w / step));
    const rows = Math.max(3, Math.floor(rect.h / step));
    const cw = rect.w / cols;
    const ch = rect.h / rows;
    const dots: Pt[] = [];
    for (let i = 0; i <= cols; i++)
      for (let j = 0; j <= rows; j++) dots.push({ x: rect.x + i * cw, y: rect.y + j * ch });
    const dotsSvg = fillGroup(dots.map(p => dotMark(p.x, p.y, 0.8)).join(''));

    // horizontal arcs (bow upward then downward alternately not — all outward away from cell centers)
    const horiz: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j <= rows; j++) {
        const a = { x: rect.x + i * cw, y: rect.y + j * ch };
        const b = { x: rect.x + (i + 1) * cw, y: rect.y + j * ch };
        // alternate outward direction by row
        const bow = (j % 2 === 0 ? -1 : 1) * cw * 0.22;
        horiz.push(`<path d="${arcAB(a, b, bow, ctx.rng)}" />`);
      }
    const horizSvg = strokeGroup(horiz.join(''), ctx.strokeWidth);

    const vert: string[] = [];
    for (let j = 0; j < rows; j++)
      for (let i = 0; i <= cols; i++) {
        const a = { x: rect.x + i * cw, y: rect.y + j * ch };
        const b = { x: rect.x + i * cw, y: rect.y + (j + 1) * ch };
        const bow = (i % 2 === 0 ? 1 : -1) * ch * 0.22;
        vert.push(`<path d="${arcAB(a, b, bow, ctx.rng)}" />`);
      }
    const vertSvg = strokeGroup(vert.join(''), ctx.strokeWidth);

    // small dots/black hearts in cell centers
    const centers: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        centers.push(disc(rect.x + (i + 0.5) * cw, rect.y + (j + 0.5) * ch, 1.2));
      }
    const centersSvg = fillGroup(centers.join(''));

    return [
      { svg: dotsSvg, label_zh: '在區塊內輕點一格網狀的點', label_en: 'Lightly dot a grid' },
      { svg: dotsSvg + horizSvg, label_zh: '用外凸弧連接所有水平相鄰點', label_en: 'Connect each horizontal pair with an outward arc' },
      { svg: dotsSvg + horizSvg + vertSvg, label_zh: '再用外凸弧連接所有垂直相鄰點，形成凹邊菱形', label_en: 'Connect verticals the same way — concave diamonds appear' },
      { svg: dotsSvg + horizSvg + vertSvg + centersSvg, label_zh: '在每個菱形中央點一個小黑心', label_en: 'Place a small black dot in each diamond' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Bales — quilt of four-petal pillows                                  */
/* ------------------------------------------------------------------ */
export const bales: TanglePattern = {
  slug: 'bales',
  generate(rect, ctx) {
    const step = Math.max(16, 26 / ctx.density);
    const cols = Math.max(3, Math.floor(rect.w / step));
    const rows = Math.max(3, Math.floor(rect.h / step));
    const cw = rect.w / cols;
    const ch = rect.h / rows;
    const grid: string[] = [];
    for (let i = 0; i <= cols; i++)
      grid.push(`<path d="${wobLine({ x: rect.x + i * cw, y: rect.y }, { x: rect.x + i * cw, y: rect.y + rect.h }, ctx.rng, 0.3, 10)}" />`);
    for (let j = 0; j <= rows; j++)
      grid.push(`<path d="${wobLine({ x: rect.x, y: rect.y + j * ch }, { x: rect.x + rect.w, y: rect.y + j * ch }, ctx.rng, 0.3, 10)}" />`);
    const gridSvg = strokeGroup(grid.join(''), ctx.strokeWidth * 0.6);

    // first-direction arcs (top-left ↔ top-right via cell, bowing inward)
    const arcs1: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const tl = { x: rect.x + i * cw, y: rect.y + j * ch };
        const br = { x: rect.x + (i + 1) * cw, y: rect.y + (j + 1) * ch };
        const tr = { x: rect.x + (i + 1) * cw, y: rect.y + j * ch };
        const bl = { x: rect.x + i * cw, y: rect.y + (j + 1) * ch };
        // arc from top-mid to right-mid, bowing toward center
        arcs1.push(`<path d="${arcAB({ x: (tl.x + tr.x) / 2, y: tl.y }, { x: tr.x, y: (tr.y + br.y) / 2 }, -cw * 0.18, ctx.rng)}" />`);
        arcs1.push(`<path d="${arcAB({ x: tr.x, y: (tr.y + br.y) / 2 }, { x: (br.x + bl.x) / 2, y: br.y }, cw * 0.18, ctx.rng)}" />`);
        arcs1.push(`<path d="${arcAB({ x: (br.x + bl.x) / 2, y: br.y }, { x: bl.x, y: (bl.y + tl.y) / 2 }, -cw * 0.18, ctx.rng)}" />`);
        arcs1.push(`<path d="${arcAB({ x: bl.x, y: (bl.y + tl.y) / 2 }, { x: (tl.x + tr.x) / 2, y: tl.y }, cw * 0.18, ctx.rng)}" />`);
      }
    const petalsSvg = strokeGroup(arcs1.join(''), ctx.strokeWidth);

    const dots: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        dots.push(disc(rect.x + (i + 0.5) * cw, rect.y + (j + 0.5) * ch, 1.0));
      }
    const dotsSvg = fillGroup(dots.join(''));

    return [
      { svg: gridSvg, label_zh: '鋪一格方格網', label_en: 'Lay down a square grid' },
      { svg: gridSvg + petalsSvg, label_zh: '每格從邊中點向相鄰邊中點畫外凸弧，形成四瓣枕頭', label_en: 'In each cell, arc from each side-midpoint to the next — four-petal pillows' },
      { svg: gridSvg + petalsSvg + dotsSvg, label_zh: '在每瓣中心加一個小點', label_en: 'Add a dot at each petal center' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Cubine — 3D cube tessellation                                        */
/* ------------------------------------------------------------------ */
export const cubine: TanglePattern = {
  slug: 'cubine',
  generate(rect, ctx) {
    const step = Math.max(14, 24 / ctx.density);
    const cols = Math.max(3, Math.floor(rect.w / step));
    const rows = Math.max(3, Math.floor(rect.h / step));
    const cw = rect.w / cols;
    const ch = rect.h / rows;

    const grid: string[] = [];
    for (let i = 0; i <= cols; i++)
      grid.push(`<path d="${wobLine({ x: rect.x + i * cw, y: rect.y }, { x: rect.x + i * cw, y: rect.y + rect.h }, ctx.rng, 0.3, 10)}" />`);
    for (let j = 0; j <= rows; j++)
      grid.push(`<path d="${wobLine({ x: rect.x, y: rect.y + j * ch }, { x: rect.x + rect.w, y: rect.y + j * ch }, ctx.rng, 0.3, 10)}" />`);
    const gridSvg = strokeGroup(grid.join(''), ctx.strokeWidth * 0.6);

    // diagonals from corners toward inner small square
    const inner = 0.32;
    const lines: string[] = [];
    const fills: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const x0 = rect.x + i * cw;
        const y0 = rect.y + j * ch;
        const tl = { x: x0, y: y0 };
        const tr = { x: x0 + cw, y: y0 };
        const br = { x: x0 + cw, y: y0 + ch };
        const bl = { x: x0, y: y0 + ch };
        const itl = { x: x0 + cw * inner, y: y0 + ch * inner };
        const itr = { x: x0 + cw * (1 - inner), y: y0 + ch * inner };
        const ibr = { x: x0 + cw * (1 - inner), y: y0 + ch * (1 - inner) };
        const ibl = { x: x0 + cw * inner, y: y0 + ch * (1 - inner) };
        lines.push(`<path d="${wobLine(tl, itl, ctx.rng, 0.3, 4)}" />`);
        lines.push(`<path d="${wobLine(tr, itr, ctx.rng, 0.3, 4)}" />`);
        lines.push(`<path d="${wobLine(br, ibr, ctx.rng, 0.3, 4)}" />`);
        lines.push(`<path d="${wobLine(bl, ibl, ctx.rng, 0.3, 4)}" />`);
        // inner square
        lines.push(`<path d="${polygon([itl, itr, ibr, ibl])}" />`);
        // fill top + bottom triangles black
        fills.push(polygon([tl, tr, itr, itl]));
        fills.push(polygon([bl, br, ibr, ibl]));
      }
    const linesSvg = strokeGroup(lines.join(''), ctx.strokeWidth);
    const fillsSvg = `<g fill="currentColor" stroke="none">${fills.map(d => `<path d="${d}" />`).join('')}</g>`;

    return [
      { svg: gridSvg, label_zh: '畫一格方格網', label_en: 'Draw a square grid' },
      { svg: gridSvg + linesSvg, label_zh: '從四角向中心畫對角線，留下內部小方塊', label_en: 'Diagonals from each corner toward center, leaving an inner square' },
      { svg: gridSvg + linesSvg + fillsSvg, label_zh: '把對角的兩個三角填黑，立方體出現', label_en: 'Fill two opposite triangles black — the cubes pop out' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Chillon — Greek-key / labyrinth grid                                 */
/* ------------------------------------------------------------------ */
export const chillon: TanglePattern = {
  slug: 'chillon',
  generate(rect, ctx) {
    const step = Math.max(20, 32 / ctx.density);
    const cols = Math.max(3, Math.floor(rect.w / step));
    const rows = Math.max(3, Math.floor(rect.h / step));
    const cw = rect.w / cols;
    const ch = rect.h / rows;

    const grid: string[] = [];
    for (let i = 0; i <= cols; i++)
      grid.push(`<path d="${wobLine({ x: rect.x + i * cw, y: rect.y }, { x: rect.x + i * cw, y: rect.y + rect.h }, ctx.rng, 0.3, 10)}" />`);
    for (let j = 0; j <= rows; j++)
      grid.push(`<path d="${wobLine({ x: rect.x, y: rect.y + j * ch }, { x: rect.x + rect.w, y: rect.y + j * ch }, ctx.rng, 0.3, 10)}" />`);
    const gridSvg = strokeGroup(grid.join(''), ctx.strokeWidth * 0.5);

    // crosses inside each cell (thick arms to mid-edges, central square)
    const arm = 0.22;
    const crosses: string[] = [];
    const blacks: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const x0 = rect.x + i * cw;
        const y0 = rect.y + j * ch;
        const cx = x0 + cw / 2;
        const cy = y0 + ch / 2;
        // cross arms as four rectangles
        const a1: Pt[] = [
          { x: cx - cw * arm, y: y0 },
          { x: cx + cw * arm, y: y0 },
          { x: cx + cw * arm, y: cy - ch * arm },
          { x: cx - cw * arm, y: cy - ch * arm },
        ];
        const a2: Pt[] = [
          { x: cx - cw * arm, y: cy + ch * arm },
          { x: cx + cw * arm, y: cy + ch * arm },
          { x: cx + cw * arm, y: y0 + ch },
          { x: cx - cw * arm, y: y0 + ch },
        ];
        const a3: Pt[] = [
          { x: x0, y: cy - ch * arm },
          { x: cx - cw * arm, y: cy - ch * arm },
          { x: cx - cw * arm, y: cy + ch * arm },
          { x: x0, y: cy + ch * arm },
        ];
        const a4: Pt[] = [
          { x: cx + cw * arm, y: cy - ch * arm },
          { x: x0 + cw, y: cy - ch * arm },
          { x: x0 + cw, y: cy + ch * arm },
          { x: cx + cw * arm, y: cy + ch * arm },
        ];
        for (const arr of [a1, a2, a3, a4]) crosses.push(`<path d="${polygon(arr)}" />`);
        // small inner square
        crosses.push(`<path d="${polygon([
          { x: cx - cw * arm * 0.5, y: cy - ch * arm * 0.5 },
          { x: cx + cw * arm * 0.5, y: cy - ch * arm * 0.5 },
          { x: cx + cw * arm * 0.5, y: cy + ch * arm * 0.5 },
          { x: cx - cw * arm * 0.5, y: cy + ch * arm * 0.5 },
        ])}" />`);
        // black corners
        for (const corner of [
          { x: x0, y: y0 },
          { x: x0 + cw, y: y0 },
          { x: x0 + cw, y: y0 + ch },
          { x: x0, y: y0 + ch },
        ]) {
          blacks.push(polygon([
            corner,
            { x: corner.x + (corner.x === x0 ? cw * (0.5 - arm) : -cw * (0.5 - arm)), y: corner.y },
            { x: corner.x + (corner.x === x0 ? cw * (0.5 - arm) : -cw * (0.5 - arm)), y: corner.y + (corner.y === y0 ? ch * (0.5 - arm) : -ch * (0.5 - arm)) },
            { x: corner.x, y: corner.y + (corner.y === y0 ? ch * (0.5 - arm) : -ch * (0.5 - arm)) },
          ]));
        }
      }
    const crossesSvg = strokeGroup(crosses.join(''), ctx.strokeWidth);
    const blacksSvg = `<g fill="currentColor" stroke="none">${blacks.map(d => `<path d="${d}" />`).join('')}</g>`;

    return [
      { svg: gridSvg, label_zh: '鋪一格方格網', label_en: 'Lay a square grid' },
      { svg: gridSvg + crossesSvg, label_zh: '每格畫粗臂十字，中央留小方塊', label_en: 'Draw a thick cross in each cell with a small inner square' },
      { svg: gridSvg + crossesSvg + blacksSvg, label_zh: '把四角空白填黑，連成希臘回紋', label_en: 'Fill corner spaces black to form a Greek-key labyrinth' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Rixty — alternating dots and crosses                                 */
/* ------------------------------------------------------------------ */
export const rixty: TanglePattern = {
  slug: 'rixty',
  generate(rect, ctx) {
    const step = Math.max(14, 20 / ctx.density);
    const cols = Math.max(4, Math.floor(rect.w / step));
    const rows = Math.max(4, Math.floor(rect.h / step));
    const cw = rect.w / cols;
    const ch = rect.h / rows;

    const grid: string[] = [];
    for (let i = 0; i <= cols; i++)
      grid.push(`<path d="${wobLine({ x: rect.x + i * cw, y: rect.y }, { x: rect.x + i * cw, y: rect.y + rect.h }, ctx.rng, 0.3, 10)}" />`);
    for (let j = 0; j <= rows; j++)
      grid.push(`<path d="${wobLine({ x: rect.x, y: rect.y + j * ch }, { x: rect.x + rect.w, y: rect.y + j * ch }, ctx.rng, 0.3, 10)}" />`);
    const gridSvg = strokeGroup(grid.join(''), ctx.strokeWidth * 0.6);

    const dots: string[] = [];
    const crosses: string[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const cx = rect.x + (i + 0.5) * cw;
        const cy = rect.y + (j + 0.5) * ch;
        if ((i + j) % 2 === 0) {
          dots.push(disc(cx, cy, Math.min(cw, ch) * 0.18));
        } else {
          const r = Math.min(cw, ch) * 0.32;
          crosses.push(`<path d="${wobLine({ x: cx - r, y: cy - r }, { x: cx + r, y: cy + r }, ctx.rng, 0.3, 4)}" />`);
          crosses.push(`<path d="${wobLine({ x: cx + r, y: cy - r }, { x: cx - r, y: cy + r }, ctx.rng, 0.3, 4)}" />`);
        }
      }

    return [
      { svg: gridSvg, label_zh: '畫一格方格網', label_en: 'Draw a square grid' },
      { svg: gridSvg + fillGroup(dots.join('')), label_zh: '每隔一格放一個實心圓點', label_en: 'Place a solid dot in alternating cells' },
      { svg: gridSvg + fillGroup(dots.join('')) + strokeGroup(crosses.join(''), ctx.strokeWidth), label_zh: '剩下的格內畫對角交叉，形成點與X棋盤', label_en: 'Fill the rest with diagonal X — a chessboard of dots and crosses' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Amaze — square spiraling labyrinths                                  */
/* ------------------------------------------------------------------ */
export const amaze: TanglePattern = {
  slug: 'amaze',
  generate(rect, ctx) {
    const cell = Math.max(28, 40 / ctx.density);
    const cols = Math.max(2, Math.floor(rect.w / cell));
    const rows = Math.max(2, Math.floor(rect.h / cell));
    const cw = rect.w / cols;
    const ch = rect.h / rows;
    const inset = Math.min(cw, ch) * 0.12;

    function spiral(x0: number, y0: number, w: number, h: number, startCorner: number): string {
      const points: Pt[] = [];
      let left = x0 + inset;
      let right = x0 + w - inset;
      let top = y0 + inset;
      let bottom = y0 + h - inset;
      const step = inset * 1.4;
      // Start at startCorner: 0=tl, 1=tr, 2=br, 3=bl
      // We walk inward by step on each side until we cross.
      let corner: Pt;
      if (startCorner === 0) corner = { x: left, y: top };
      else if (startCorner === 1) corner = { x: right, y: top };
      else if (startCorner === 2) corner = { x: right, y: bottom };
      else corner = { x: left, y: bottom };
      points.push(corner);

      // direction sequence based on starting corner; we just spiral inward in 90deg turns
      const dirs: { dx: number; dy: number }[] = [];
      if (startCorner === 0) dirs.push({ dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 0, dy: -1 });
      else if (startCorner === 1) dirs.push({ dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 });
      else if (startCorner === 2) dirs.push({ dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 });
      else dirs.push({ dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 });

      let cur = corner;
      let leftBound = left;
      let rightBound = right;
      let topBound = top;
      let bottomBound = bottom;
      let dirIdx = 0;
      for (let k = 0; k < 30; k++) {
        const d = dirs[dirIdx % 4];
        let next: Pt;
        if (d.dx > 0) next = { x: rightBound, y: cur.y };
        else if (d.dx < 0) next = { x: leftBound, y: cur.y };
        else if (d.dy > 0) next = { x: cur.x, y: bottomBound };
        else next = { x: cur.x, y: topBound };
        points.push(next);
        // shrink bounds after the move
        if (d.dx > 0) topBound += step;
        else if (d.dx < 0) bottomBound -= step;
        else if (d.dy > 0) rightBound -= step;
        else leftBound += step;
        if (rightBound - leftBound < step || bottomBound - topBound < step) break;
        cur = next;
        dirIdx++;
      }
      let dStr = `M ${f(points[0].x)} ${f(points[0].y)}`;
      for (let p = 1; p < points.length; p++) dStr += ` L ${f(points[p].x)} ${f(points[p].y)}`;
      return dStr;
    }

    const cells: string[][] = [];
    for (let i = 0; i < cols; i++) {
      cells[i] = [];
      for (let j = 0; j < rows; j++) {
        cells[i][j] = spiral(rect.x + i * cw, rect.y + j * ch, cw, ch, (i + j) % 4);
      }
    }

    const allFrames: string[] = [];
    // Frame 1 — first row of spirals
    let f1 = '';
    for (let i = 0; i < cols; i++) f1 += `<path d="${cells[i][0]}" />`;
    allFrames.push(strokeGroup(f1, ctx.strokeWidth));

    // Frame 2 — half
    let f2 = '';
    for (let i = 0; i < cols; i++)
      for (let j = 0; j <= Math.floor(rows / 2); j++)
        f2 += `<path d="${cells[i][j]}" />`;
    allFrames.push(strokeGroup(f2, ctx.strokeWidth));

    // Frame 3 — full
    let f3 = '';
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) f3 += `<path d="${cells[i][j]}" />`;
    allFrames.push(strokeGroup(f3, ctx.strokeWidth));

    return [
      { svg: allFrames[0], label_zh: '從一個方格的角開始，畫一條向內 90° 螺旋的連續線', label_en: 'From a square corner, draw a line spiralling inward in 90° turns' },
      { svg: allFrames[1], label_zh: '在相鄰方格重複，交錯起點讓螺旋互鎖', label_en: 'Repeat in neighbouring squares; alternate starting corners' },
      { svg: allFrames[2], label_zh: '填滿整片區塊', label_en: 'Fill the whole area with the labyrinth' },
    ];
  },
};
