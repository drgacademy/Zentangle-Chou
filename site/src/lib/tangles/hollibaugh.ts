import type { Rect, TangleOptions } from './types';
import { wobblyLine } from './path';
import { randRange } from './random';

/**
 * Hollibaugh — crisscrossing parallel "planks" that pass behind one another.
 * We draw a series of long bands across the rect at various angles, alternating
 * which crosses in front so the planks weave.
 */
export function hollibaugh(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 0.75, density = 1 } = opts;
  const plankCount = Math.max(3, Math.floor(4 * density));
  const plankWidth = Math.min(rect.w, rect.h) * 0.18;

  const planks: { x1: number; y1: number; x2: number; y2: number; w: number; angle: number }[] = [];
  for (let i = 0; i < plankCount; i++) {
    const angle = randRange(rng, -Math.PI * 0.45, Math.PI * 0.45) + (i % 2 === 0 ? 0 : Math.PI / 2);
    const cx = randRange(rng, rect.x + rect.w * 0.2, rect.x + rect.w * 0.8);
    const cy = randRange(rng, rect.y + rect.h * 0.2, rect.y + rect.h * 0.8);
    const len = Math.max(rect.w, rect.h) * 1.4;
    const dx = Math.cos(angle) * len * 0.5;
    const dy = Math.sin(angle) * len * 0.5;
    planks.push({
      x1: cx - dx,
      y1: cy - dy,
      x2: cx + dx,
      y2: cy + dy,
      w: plankWidth * randRange(rng, 0.8, 1.2),
      angle,
    });
  }

  const parts: string[] = [];
  // simple "behind" effect: paint white-fill rect for each plank to mask earlier ones
  for (const p of planks) {
    const nx = -Math.sin(p.angle);
    const ny = Math.cos(p.angle);
    const off = p.w / 2;
    const a1 = { x: p.x1 + nx * off, y: p.y1 + ny * off };
    const a2 = { x: p.x1 - nx * off, y: p.y1 - ny * off };
    const b1 = { x: p.x2 + nx * off, y: p.y2 + ny * off };
    const b2 = { x: p.x2 - nx * off, y: p.y2 - ny * off };
    parts.push(
      `<polygon points="${a1.x.toFixed(2)},${a1.y.toFixed(2)} ${b1.x.toFixed(2)},${b1.y.toFixed(2)} ${b2.x.toFixed(2)},${b2.y.toFixed(2)} ${a2.x.toFixed(2)},${a2.y.toFixed(2)}" fill="var(--paper-bg, #FAF7F1)" />`
    );
    parts.push(`<path d="${wobblyLine(a1, b1, rng, 0.6, 22)}" />`);
    parts.push(`<path d="${wobblyLine(a2, b2, rng, 0.6, 22)}" />`);
  }

  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round">${parts.join('')}</g>`;
}
