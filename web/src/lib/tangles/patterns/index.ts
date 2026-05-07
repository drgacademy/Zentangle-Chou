import { crescentMoon } from './crescentMoon';
import { florz } from './florz';
import { tipple } from './tipple';
import { hollibaugh } from './hollibaugh';
import { paradox } from './paradox';
import { printemps } from './printemps';
import { nzeppel } from './nzeppel';
import type { Pattern } from '../types';

export const patterns: Record<string, Pattern> = {
  'crescent-moon': crescentMoon,
  florz,
  tipple,
  hollibaugh,
  paradox,
  printemps,
  nzeppel
};

export const patternList = Object.values(patterns);
export type PatternSlug = keyof typeof patterns;
