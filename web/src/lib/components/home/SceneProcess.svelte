<script lang="ts">
  import TangleCanvas from '$lib/components/tangle/TangleCanvas.svelte';
  import BreathingScale from '$lib/components/primitives/BreathingScale.svelte';
  import MarginalNote from '$lib/components/primitives/MarginalNote.svelte';
  import { t } from '$lib/i18n';

  type Props = { dict: Record<string, unknown> };
  let { dict }: Props = $props();

  const steps = [
    { key: 'step1', pattern: 'crescent-moon' as const },
    { key: 'step2', pattern: 'tipple' as const },
    { key: 'step3', pattern: 'florz' as const }
  ];
</script>

<section class="process" aria-labelledby="process-title">
  <header class="header">
    <h2 id="process-title" class="text-h2 font-masthead">{t(dict, 'process.title')}</h2>
  </header>

  <BreathingScale amplitude={0.008}>
    <div class="row">
      {#each steps as step, i (step.key)}
        <div class="card">
          <div class="thumb">
            <TangleCanvas
              pattern={step.pattern}
              seed={'process-' + step.key}
              mode="static"
              withScaffold={false}
              density={0.6}
            />
          </div>
          <p class="step-label">{t(dict, 'process.' + step.key)}</p>
          <p class="step-desc">{t(dict, 'process.' + step.key + 'Desc')}</p>
        </div>
        {#if i < steps.length - 1}
          <div class="arrow" aria-hidden="true">
            <svg viewBox="0 0 60 16" width="60" height="16">
              <path d="M2 8 Q15 2 30 8 Q45 14 56 8" fill="none" stroke="var(--ink-pencil)" stroke-width="1" stroke-linecap="round" />
              <path d="M50 4 L56 8 L50 12" fill="none" stroke="var(--ink-pencil)" stroke-width="1" stroke-linecap="round" />
            </svg>
          </div>
        {/if}
      {/each}
    </div>
  </BreathingScale>

  <div class="note-anchor">
    <MarginalNote side="right" rotate={-1.5}>三步驟・也是一段呼吸</MarginalNote>
  </div>
</section>

<style>
  .process {
    padding: 8rem 6vw;
    text-align: center;
    position: relative;
  }
  .header { margin-bottom: 5rem; }
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(1rem, 3vw, 3rem);
    max-width: 80rem;
    margin: 0 auto;
  }
  .card {
    flex: 1 1 0;
    max-width: 16rem;
    text-align: left;
  }
  .thumb {
    aspect-ratio: 1;
    background: var(--paper-rice);
    padding: 1.25rem;
    border: 1px solid var(--ink-bleed);
    margin-bottom: 1.25rem;
  }
  .step-label {
    font-family: var(--font-masthead);
    font-size: var(--fs-h3);
    margin: 0 0 0.5rem;
    color: var(--ink);
  }
  .step-desc {
    color: var(--ink-shade);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .arrow {
    color: var(--ink-pencil);
    flex: 0 0 auto;
    align-self: center;
  }
  .note-anchor {
    position: relative;
    margin-top: 4rem;
    height: 4rem;
  }
  @media (max-width: 767px) {
    .row { flex-direction: column; }
    .arrow svg { transform: rotate(90deg); }
  }
</style>
