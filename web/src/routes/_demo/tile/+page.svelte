<script lang="ts">
  import TangleTile from '$lib/components/tangle/TangleTile.svelte';
  import {
    DEFAULT_REGION_CLIPS,
    DEFAULT_REGION_RECTS,
    DEFAULT_STRING_CURVES,
    type RegionDef,
    type PhaseDef
  } from '$lib/tangles/tileCompose';
  import { hollibaugh } from '$lib/tangles/patterns/hollibaugh';
  import { paradox } from '$lib/tangles/patterns/paradox';
  import { printemps } from '$lib/tangles/patterns/printemps';
  import { nzeppel } from '$lib/tangles/patterns/nzeppel';

  const regions: RegionDef[] = [
    {
      id: 'hollibaugh',
      pattern: hollibaugh,
      rect: DEFAULT_REGION_RECTS.hollibaugh,
      clipD: DEFAULT_REGION_CLIPS.hollibaugh,
      stepLabel: { zh: '立體編帶 Hollibaugh', en: 'Hollibaugh' }
    },
    {
      id: 'paradox',
      pattern: paradox,
      rect: DEFAULT_REGION_RECTS.paradox,
      clipD: DEFAULT_REGION_CLIPS.paradox,
      stepLabel: { zh: '矛盾螺旋 Paradox', en: 'Paradox' }
    },
    {
      id: 'printemps',
      pattern: printemps,
      rect: DEFAULT_REGION_RECTS.printemps,
      clipD: DEFAULT_REGION_CLIPS.printemps,
      stepLabel: { zh: '春之螺・點點 Printemps × Tipple', en: 'Printemps × Tipple' }
    },
    {
      id: 'nzeppel',
      pattern: nzeppel,
      rect: DEFAULT_REGION_RECTS.nzeppel,
      clipD: DEFAULT_REGION_CLIPS.nzeppel,
      stepLabel: { zh: "鏈環 'Nzeppel", en: "'Nzeppel" }
    }
  ];

  let phaseLabel = $state<string>('準備開始');
  let phaseLabelEn = $state<string>('Ready');
  let progress = $state(0);
  let speed = $state(1);
  let tileRef = $state<{ restart: () => void; setSpeed: (n: number) => void } | null>(null);
  let seed = $state('demo-tile-1');

  function cycleSpeed() {
    speed = speed === 1 ? 2 : speed === 2 ? 4 : 1;
  }
</script>

<svelte:head>
  <title>TangleTile demo</title>
</svelte:head>

<div class="page">
  <h1 class="h-pull">TangleTile</h1>
  <p class="meta">
    Full 4-region Zentangle tile composed from Hollibaugh × Paradox × Printemps × 'Nzeppel.
    Watch the canonical 5-layer order play out.
  </p>

  <div class="stage">
    <div class="tile-wrap">
      <TangleTile
        bind:this={tileRef}
        {regions}
        stringCurves={DEFAULT_STRING_CURVES}
        {seed}
        {speed}
        ariaLabel="A Zentangle tile drawing in five canonical layers"
        onPhaseEnter={(p: PhaseDef) => {
          phaseLabel = p.labelZh;
          phaseLabelEn = p.labelEn;
        }}
        onProgress={(p) => (progress = p)}
      />
      <div class="chip" aria-live="polite">
        <span class="zh">{phaseLabel}</span>
        <span class="en">{phaseLabelEn}</span>
      </div>
    </div>

    <div class="bar"><span class="fill" style="transform: scaleX({progress})"></span></div>

    <div class="controls">
      <button
        type="button"
        class="btn primary"
        onclick={() => {
          seed = 'demo-tile-' + Math.floor(Math.random() * 1e6).toString(36);
          tileRef?.restart();
        }}>↻ Restart</button
      >
      <button type="button" class="btn ghost" onclick={cycleSpeed}>Speed: {speed}×</button>
    </div>
  </div>
</div>

<style>
  .page {
    padding: 2rem 1.5rem 4rem;
    color: #f0e4c8;
    background: var(--bg-spotlight);
    min-height: 100vh;
  }
  :global(html.dark) .page {
    background: var(--bg-spotlight);
  }
  .meta {
    color: rgba(240, 228, 200, 0.6);
    max-width: 40rem;
    margin-bottom: 2rem;
  }
  h1 {
    color: #f0e4c8;
    margin-bottom: 0.5rem;
  }
  .stage {
    max-width: 720px;
    margin: 2rem auto 0;
    position: relative;
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
    color: #f0e4c8;
    border-radius: 999px;
    padding: 0.55rem 1.2rem;
    text-align: center;
    backdrop-filter: blur(8px);
  }
  .chip .zh {
    display: block;
    font-size: 0.95rem;
    letter-spacing: 0.06em;
  }
  .chip .en {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(240, 228, 200, 0.65);
    margin-top: 2px;
  }
  .bar {
    margin: 1.25rem auto 0;
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
  }
  .controls {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  .btn {
    padding: 0.7rem 1.4rem;
    border-radius: 999px;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 1.5px solid transparent;
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
    background: rgba(240, 228, 200, 0.1);
  }
</style>
