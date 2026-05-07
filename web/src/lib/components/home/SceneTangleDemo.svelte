<script lang="ts">
  import ScrollScene from '$lib/components/primitives/ScrollScene.svelte';
  import HandDrawnText from '$lib/components/primitives/HandDrawnText.svelte';
  import MarginalNote from '$lib/components/primitives/MarginalNote.svelte';
  import TangleDemoInner from './TangleDemoInner.svelte';
  import { t, type Lang } from '$lib/i18n';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();
</script>

<section class="tangle-section" aria-labelledby="demo-title">
  <ScrollScene pin scrub height="220vh">
    <div class="stage">
      <div class="left">
        <p class="kicker">{lang === 'zh' ? '即時' : 'Live'}</p>
        <h2 id="demo-title" class="text-h2 font-masthead mb-6">{t(dict, 'demo.title')}</h2>
        <p class="intro">{t(dict, 'demo.intro')}</p>
      </div>

      <div class="canvas-cell">
        <TangleDemoInner />
      </div>

      <div class="right">
        <ol class="steps">
          <li><MarginalNote side="right" rotate={-1.5}>{t(dict, 'demo.step1')}</MarginalNote></li>
          <li><MarginalNote side="right" rotate={1}>{t(dict, 'demo.step2')}</MarginalNote></li>
          <li><MarginalNote side="right" rotate={-0.5}>{t(dict, 'demo.step3')}</MarginalNote></li>
          <li><MarginalNote side="right" rotate={2}>{t(dict, 'demo.step4')}</MarginalNote></li>
        </ol>
      </div>
    </div>
  </ScrollScene>
</section>

<style>
  .tangle-section {
    background: var(--paper-rice);
  }
  .stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) min(70vmin, 36rem) minmax(0, 1fr);
    gap: clamp(1.5rem, 4vw, 4rem);
    align-items: center;
    width: 100%;
    height: 100vh;
    padding: 4rem 6vw;
    box-sizing: border-box;
  }
  .left {
    text-align: right;
  }
  .right {
    position: relative;
    height: 100%;
  }
  .kicker {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--ink-shade);
    margin-bottom: 1rem;
  }
  .intro {
    font-size: var(--fs-lede);
    line-height: 1.7;
    color: var(--ink-warm);
    white-space: pre-line;
  }
  .canvas-cell {
    aspect-ratio: 1;
    width: 100%;
    max-width: min(70vmin, 36rem);
    margin: 0 auto;
  }
  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 4rem;
    position: relative;
  }
  @media (max-width: 1023px) {
    .stage {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      height: auto;
      min-height: 100vh;
      padding: 4rem 6vw 6rem;
    }
    .left { text-align: center; }
    .steps { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  }
</style>
