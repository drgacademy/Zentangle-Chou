<script lang="ts">
  import RevealOnScroll from '$lib/components/primitives/RevealOnScroll.svelte';
  import TangleCanvas from '$lib/components/tangle/TangleCanvas.svelte';
  import { patternCards } from '$lib/data/patternIndex';
  import { t, type Lang } from '$lib/i18n';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();
</script>

<section class="patterns" aria-labelledby="patterns-title">
  <header class="header">
    <RevealOnScroll>
      <h2 id="patterns-title" class="title">{t(dict, 'patternIndex.title')}</h2>
      <p class="intro">{t(dict, 'patternIndex.intro')}</p>
    </RevealOnScroll>
  </header>

  <div class="grid">
    {#each patternCards as p (p.slug)}
      <RevealOnScroll yFrom={20} duration={0.6}>
        <a class="card" href={'/' + lang + '/tangles#' + p.slug} aria-label={p.nameEn + ' / ' + p.nameZh}>
          <div class="canvas-wrap">
            <TangleCanvas
              pattern={p.slug}
              mode="ambient"
              seed={'idx-' + p.slug}
              size={200}
              density={0.7}
              jitter={1.0}
              withScaffold={false}
            />
          </div>
          <div class="caption">
            <span class="zh">{p.nameZh}</span>
            <span class="en">{p.nameEn}</span>
          </div>
        </a>
      </RevealOnScroll>
    {/each}
  </div>
</section>

<style>
  .patterns {
    padding: clamp(4rem, 10vw, 8rem) 1.5rem;
    background: var(--paper-bg);
    color: var(--ink);
  }
  .header {
    max-width: 60rem;
    margin: 0 auto 3rem;
    text-align: center;
  }
  .title {
    font-family: var(--font-masthead);
    font-size: var(--fs-pull);
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  .intro {
    color: var(--ink-shade);
    font-family: var(--font-display-script);
    font-size: 1.4rem;
    margin: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 2rem;
    max-width: 80rem;
    margin: 0 auto;
  }
  .card {
    display: block;
    background: var(--paper-rice);
    padding: 1.2rem;
    border: 1px solid var(--ink-bleed);
    border-radius: 4px;
    color: var(--ink);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
    text-decoration: none;
  }
  .canvas-wrap {
    aspect-ratio: 1/1;
    background: var(--paper-tile);
    margin-bottom: 1rem;
    border-radius: 2px;
    overflow: hidden;
  }
  .caption {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .caption .zh {
    font-family: var(--font-masthead);
    font-size: 1.1rem;
    font-weight: 500;
  }
  .caption .en {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-shade);
  }
</style>
