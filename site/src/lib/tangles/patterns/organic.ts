import type { Pt, Rect, PatternContext, TanglePattern } from '../types';
import { f, wobLine, arcAB, dotMark, disc, ring, polygon, strokeGroup, fillGroup, halfArc, wobCircle } from '../svg';

/* ------------------------------------------------------------------ */
/* Printemps — tight inward spirals                                      */
/* ------------------------------------------------------------------ */
function spiralPath(cx: number, cy: number, maxR: number, turns: number, rng: () => number): string {
  const segs = Math.max(40, Math.floor(turns * 28));
  const pts: Pt[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const a = t * turns * Math.PI * 2;
    const r = (1 - t) * maxR + (rng() - 0.5) * 0.25;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const mid: Pt = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
    d += ` Q ${f(prev.x)} ${f(prev.y)} ${f(mid.x)} ${f(mid.y)}`;
  }
  return d;
}

export const printemps: TanglePattern = {
  slug: 'printemps',
  generate(rect, ctx) {
    const rMin = Math.min(rect.w, rect.h) * 0.06;
    const rMax = Math.min(rect.w, rect.h) * 0.13;
    const placed: { x: number; y: number; r: number; turns: number }[] = [];
    const target = Math.floor(rect.w * rect.h * 0.0009 * ctx.density);
    for (let i = 0; i < target * 8 && placed.length < target; i++) {
      const r = rMin + ctx.rng() * (rMax - rMin);
      const x = rect.x + r + 1 + ctx.rng() * (rect.w - r * 2 - 2);
      const y = rect.y + r + 1 + ctx.rng() * (rect.h - r * 2 - 2);
      let ok = true;
      for (const q of placed) if (Math.hypot(q.x - x, q.y - y) < r + q.r + 1.5) { ok = false; break; }
      if (ok) placed.push({ x, y, r, turns: 2.6 + ctx.rng() * 1.4 });
    }
    const small = placed.slice(0, 1);
    const halfNum = Math.ceil(placed.length / 2);
    const half = placed.slice(0, halfNum);

    const drawSet = (set: typeof placed) =>
      strokeGroup(set.map(s => `<path d="${spiralPath(s.x, s.y, s.r, s.turns, ctx.rng)}" />`).join(''), ctx.strokeWidth);

    return [
      { svg: drawSet(small), label_zh: '從一個小點或緊密的小捲開始', label_en: 'Start with a small dot or a tight inner curl' },
      { svg: drawSet(half), label_zh: '用連續曲線往外旋轉，每圈間距盡量一致', label_en: 'Spiral outward with continuous curves, even spacing' },
      { svg: drawSet(placed), label_zh: '把許多旋紋緊密排列，留下小三角形空隙', label_en: 'Pack many spirals tightly, leaving triangular gaps' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Tipple — circles of varying size, like bubbles                        */
/* ------------------------------------------------------------------ */
export const tipple: TanglePattern = {
  slug: 'tipple',
  generate(rect, ctx) {
    const minR = 2.4;
    const maxR = Math.max(4, Math.min(rect.w, rect.h) * 0.07);
    const placed: { x: number; y: number; r: number }[] = [];
    const targetBig = 6;
    const targetMed = 16;
    const targetAll = Math.max(20, Math.floor(rect.w * rect.h * 0.012 * ctx.density));

    function tryPlace(rRange: [number, number]) {
      for (let i = 0; i < 60; i++) {
        const r = rRange[0] + ctx.rng() * (rRange[1] - rRange[0]);
        const x = rect.x + r + 1 + ctx.rng() * (rect.w - r * 2 - 2);
        const y = rect.y + r + 1 + ctx.rng() * (rect.h - r * 2 - 2);
        let ok = true;
        for (const q of placed) if (Math.hypot(q.x - x, q.y - y) < r + q.r + 0.8) { ok = false; break; }
        if (ok) { placed.push({ x, y, r }); return true; }
      }
      return false;
    }

    while (placed.length < targetBig) if (!tryPlace([maxR * 0.75, maxR])) break;
    while (placed.length < targetMed) if (!tryPlace([maxR * 0.45, maxR * 0.75])) break;
    while (placed.length < targetAll) if (!tryPlace([minR, maxR * 0.45])) break;

    const drawSet = (subset: typeof placed) => {
      const rings = subset.map(c => `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(c.r)}" />`).join('');
      const dots = subset
        .filter((_, i) => i % 2 === 0)
        .map(c => disc(c.x + c.r * 0.15, c.y + c.r * 0.15, 0.45))
        .join('');
      return strokeGroup(rings, ctx.strokeWidth) + fillGroup(dots);
    };

    return [
      { svg: drawSet(placed.slice(0, targetBig)), label_zh: '先放最大的圓', label_en: 'Place the largest circles first' },
      { svg: drawSet(placed.slice(0, targetMed)), label_zh: '讓中等的圓填補空隙', label_en: 'Fill gaps with medium circles' },
      { svg: drawSet(placed), label_zh: '最小的圓填空隙的空隙；視需要單側加陰影像泡泡', label_en: 'The smallest circles fill the gaps of the gaps; add a single-side dot for bubble shading' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Mooka — flowing S-stem with curling teardrop petals                   */
/* ------------------------------------------------------------------ */
export const mooka: TanglePattern = {
  slug: 'mooka',
  generate(rect, ctx) {
    const x0 = rect.x + rect.w * 0.1;
    const x1 = rect.x + rect.w * 0.9;
    const y0 = rect.y + rect.h * 0.78;
    const y1 = rect.y + rect.h * 0.25;
    const stemD = `M ${f(x0)} ${f(y0)} C ${f(rect.x + rect.w * 0.3)} ${f(rect.y + rect.h * 0.95)} ${f(rect.x + rect.w * 0.45)} ${f(rect.y + rect.h * 0.1)} ${f(x1)} ${f(y1)}`;
    const stem = strokeGroup(`<path d="${stemD}" />`, ctx.strokeWidth);

    function petal(ax: number, ay: number, dirX: number, dirY: number, len: number, curl: number): string {
      const lenN = Math.hypot(dirX, dirY) || 1;
      const ux = dirX / lenN;
      const uy = dirY / lenN;
      const tipX = ax + ux * len;
      const tipY = ay + uy * len;
      const sideX = -uy;
      const sideY = ux;
      const c1x = ax + ux * len * 0.3 + sideX * len * 0.5;
      const c1y = ay + uy * len * 0.3 + sideY * len * 0.5;
      const c2x = tipX + sideX * len * curl;
      const c2y = tipY + sideY * len * curl;
      const c3x = ax + ux * len * 0.4 - sideX * len * 0.1;
      const c3y = ay + uy * len * 0.4 - sideY * len * 0.1;
      return `M ${f(ax)} ${f(ay)} C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(tipX)} ${f(tipY)} C ${f(c2x - sideX * len * 0.5)} ${f(c2y - sideY * len * 0.5)} ${f(c3x)} ${f(c3y)} ${f(ax)} ${f(ay)}`;
    }

    const petals: string[] = [];
    const innerPetals: string[] = [];
    const points = 5;
    for (let i = 0; i < points; i++) {
      const t = (i + 0.5) / points;
      // sample point along bezier (approx by lerp)
      const sx = x0 + (x1 - x0) * t;
      const sy = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * (-rect.h * 0.18);
      const dirX = Math.cos(t * Math.PI - Math.PI / 2);
      const dirY = Math.sin(t * Math.PI - Math.PI / 2);
      const len = rect.h * 0.22;
      petals.push(`<path d="${petal(sx, sy, dirX, dirY, len, 0.7)}" />`);
      innerPetals.push(`<path d="${petal(sx, sy, dirX, dirY, len * 0.55, 0.5)}" />`);
    }
    const petalsSvg = strokeGroup(petals.join(''), ctx.strokeWidth);
    const innerSvg = strokeGroup(innerPetals.join(''), ctx.strokeWidth * 0.85);

    return [
      { svg: stem, label_zh: '從一條柔順的長 S 曲線開始，作為主莖', label_en: 'Start with a long, gentle S-curve as the main stem' },
      { svg: stem + petalsSvg, label_zh: '從莖延伸出水滴形的瓣，往莖回捲', label_en: 'Extend teardrop petals back toward the stem' },
      { svg: stem + petalsSvg + innerSvg, label_zh: '在主瓣裡加更小的次級瓣，營造層次', label_en: 'Add smaller inner petals for depth' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Pokeleaf — balloon-shaped leaves on a stem                            */
/* ------------------------------------------------------------------ */
export const pokeleaf: TanglePattern = {
  slug: 'pokeleaf',
  generate(rect, ctx) {
    const cx = rect.x + rect.w / 2;
    const stemD = `M ${f(cx)} ${f(rect.y + rect.h - 4)} Q ${f(cx + rect.w * 0.15)} ${f(rect.y + rect.h * 0.55)} ${f(cx - rect.w * 0.05)} ${f(rect.y + 4)}`;
    const stem = strokeGroup(`<path d="${stemD}" />`, ctx.strokeWidth);

    const leafCount = 5;
    const leaves: string[] = [];
    const veins: string[] = [];
    const positions: { x: number; y: number; dir: number }[] = [];
    for (let i = 0; i < leafCount; i++) {
      const t = (i + 0.5) / leafCount;
      const sx = cx + Math.sin((1 - t) * Math.PI) * rect.w * 0.12 - rect.w * 0.025;
      const sy = rect.y + rect.h * (1 - t) - 4;
      const side = i % 2 === 0 ? 1 : -1;
      positions.push({ x: sx, y: sy, dir: side });
      const r = rect.w * 0.13;
      const dx = side * r * 1.4;
      const dy = -r * 0.4;
      const tipX = sx + dx;
      const tipY = sy + dy;
      // balloon leaf — circle bowed away with a notch at attach
      const c1 = { x: sx + dx * 0.3 + side * r * 0.6, y: sy + dy * 0.3 - r * 0.6 };
      const c2 = { x: sx + dx * 0.7 + side * r * 0.6, y: sy + dy * 0.7 + r * 0.6 };
      const leafD = `M ${f(sx)} ${f(sy)} C ${f(c1.x)} ${f(c1.y)} ${f(tipX + side * r * 0.2)} ${f(tipY - r * 0.3)} ${f(tipX)} ${f(tipY)} C ${f(c2.x)} ${f(c2.y)} ${f(sx + dx * 0.3 - side * r * 0.05)} ${f(sy + dy * 0.3 + r * 0.5)} ${f(sx)} ${f(sy)}`;
      leaves.push(`<path d="${leafD}" />`);
      // vein
      veins.push(`<path d="${wobLine({ x: sx, y: sy }, { x: tipX, y: tipY }, ctx.rng, 0.3, 6)}" />`);
    }

    const leavesSvg = strokeGroup(leaves.join(''), ctx.strokeWidth);
    const veinsSvg = strokeGroup(veins.join(''), ctx.strokeWidth * 0.7);

    return [
      { svg: stem, label_zh: '畫一條彎彎的莖', label_en: 'Draw a curving stem' },
      { svg: stem + leavesSvg, label_zh: '在莖上長出圓鼓鼓的氣球狀葉，連接處留小凹口', label_en: 'Grow plump balloon leaves with a small notch at each attachment' },
      { svg: stem + leavesSvg + veinsSvg, label_zh: '加細葉脈或單側陰影', label_en: 'Add fine veins or one-sided shading' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Fescu — thin J-curves with dots at tips                               */
/* ------------------------------------------------------------------ */
export const fescu: TanglePattern = {
  slug: 'fescu',
  generate(rect, ctx) {
    const baseY = rect.y + rect.h * 0.85;
    const count = Math.max(7, Math.floor(rect.w / 12));
    const items: { x: number; tip: Pt }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const x = rect.x + t * rect.w;
      const len = rect.h * (0.4 + ctx.rng() * 0.45);
      const lean = (ctx.rng() - 0.5) * rect.w * 0.06;
      const tip = { x: x + lean, y: baseY - len };
      items.push({ x, tip });
    }
    function drawJ(it: { x: number; tip: Pt }): { line: string; dot: string } {
      const ax = it.x;
      const ay = baseY;
      const tip = it.tip;
      // bow J slightly
      const c = { x: (ax + tip.x) / 2 + (tip.x > ax ? -3 : 3), y: (ay + tip.y) / 2 };
      return {
        line: `<path d="M ${f(ax)} ${f(ay)} Q ${f(c.x)} ${f(c.y)} ${f(tip.x)} ${f(tip.y)}" />`,
        dot: disc(tip.x, tip.y, 1.4),
      };
    }
    const drawn = items.map(drawJ);
    const linesA = strokeGroup(drawn.slice(0, Math.ceil(drawn.length * 0.4)).map(d => d.line).join(''), ctx.strokeWidth);
    const linesAll = strokeGroup(drawn.map(d => d.line).join(''), ctx.strokeWidth);
    const dotsAll = fillGroup(drawn.map(d => d.dot).join(''));
    return [
      { svg: linesA, label_zh: '從基線畫一條細的 J 字曲線', label_en: 'From a baseline, draw a thin J-shaped curve' },
      { svg: linesAll, label_zh: '旁邊再畫一條，方向類似但角度略不同', label_en: 'Draw more J-curves with slightly varying angles' },
      { svg: linesAll + dotsAll, label_zh: '尾端加實心圓點，整體像隨風起伏的草', label_en: 'Add a solid dot at each tip — wind-blown grass' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Zinger — comma stems with curl + parallel diagonals                   */
/* ------------------------------------------------------------------ */
export const zinger: TanglePattern = {
  slug: 'zinger',
  generate(rect, ctx) {
    const count = 6;
    const positions: { x: number; y: number; angle: number; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        x: rect.x + rect.w * (0.15 + ctx.rng() * 0.7),
        y: rect.y + rect.h * (0.15 + ctx.rng() * 0.7),
        angle: ctx.rng() * Math.PI * 2,
        size: rect.h * (0.18 + ctx.rng() * 0.18),
      });
    }
    function comma(p: { x: number; y: number; angle: number; size: number }): { stem: string; curl: string; dashes: string } {
      const cx = Math.cos(p.angle);
      const sy = Math.sin(p.angle);
      const tip = { x: p.x + cx * p.size, y: p.y + sy * p.size };
      const cp = { x: p.x + cx * p.size * 0.5 + sy * p.size * 0.3, y: p.y + sy * p.size * 0.5 - cx * p.size * 0.3 };
      const stem = `<path d="M ${f(p.x)} ${f(p.y)} Q ${f(cp.x)} ${f(cp.y)} ${f(tip.x)} ${f(tip.y)}" />`;
      const cr = p.size * 0.18;
      // small curl as half-circle near tip
      const curl = `<path d="M ${f(tip.x)} ${f(tip.y)} a ${f(cr)} ${f(cr)} 0 1 1 ${f(-0.1)} ${f(-0.01)}" />`;
      // dashes along stem
      const dashes: string[] = [];
      for (let k = 0.2; k < 0.95; k += 0.18) {
        const ax = p.x + cx * p.size * k;
        const ay = p.y + sy * p.size * k;
        const px = -sy;
        const py = cx;
        dashes.push(`<path d="M ${f(ax)} ${f(ay)} L ${f(ax + px * p.size * 0.18)} ${f(ay + py * p.size * 0.18)}" />`);
      }
      return { stem, curl, dashes: dashes.join('') };
    }

    const drawn = positions.map(comma);
    const stems = strokeGroup(drawn.map(d => d.stem).join(''), ctx.strokeWidth);
    const curls = strokeGroup(drawn.map(d => d.curl).join(''), ctx.strokeWidth);
    const dashes = strokeGroup(drawn.map(d => d.dashes).join(''), ctx.strokeWidth * 0.8);

    return [
      { svg: stems, label_zh: '畫一條像逗號的彎莖', label_en: 'Draw a comma-like curving stem' },
      { svg: stems + curls, label_zh: '一端加上一個小旋或小捲', label_en: 'Add a small swirl or curl at one end' },
      { svg: stems + curls + dashes, label_zh: '在莖上加平行斜線或小葉，散布各方向', label_en: 'Add parallel diagonals along the stems; scatter in all directions' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Flux — flame leaves with veins                                        */
/* ------------------------------------------------------------------ */
export const flux: TanglePattern = {
  slug: 'flux',
  generate(rect, ctx) {
    const cx = rect.x + rect.w * 0.5;
    const baseY = rect.y + rect.h * 0.92;
    const stemD = `M ${f(cx - rect.w * 0.05)} ${f(baseY)} Q ${f(cx + rect.w * 0.1)} ${f(rect.y + rect.h * 0.55)} ${f(cx - rect.w * 0.06)} ${f(rect.y + 6)}`;
    const stem = strokeGroup(`<path d="${stemD}" />`, ctx.strokeWidth);

    function flameLeaf(ax: number, ay: number, angle: number, len: number): { outer: string; vein: string } {
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const sx = -uy;
      const sy = ux;
      const tipX = ax + ux * len;
      const tipY = ay + uy * len;
      const c1x = ax + ux * len * 0.4 + sx * len * 0.4;
      const c1y = ay + uy * len * 0.4 + sy * len * 0.4;
      const c2x = ax + ux * len * 0.7 - sx * len * 0.4;
      const c2y = ay + uy * len * 0.7 - sy * len * 0.4;
      const outer = `<path d="M ${f(ax)} ${f(ay)} C ${f(c1x)} ${f(c1y)} ${f(tipX + sx * len * 0.05)} ${f(tipY + sy * len * 0.05)} ${f(tipX)} ${f(tipY)} C ${f(c2x)} ${f(c2y)} ${f(ax + ux * len * 0.3 - sx * len * 0.1)} ${f(ay + uy * len * 0.3 - sy * len * 0.1)} ${f(ax)} ${f(ay)}" />`;
      const vein = `<path d="M ${f(ax)} ${f(ay)} Q ${f(c1x * 0.5 + c2x * 0.5)} ${f(c1y * 0.5 + c2y * 0.5)} ${f(tipX)} ${f(tipY)}" />`;
      return { outer, vein };
    }

    const leaves: { outer: string; vein: string }[] = [];
    const positions = [
      { t: 0.15, side: 1, len: 0.32 },
      { t: 0.32, side: -1, len: 0.28 },
      { t: 0.5, side: 1, len: 0.36 },
      { t: 0.65, side: -1, len: 0.3 },
      { t: 0.8, side: 1, len: 0.26 },
    ];
    for (const p of positions) {
      const sx = cx - rect.w * 0.05 + Math.sin((1 - p.t) * Math.PI) * rect.w * 0.08 - rect.w * 0.02;
      const sy = rect.y + rect.h * (1 - p.t * 0.95) - 6;
      const angle = Math.PI * (-0.5) + (p.side > 0 ? -0.5 : 0.5);
      leaves.push(flameLeaf(sx, sy, angle, rect.h * p.len));
    }
    const outerSvg = strokeGroup(leaves.map(l => l.outer).join(''), ctx.strokeWidth);
    const veinSvg = strokeGroup(leaves.map(l => l.vein).join(''), ctx.strokeWidth * 0.7);

    return [
      { svg: stem, label_zh: '先有一條主莖', label_en: 'Begin with a main stem' },
      { svg: stem + outerSvg, label_zh: '畫一片像火焰般彎曲的葉', label_en: 'Draw a flame-like curving leaf' },
      { svg: stem + outerSvg + veinSvg, label_zh: '沿葉長軸加彎曲葉脈；大小有變化、部分藏於彼此後', label_en: 'Add a curving vein; vary sizes, let some leaves hide behind others' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Diva Dance — nested asymmetric S-curves                               */
/* ------------------------------------------------------------------ */
export const divaDance: TanglePattern = {
  slug: 'diva-dance',
  generate(rect, ctx) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    function sLeaf(offset: number): string {
      const top: Pt = { x: cx + offset * 0.4, y: rect.y + rect.h * 0.1 };
      const bot: Pt = { x: cx + offset, y: rect.y + rect.h * 0.9 };
      const c1 = { x: cx + offset * 0.4 + rect.w * 0.25, y: rect.y + rect.h * 0.35 };
      const c2 = { x: cx + offset - rect.w * 0.2, y: rect.y + rect.h * 0.7 };
      return `M ${f(top.x)} ${f(top.y)} C ${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(bot.x)} ${f(bot.y)}`;
    }
    const offsets = [-rect.w * 0.32, -rect.w * 0.18, -rect.w * 0.05, rect.w * 0.08, rect.w * 0.22, rect.w * 0.36];
    const curves: string[] = offsets.map(o => `<path d="${sLeaf(o)}" />`);
    const a = strokeGroup(curves.slice(0, 1).join(''), ctx.strokeWidth);
    const b = strokeGroup(curves.slice(0, 3).join(''), ctx.strokeWidth);
    const c = strokeGroup(curves.join(''), ctx.strokeWidth);
    return [
      { svg: a, label_zh: '畫一條長且不對稱的 S 形——一端粗鈍、另一端細捲', label_en: 'Draw a long, asymmetric S-curve' },
      { svg: b, label_zh: '旁邊再畫一條 S 形，靠著前一條鋪', label_en: 'Draw another S-curve hugging the first' },
      { svg: c, label_zh: '不斷堆疊；每一條都呼應、推移前一條，像隨風飄動的長葉', label_en: 'Keep stacking — each curve echoes and pushes the previous' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Bunzo — rounded forms with parallel half-moon arcs                    */
/* ------------------------------------------------------------------ */
export const bunzo: TanglePattern = {
  slug: 'bunzo',
  generate(rect, ctx) {
    const r = Math.min(rect.w, rect.h) * 0.11;
    const stepX = r * 2.3;
    const cx0 = rect.x + r * 1.2;
    const cy = rect.y + rect.h * 0.5;
    const balls: { cx: number; cy: number }[] = [];
    let x = cx0;
    while (x + r * 1.2 < rect.x + rect.w) {
      const yWobble = Math.sin(((x - cx0) / stepX) * 1.2) * r * 0.4;
      balls.push({ cx: x, cy: cy + yWobble });
      x += stepX;
    }
    const stemD = balls.length
      ? `M ${f(balls[0].cx)} ${f(balls[0].cy)} ` +
        balls.slice(1).map(b => `L ${f(b.cx)} ${f(b.cy)}`).join(' ')
      : '';
    const stem = strokeGroup(`<path d="${stemD}" />`, ctx.strokeWidth * 0.7);

    const outlines = strokeGroup(
      balls.map(b => `<path d="${wobCircle(b.cx, b.cy, r * 0.95, ctx.rng, 0.18, 14)}" />`).join(''),
      ctx.strokeWidth
    );

    const arcs: string[] = [];
    for (const b of balls) {
      for (let k = 1; k <= 4; k++) {
        const off = (k - 2.5) * (r * 0.22);
        const a: Pt = { x: b.cx - r * 0.7, y: b.cy + off };
        const c: Pt = { x: b.cx + r * 0.7, y: b.cy + off };
        arcs.push(`<path d="${arcAB(a, c, r * 0.35, ctx.rng)}" />`);
      }
    }
    const arcsSvg = strokeGroup(arcs.join(''), ctx.strokeWidth * 0.8);

    return [
      { svg: stem, label_zh: '想像一條串連珠子的莖', label_en: 'Imagine a stem to string beads on' },
      { svg: stem + outlines, label_zh: '畫一個圓潤的形（略扁的球）', label_en: 'Draw a rounded form — a slightly flattened ball' },
      { svg: stem + outlines + arcsSvg, label_zh: '內部畫平行半月弧，全部偏向同一邊；沿莖串連', label_en: 'Inside, draw parallel half-moon arcs biased to one side; string many along the stem' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Nipa — pointed leaves like palm fronds                                */
/* ------------------------------------------------------------------ */
export const nipa: TanglePattern = {
  slug: 'nipa',
  generate(rect, ctx) {
    const cx = rect.x + rect.w * 0.5;
    const stemD = `M ${f(cx - rect.w * 0.05)} ${f(rect.y + rect.h - 4)} Q ${f(cx + rect.w * 0.12)} ${f(rect.y + rect.h * 0.5)} ${f(cx - rect.w * 0.04)} ${f(rect.y + 4)}`;
    const stem = strokeGroup(`<path d="${stemD}" />`, ctx.strokeWidth);

    const count = 6;
    const leaves: { outer: string; fill: string }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const sx = cx - rect.w * 0.04 + Math.sin((1 - t) * Math.PI) * rect.w * 0.1 - rect.w * 0.02;
      const sy = rect.y + rect.h * (1 - t) - 4;
      const side = i % 2 === 0 ? 1 : -1;
      const len = rect.h * 0.28;
      const ux = side * 0.95;
      const uy = -0.3;
      const tipX = sx + ux * len;
      const tipY = sy + uy * len;
      const sideX = -uy;
      const sideY = ux;
      const c1 = { x: sx + ux * len * 0.5 + sideX * len * 0.18, y: sy + uy * len * 0.5 + sideY * len * 0.18 };
      const c2 = { x: sx + ux * len * 0.5 - sideX * len * 0.18, y: sy + uy * len * 0.5 - sideY * len * 0.18 };
      const outer = `M ${f(sx)} ${f(sy)} Q ${f(c1.x)} ${f(c1.y)} ${f(tipX)} ${f(tipY)} Q ${f(c2.x)} ${f(c2.y)} ${f(sx)} ${f(sy)} Z`;
      leaves.push({ outer, fill: i % 2 === 0 ? outer : '' });
    }
    const outers = strokeGroup(leaves.map(l => `<path d="${l.outer}" />`).join(''), ctx.strokeWidth);
    const fills = `<g fill="currentColor" stroke="none" opacity="0.85">${leaves.map(l => l.fill ? `<path d="${l.fill}" />` : '').join('')}</g>`;

    return [
      { svg: stem, label_zh: '畫一條彎曲的長莖', label_en: 'Draw a long curving stem' },
      { svg: stem + outers, label_zh: '從莖兩側射出一對對長水滴尖葉', label_en: 'Shoot pairs of pointed teardrop leaves from both sides' },
      { svg: stem + outers + fills, label_zh: '把交替的葉片填黑，產生熱帶層次', label_en: 'Fill alternating leaves black for tropical layering' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Verdigogh — pine-needle bundles                                       */
/* ------------------------------------------------------------------ */
export const verdigogh: TanglePattern = {
  slug: 'verdigogh',
  generate(rect, ctx) {
    const cx = rect.x + rect.w * 0.5;
    const stemD = `M ${f(cx - rect.w * 0.04)} ${f(rect.y + rect.h - 4)} Q ${f(cx + rect.w * 0.12)} ${f(rect.y + rect.h * 0.5)} ${f(cx - rect.w * 0.04)} ${f(rect.y + 4)}`;
    const stem = strokeGroup(`<path d="${stemD}" />`, ctx.strokeWidth);

    const bundles = 5;
    const lines: string[] = [];
    const linesHalf: string[] = [];
    for (let i = 0; i < bundles; i++) {
      const t = (i + 0.5) / bundles;
      const sx = cx - rect.w * 0.04 + Math.sin((1 - t) * Math.PI) * rect.w * 0.1 - rect.w * 0.02;
      const sy = rect.y + rect.h * (1 - t) - 4;
      const side = i % 2 === 0 ? 1 : -1;
      const baseAngle = side > 0 ? -Math.PI * 0.15 : -Math.PI * 0.85;
      const needleCount = 6;
      const spread = Math.PI * 0.4;
      const len = rect.h * 0.18;
      for (let n = 0; n < needleCount; n++) {
        const a = baseAngle - spread / 2 + (spread * n) / (needleCount - 1);
        const ex = sx + Math.cos(a) * len;
        const ey = sy + Math.sin(a) * len;
        const ln = `<path d="${wobLine({ x: sx, y: sy }, { x: ex, y: ey }, ctx.rng, 0.3, 4)}" />`;
        lines.push(ln);
        if (i < 3) linesHalf.push(ln);
      }
    }
    const linesA = strokeGroup(linesHalf.join(''), ctx.strokeWidth);
    const linesAll = strokeGroup(lines.join(''), ctx.strokeWidth);
    return [
      { svg: stem, label_zh: '畫一條彎曲的莖', label_en: 'Draw a curving stem' },
      { svg: stem + linesA, label_zh: '從莖上射出第一束短直線——5–7 根針', label_en: 'Shoot a first bundle of 5–7 short straight needles' },
      { svg: stem + linesAll, label_zh: '沿莖錯開排列，每束從同一點放射開來', label_en: 'Stagger more bundles along the stem; each radiates from one point' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Nautilus — single oversized chambered spiral                          */
/* ------------------------------------------------------------------ */
export const nautilus: TanglePattern = {
  slug: 'nautilus',
  generate(rect, ctx) {
    const cx = rect.x + rect.w * 0.45;
    const cy = rect.y + rect.h * 0.55;
    const maxR = Math.min(rect.w, rect.h) * 0.45;
    const turns = 3.2;
    const segs = Math.floor(turns * 36);
    const offset = maxR * 0.06;

    function spiral(rngLocal: () => number, r0Factor: number) {
      const pts: Pt[] = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const a = t * turns * Math.PI * 2;
        const r = Math.max(2, maxR * Math.pow(t, 1.3) - r0Factor) + (rngLocal() - 0.5) * 0.4;
        pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      }
      let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const cur = pts[i];
        const mid: Pt = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };
        d += ` Q ${f(prev.x)} ${f(prev.y)} ${f(mid.x)} ${f(mid.y)}`;
      }
      return d;
    }

    const outerD = spiral(ctx.rng, 0);
    const innerD = spiral(ctx.rng, offset);

    const chambers: string[] = [];
    const chamberCount = 18;
    for (let i = 0; i < chamberCount; i++) {
      const t = 0.15 + (i / chamberCount) * 0.85;
      const a = t * turns * Math.PI * 2;
      const r1 = Math.max(2, maxR * Math.pow(t, 1.3) - offset);
      const r2 = maxR * Math.pow(t, 1.3);
      chambers.push(
        `<path d="M ${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)} L ${f(cx + Math.cos(a) * r2)} ${f(cy + Math.sin(a) * r2)}" />`
      );
    }

    const outerSvg = strokeGroup(`<path d="${outerD}" />`, ctx.strokeWidth);
    const innerSvg = `<g stroke="currentColor" stroke-width="${ctx.strokeWidth * 0.6}" fill="none" opacity="0.7" stroke-linecap="round"><path d="${innerD}" /></g>`;
    const chambersSvg = strokeGroup(chambers.join(''), ctx.strokeWidth * 0.6);

    return [
      { svg: outerSvg, label_zh: '從中心畫一條向外擴的對數螺旋——主螺殼線', label_en: 'Draw a logarithmic spiral outward from the center — the main shell line' },
      { svg: outerSvg + innerSvg, label_zh: '在內側偏移一條平行螺旋，形成螺殼層', label_en: 'Offset a parallel spiral inside to suggest the shell wall' },
      { svg: outerSvg + innerSvg + chambersSvg, label_zh: '加上輻射的小短線當作鸚鵡螺的隔層', label_en: 'Add short radial lines as the chambered partitions of the nautilus' },
    ];
  },
};

/* ------------------------------------------------------------------ */
/* Wud — wood planks with grain rings                                    */
/* ------------------------------------------------------------------ */
export const wud: TanglePattern = {
  slug: 'wud',
  generate(rect, ctx) {
    const cols = 4;
    const cw = rect.w / cols;
    const planks: string[] = [];
    for (let i = 0; i <= cols; i++) {
      const x = rect.x + i * cw + (ctx.rng() - 0.5) * 2;
      planks.push(`<path d="M ${f(x)} ${f(rect.y)} Q ${f(x + (ctx.rng() - 0.5) * 4)} ${f(rect.y + rect.h * 0.5)} ${f(x)} ${f(rect.y + rect.h)}" />`);
    }
    const planksSvg = strokeGroup(planks.join(''), ctx.strokeWidth);

    // wood-grain rings inside each plank
    const rings: string[] = [];
    for (let i = 0; i < cols; i++) {
      const cx = rect.x + (i + 0.5) * cw;
      const cy = rect.y + rect.h / 2;
      const rx = cw * 0.35;
      const ry = rect.h * 0.4;
      for (let k = 0; k < 4; k++) {
        const factor = 1 - k * 0.22;
        rings.push(`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx * factor)}" ry="${f(ry * factor)}" />`);
      }
      // small dot at the heart
      rings.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="0.8" fill="currentColor" stroke="none" />`);
    }
    const ringsSvg = `<g stroke="currentColor" stroke-width="${ctx.strokeWidth * 0.8}" fill="none">${rings.join('')}</g>`;

    return [
      { svg: planksSvg, label_zh: '畫一排垂直波浪線，像層層木板的剖面', label_en: 'Draw vertical wavy lines — cross-sections of stacked planks' },
      { svg: planksSvg + ringsSvg, label_zh: '在每塊木板內畫巢套的橢圓——像年輪', label_en: 'Inside each plank, draw nested ovals — wood-grain rings' },
    ];
  },
};
