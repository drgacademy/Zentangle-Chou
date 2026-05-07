<script lang="ts">
  import SceneEightBreaths from '$lib/components/home/SceneEightBreaths.svelte';
  import RevealOnScroll from '$lib/components/primitives/RevealOnScroll.svelte';
  import { t, type Lang } from '$lib/i18n';

  type Props = { data: { lang: Lang; dict: Record<string, unknown> } };
  let { data }: Props = $props();
  const dict = $derived(data.dict);
  const lang = $derived(data.lang);
</script>

<svelte:head>
  <title>{t(dict, 'nav.process')} — {t(dict, 'site.title')}</title>
</svelte:head>

<main class="process">
  <RevealOnScroll>
    <header class="page-header">
      <h1 class="title">{t(dict, 'eightBreaths.title')}</h1>
      <p class="intro">{t(dict, 'eightBreaths.subtitle')}</p>
    </header>
  </RevealOnScroll>

  <SceneEightBreaths {dict} {lang} />

  <RevealOnScroll>
    <footer class="closing">
      <blockquote>
        <p>{lang === 'zh' ? '一筆一畫，找回安靜。' : 'One stroke, one breath. Stillness returned.'}</p>
      </blockquote>
    </footer>
  </RevealOnScroll>
</main>

<style>
  .process {
    color: var(--ink);
  }
  .page-header {
    text-align: center;
    padding: 4rem 1.5rem 2rem;
    max-width: 60rem;
    margin: 0 auto;
  }
  .title {
    font-family: var(--font-masthead);
    font-size: var(--fs-pull);
    font-weight: 600;
    margin: 0 0 0.6rem;
  }
  .intro {
    font-family: var(--font-display-script);
    color: var(--ink-warm);
    font-size: 1.5rem;
    margin: 0;
  }
  .closing {
    text-align: center;
    padding: 4rem 1.5rem 6rem;
  }
  .closing blockquote {
    margin: 0;
    font-family: var(--font-display-script);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    color: var(--ink-warm);
  }
</style>
