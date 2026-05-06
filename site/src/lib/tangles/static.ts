import type { Rect, TangleOptions } from './types';
import { fmt } from './path';
import { randRange } from './random';

/**
 * Static — sharp zigzag lightning bolts, stacked horizontally.
 */
export function staticTangle(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.75, density = 1 } = opts;
  const rows = Math.max(3, Math.floor(rect.h / (14 / density)));
  const lines: string[] = [];

  for (let r = 0; r < rows; r++) {
    const y = rect.y + (r + 0.5) * (rect.h / rows);
    const amp = (rect.h / rows) * 0.4;
    const segs = Math.max(6, Math.floor(rect.w / 12));
    let d = `M ${fmt(rect.x)} ${fmt(y)}`;
    for (let i = 1; i <= segs; i++) {
      const x = rect.x + (i / segs) * rect.w;
      const yy = y + (i % 2 === 0 ? -amp : amp) + (rng() - 0.5) * 1.2;
      d += ` L ${fmt(x)} ${fmt(yy)}`;
    }
    lines.push(`<path d="${d}" />`);
  }

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linejoin="miter">${lines.join('')}</g>`;
}
