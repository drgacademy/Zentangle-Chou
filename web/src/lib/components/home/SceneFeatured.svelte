<script lang="ts">
  import Polaroid from '$lib/components/primitives/Polaroid.svelte';
  import ParallaxLayer from '$lib/components/primitives/ParallaxLayer.svelte';
  import { featured } from '$lib/data/featured';
  import { t, type Lang } from '$lib/i18n';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();

  const speeds = [0.2, 0.5, 0.35];
</script>

<section class="featured" aria-labelledby="featured-title">
  <header class="header">
    <p class="kicker">{lang === 'zh' ? '精選' : 'Featured'}</p>
    <h2 id="featured-title" class="text-h2 font-masthead">{t(dict, 'featured.title')}</h2>
  </header>
  <div class="grid">
    {#each featured as work, i (work.seed)}
      <ParallaxLayer speed={speeds[i % speeds.length]}>
        <div class="cell">
          <Polaroid
            src={work.src}
            alt={work.alt}
            caption={lang === 'zh' ? work.captionZh : work.captionEn}
            rotate={work.rotate}
            seed={work.seed}
          />
        </div>
      </ParallaxLayer>
    {/each}
  </div>
</section>

<style>
  .featured {
    padding: 10rem 6vw 14rem;
    overflow: visible;
  }
  .header {
    text-align: center;
    margin-bottom: 6rem;
  }
  .kicker {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--ink-shade);
    margin-bottom: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1.5rem, 5vw, 4rem);
    max-width: 80rem;
    margin: 0 auto;
    align-items: start;
  }
  .cell {
    display: grid;
    place-items: center;
  }
  /* stagger the rows so polaroids don't all sit at one baseline */
  .grid > :nth-child(1) { transform: translateY(2rem); }
  .grid > :nth-child(2) { transform: translateY(-1rem); }
  .grid > :nth-child(3) { transform: translateY(3rem); }
  @media (max-width: 767px) {
    .grid { grid-template-columns: 1fr; }
    .grid > * { transform: none !important; }
  }
</style>
