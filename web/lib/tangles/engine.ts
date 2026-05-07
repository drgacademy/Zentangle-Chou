import type { Pattern, PatternCtx, Rect, Stroke } from './types';
import { dot, pencilString, wobblyRect } from './geometry';
import { makeRng } from './rng';

/**
 * Compose a full Zentangle scene's strokes:
 *   layer 0  corner dots (graphite)
 *   layer 1  pencil border (graphite)
 *   layer 2  pencil string (graphite)
 *   layer 3  ink tangle (delegated to the named pattern's `build`)
 *   layer 4  graphite shading (left to consumers; we expose a helper below)
 *
 * Output is layer-ordered so the timeline plays in the canonical Zentangle order.
 */
export function buildScene(opts: {
  pattern: Pattern;
  rect: Rect;
  seed: string;
  density?: number;
  jitter?: number;
  withScaffold?: boolean; // false to skip dots/border/string (for inline tile thumbnails)
}): Stroke[] {
  const { pattern, rect, seed } = opts;
  const density = opts.density ?? 1;
  const jitter = opts.jitter ?? 1.4;
  const rng = makeRng(seed);
  const ctx: PatternCtx = { rng, density, jitter };
  const strokes: Stroke[] = [];

  if (opts.withScaffold !== false) {
    // 0 — corner dots, slightly inset.
    const inset = Math.min(rect.w, rect.h) * 0.04;
    const corners = [
      { x: rect.x + inset, y: rect.y + inset },
      { x: rect.x + rect.w - inset, y: rect.y + inset },
      { x: rect.x + rect.w - inset, y: rect.y + rect.h - inset },
      { x: rect.x + inset, y: rect.y + rect.h - inset }
    ];
    corners.forEach((c, i) =>
      strokes.push({
        id: `dot-${i}`,
        d: dot(c.x, c.y, 1.6),
        layer: 'dot',
        width: 0.8,
        fill: 'currentColor',
        drawMs: 220
      })
    );

    // 1 — pencil wobbly border around the tile.
    strokes.push({
      id: 'border',
      d: wobblyRect(
        { x: rect.x + inset, y: rect.y + inset, w: rect.w - inset * 2, h: rect.h - inset * 2 },
        rng,
        jitter,
        24
      ),
      layer: 'pencil-border',
      width: 1.0,
      drawMs: 1400
    });

    // 2 — pencil string subdividing the tile.
    strokes.push({
      id: 'string',
      d: pencilString(
        { x: rect.x + inset * 1.5, y: rect.y + inset * 1.5, w: rect.w - inset * 3, h: rect.h - inset * 3 },
        rng
      ),
      layer: 'pencil-string',
      width: 0.9,
      drawMs: 1500
    });
  }

  // 3 — ink tangle.
  const inkRect: Rect = opts.withScaffold === false
    ? rect
    : {
        x: rect.x + Math.min(rect.w, rect.h) * 0.06,
        y: rect.y + Math.min(rect.w, rect.h) * 0.06,
        w: rect.w - Math.min(rect.w, rect.h) * 0.12,
        h: rect.h - Math.min(rect.w, rect.h) * 0.12
      };
  strokes.push(...pattern.build(inkRect, ctx));

  return strokes;
}
