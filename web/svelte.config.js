import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x',
      regions: ['hnd1'],
      images: {
        sizes: [320, 480, 768, 1024, 1280, 1600, 1920],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 31536000
      }
    }),
    alias: {
      $lib: 'src/lib',
      '$lib/*': 'src/lib/*'
    }
  }
};

export default config;
