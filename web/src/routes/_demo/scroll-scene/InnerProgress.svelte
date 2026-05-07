<script lang="ts">
  import { getSceneProgress } from '$lib/components/primitives/ScrollScene.svelte';
  const progress = getSceneProgress();
</script>

<div
  class="text-display font-masthead text-center"
  style="transform: scale({0.6 + $progress * 0.6}); opacity: {0.4 + $progress * 0.6};"
>
  {Math.round($progress * 100)}%
</div>
