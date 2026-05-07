<script lang="ts">
  import InkTransition from '$lib/components/primitives/InkTransition.svelte';
  let active = $state(false);
</script>

<h1 class="h-pull mb-8">InkTransition</h1>

<button
  class="font-mono text-caption uppercase tracking-[0.2em] underline"
  onclick={() => (active = true)}
>
  ↻ trigger ink wash
</button>

<InkTransition {active} onDone={() => (active = false)} durationMs={1100} />

<p class="mt-12 text-ink-shade">Click the button. The full-viewport overlay floods with ink (radial bleed + offset splatters), then disposes.</p>
