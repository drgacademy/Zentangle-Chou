<script lang="ts">
  import TornEdge from '$lib/components/primitives/TornEdge.svelte';
</script>

<h1 class="h-pull mb-8">TornEdge</h1>

<div class="grid sm:grid-cols-3 gap-6">
  {#each ['t1', 't2', 't3'] as s, i}
    <TornEdge seed={s} severity={0.3 + i * 0.25}>
      <div class="bg-paper-cream p-8">
        <p class="font-mono text-caption text-ink-shade mb-2">seed="{s}"</p>
        <p class="text-h3">severity {(0.3 + i * 0.25).toFixed(2)}</p>
      </div>
    </TornEdge>
  {/each}
</div>
