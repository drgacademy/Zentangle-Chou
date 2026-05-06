import type { Rect, TangleOptions } from './types';
import { fmt } from './path';

/**
 * Knightsbridge — pure black-and-white checkerboard. The strongest contrast
 * tangle, used as graphic punctuation. Cells are slightly wobbly so it
 * doesn't look mechanical.
 */
export function knightsbridge(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', density = 1 } = opts;
  const cellSize = Math.max(10, Math.min(rect.w, rect.h) / (8 * density));
  const cols = Math.ceil(rect.w / cellSize);
  const rows = Math.ceil(rect.h / cellSize);

  const fills: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 !== 0) continue;
      const x = rect.x + c * cellSize;
      const y = rect.y + r * cellSize;
      const w = Math.min(cellSize, rect.x + rect.w - x);
      const h = Math.min(cellSize, rect.y + rect.h - y);
      // tiny wobble per corner
      const j = 0.6;
      const tlx = x + (rng() - 0.5) * j;
      const tly = y + (rng() - 0.5) * j;
      const trx = x + w + (rng() - 0.5) * j;
      const tryy = y + (rng() - 0.5) * j;
      const brx = x + w + (rng() - 0.5) * j;
      const bry = y + h + (rng() - 0.5) * j;
      const blx = x + (rng() - 0.5) * j;
      const bly = y + h + (rng() - 0.5) * j;
      fills.push(
        `<path d="M ${fmt(tlx)} ${fmt(tly)} L ${fmt(trx)} ${fmt(tryy)} L ${fmt(brx)} ${fmt(bry)} L ${fmt(blx)} ${fmt(bly)} Z" />`
      );
    }
  }

  // also draw a thin outline grid so empty cells aren't featureless
  const outlines: string[] = [];
  for (let r = 0; r <= rows; r++) {
    const y = rect.y + r * cellSize;
    outlines.push(`<path d="M ${fmt(rect.x)} ${fmt(y)} L ${fmt(rect.x + rect.w)} ${fmt(y)}" />`);
  }
  for (let c = 0; c <= cols; c++) {
    const x = rect.x + c * cellSize;
    outlines.push(`<path d="M ${fmt(x)} ${fmt(rect.y)} L ${fmt(x)} ${fmt(rect.y + rect.h)}" />`);
  }

  return `<g><g fill="${stroke}" stroke="none">${fills.join('')}</g><g fill="none" stroke="${stroke}" stroke-width="0.4" opacity="0.5">${outlines.join('')}</g></g>`;
}
