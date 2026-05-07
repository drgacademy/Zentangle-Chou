<script lang="ts">
  import PaperTexture from '$lib/components/primitives/PaperTexture.svelte';
  const tones = ['rice', 'cream', 'tea', 'night'] as const;
</script>

<h1 class="h-pull mb-8">PaperTexture</h1>
<p class="text-ink-shade mb-12 max-w-prose">Each scene picks the paper grade that fits its mood. Night is reserved for dark mode and Scene 6.</p>

<div class="grid sm:grid-cols-2 gap-6">
  {#each tones as tone}
    <div class="relative h-72 overflow-hidden border border-ink/10">
      <PaperTexture {tone} fixed={false} intensity={0.7} />
      <div class="absolute inset-0 flex flex-col justify-end p-6">
        <p class="font-mono text-caption text-ink-shade">tone="{tone}"</p>
        <p class="text-h3" class:text-ink={tone !== 'night'} class:text-paper={tone === 'night'} style={tone === 'night' ? 'color:var(--paper-rice)' : ''}>{tone}</p>
      </div>
    </div>
  {/each}
</div>
