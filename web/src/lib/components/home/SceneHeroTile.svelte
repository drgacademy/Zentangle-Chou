<script lang="ts">
  import TangleTile from '$lib/components/tangle/TangleTile.svelte';
  import {
    DEFAULT_REGION_CLIPS,
    DEFAULT_REGION_RECTS,
    DEFAULT_STRING_CURVES,
    type PhaseDef,
    type RegionDef
  } from '$lib/tangles/tileCompose';
  import { hollibaugh } from '$lib/tangles/patterns/hollibaugh';
  import { paradox } from '$lib/tangles/patterns/paradox';
  import { printemps } from '$lib/tangles/patterns/printemps';
  import { nzeppel } from '$lib/tangles/patterns/nzeppel';
  import { t, type Lang } from '$lib/i18n';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();

  const regions: RegionDef[] = $derived([
    {
      id: 'hollibaugh',
      pattern: hollibaugh,
      rect: DEFAULT_REGION_RECTS.hollibaugh,
      clipD: DEFAULT_REGION_CLIPS.hollibaugh,
      stepLabel: { zh: t(dict, 'tile.phases.hollibaugh'), en: 'Hollibaugh' }
    },
    {
      id: 'paradox',
      pattern: paradox,
      rect: DEFAULT_REGION_RECTS.paradox,
      clipD: DEFAULT_REGION_CLIPS.paradox,
      stepLabel: { zh: t(dict, 'tile.phases.paradox'), en: 'Paradox' }
    },
    {
      id: 'printemps',
      pattern: printemps,
      rect: DEFAULT_REGION_RECTS.printemps,
      clipD: DEFAULT_REGION_CLIPS.printemps,
      stepLabel: { zh: t(dict, 'tile.phases.printemps'), en: 'Printemps × Tipple' }
    },
    {
      id: 'nzeppel',
      pattern: nzeppel,
      rect: DEFAULT_REGION_RECTS.nzeppel,
      clipD: DEFAULT_REGION_CLIPS.nzeppel,
      stepLabel: { zh: t(dict, 'tile.phases.nzeppel'), en: "'Nzeppel" }
    }
  ]);

  let phaseLabelZh = $state('');
  let phaseLabelEn = $state('');
  let progress = $state(0);
  let speed = $state(1);
  let seed = $state('hero-tile-1');
  let tileRef = $state<{ restart: () => void; setSpeed: (n: number) => void } | null>(null);

  function onPhase(p: PhaseDef) {
    phaseLabelZh = p.labelZh;
    phaseLabelEn = p.labelEn;
  }

  function cycleSpeed() {
    speed = speed === 1 ? 2 : speed === 2 ? 4 : 1;
  }

  function restart() {
    seed = 'hero-tile-' + Math.floor(Math.random() * 1e6).toString(36);
    tileRef?.restart();
  }
</script>

<section class="hero-tile" id="hero" aria-labelledby="hero-mast">
  <div class="hero-content">
    <h1 id="hero-mast" class="wordmark">{t(dict, 'hero.title')}</h1>
    <p class="tagline">{t(dict, 'hero.subtitle')}</p>

    <div class="tile-wrap">
      <TangleTile
        bind:this={tileRef}
        {regions}
        stringCurves={DEFAULT_STRING_CURVES}
        {seed}
        {speed}
        ariaLabel={t(dict, 'tile.ariaLabel')}
        onPhaseEnter={onPhase}
        onProgress={(p) => (progress = p)}
      />
      <div class="chip" aria-live="polite">
        {#if lang === 'zh'}
          <span class="zh">{phaseLabelZh}</span>
          <span class="en">{phaseLabelEn}</span>
        {:else}
          <span class="zh">{phaseLabelEn}</span>
          <span class="en">{phaseLabelZh}</span>
        {/if}
      </div>
    </div>

    <div class="bar"><span class="fill" style="transform: scaleX({progress})"></span></div>

    <div class="controls">
      <button type="button" class="btn primary" onclick={restart} aria-label={t(dict, 'tile.controls.restart')}>
        ↻ {t(dict, 'tile.controls.restart')}
      </button>
      <button
        type="button"
        class="btn ghost"
        onclick={cycleSpeed}
        aria-label={t(dict, 'tile.controls.speed') + ' ' + speed + 'x'}
      >
        {t(dict, 'tile.controls.speed')}: {speed}×
      </button>
    </div>

    <div class="scroll-cue" aria-hidden="true">
      <svg viewBox="0 0 12 60" width="12" height="60">
        <path d="M6 2 Q4 30 6 58" fill="none" stroke="rgba(240,228,200,0.45)" stroke-width="1" stroke-linecap="round" />
        <path d="M2 50 L6 58 L10 50" fill="none" stroke="rgba(240,228,200,0.45)" stroke-width="1" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</section>

<style>
  .hero-tile {
    position: relative;
    min-height: 100vh;
    background: var(--bg-spotlight);
    color: #f0e4c8;
    padding: 6rem 1.5rem 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .hero-content {
    position: relative;
    width: 100%;
    max-width: 760px;
    text-align: center;
  }
  .wordmark {
    font-family: var(--font-masthead);
    font-weight: 600;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    letter-spacing: 0.04em;
    margin: 0 0 0.4rem;
    color: #f0e4c8;
  }
  .tagline {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: rgba(240, 228, 200, 0.6);
    margin: 0 0 2.2rem;
  }
  .tile-wrap {
    position: relative;
    width: min(85vmin, 720px);
    aspect-ratio: 1/1;
    margin: 0 auto;
  }
  .chip {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(20, 15, 10, 0.86);
    border-radius: 999px;
    padding: 0.55rem 1.2rem;
    text-align: center;
    backdrop-filter: blur(8px);
    min-width: 14rem;
  }
  .chip .zh {
    display: block;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    color: #f0e4c8;
  }
  .chip .en {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(240, 228, 200, 0.6);
    margin-top: 2px;
  }
  .bar {
    margin: 1.4rem auto 0;
    width: min(85vmin, 720px);
    height: 3px;
    background: rgba(240, 228, 200, 0.12);
    border-radius: 2px;
    overflow: hidden;
  }
  .fill {
    display: block;
    height: 100%;
    width: 100%;
    transform-origin: left center;
    background: linear-gradient(90deg, #d4a574, #f0e4c8);
    transition: transform 0.1s linear;
  }
  .controls {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  .btn {
    padding: 0.7rem 1.4rem;
    border-radius: 999px;
    font-size: 0.9rem;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 1.5px solid transparent;
    font-family: inherit;
  }
  .btn:hover {
    transform: translateY(-2px);
  }
  .btn.primary {
    background: #f0e4c8;
    color: #1a1410;
    font-weight: 500;
  }
  .btn.ghost {
    background: transparent;
    color: #f0e4c8;
    border-color: rgba(240, 228, 200, 0.55);
  }
  .btn.ghost:hover {
    background: rgba(240, 228, 200, 0.08);
  }
  .scroll-cue {
    position: absolute;
    bottom: -3rem;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    animation: fadeIn 1.6s ease 4s forwards;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
