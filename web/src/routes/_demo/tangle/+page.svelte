<script lang="ts">
  import TangleCanvas from '$lib/components/tangle/TangleCanvas.svelte';
  import { randomSeed } from '$lib/tangles/rng';

  type Slug = 'crescent-moon' | 'florz' | 'tipple';
  const slugs: Slug[] = ['crescent-moon', 'florz', 'tipple'];
  let seeds: Record<Slug, string> = $state({
    'crescent-moon': 'demo-cm',
    florz: 'demo-fl',
    tipple: 'demo-ti'
  });

  function reseed(s: Slug) {
    seeds[s] = randomSeed();
  }
</script>

<h1 class="h-pull mb-8">TangleCanvas</h1>
<p class="text-ink-shade mb-12 max-w-prose">
  Three hero patterns. Each draws layer-by-layer in the canonical Zentangle order: corner dots → pencil border → pencil string → ink tangle. Click a tile to re-seed and re-draw.
</p>

<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {#each slugs as s}
    <div>
      <div class="aspect-square">
        <TangleCanvas pattern={s} seed={seeds[s]} mode="interactive" onClick={() => reseed(s)} />
      </div>
      <div class="mt-3 flex items-baseline justify-between">
        <p class="font-mono text-caption">{s}</p>
        <button class="font-mono text-caption underline text-ink-shade hover:text-ink" onclick={() => reseed(s)}>
          ↻ reseed
        </button>
      </div>
      <p class="font-mono text-caption text-ink-shade">seed = {seeds[s]}</p>
    </div>
  {/each}
</div>

<section class="mt-16">
  <h2 class="text-h3 mb-4">Ambient (no scaffold)</h2>
  <div class="aspect-[2/1] max-w-3xl">
    <TangleCanvas pattern="crescent-moon" seed="ambient" mode="ambient" withScaffold={false} density={0.7} />
  </div>
</section>
