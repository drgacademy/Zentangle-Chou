<script lang="ts">
  import { onMount } from 'svelte';
  import { buildScene } from '$lib/tangles/engine';
  import { patterns, type PatternSlug } from '$lib/tangles/patterns';
  import { strokeRevealTimeline, snapStrokes } from '$lib/animations/strokeReveal';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import { getSceneProgress } from '$lib/components/primitives/ScrollScene.svelte';
  import { randomSeed } from '$lib/tangles/rng';
  import type { Stroke } from '$lib/tangles/types';

  type Mode = 'ambient' | 'interactive' | 'scroll' | 'static';

  type Props = {
    pattern: PatternSlug;
    mode?: Mode;
    seed?: string;
    size?: number; // viewBox edge in user units
    density?: number;
    jitter?: number;
    withScaffold?: boolean;
    onClick?: () => void;
  };
  let {
    pattern,
    mode = 'ambient',
    seed = $bindable(randomSeed()),
    size = 600,
    density = 1,
    jitter = 1.4,
    withScaffold = true,
    onClick
  }: Props = $props();

  let svgRoot: SVGSVGElement | null = $state(null);
  const sceneProgress = getSceneProgress();
  let timeline: ReturnType<typeof strokeRevealTimeline> | null = null;

  const strokes = $derived.by<Stroke[]>(() => {
    const p = patterns[pattern];
    if (!p) return [];
    return buildScene({
      pattern: p,
      rect: { x: 0, y: 0, w: size, h: size },
      seed,
      density,
      jitter,
      withScaffold
    });
  });

  function strokeColorFor(layer: Stroke['layer']) {
    switch (layer) {
      case 'pencil-border':
      case 'pencil-string':
      case 'dot':
        return 'var(--ink-pencil)';
      case 'shade':
        return 'var(--ink-shade)';
      case 'ink':
      default:
        return 'var(--ink)';
    }
  }

  function fillFor(s: Stroke) {
    if (s.fill) {
      // resolve the literal "currentColor" placeholder we used in patterns
      if (s.fill === 'currentColor') return strokeColorFor(s.layer);
      return s.fill;
    }
    return 'none';
  }

  function play() {
    if (!svgRoot) return;
    const paths = Array.from(svgRoot.querySelectorAll<SVGPathElement>('path[data-stroke]'));
    timeline?.kill();
    if ($reducedMotion || mode === 'static') {
      snapStrokes(paths);
      return;
    }
    if (mode === 'scroll') {
      timeline = strokeRevealTimeline(paths, { staggerMs: 30, autoPlay: false });
    } else {
      timeline = strokeRevealTimeline(paths, { staggerMs: 70, autoPlay: true });
    }
  }

  $effect(() => {
    void strokes;
    play();
  });

  $effect(() => {
    if (mode === 'scroll' && timeline) {
      timeline.progress($sceneProgress);
    }
  });

  function handleClick() {
    if (mode === 'interactive') {
      seed = randomSeed();
    }
    onClick?.();
  }

  onMount(() => () => timeline?.kill());
</script>

{#if mode === 'interactive'}
  <button
    type="button"
    class="canvas-button"
    aria-label="Re-seed {pattern} tangle"
    onclick={handleClick}
  >
    <svg
      bind:this={svgRoot}
      viewBox="0 0 {size} {size}"
      class="tangle-canvas"
      role="img"
      aria-label="Zentangle pattern: {pattern}"
    >
      {#each strokes as s (s.id)}
        <path
          data-stroke
          data-layer={s.layer}
          d={s.d}
          fill={fillFor(s)}
          stroke={strokeColorFor(s.layer)}
          stroke-width={s.width ?? 1}
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity={s.opacity ?? 1}
        />
      {/each}
    </svg>
  </button>
{:else}
  <svg
    bind:this={svgRoot}
    viewBox="0 0 {size} {size}"
    class="tangle-canvas"
    role="img"
    aria-label="Zentangle pattern: {pattern}"
  >
    {#each strokes as s (s.id)}
      <path
        data-stroke
        data-layer={s.layer}
        d={s.d}
        fill={fillFor(s)}
        stroke={strokeColorFor(s.layer)}
        stroke-width={s.width ?? 1}
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity={s.opacity ?? 1}
      />
    {/each}
  </svg>
{/if}

<style>
  .canvas-button {
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
    background: none;
    padding: 0;
    border: 0;
  }
  .canvas-button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }
  .tangle-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
