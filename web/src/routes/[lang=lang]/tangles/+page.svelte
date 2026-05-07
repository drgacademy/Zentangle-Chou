<script lang="ts">
  import RevealOnScroll from '$lib/components/primitives/RevealOnScroll.svelte';
  import TangleCanvas from '$lib/components/tangle/TangleCanvas.svelte';
  import { patterns } from '$lib/tangles/patterns';
  import { patternCards } from '$lib/data/patternIndex';
  import { t, type Lang } from '$lib/i18n';

  type Props = { data: { lang: Lang; dict: Record<string, unknown> } };
  let { data }: Props = $props();
  const dict = $derived(data.dict);
  const lang = $derived(data.lang);
</script>

<svelte:head>
  <title>{t(dict, 'nav.tangles')} — {t(dict, 'site.title')}</title>
</svelte:head>

<main class="tangles">
  <RevealOnScroll>
    <header class="page-header">
      <h1 class="title">{t(dict, 'patternIndex.title')}</h1>
      <p class="intro">{t(dict, 'patternIndex.intro')}</p>
      <p class="hint">
        {lang === 'zh' ? '點擊圖樣即可重新繪製。' : 'Click any tangle to re-draw it.'}
      </p>
    </header>
  </RevealOnScroll>

  <div class="grid">
    {#each patternCards as card (card.slug)}
      {@const p = patterns[card.slug]}
      <RevealOnScroll yFrom={28} duration={0.7}>
        <section class="card" id={card.slug} aria-labelledby={card.slug + '-title'}>
          <div class="canvas-wrap">
            <TangleCanvas
              pattern={card.slug}
              mode="interactive"
              seed={'tangle-' + card.slug}
              size={400}
              density={1}
              jitter={1.4}
              withScaffold={true}
            />
          </div>
          <header class="card-head">
            <h2 id={card.slug + '-title'}>
              <span class="zh">{card.nameZh}</span>
              <span class="en">{card.nameEn}</span>
            </h2>
            <p class="origin">{lang === 'zh' ? '由' : 'by'} {card.origin}</p>
          </header>
          {#if p}
            <ol class="steps">
              {#each p.steps as step (step.labelEn)}
                <li>{lang === 'zh' ? step.labelZh : step.labelEn}</li>
              {/each}
            </ol>
          {/if}
        </section>
      </RevealOnScroll>
    {/each}
  </div>
</main>

<style>
  .tangles {
    padding: 4rem 1.5rem 6rem;
    max-width: 80rem;
    margin: 0 auto;
    color: var(--ink);
  }
  .page-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  .title {
    font-family: var(--font-masthead);
    font-size: var(--fs-pull);
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  .intro {
    font-family: var(--font-display-script);
    color: var(--ink-warm);
    font-size: 1.4rem;
    margin: 0 0 0.75rem;
  }
  .hint {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    color: var(--ink-shade);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  .card {
    background: var(--paper-rice);
    border: 1px solid var(--ink-bleed);
    padding: 1.4rem;
    border-radius: 4px;
    scroll-margin-top: 6rem;
  }
  .canvas-wrap {
    aspect-ratio: 1/1;
    background: var(--paper-tile);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  .card-head h2 {
    margin: 0 0 0.3rem;
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }
  .card-head .zh {
    font-family: var(--font-masthead);
    font-size: 1.4rem;
    font-weight: 500;
  }
  .card-head .en {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-shade);
  }
  .origin {
    font-size: var(--fs-caption);
    color: var(--ink-shade);
    margin: 0 0 0.75rem;
  }
  .steps {
    margin: 0.5rem 0 0;
    padding-left: 1.2rem;
    color: var(--ink-shade);
    font-size: 0.95rem;
    line-height: 1.7;
  }
  .steps li {
    margin-bottom: 0.2rem;
  }
</style>
