<script lang="ts">
  import RevealOnScroll from '$lib/components/primitives/RevealOnScroll.svelte';
  import { eightBreaths } from '$lib/data/eightBreaths';
  import { t, type Lang } from '$lib/i18n';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();
</script>

<section class="breaths" aria-labelledby="breaths-title">
  <header class="header">
    <RevealOnScroll>
      <p class="kicker">{t(dict, 'eightBreaths.subtitle')}</p>
      <h2 id="breaths-title" class="title">{t(dict, 'eightBreaths.title')}</h2>
    </RevealOnScroll>
  </header>

  <ol class="steps">
    {#each eightBreaths as step (step.index)}
      <RevealOnScroll yFrom={32}>
        <li class="step">
          <span class="num">{String(step.index).padStart(2, '0')}</span>
          <div class="text">
            <h3 class="step-title">{t(dict, step.i18nKey + '.title')}</h3>
            <p class="step-desc">{t(dict, step.i18nKey + '.desc')}</p>
          </div>
          <div class="layer-cue layer-{step.layerHint}" aria-hidden="true"></div>
        </li>
      </RevealOnScroll>
    {/each}
  </ol>
</section>

<style>
  .breaths {
    padding: clamp(4rem, 10vw, 8rem) 1.5rem;
    background: var(--paper-rice);
    color: var(--ink);
  }
  .header {
    max-width: 60rem;
    margin: 0 auto 4rem;
    text-align: center;
  }
  .kicker {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--ink-shade);
    margin: 0 0 0.75rem;
  }
  .title {
    font-family: var(--font-masthead);
    font-size: var(--fs-pull);
    font-weight: 600;
    margin: 0;
  }
  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
    max-width: 56rem;
    margin: 0 auto;
    display: grid;
    gap: 2.5rem;
  }
  .step {
    display: grid;
    grid-template-columns: 4rem 1fr 4rem;
    gap: 1.5rem;
    align-items: center;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--ink-bleed);
  }
  .num {
    font-family: var(--font-mono);
    font-size: 1.4rem;
    color: var(--ink-pencil);
    letter-spacing: 0.02em;
  }
  .step-title {
    font-family: var(--font-masthead);
    font-size: var(--fs-h3);
    font-weight: 500;
    margin: 0 0 0.4rem;
  }
  .step-desc {
    margin: 0;
    color: var(--ink-shade);
    line-height: 1.65;
  }
  .layer-cue {
    width: 3rem;
    height: 3rem;
    border-radius: 999px;
    background: var(--ink-pencil);
    opacity: 0.6;
  }
  .layer-cue.layer-gratitude {
    background: var(--ink-red-stamp);
  }
  .layer-cue.layer-dot {
    background: var(--ink-pencil);
    opacity: 1;
  }
  .layer-cue.layer-pencil-border {
    background: transparent;
    border: 2px solid var(--ink-pencil);
  }
  .layer-cue.layer-pencil-string {
    background: transparent;
    border: 2px dashed var(--ink-pencil);
  }
  .layer-cue.layer-ink {
    background: var(--ink);
  }
  .layer-cue.layer-shade {
    background: var(--ink-shade);
  }
  .layer-cue.layer-initial {
    background: var(--ink-red-stamp);
    opacity: 0.65;
  }
  .layer-cue.layer-appreciate {
    background: linear-gradient(135deg, var(--ink-red-stamp), var(--gold-500));
  }
  @media (max-width: 600px) {
    .step {
      grid-template-columns: 3rem 1fr 2.4rem;
      gap: 1rem;
    }
    .layer-cue {
      width: 2.4rem;
      height: 2.4rem;
    }
  }
</style>
