<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import { getGsap, ScrollTrigger } from '$lib/animations/gsapClient';
  import { wobblyRect, dot } from '$lib/tangles/geometry';
  import { makeRng } from '$lib/tangles/rng';

  type Props = {
    children: Snippet;
    seed?: string;
    /** padding inside the wobbly border (px) */
    pad?: number;
    /** Wobble jitter amount */
    jitter?: number;
    /** Optional CSS class for the wrapper */
    class?: string;
    ariaLabel?: string;
  };

  let { children, seed = 'section', pad = 32, jitter = 2, class: className = '', ariaLabel }: Props = $props();

  let host: HTMLElement | null = $state(null);
  let svg: SVGSVGElement | null = $state(null);
  let dimensions = $state({ w: 0, h: 0 });
  let strokes = $derived.by(() => {
    if (dimensions.w === 0 || dimensions.h === 0) return null;
    const rng = makeRng(seed);
    const inset = pad;
    const rect = {
      x: inset,
      y: inset,
      w: dimensions.w - inset * 2,
      h: dimensions.h - inset * 2
    };
    return {
      dots: [
        { id: 'd-tl', d: dot(rect.x, rect.y, 2.2) },
        { id: 'd-tr', d: dot(rect.x + rect.w, rect.y, 2.2) },
        { id: 'd-br', d: dot(rect.x + rect.w, rect.y + rect.h, 2.2) },
        { id: 'd-bl', d: dot(rect.x, rect.y + rect.h, 2.2) }
      ],
      border: { id: 'b', d: wobblyRect(rect, rng, jitter, 24) }
    };
  });

  onMount(() => {
    if (!host) return;
    const ro = new ResizeObserver(() => {
      if (!host) return;
      dimensions = { w: host.offsetWidth, h: host.offsetHeight };
    });
    ro.observe(host);
    dimensions = { w: host.offsetWidth, h: host.offsetHeight };

    const gsap = getGsap();

    if ($reducedMotion) {
      // Snap visible immediately on next paint after svg renders.
      requestAnimationFrame(() => {
        if (!svg) return;
        svg.querySelectorAll<SVGPathElement>('path').forEach((p) => {
          p.style.opacity = '1';
          p.style.strokeDasharray = '';
          p.style.strokeDashoffset = '';
        });
      });
      return () => ro.disconnect();
    }

    let trigger: ScrollTrigger | null = null;

    const setup = () => {
      if (!svg) return;
      const dots = Array.from(svg.querySelectorAll<SVGPathElement>('path[data-kind="dot"]'));
      const border = svg.querySelector<SVGPathElement>('path[data-kind="border"]');
      gsap.set(dots, { opacity: 0 });
      if (border) {
        try {
          const len = border.getTotalLength();
          border.style.strokeDasharray = String(len);
          border.style.strokeDashoffset = String(len);
        } catch {
          /* ignore */
        }
      }

      const tl = gsap.timeline({ paused: true });
      dots.forEach((d, i) => {
        tl.to(d, { opacity: 1, duration: 0.25, ease: 'power2.out' }, i === 0 ? 0 : '<+=0.18');
      });
      if (border) {
        tl.to(border, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' }, '>+=0.1');
      }

      trigger = ScrollTrigger.create({
        trigger: host!,
        start: 'top 78%',
        once: true,
        onEnter: () => tl.play()
      });
    };

    requestAnimationFrame(setup);

    return () => {
      ro.disconnect();
      trigger?.kill();
    };
  });
</script>

<section bind:this={host} class={'tangle-section ' + className} aria-label={ariaLabel}>
  {#if strokes}
    <svg
      bind:this={svg}
      class="frame"
      viewBox="0 0 {dimensions.w} {dimensions.h}"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {#each strokes.dots as d (d.id)}
        <path data-kind="dot" d={d.d} fill="var(--ink-pencil)" />
      {/each}
      <path
        data-kind="border"
        d={strokes.border.d}
        fill="none"
        stroke="var(--ink-pencil)"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  {/if}
  <div class="content">
    {@render children()}
  </div>
</section>

<style>
  .tangle-section {
    position: relative;
    padding: clamp(2rem, 5vw, 4rem);
  }
  .frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  .content {
    position: relative;
    z-index: 1;
  }
</style>
