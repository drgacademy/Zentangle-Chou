<script lang="ts">
  import { theme } from '$lib/stores/theme';
</script>

<button
  type="button"
  onclick={() => theme.toggle()}
  aria-label="Toggle theme"
  class="inline-flex items-center gap-2 px-3 py-1.5 text-caption uppercase tracking-[0.2em] text-ink-shade hover:text-ink transition-colors"
>
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <circle cx="7" cy="7" r="3.2" fill="none" stroke="currentColor" stroke-width="1" />
    <path
      d="M7 1 L7 2.5 M7 11.5 L7 13 M1 7 L2.5 7 M11.5 7 L13 7 M2.5 2.5 L3.5 3.5 M10.5 10.5 L11.5 11.5 M11.5 2.5 L10.5 3.5 M3.5 10.5 L2.5 11.5"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      class="dark:hidden"
    />
    <path
      d="M9.5 5 a4 4 0 1 1 -4.5 4.5 a3.2 3.2 0 0 0 4.5 -4.5z"
      fill="currentColor"
      class="hidden dark:block"
    />
  </svg>
  <span class="hidden sm:inline">{$theme === 'dark' ? 'dark' : 'light'}</span>
</button>
