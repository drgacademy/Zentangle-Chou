<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { startBreath, stopBreath } from '$lib/stores/breath';
  import { reducedMotion } from '$lib/stores/reducedMotion';

  let unsub: () => void;

  onMount(() => {
    unsub = reducedMotion.subscribe((reduced) => {
      if (reduced) stopBreath();
      else startBreath();
    });
  });

  onDestroy(() => {
    unsub?.();
    stopBreath();
  });
</script>
