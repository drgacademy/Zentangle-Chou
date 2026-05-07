<script lang="ts">
  import { motionOverride } from '$lib/stores/reducedMotion';

  const labels = { auto: 'auto', on: 'full', off: 'reduced' };
</script>

<button
  type="button"
  class="motion"
  aria-label="Cycle motion preference"
  onclick={() => motionOverride.cycle()}
>
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M2 7 Q7 1 12 7 Q7 13 2 7Z" fill="none" stroke="currentColor" stroke-width="1" />
    <circle cx="7" cy="7" r="1.4" fill="currentColor" />
  </svg>
  <span>{labels[$motionOverride]}</span>
</button>

<style>
  .motion {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--ink-shade);
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--ink-bleed);
    transition: color 0.2s, border-color 0.2s;
  }
  .motion:hover {
    color: var(--ink);
    border-color: var(--ink-pencil);
  }
</style>
