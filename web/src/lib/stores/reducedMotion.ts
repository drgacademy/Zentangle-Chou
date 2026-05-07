import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Combines OS prefers-reduced-motion with the user's in-site override.
 * Resolves to true when EITHER source asks for reduced motion.
 *
 * Override values:
 *   'auto'  → follow OS
 *   'on'    → motion enabled even if OS reduces
 *   'off'   → motion disabled regardless of OS
 */
type Override = 'auto' | 'on' | 'off';

const STORE_KEY = 'motion-pref';

function readOverride(): Override {
  if (!browser) return 'auto';
  const v = localStorage.getItem(STORE_KEY);
  return v === 'on' || v === 'off' ? v : 'auto';
}

function osReducedMotion(): boolean {
  if (!browser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resolve(override: Override, os: boolean): boolean {
  if (override === 'on') return false;
  if (override === 'off') return true;
  return os;
}

const overrideStore = writable<Override>(readOverride());
const reducedStore = writable<boolean>(resolve(readOverride(), osReducedMotion()));

if (browser) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => {
    const ov = readOverride();
    const os = mq.matches;
    const reduced = resolve(ov, os);
    reducedStore.set(reduced);
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  };
  mq.addEventListener('change', sync);
  sync();
}

export const reducedMotion = { subscribe: reducedStore.subscribe };

export const motionOverride = {
  subscribe: overrideStore.subscribe,
  set(v: Override) {
    overrideStore.set(v);
    if (browser) {
      localStorage.setItem(STORE_KEY, v);
      const reduced = resolve(v, osReducedMotion());
      reducedStore.set(reduced);
      document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
    }
  },
  cycle() {
    overrideStore.update((cur) => {
      const next: Override = cur === 'auto' ? 'on' : cur === 'on' ? 'off' : 'auto';
      if (browser) {
        localStorage.setItem(STORE_KEY, next);
        const reduced = resolve(next, osReducedMotion());
        reducedStore.set(reduced);
        document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
      }
      return next;
    });
  }
};
