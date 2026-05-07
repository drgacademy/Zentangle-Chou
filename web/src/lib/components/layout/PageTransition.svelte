<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import InkTransition from '$lib/components/primitives/InkTransition.svelte';
  import { reducedMotion } from '$lib/stores/reducedMotion';

  let active = $state(false);

  onNavigate((nav) => {
    if ($reducedMotion) return;
    if (nav.from?.url.pathname === nav.to?.url.pathname) return;
    active = true;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        nav.complete.then(() => resolve());
      }, 380);
    });
  });
</script>

<InkTransition {active} onDone={() => (active = false)} durationMs={1100} />
