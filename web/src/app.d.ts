// See https://kit.svelte.dev/docs/types#app
declare global {
  namespace App {
    interface Locals {
      lang?: 'zh' | 'en';
    }
    interface PageData {
      lang?: 'zh' | 'en';
    }
  }
}

export {};
