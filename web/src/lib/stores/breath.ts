import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Site-wide breath phase: oscillates 0..1..0 over BREATH_MS.
 * Used by <BreathingScale> and friends to keep all "alive" elements in sync.
 */
const BREATH_MS = 8000;

export const breath = writable(0);

let raf = 0;
let started = false;

export function startBreath() {
  if (!browser || started) return;
  started = true;
  const start = performance.now();
  const tick = (now: number) => {
    const t = ((now - start) % BREATH_MS) / BREATH_MS;
    // smooth in-out triangle wave: 0 → 1 → 0
    const phase = t < 0.5 ? t * 2 : 2 - t * 2;
    // ease with smoothstep
    const eased = phase * phase * (3 - 2 * phase);
    breath.set(eased);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

export function stopBreath() {
  if (raf) cancelAnimationFrame(raf);
  started = false;
}
