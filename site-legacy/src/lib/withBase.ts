/**
 * Resolve a public-asset path to include the GitHub Pages subdirectory base.
 *
 * The site is deployed to https://drgacademy.github.io/Zentangle-Chou, so
 * absolute asset paths like `/artworks/foo.jpg` need to become
 * `/Zentangle-Chou/artworks/foo.jpg` in production.
 *
 * `postbuild.js` patches the rendered HTML for us, but values that travel
 * through React props or are constructed at runtime (e.g. `new Image().src`)
 * never get patched. Components that need the resolved path should call
 * `withBase()` explicitly.
 *
 * In dev (no postbuild), BASE is empty and paths stay as-is.
 */
const BASE = import.meta.env.PROD ? '/Zentangle-Chou' : '';

export function withBase(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) return path;
  return BASE + (path.startsWith('/') ? path : '/' + path);
}

export const baseUrl = BASE;
