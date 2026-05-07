import type { Pattern, Stroke } from '../types';
import { bowedArc, fmt } from '../geometry';

/**
 * Crescent Moon — the first tangle taught in CZT, attributed to Roberts/Thomas.
 * Steps:
 *   1. Filled half-moons along the inside of the zone edge.
 *   2. First aura — a single offset arc echoing each moon.
 *   3. Second aura — a further offset echo.
 *   4. Third aura, lighter, optionally fading off.
 */
export const crescentMoon: Pattern = {
  slug: 'crescent-moon',
  steps: [
    { labelZh: '1. 沿邊畫半月', labelEn: '1. Half-moons along the edge' },
    { labelZh: '2. 第一道光環', labelEn: '2. First aura' },
    { labelZh: '3. 第二道光環', labelEn: '3. Second aura' },
    { labelZh: '4. 第三道光環', labelEn: '4. Third aura' }
  ],
  build(rect, ctx) {
    const strokes: Stroke[] = [];
    const { x, y, w, h } = rect;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const cap = Math.min(w, h) / 2;

    const moonCount = Math.max(5, Math.round(8 * ctx.density));
    const moonR = (Math.PI * cap * 0.85) / moonCount; // arc length budget per moon
    const baseR = cap - moonR * 1.2;

    let id = 0;
    // Step 1 — filled half-moons placed around an inner ring.
    for (let i = 0; i < moonCount; i++) {
      const t = (i / moonCount) * Math.PI * 2;
      const px = cx + Math.cos(t) * baseR;
      const py = cy + Math.sin(t) * baseR;
      const a = { x: px - Math.sin(t) * moonR, y: py + Math.cos(t) * moonR };
      const b = { x: px + Math.sin(t) * moonR, y: py - Math.cos(t) * moonR };
      const bow = moonR * 0.9;
      const d = `${bowedArc(a, b, bow)} L${fmt(b.x)} ${fmt(b.y)} L${fmt(a.x)} ${fmt(a.y)} Z`;
      strokes.push({
        id: `m${id++}`,
        d,
        layer: 'ink',
        width: 1.1,
        fill: 'currentColor',
        stepIndex: 0,
        drawMs: 380
      });
    }

    // Auras (steps 2..4) — echo arcs at progressively larger radius.
    for (let aura = 1; aura <= 3; aura++) {
      const offset = moonR * (1.4 + aura * 0.9);
      for (let i = 0; i < moonCount; i++) {
        const t = (i / moonCount) * Math.PI * 2;
        const px = cx + Math.cos(t) * baseR;
        const py = cy + Math.sin(t) * baseR;
        const a = {
          x: px - Math.sin(t) * (moonR + offset * 0.2),
          y: py + Math.cos(t) * (moonR + offset * 0.2)
        };
        const b = {
          x: px + Math.sin(t) * (moonR + offset * 0.2),
          y: py - Math.cos(t) * (moonR + offset * 0.2)
        };
        strokes.push({
          id: `a${aura}-${id++}`,
          d: bowedArc(a, b, moonR * 0.6 + offset),
          layer: 'ink',
          width: 0.9,
          stepIndex: aura,
          opacity: 1 - aura * 0.12,
          drawMs: 260
        });
      }
    }

    return strokes;
  }
};
