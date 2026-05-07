<script lang="ts">
  import { onMount } from 'svelte';
  import { wobblyRect } from '$lib/tangles/geometry';
  import { makeRng } from '$lib/tangles/rng';
  import type { Snippet } from 'svelte';

  type Props = {
    seed?: string;
    jitter?: number;
    color?: string;
    width?: number;
    inset?: number;
    double?: boolean;
    children: Snippet;
  };
  let {
    seed = 'sketch',
    jitter = 1.6,
    color = 'currentColor',
    width = 1,
    inset = 6,
    double = false,
    children
  }: Props = $props();

  let host: HTMLDivElement | null = $state(null);
  let w = $state(0);
  let h = $state(0);

  onMount(() => {
    if (!host) return;
    const ro = new ResizeObserver(() => {
      const rect = host!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
    });
    ro.observe(host);
    return () => ro.disconnect();
  });

  const rng1 = $derived(makeRng(seed));
  const path1 = $derived(
    w > 0 && h > 0
      ? wobblyRect({ x: inset, y: inset, w: w - inset * 2, h: h - inset * 2 }, rng1, jitter, 18)
      : ''
  );
  const rng2 = $derived(makeRng(seed + 'b'));
  const path2 = $derived(
    double && w > 0 && h > 0
      ? wobblyRect(
          { x: inset + 3, y: inset + 3, w: w - inset * 2 - 6, h: h - inset * 2 - 6 },
          rng2,
          jitter * 0.7,
          18
        )
      : ''
  );
</script>

<div class="wrap" bind:this={host}>
  {#if w > 0 && h > 0}
    <svg class="border" viewBox="0 0 {w} {h}" aria-hidden="true">
      <path d={path1} fill="none" stroke={color} stroke-width={width} stroke-linejoin="round" />
      {#if double}
        <path d={path2} fill="none" stroke={color} stroke-width={width * 0.6} opacity="0.6" />
      {/if}
    </svg>
  {/if}
  <div class="content">
    {@render children()}
  </div>
</div>

<style>
  .wrap {
    position: relative;
    display: block;
  }
  .border {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .content {
    position: relative;
    z-index: 1;
  }
</style>
