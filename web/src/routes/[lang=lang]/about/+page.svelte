<script lang="ts">
  import RevealOnScroll from '$lib/components/primitives/RevealOnScroll.svelte';
  import TangleSection from '$lib/components/primitives/TangleSection.svelte';
  import { wobblyCircle } from '$lib/tangles/geometry';
  import { makeRng } from '$lib/tangles/rng';
  import { t, type Lang } from '$lib/i18n';

  type Props = { data: { lang: Lang; dict: Record<string, unknown> } };
  let { data }: Props = $props();
  const dict = $derived(data.dict);
  const lang = $derived(data.lang);

  const ensoD = (() => {
    const rng = makeRng('about-enso');
    return wobblyCircle(80, 80, 60, rng, 1.6, 80).replace(/\s*Z\s*$/, '');
  })();

  const tools = [
    {
      name: { zh: '紙', en: 'Paper' },
      desc: {
        zh: '3.5 × 3.5 英吋，奶油色純棉。沒有純白。',
        en: '3.5 × 3.5 in. cream cotton vellum. Never pure white.'
      }
    },
    {
      name: { zh: '墨筆', en: 'Pen' },
      desc: {
        zh: 'Sakura Pigma Micron 01／05，純黑、單線寬。',
        en: 'Sakura Pigma Micron 01/05. Pure black, monoline.'
      }
    },
    {
      name: { zh: '鉛筆', en: 'Pencil' },
      desc: {
        zh: '2B 或 4B，畫邊框、字串、最後的陰影。',
        en: '2B or 4B for borders, strings, and the final shading.'
      }
    },
    {
      name: { zh: '抹擦筆', en: 'Tortillon' },
      desc: {
        zh: '紙捲擦筆，把鉛筆暈開成柔和漸層。',
        en: 'Paper stump that smudges graphite into soft gradients.'
      }
    }
  ];

  const influences = [
    {
      quoteZh: '禪繞畫不是畫技，是一種專注的儀式。',
      quoteEn: 'Zentangle is not a drawing skill — it is a ritual of presence.',
      attr: 'Maria Thomas & Rick Roberts'
    },
    {
      quoteZh: '沒有錯誤，只有契機。',
      quoteEn: 'There are no mistakes, only opportunities.',
      attr: 'Zentangle Method'
    },
    {
      quoteZh: '一筆一畫，一切都成為可能。',
      quoteEn: 'Anything is possible, one stroke at a time.',
      attr: 'Zentangle Method'
    }
  ];
</script>

<svelte:head>
  <title>{t(dict, 'nav.about')} — {t(dict, 'site.title')}</title>
</svelte:head>

<main class="about">
  <section class="bio">
    <RevealOnScroll>
      <div class="bio-grid">
        <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden="true" class="enso">
          <path d={ensoD} fill="none" stroke="var(--ink-red-stamp)" stroke-width="3" stroke-linecap="round" />
        </svg>
        <div>
          <p class="kicker">{lang === 'zh' ? '關於' : 'About'}</p>
          <p class="lede">
            {lang === 'zh'
              ? '十年前她拿起筆，從此找到一個安靜的儀式。'
              : 'An artist who picked up a pen ten years ago and found a quiet ritual.'}
          </p>
          <p class="body">
            {lang === 'zh'
              ? 'Zentangle Chou 是一個圍繞「一筆，一息」的個人作品集。每一張畫，都是在沒有計畫之下慢慢長出來的。我們相信沒有橡皮擦，因為人生中也沒有橡皮擦。'
              : 'Zentangle Chou is a portfolio orbiting the phrase "one stroke, one breath." Each piece grows slowly without a plan. There is no eraser — because in life there is no eraser either.'}
          </p>
        </div>
      </div>
    </RevealOnScroll>
  </section>

  <section class="tools-section">
    <RevealOnScroll>
      <h2 class="section-title">{lang === 'zh' ? '工具' : 'Tools'}</h2>
    </RevealOnScroll>
    <div class="tools-grid">
      {#each tools as tool, i (tool.name.en)}
        <RevealOnScroll yFrom={32} duration={0.6}>
          <TangleSection seed={'tool-' + i}>
            <h3 class="tool-name">
              <span class="zh">{tool.name.zh}</span>
              <span class="en">{tool.name.en}</span>
            </h3>
            <p class="tool-desc">{lang === 'zh' ? tool.desc.zh : tool.desc.en}</p>
          </TangleSection>
        </RevealOnScroll>
      {/each}
    </div>
  </section>

  <section class="influences">
    <RevealOnScroll>
      <h2 class="section-title">{lang === 'zh' ? '影響' : 'Influences'}</h2>
    </RevealOnScroll>
    <div class="quotes">
      {#each influences as q (q.attr)}
        <RevealOnScroll yFrom={20}>
          <blockquote class="quote">
            <p class="quote-text">{lang === 'zh' ? q.quoteZh : q.quoteEn}</p>
            <footer class="attribution">— {q.attr}</footer>
          </blockquote>
        </RevealOnScroll>
      {/each}
    </div>
  </section>
</main>

<style>
  .about {
    padding: 4rem 1.5rem 6rem;
    color: var(--ink);
    max-width: 80rem;
    margin: 0 auto;
  }
  .bio {
    margin-bottom: clamp(4rem, 8vw, 6rem);
  }
  .bio-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2.5rem;
    align-items: center;
    max-width: 56rem;
    margin: 0 auto;
  }
  .enso {
    flex-shrink: 0;
  }
  .kicker {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--ink-shade);
    margin: 0 0 0.5rem;
  }
  .lede {
    font-family: var(--font-masthead);
    font-size: var(--fs-h2);
    line-height: 1.25;
    margin: 0 0 1.2rem;
    font-weight: 500;
  }
  .body {
    color: var(--ink-shade);
    line-height: 1.75;
    margin: 0;
  }
  .section-title {
    font-family: var(--font-masthead);
    font-size: var(--fs-h2);
    font-weight: 500;
    text-align: center;
    margin: 0 0 2.5rem;
  }
  .tools-section {
    margin-bottom: clamp(4rem, 8vw, 6rem);
  }
  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    max-width: 64rem;
    margin: 0 auto;
  }
  .tool-name {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin: 0 0 0.6rem;
  }
  .tool-name .zh {
    font-family: var(--font-masthead);
    font-size: 1.4rem;
    font-weight: 500;
  }
  .tool-name .en {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-shade);
  }
  .tool-desc {
    color: var(--ink-shade);
    margin: 0;
    line-height: 1.65;
  }
  .quotes {
    display: grid;
    gap: 2.5rem;
    max-width: 48rem;
    margin: 0 auto;
  }
  .quote {
    margin: 0;
    text-align: center;
    border-top: 1px solid var(--ink-bleed);
    padding-top: 2rem;
  }
  .quote:first-child {
    border-top: 0;
  }
  .quote-text {
    font-family: var(--font-display-script);
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--ink-warm);
    margin: 0 0 1rem;
    line-height: 1.4;
  }
  .attribution {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-shade);
  }
  @media (max-width: 600px) {
    .bio-grid {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .enso {
      margin: 0 auto;
    }
  }
</style>
