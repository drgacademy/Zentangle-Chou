<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import PaperTexture from '$lib/components/primitives/PaperTexture.svelte';
  import BreathingDriver from '$lib/components/primitives/BreathingDriver.svelte';
  import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
  import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
  import PageTransition from '$lib/components/layout/PageTransition.svelte';
  import { startLenis } from '$lib/animations/lenisInit';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import type { Lang } from '$lib/i18n';

  type Props = {
    data: { lang: Lang; dict: Record<string, unknown> };
    children: Snippet;
  };
  let { data, children }: Props = $props();

  $effect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = data.lang === 'zh' ? 'zh-Hant' : 'en';
    }
  });

  onMount(() => {
    let unsub = reducedMotion.subscribe((reduced) => {
      if (!reduced) startLenis();
    });
    return () => unsub();
  });
</script>

<svelte:head>
  <link rel="alternate" hreflang="zh-Hant" href="/zh" />
  <link rel="alternate" hreflang="en" href="/en" />
  <link rel="alternate" hreflang="x-default" href="/zh" />
</svelte:head>

<PaperTexture tone="rice" />
<BreathingDriver />
<PageTransition />

<SiteHeader lang={data.lang} dict={data.dict} />

<div class="page">
  {@render children()}
</div>

<SiteFooter lang={data.lang} dict={data.dict} />

<style>
  .page {
    padding-top: 5rem;
  }
</style>
