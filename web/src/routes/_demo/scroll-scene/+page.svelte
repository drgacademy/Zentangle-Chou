<script lang="ts">
  import ScrollScene from '$lib/components/primitives/ScrollScene.svelte';
  import InnerProgress from './InnerProgress.svelte';
</script>

<h1 class="h-pull mb-8">ScrollScene</h1>
<p class="text-ink-shade mb-12">Scroll: the inner block scales with progress (0..1).</p>

<ScrollScene pin scrub height="200vh">
  <div class="h-screen flex items-center justify-center">
    <InnerProgress />
  </div>
</ScrollScene>

<div class="h-[40vh] flex items-center justify-center text-ink-shade">— end of pin —</div>
