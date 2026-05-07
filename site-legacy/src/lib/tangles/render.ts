import type { TileSpec, Rect, TangleOptions, PatternFrame } from './types';
import { rngFromSeed, randRange } from './random';
import { fmt, wobblyLine } from './path';
import { stringPath } from './string';
import { getPattern } from './patterns';

/**
 * Build a complete zentangle tile SVG (string) for a deterministic seed.
 * Used as a fallback thumbnail in artwork cards.
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

  // 2. wobbly border
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

  const stringD = stringPath(inner, rng);

  const names = (spec.tangles && spec.tangles.length > 0 ? spec.tangles : ['tipple', 'crescent-moon', 'florz']).slice(0, 3);
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
    const pat = getPattern(names[i]);
    const frames = pat.generate(bands[i], { rng, density: 1, strokeWidth: 0.7 });
    tangleParts.push(frames.map(f => f.svg).join(''));
  }

  const sx = inner.x + inner.w * randRange(rng, 0.3, 0.7);
  const sy = inner.y + inner.h * randRange(rng, 0.3, 0.7);
  const shade = `<ellipse cx="${fmt(sx)}" cy="${fmt(sy)}" rx="${fmt(inner.w * 0.18)}" ry="${fmt(inner.h * 0.12)}" fill="${stroke}" opacity="0.06" />`;

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

/**
 * Render a single tangle as a small standalone SVG (used by gallery cards).
 * Same seed → same drawing.
 */
export function drawTinyTangle(name: string, size = 200, seed = name): string {
  const rng = rngFromSeed(seed);
  const pat = getPattern(name);
  const rect: Rect = { x: 6, y: 6, w: size - 12, h: size - 12 };
  const frames = pat.generate(rect, { rng, density: 1, strokeWidth: 0.9 });
  const body = frames.map(f => f.svg).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" aria-hidden="true">${body}</svg>`;
}

/**
 * Render a tangle's animated step SVG with each step wrapped in a <g> tagged
 * `data-step="N"`. Returns the SVG markup plus the step labels for UI use.
 */
export function drawTangleAnimated(
  slug: string,
  size = 320,
  seed = slug
): { svg: string; frames: PatternFrame[] } {
  const rng = rngFromSeed(seed);
  const pat = getPattern(slug);
  const rect: Rect = { x: 12, y: 12, w: size - 24, h: size - 24 };
  const frames = pat.generate(rect, { rng, density: 1, strokeWidth: 1.0 });
  // Build cumulative groups: step 0 contains frame 0, step 1 contains diff (frame1 minus frame0), etc.
  // Since each frame's svg is already cumulative, we wrap each whole frame and use CSS to swap visibility.
  const groups = frames
    .map(
      (frame, i) =>
        `<g class="tangle-step" data-step="${i}" style="${i === 0 ? '' : 'display:none;'}">${frame.svg}</g>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="tangle-animation-svg" aria-hidden="true">${groups}</svg>`;
  return { svg, frames };
}
