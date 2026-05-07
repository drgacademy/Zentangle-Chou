<script lang="ts">
  import SketchBorder from '$lib/components/primitives/SketchBorder.svelte';
</script>

<h1 class="h-pull mb-8">SketchBorder</h1>
<p class="text-ink-shade mb-12 max-w-prose">Wobbly hand-drawn frames. Same seed = same wobble. Use double for stacked aura look.</p>

<div class="grid sm:grid-cols-2 gap-8">
  <SketchBorder seed="alpha" jitter={1.6}>
    <div class="p-10 text-center">
      <p class="text-h3">seed: alpha</p>
      <p class="text-ink-shade">jitter 1.6 (default)</p>
    </div>
  </SketchBorder>
  <SketchBorder seed="beta" jitter={2.4} double>
    <div class="p-10 text-center">
      <p class="text-h3">double</p>
      <p class="text-ink-shade">double=true, jitter 2.4</p>
    </div>
  </SketchBorder>
  <SketchBorder seed="gamma" jitter={0.8} width={0.8}>
    <div class="p-10 text-center">
      <p class="text-h3">tame</p>
      <p class="text-ink-shade">jitter 0.8, thin</p>
    </div>
  </SketchBorder>
  <SketchBorder seed="delta" jitter={3.5} width={1.4}>
    <div class="p-10 text-center">
      <p class="text-h3">scribbly</p>
      <p class="text-ink-shade">jitter 3.5, bold</p>
    </div>
  </SketchBorder>
</div>
