<script lang="ts">
  import BreathingDriver from '$lib/components/primitives/BreathingDriver.svelte';
  import PaperTexture from '$lib/components/primitives/PaperTexture.svelte';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet };
  let { children }: Props = $props();
</script>

<PaperTexture tone="rice" />
<BreathingDriver />

<header class="demo-bar">
  <a href="/_demo">/_demo</a>
  <span class="meta">design system playground</span>
</header>

<main class="demo-main">
  {@render children()}
</main>

<style>
  .demo-bar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: baseline;
    gap: 1rem;
    padding: 0.75rem 2rem;
    background: var(--paper-bg);
    border-bottom: 1px solid var(--ink-bleed);
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }
  .demo-bar a {
    color: var(--ink);
    font-weight: 600;
  }
  .meta {
    color: var(--ink-shade);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
  .demo-main {
    padding: 3rem 2rem;
    max-width: 72rem;
    margin: 0 auto;
  }
</style>
