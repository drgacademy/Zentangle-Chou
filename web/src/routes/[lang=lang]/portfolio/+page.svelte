<script lang="ts">
  import RevealOnScroll from '$lib/components/primitives/RevealOnScroll.svelte';
  import TangleCanvas from '$lib/components/tangle/TangleCanvas.svelte';
  import { t, type Lang } from '$lib/i18n';
  import { patternCards } from '$lib/data/patternIndex';

  type Props = { data: { lang: Lang; dict: Record<string, unknown> } };
  let { data }: Props = $props();
  const dict = $derived(data.dict);
  const lang = $derived(data.lang);

  // Procedural placeholders until real photographs arrive.
  // Captions are pulled from the existing featured.ts list, with extras.
  const works = [
    { titleZh: '初春', titleEn: 'Early Spring', slug: 'florz', seed: 'work-spring' },
    { titleZh: '夜雨', titleEn: 'Night Rain', slug: 'crescent-moon', seed: 'work-rain' },
    { titleZh: '南風', titleEn: 'South Wind', slug: 'paradox', seed: 'work-wind' },
    { titleZh: '清晨', titleEn: 'Morning', slug: 'tipple', seed: 'work-morning' },
    { titleZh: '深谷', titleEn: 'Deep Valley', slug: 'hollibaugh', seed: 'work-valley' },
    { titleZh: '靜湖', titleEn: 'Still Lake', slug: 'printemps', seed: 'work-lake' },
    { titleZh: '禪行', titleEn: 'Walking Zen', slug: 'nzeppel', seed: 'work-walking' },
    { titleZh: '一息', titleEn: 'One Breath', slug: 'florz', seed: 'work-breath' }
  ] as const;
</script>

<svelte:head>
  <title>{t(dict, 'nav.portfolio')} — {t(dict, 'site.title')}</title>
</svelte:head>

<main class="portfolio">
  <RevealOnScroll>
    <header class="page-header">
      <h1 class="title">{t(dict, 'nav.portfolio')}</h1>
      <p class="intro">
        {lang === 'zh'
          ? '每一件都是一段時間的呼吸。'
          : 'Each piece is the breath of a stretch of time.'}
      </p>
    </header>
  </RevealOnScroll>

  <div class="grid">
    {#each works as work, i (work.titleEn + i)}
      <RevealOnScroll yFrom={28}>
        <article class="card">
          <div class="art">
            <TangleCanvas
              pattern={work.slug}
              mode="ambient"
              seed={work.seed}
              size={360}
              density={0.85}
              jitter={1.2}
              withScaffold={true}
            />
          </div>
          <div class="caption">
            <h3 class="card-title">
              <span class="zh">{work.titleZh}</span>
              <span class="en">{work.titleEn}</span>
            </h3>
          </div>
        </article>
      </RevealOnScroll>
    {/each}
  </div>
</main>

<style>
  .portfolio {
    padding: 4rem 1.5rem 6rem;
    color: var(--ink);
    max-width: 80rem;
    margin: 0 auto;
  }
  .page-header {
    text-align: center;
    margin-bottom: 4rem;
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
    font-size: 1.4rem;
    margin: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
  }
  .card {
    background: var(--paper-rice);
    border: 1px solid var(--ink-bleed);
    padding: 1.2rem;
    border-radius: 4px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  }
  .art {
    aspect-ratio: 1/1;
    background: var(--paper-tile);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  .caption {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .card-title {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }
  .card-title .zh {
    font-family: var(--font-masthead);
    font-size: 1.15rem;
    font-weight: 500;
  }
  .card-title .en {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-shade);
  }
</style>
