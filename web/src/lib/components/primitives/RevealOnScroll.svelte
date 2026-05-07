<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import { getGsap, ScrollTrigger } from '$lib/animations/gsapClient';

  type Props = {
    children: Snippet;
    /** Slide-up offset in px (0 to disable) */
    yFrom?: number;
    /** Animation duration in seconds */
    duration?: number;
    /** Stagger child elements selector — defaults to direct children */
    stagger?: number;
    staggerSelector?: string;
    /** Trigger threshold (0..1, where ScrollTrigger fires "play") */
    start?: string;
    /** Optional CSS class for the wrapper */
    class?: string;
  };

  let {
    children,
    yFrom = 24,
    duration = 0.7,
    stagger = 0,
    staggerSelector = ':scope > *',
    start = 'top 82%',
    class: className = ''
  }: Props = $props();

  let host: HTMLElement | null = $state(null);

  onMount(() => {
    if (!host) return;
    if ($reducedMotion) {
      // Snap visible immediately.
      const targets =
        stagger > 0 ? Array.from(host.querySelectorAll<HTMLElement>(staggerSelector)) : [host];
      targets.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }
    const gsap = getGsap();
    const targets =
      stagger > 0 ? Array.from(host.querySelectorAll<HTMLElement>(staggerSelector)) : [host];

    gsap.set(targets, { opacity: 0, y: yFrom });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      ease: 'power2.out',
      stagger: stagger > 0 ? stagger : 0,
      paused: true
    });

    const trigger = ScrollTrigger.create({
      trigger: host,
      start,
      once: true,
      onEnter: () => tween.play()
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  });
</script>

<div bind:this={host} class={className}>
  {@render children()}
</div>
