<script lang="ts">
  import { breath } from '$lib/stores/breath';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import type { Snippet } from 'svelte';

  type Props = {
    amplitude?: number; // 0..0.05 typical
    children: Snippet;
  };
  let { amplitude = 0.012, children }: Props = $props();

  const scale = $derived($reducedMotion ? 1 : 1 + amplitude * $breath);
</script>

<div class="breathe" style="transform: scale({scale});">
  {@render children()}
</div>

<style>
  .breathe {
    will-change: transform;
    transform-origin: center;
  }
</style>
