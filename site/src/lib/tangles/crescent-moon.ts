import type { Pt, Rect, TangleOptions } from './types';
import { bowedArc, fmt } from './path';

/**
 * Crescent Moon — a chain of crescents along a path or rect edge.
 * For a simple region we walk a sinuous path along the longest axis,
 * placing nested arcs perpendicular to the direction of travel.
 */
export function crescentMoon(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.75, density = 1 } = opts;
  const horiz = rect.w >= rect.h;
  const len = horiz ? rect.w : rect.h;
  const span = horiz ? rect.h : rect.w;
  const step = Math.max(14, 22 / density);
  const count = Math.max(2, Math.floor(len / step));

  const parts: string[] = [];

  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const cx = horiz ? rect.x + t * len : rect.x + span / 2;
    const cy = horiz ? rect.y + span / 2 : rect.y + t * len;
    const baseR = step * 0.42;

    // primary crescent: half-circle on one side
    const dir = i % 2 === 0 ? 1 : -1;
    const a: Pt = horiz
      ? { x: cx - baseR, y: cy + dir * baseR * 0.1 }
      : { x: cx + dir * baseR * 0.1, y: cy - baseR };
    const b: Pt = horiz
      ? { x: cx + baseR, y: cy + dir * baseR * 0.1 }
      : { x: cx + dir * baseR * 0.1, y: cy + baseR };

    // 4 nested arcs (auras), shrinking
    for (let n = 0; n < 4; n++) {
      const bow = (baseR * 1.1 - n * baseR * 0.22) * dir;
      parts.push(`<path d="${bowedArc(a, b, bow, rng)}" />`);
    }
    // baseline of the crescent
    parts.push(
      `<path d="M ${fmt(a.x)} ${fmt(a.y)} L ${fmt(b.x)} ${fmt(b.y)}" />`
    );
  }

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round">${parts.join('')}</g>`;
}
