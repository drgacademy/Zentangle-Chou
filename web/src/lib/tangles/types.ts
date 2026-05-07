/**
 * Core types for the new tangle engine.
 *
 * Pattern → build(rect, ctx) → Stroke[] → render & animate
 *
 * Strokes are layered to mirror an actual Zentangle tile:
 *   layer 0: corner dots (graphite)
 *   layer 1: pencil border (graphite)
 *   layer 2: pencil string (graphite)
 *   layer 3: ink tangles (black, the meat of any pattern)
 *   layer 4: graphite shading (drawn last)
 */
export type Pt = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };

export type StrokeLayer = 'dot' | 'pencil-border' | 'pencil-string' | 'ink' | 'shade';

export type Stroke = {
  id: string;
  d: string; // SVG path "d"
  layer: StrokeLayer;
  width?: number;
  color?: string; // explicit override; falls back to layer default
  fill?: string;
  opacity?: number;
  stepIndex?: number; // teaching step within an ink-layer pattern
  drawMs?: number; // override per-stroke draw duration (default derived from path length)
};

export type PatternCtx = {
  rng: () => number;
  density: number; // 0.5 .. 2.0
  jitter: number; // px wobble amount
};

export type Pattern = {
  slug: string;
  steps: { labelZh: string; labelEn: string }[];
  build: (rect: Rect, ctx: PatternCtx) => Stroke[];
};

export const LAYER_ORDER: StrokeLayer[] = [
  'dot',
  'pencil-border',
  'pencil-string',
  'ink',
  'shade'
];
