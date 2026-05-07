/** Deterministic seeded RNG (mulberry32). Same seed → same drawing. */

export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed: string | number): () => number {
  const s = typeof seed === 'string' ? hashSeed(seed) : (seed >>> 0);
  return mulberry32(s);
}

export function randomSeed(): string {
  return Math.floor(Math.random() * 0xffffffff).toString(36);
}
