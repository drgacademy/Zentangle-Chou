<script lang="ts">
  import ParallaxLayer from '$lib/components/primitives/ParallaxLayer.svelte';
</script>

<h1 class="h-pull mb-8">ParallaxLayer</h1>
<p class="text-ink-shade mb-12">Scroll to see the layered offset.</p>

<div class="space-y-[40vh] py-[20vh]">
  {#each [0.2, 0.5, 0.8, 1.2] as speed, i}
    <div class="relative h-40 border-t border-ink/10 pt-4">
      <ParallaxLayer {speed}>
        <p class="text-h2">layer · speed {speed}</p>
      </ParallaxLayer>
      <p class="font-mono text-caption text-ink-shade absolute right-0 top-4">
        {i + 1}/4
      </p>
    </div>
  {/each}
</div>
