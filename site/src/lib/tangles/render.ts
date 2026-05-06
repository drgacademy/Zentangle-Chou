import type { TangleName, TileSpec, Rect, TangleOptions } from './types';
import { rngFromSeed, randRange } from './random';
import { fmt, wobblyLine } from './path';
import { stringPath } from './string';
import { tipple } from './tipple';
import { florz } from './florz';
import { printemps } from './printemps';
import { crescentMoon } from './crescent-moon';
import { hollibaugh } from './hollibaugh';
import { staticTangle } from './static';
import { auras } from './auras';

/**
 * Map between tangle names (English, as stored in artworks.tangles) and
 * the procedural drawer functions. Unknown names fall back to tipple.
 */
const drawers: Record<TangleName, (rect: Rect, opts: TangleOptions) => string> = {
  'crescent-moon': crescentMoon,
  hollibaugh,
  printemps,
  tipple,
  florz,
  static: staticTangle,
  auras,
};

const ALIASES: Record<string, TangleName> = {
  'crescent moon': 'crescent-moon',
  crescentmoon: 'crescent-moon',
  knightsbridge: 'static',
  cadent: 'florz',
  bales: 'florz',
  flux: 'auras',
  mooka: 'printemps',
  paradox: 'static',
};

function normalize(name: string): TangleName {
  const k = name.toLowerCase().trim();
  if (k in drawers) return k as TangleName;
  if (ALIASES[k]) return ALIASES[k];
  return 'tipple';
}

/**
 * Build a complete zentangle tile SVG (as a string) for the given seed and
 * tangles list. The same seed produces the same tile every time, so it can
 * be used as a deterministic fallback thumbnail.
 */
export function drawTile(spec: TileSpec): string {
  const size = spec.size ?? 800;
  const rng = rngFromSeed(spec.seed);
  const stroke = spec.stroke ?? 'currentColor';
  const padding = size * 0.06;
  const inner: Rect = { x: padding, y: padding, w: size - padding * 2, h: size - padding * 2 };

  // 1. corner dots
  const dotR = Math.max(2, size * 0.005);
  const dots = [
    `<circle cx="${fmt(inner.x)}" cy="${fmt(inner.y)}" r="${dotR}" fill="${stroke}" />`,
    `<circle cx="${fmt(inner.x + inner.w)}" cy="${fmt(inner.y)}" r="${dotR}" fill="${stroke}" />`,
    `<circle cx="${fmt(inner.x + inner.w)}" cy="${fmt(inner.y + inner.h)}" r="${dotR}" fill="${stroke}" />`,
    `<circle cx="${fmt(inner.x)}" cy="${fmt(inner.y + inner.h)}" r="${dotR}" fill="${stroke}" />`,
  ].join('');

  // 2. wobbly border (made of 4 wobbly lines so it never closes perfectly)
  const tl = { x: inner.x, y: inner.y };
  const tr = { x: inner.x + inner.w, y: inner.y };
  const br = { x: inner.x + inner.w, y: inner.y + inner.h };
  const bl = { x: inner.x, y: inner.y + inner.h };
  const border = [
    `<path d="${wobblyLine(tl, tr, rng, 1.2, 14)}" />`,
    `<path d="${wobblyLine(tr, br, rng, 1.2, 14)}" />`,
    `<path d="${wobblyLine(br, bl, rng, 1.2, 14)}" />`,
    `<path d="${wobblyLine(bl, tl, rng, 1.2, 14)}" />`,
  ].join('');

  // 3. the string (split inner area into 2 regions)
  const stringD = stringPath(inner, rng);

  // 4. tangles in regions. We don't bother polygon-clipping (would need full
  // path-vs-path partitioning). Instead, we tile patterns over inner-rect
  // sub-bands picked from the tangles list.
  const names = (spec.tangles && spec.tangles.length > 0 ? spec.tangles : ['tipple', 'crescent-moon', 'florz']).map(normalize);
  const bandCount = Math.min(names.length, 3);
  const bands: Rect[] = [];
  if (bandCount === 1) {
    bands.push(inner);
  } else if (bandCount === 2) {
    bands.push({ x: inner.x, y: inner.y, w: inner.w, h: inner.h * 0.55 });
    bands.push({ x: inner.x, y: inner.y + inner.h * 0.55, w: inner.w, h: inner.h * 0.45 });
  } else {
    bands.push({ x: inner.x, y: inner.y, w: inner.w * 0.6, h: inner.h * 0.5 });
    bands.push({ x: inner.x + inner.w * 0.6, y: inner.y, w: inner.w * 0.4, h: inner.h * 0.5 });
    bands.push({ x: inner.x, y: inner.y + inner.h * 0.5, w: inner.w, h: inner.h * 0.5 });
  }

  const tangleParts: string[] = [];
  for (let i = 0; i < bandCount; i++) {
    const fn = drawers[names[i]];
    tangleParts.push(fn(bands[i], { rng, stroke, strokeWidth: 0.7, density: 1 }));
  }

  // 5. soft shade ellipse
  const sx = inner.x + inner.w * randRange(rng, 0.3, 0.7);
  const sy = inner.y + inner.h * randRange(rng, 0.3, 0.7);
  const shade = `<ellipse cx="${fmt(sx)}" cy="${fmt(sy)}" rx="${fmt(inner.w * 0.18)}" ry="${fmt(inner.h * 0.12)}" fill="${stroke}" opacity="0.06" />`;

  // 6. signature dot near bottom-right
  const sigX = inner.x + inner.w - randRange(rng, 14, 28);
  const sigY = inner.y + inner.h - randRange(rng, 14, 28);
  const sig = `<circle cx="${fmt(sigX)}" cy="${fmt(sigY)}" r="1.6" fill="${stroke}" opacity="0.6" />`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g stroke="${stroke}" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-linejoin="round">
      ${dots}
      ${border}
      <path d="${stringD}" stroke-width="0.5" opacity="0.5" />
    </g>
    ${tangleParts.join('')}
    ${shade}
    ${sig}
  </svg>`;
}

export function drawTinyTangle(name: string, size = 80, seed = name): string {
  const rng = rngFromSeed(seed);
  const t = normalize(name);
  const fn = drawers[t];
  const rect: Rect = { x: 4, y: 4, w: size - 8, h: size - 8 };
  const body = fn(rect, { rng, stroke: 'currentColor', strokeWidth: 0.7, density: 1 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" aria-hidden="true">${body}</svg>`;
}
