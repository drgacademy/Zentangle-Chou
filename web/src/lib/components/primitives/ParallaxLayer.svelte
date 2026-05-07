<script lang="ts">
  import { onMount } from 'svelte';
  import { getGsap, ScrollTrigger } from '$lib/animations/gsapClient';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import type { Snippet } from 'svelte';

  type Props = {
    speed?: number; // < 1 slower than scroll, > 1 faster, negative = opposite direction
    axis?: 'y' | 'x';
    children: Snippet;
  };
  let { speed = 0.4, axis = 'y', children }: Props = $props();

  let el: HTMLDivElement | null = $state(null);

  onMount(() => {
    if (!el) return;
    let unsub = reducedMotion.subscribe((reduced) => {
      if (reduced) return;
      const gsap = getGsap();
      const distance = (1 - speed) * 200;
      const tween = gsap.fromTo(
        el!,
        { [axis === 'y' ? 'yPercent' : 'xPercent']: -distance / 4 },
        {
          [axis === 'y' ? 'yPercent' : 'xPercent']: distance / 4,
          ease: 'none',
          scrollTrigger: {
            trigger: el!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => unsub();
  });
</script>

<div bind:this={el} class="layer">
  {@render children()}
</div>

<style>
  .layer {
    will-change: transform;
  }
</style>
