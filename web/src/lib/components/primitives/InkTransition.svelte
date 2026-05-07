<script lang="ts">
  import { onMount } from 'svelte';
  import { reducedMotion } from '$lib/stores/reducedMotion';

  type Props = {
    active: boolean;
    color?: string;
    durationMs?: number;
    onDone?: () => void;
  };
  let { active, color = '#1A1A1A', durationMs = 900, onDone }: Props = $props();

  let canvas: HTMLCanvasElement | null = $state(null);
  let raf = 0;

  function play() {
    if (!canvas) return;
    if ($reducedMotion) {
      onDone?.();
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const cx = W / 2;
    const cy = H * 0.6;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      ctx.clearRect(0, 0, W, H);
      const r = Math.max(W, H) * t * 1.6;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, color);
      grad.addColorStop(0.55 * (1 - t * 0.3), color);
      grad.addColorStop(0.85, color + '00');
      grad.addColorStop(1, color + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // soft splatter
      const splats = 12;
      for (let i = 0; i < splats; i++) {
        const ang = (i / splats) * Math.PI * 2 + t * 1.5;
        const dist = r * (0.55 + Math.sin(i * 9.2) * 0.18);
        const sx = cx + Math.cos(ang) * dist;
        const sy = cy + Math.sin(ang) * dist;
        const sr = 30 * t * (0.5 + Math.cos(i * 3.7) * 0.4);
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sg.addColorStop(0, color);
        sg.addColorStop(1, color + '00');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else onDone?.();
    };
    raf = requestAnimationFrame(tick);
  }

  $effect(() => {
    if (active) play();
    else if (raf) cancelAnimationFrame(raf);
  });

  onMount(() => () => raf && cancelAnimationFrame(raf));
</script>

{#if active}
  <div class="ink-overlay" aria-hidden="true">
    <canvas bind:this={canvas}></canvas>
  </div>
{/if}

<style>
  .ink-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
  }
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
