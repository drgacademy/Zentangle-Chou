<script lang="ts">
  import ParallaxLayer from '$lib/components/primitives/ParallaxLayer.svelte';
  import PaperTexture from '$lib/components/primitives/PaperTexture.svelte';
  import { t, type Lang } from '$lib/i18n';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();
</script>

<section class="manifesto" aria-labelledby="manifesto-title">
  <PaperTexture tone="cream" fixed={false} intensity={0.85} />
  <div class="grid">
    <ParallaxLayer speed={0.4}>
      <blockquote class="quote">
        <p class="primary" id="manifesto-title">
          {lang === 'zh' ? t(dict, 'manifesto.quoteZh') : t(dict, 'manifesto.quoteEn')}
        </p>
        <p class="secondary">
          {lang === 'zh' ? t(dict, 'manifesto.quoteEn') : t(dict, 'manifesto.quoteZh')}
        </p>
      </blockquote>
    </ParallaxLayer>
  </div>
</section>

<style>
  .manifesto {
    position: relative;
    min-height: 100vh;
    padding: 8rem 6vw;
    display: grid;
    place-items: center;
    overflow: hidden;
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 16rem);
    gap: clamp(2rem, 6vw, 6rem);
    align-items: start;
    max-width: 80rem;
    width: 100%;
  }
  .quote {
    margin: 0;
  }
  .primary {
    font-family: var(--font-masthead);
    font-size: var(--fs-pull);
    line-height: 1.18;
    font-weight: 500;
    margin: 0 0 1rem;
    color: var(--ink);
  }
  .secondary {
    font-family: var(--font-display-script);
    font-size: clamp(1.4rem, 2.5vw, 1.9rem);
    color: var(--ink-warm);
    margin: 0;
  }
  @media (max-width: 767px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
