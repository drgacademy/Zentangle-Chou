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

export type TangleName =
  | 'crescent-moon'
  | 'hollibaugh'
  | 'printemps'
  | 'tipple'
  | 'florz'
  | 'static'
  | 'auras'
  | 'mooka'
  | 'paradox'
  | 'knightsbridge'
  | 'nautilus';

export interface TileSpec {
  seed: string;
  size?: number;
  tangles?: TangleName[];
  stroke?: string;
  bg?: string;
}
