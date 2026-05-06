export type Rng = () => number;

export type Pt = { x: number; y: number };

export type Rect = { x: number; y: number; w: number; h: number };

export interface TangleOptions {
  rng: Rng;
  stroke?: string;
  strokeWidth?: number;
  jitter?: number;
  density?: number;
  fill?: string;
}

export type TangleName = string;

export interface TileSpec {
  seed: string;
  size?: number;
  tangles?: TangleName[];
  stroke?: string;
  bg?: string;
}

export interface PatternFrame {
  /** SVG inner content for the cumulative geometry of this step. */
  svg: string;
  label_zh: string;
  label_en: string;
}

export interface PatternContext {
  rng: Rng;
  density: number;
  strokeWidth: number;
}

export interface TanglePattern {
  /** Slug matches site/src/data/tangles.json `slug.current`. */
  slug: string;
  /** Builds an ordered list of cumulative drawing frames. */
  generate: (rect: Rect, ctx: PatternContext) => PatternFrame[];
}
