<script lang="ts">
  import { onMount } from 'svelte';
  import { composeTile, type ComposedTile, type PhaseDef, type RegionDef } from '$lib/tangles/tileCompose';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import { getGsap } from '$lib/animations/gsapClient';
  import type { Stroke } from '$lib/tangles/types';

  type Props = {
    regions: RegionDef[];
    stringCurves?: string[];
    seed?: string;
    size?: number;
    speed?: number;
    paused?: boolean;
    ariaLabel?: string;
    onPhaseEnter?: (phase: PhaseDef) => void;
    onProgress?: (p: number) => void;
    onComplete?: () => void;
  };

  let {
    regions,
    stringCurves,
    seed = 'tile-default',
    size = 800,
    speed = $bindable(1),
    paused = false,
    ariaLabel = 'Zentangle tile',
    onPhaseEnter,
    onProgress,
    onComplete
  }: Props = $props();

  let svgRoot: SVGSVGElement | null = $state(null);
  let timeline: gsap.core.Timeline | null = null;

  const composed = $derived.by<ComposedTile>(() =>
    composeTile({
      regions,
      stringCurves,
      outerRect: { x: 0, y: 0, w: size, h: size },
      seed
    })
  );

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
    if (!s.fill) return 'none';
    if (s.fill === 'currentColor') return strokeColorFor(s.layer);
    return s.fill;
  }

  function buildTimeline() {
    if (!svgRoot) return;
    const gsap = getGsap();
    timeline?.kill();

    const tl = gsap.timeline({ paused: true });
    timeline = tl;

    // Reduced motion → snap everything.
    if ($reducedMotion) {
      composed.strokes.forEach((s) => {
        const node = svgRoot!.querySelector<SVGPathElement>(`[data-id="${s.id}"]`);
        if (!node) return;
        node.style.opacity = '1';
        node.style.strokeDasharray = '';
        node.style.strokeDashoffset = '';
      });
      const lastPhase = composed.phases[composed.phases.length - 1];
      if (lastPhase) onPhaseEnter?.(lastPhase);
      onProgress?.(1);
      onComplete?.();
      return;
    }

    // Initial state — opacity 0 for fills/dots/shades, dashoffset for outlines.
    composed.strokes.forEach((s) => {
      const node = svgRoot!.querySelector<SVGPathElement>(`[data-id="${s.id}"]`);
      if (!node) return;
      const isFillOnly = s.fill && s.fill !== 'none';
      const isOpacityOnly =
        s.layer === 'dot' ||
        s.layer === 'shade' ||
        isFillOnly;
      if (isOpacityOnly) {
        node.style.opacity = '0';
      } else {
        try {
          const len = node.getTotalLength();
          node.style.strokeDasharray = String(len);
          node.style.strokeDashoffset = String(len);
        } catch {
          node.style.opacity = '0';
        }
      }
    });

    // Phase loop: emit label, fire callback, then animate strokes for that phase.
    composed.phases.forEach((phase, i) => {
      tl.addLabel(phase.id);
      tl.call(() => onPhaseEnter?.(phase));
      const strokeMeta: Record<string, Stroke> = {};
      composed.strokes.forEach((s) => (strokeMeta[s.id] = s));

      const phaseStrokes = phase.strokeIds.map((id) => strokeMeta[id]).filter(Boolean);
      const stagger = Math.max(0.012, 0.6 / Math.max(phaseStrokes.length, 1));

      phaseStrokes.forEach((s, idx) => {
        const node = svgRoot!.querySelector<SVGPathElement>(`[data-id="${s.id}"]`);
        if (!node) return;
        const isFillOnly = s.fill && s.fill !== 'none';
        const isOpacityOnly = s.layer === 'dot' || s.layer === 'shade' || isFillOnly;
        const baseDur = (s.drawMs ?? 600) / 1000;
        const at = idx === 0 ? '>' : `<+=${stagger}`;
        if (isOpacityOnly) {
          tl.to(node, { opacity: 1, duration: baseDur, ease: 'power2.out' }, at);
        } else {
          tl.to(
            node,
            { strokeDashoffset: 0, duration: baseDur, ease: 'power2.out' },
            at
          );
        }
      });
      // Pad slightly between phases so chip transitions are legible.
      if (i < composed.phases.length - 1) tl.to({}, { duration: 0.25 });
    });

    tl.eventCallback('onUpdate', () => onProgress?.(tl.progress()));
    tl.eventCallback('onComplete', () => onComplete?.());

    tl.timeScale(speed);
    if (!paused) tl.play();
  }

  $effect(() => {
    void composed;
    if (svgRoot) buildTimeline();
  });

  $effect(() => {
    if (timeline) timeline.timeScale(speed);
  });

  $effect(() => {
    if (timeline) {
      if (paused) timeline.pause();
      else timeline.play();
    }
  });

  export function restart() {
    if (timeline) timeline.restart(true);
  }

  export function setSpeed(n: number) {
    speed = n;
  }

  onMount(() => () => timeline?.kill());
</script>

<svg
  bind:this={svgRoot}
  viewBox="0 0 {size} {size}"
  class="tangle-tile"
  role="img"
  aria-label={ariaLabel}
>
  <defs>
    {#each composed.clipPaths as cp (cp.id)}
      <clipPath id={cp.id}>
        <path d={cp.d} />
      </clipPath>
    {/each}
  </defs>

  <!-- Tile paper ground -->
  <rect x="0" y="0" width={size} height={size} fill="var(--paper-tile, #F0E4C8)" />

  <!-- Strokes: scaffold ungrouped; region strokes inside their <g clip-path> -->
  {#each composed.strokes as s (s.id)}
    {#if s.clipPathId}
      <g clip-path="url(#{s.clipPathId})">
        <path
          data-id={s.id}
          data-layer={s.layer}
          d={s.d}
          fill={fillFor(s)}
          stroke={s.fill && s.fill !== 'none' && s.fill !== 'currentColor' ? 'none' : strokeColorFor(s.layer)}
          stroke-width={s.width ?? 1}
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity={s.opacity ?? 1}
        />
      </g>
    {:else}
      <path
        data-id={s.id}
        data-layer={s.layer}
        d={s.d}
        fill={fillFor(s)}
        stroke={s.fill && s.fill !== 'none' && s.fill !== 'currentColor' ? 'none' : strokeColorFor(s.layer)}
        stroke-width={s.width ?? 1}
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity={s.opacity ?? 1}
      />
    {/if}
  {/each}
</svg>

<style>
  .tangle-tile {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 6px;
    box-shadow:
      0 25px 60px rgba(0, 0, 0, 0.5),
      0 8px 20px rgba(0, 0, 0, 0.35),
      inset 0 0 80px rgba(140, 100, 40, 0.15);
  }
</style>
