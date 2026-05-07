<script lang="ts">
  import Polaroid from '$lib/components/primitives/Polaroid.svelte';
</script>

<h1 class="h-pull mb-8">Polaroid</h1>

<div class="flex flex-wrap gap-12 justify-center">
  <Polaroid src="/favicon.svg" alt="placeholder" caption="Florz · 初春" rotate={-3} seed="p1" />
  <Polaroid src="/favicon.svg" alt="placeholder" caption="Crescent · 夜雨" rotate={2} seed="p2" />
  <Polaroid src="/favicon.svg" alt="placeholder" caption="Mooka · 南風" rotate={-1} seed="p3" />
</div>
