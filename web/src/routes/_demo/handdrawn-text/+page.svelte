<script lang="ts">
  import HandDrawnText from '$lib/components/primitives/HandDrawnText.svelte';
  let key = $state(0);
</script>

<h1 class="h-pull mb-8">HandDrawnText</h1>

<button
  class="font-mono text-caption uppercase tracking-[0.2em] mb-12 underline"
  onclick={() => (key += 1)}
>
  ↻ replay
</button>

{#key key}
  <div class="space-y-12">
    <HandDrawnText el="h2" text="一筆一畫，找回安靜" font="var(--font-masthead)" size="var(--fs-h1)" />
    <HandDrawnText el="p" text="One Stroke at a Time" font="var(--font-display-script)" size="3rem" color="var(--ink-warm)" perCharMs={140} delayMs={400} />
    <HandDrawnText el="p" text="There are no mistakes,
only opportunities." font="var(--font-masthead)" size="var(--fs-h2)" perCharMs={70} delayMs={2200} />
    <HandDrawnText el="p" text="這是 marginal note 的字體" font="var(--font-marginal)" size="1.25rem" color="var(--ink-shade)" perCharMs={120} delayMs={5500} />
  </div>
{/key}
