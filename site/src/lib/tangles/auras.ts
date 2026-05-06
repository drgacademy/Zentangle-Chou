import type { Rect, TangleOptions } from './types';
import { wobblyCircle } from './path';
import { randRange } from './random';

/**
 * Auras — concentric echoes around a center. Used as accent in tiles.
 */
export function auras(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.7 } = opts;
  const cx = rect.x + rect.w / 2 + (rng() - 0.5) * rect.w * 0.2;
  const cy = rect.y + rect.h / 2 + (rng() - 0.5) * rect.h * 0.2;
  const baseR = Math.min(rect.w, rect.h) * 0.18;
  const rings = Math.floor(randRange(rng, 4, 7));

  const parts: string[] = [];
  for (let i = 0; i < rings; i++) {
    const r = baseR * (0.4 + i * 0.18);
    parts.push(`<path d="${wobblyCircle(cx, cy, r, rng, 0.35, 18)}" />`);
  }

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round">${parts.join('')}</g>`;
}
