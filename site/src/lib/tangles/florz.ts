import type { Rect, TangleOptions } from './types';
import { wobblyLine, fmt } from './path';

/**
 * Florz — a diamond grid with a small dot at every intersection.
 * Wobbled lines + intersection dots.
 */
export function florz(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.7, density = 1 } = opts;
  const spacing = Math.max(8, 18 / density);
  const angle = Math.PI / 4;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // diagonals in two directions
  const lines: string[] = [];
  const dots: string[] = [];

  const diag = Math.hypot(rect.w, rect.h) + spacing * 2;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;

  for (const dir of [1, -1]) {
    const ax = cos * dir;
    const ay = sin;
    const bx = -ay;
    const by = ax;
    for (let k = -diag / 2; k <= diag / 2; k += spacing) {
      const a = { x: cx + ax * -diag + bx * k, y: cy + ay * -diag + by * k };
      const b = { x: cx + ax * diag + bx * k, y: cy + ay * diag + by * k };
      // clip to rect (simple; accept overflow because viewBox will clip)
      lines.push(`<path d="${wobblyLine(a, b, rng, 0.7, 24)}" />`);
    }
  }

  // place small dots at approximate intersections
  for (let x = rect.x + spacing / 2; x < rect.x + rect.w; x += spacing * cos * 2) {
    for (let y = rect.y + spacing / 2; y < rect.y + rect.h; y += spacing * sin * 2) {
      if (rng() > 0.15) {
        dots.push(`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="0.7" fill="${stroke}" />`);
      }
    }
  }

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none">${lines.join('')}${dots.join('')}</g>`;
}
