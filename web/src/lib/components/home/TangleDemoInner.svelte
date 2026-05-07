<script lang="ts">
  import TangleCanvas from '$lib/components/tangle/TangleCanvas.svelte';
  import { randomSeed } from '$lib/tangles/rng';

  let seed = $state('demo-florz');
</script>

<div class="cell">
  <TangleCanvas
    pattern="florz"
    {seed}
    mode="scroll"
    onClick={() => (seed = randomSeed())}
  />
</div>

<style>
  .cell {
    width: 100%;
    height: 100%;
  }
</style>
