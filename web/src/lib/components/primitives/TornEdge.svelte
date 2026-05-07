<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { makeRng } from '$lib/tangles/rng';

  type Props = {
    seed?: string;
    severity?: number; // 0..1
    children: Snippet;
  };
  let { seed = 'torn', severity = 0.5, children }: Props = $props();

  let host: HTMLDivElement | null = $state(null);
  let w = $state(0);
  let h = $state(0);
  const id = `torn-${Math.random().toString(36).slice(2, 8)}`;

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

  function buildEdge(side: 'top' | 'bottom', rng: () => number): string {
    const samples = 32;
    const amp = 4 + severity * 8;
    let d = '';
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = t * w;
      const offset = (rng() - 0.5) * 2 * amp;
      const y = side === 'top' ? offset : h + offset;
      d += i === 0 ? `${x.toFixed(1)},${y.toFixed(1)}` : ` ${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d;
  }

  const rngTop = $derived(makeRng(seed + ':top'));
  const rngBot = $derived(makeRng(seed + ':bot'));
  const top = $derived(w > 0 ? buildEdge('top', rngTop) : '');
  const bot = $derived(w > 0 ? buildEdge('bottom', rngBot) : '');
  const polygon = $derived(top && bot ? `${top} ${bot.split(' ').reverse().join(' ')}` : '');
</script>

<div class="wrap" bind:this={host} style="--clip: polygon({polygon ? polygon.split(' ').map((p) => p.replace(',', 'px ').concat('px')).join(', ') : '0 0, 100% 0, 100% 100%, 0 100%'});">
  <div class="clipped">
    {@render children()}
  </div>
</div>

<style>
  .wrap {
    position: relative;
    display: block;
  }
  .clipped {
    clip-path: var(--clip);
    -webkit-clip-path: var(--clip);
    background: var(--paper-rice);
  }
</style>
