import type { Pattern, Stroke } from '../types';
import { wobblyCircle } from '../geometry';

/**
 * Tipple — Roberts/Thomas. Random circles of varying size, packed together.
 * Steps:
 *   1. Largest circles, scattered.
 *   2. Medium circles in the gaps.
 *   3. Smallest circles in the remaining slivers.
 */
export const tipple: Pattern = {
  slug: 'tipple',
  steps: [
    { labelZh: '1. 大圓散布', labelEn: '1. Large circles, scattered' },
    { labelZh: '2. 中圓填縫', labelEn: '2. Medium circles fill the gaps' },
    { labelZh: '3. 小圓收拾', labelEn: '3. Smallest circles tidy the rest' }
  ],
  build(rect, ctx) {
    const strokes: Stroke[] = [];
    const { x, y, w, h } = rect;
    const placed: { cx: number; cy: number; r: number }[] = [];
    const max = Math.min(w, h);
    const tiers = [
      { count: Math.round(8 * ctx.density), r: max * 0.085, layer: 0 },
      { count: Math.round(18 * ctx.density), r: max * 0.045, layer: 1 },
      { count: Math.round(26 * ctx.density), r: max * 0.025, layer: 2 }
    ];

    let id = 0;
    for (const tier of tiers) {
      let attempts = 0;
      let placedThisTier = 0;
      while (placedThisTier < tier.count && attempts < tier.count * 30) {
        attempts++;
        const cx = x + ctx.rng() * w;
        const cy = y + ctx.rng() * h;
        if (cx - tier.r < x || cx + tier.r > x + w || cy - tier.r < y || cy + tier.r > y + h)
          continue;
        const collides = placed.some((p) => {
          const d = Math.hypot(p.cx - cx, p.cy - cy);
          return d < p.r + tier.r + 0.5;
        });
        if (collides) continue;
        placed.push({ cx, cy, r: tier.r });
        strokes.push({
          id: `t${id++}`,
          d: wobblyCircle(cx, cy, tier.r, ctx.rng, Math.max(0.4, tier.r * 0.06), 24),
          layer: 'ink',
          width: 0.9,
          stepIndex: tier.layer,
          drawMs: 220 - tier.layer * 60
        });
        placedThisTier++;
      }
    }

    return strokes;
  }
};
