import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function readInitial(): Theme {
  if (!browser) return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const internal = writable<Theme>(readInitial());

export const theme = {
  subscribe: internal.subscribe,
  set(value: Theme) {
    internal.set(value);
    if (browser) {
      localStorage.setItem('theme', value);
      document.documentElement.classList.toggle('dark', value === 'dark');
      document.documentElement.dataset.theme = value;
    }
  },
  toggle() {
    internal.update((cur) => {
      const next: Theme = cur === 'dark' ? 'light' : 'dark';
      if (browser) {
        localStorage.setItem('theme', next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        document.documentElement.dataset.theme = next;
      }
      return next;
    });
  }
};
