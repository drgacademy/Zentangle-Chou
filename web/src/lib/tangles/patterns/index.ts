import { crescentMoon } from './crescentMoon';
import { florz } from './florz';
import { tipple } from './tipple';
import type { Pattern } from '../types';

export const patterns: Record<string, Pattern> = {
  'crescent-moon': crescentMoon,
  florz,
  tipple
};

export const patternList = Object.values(patterns);
export type PatternSlug = keyof typeof patterns;
