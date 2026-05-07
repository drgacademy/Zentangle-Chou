<script lang="ts" module>
  import { writable, type Writable } from 'svelte/store';
  import { getContext, setContext } from 'svelte';
  const KEY = Symbol('scroll-scene-progress');

  export function getSceneProgress(): Writable<number> {
    return getContext(KEY) ?? writable(0);
  }
  export function setSceneProgress(store: Writable<number>) {
    setContext(KEY, store);
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { getGsap, ScrollTrigger } from '$lib/animations/gsapClient';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import type { Snippet } from 'svelte';

  type Props = {
    pin?: boolean;
    scrub?: boolean | number;
    height?: string; // e.g. "200vh"
    children: Snippet;
  };
  let { pin = false, scrub = true, height = '150vh', children }: Props = $props();

  let host: HTMLDivElement | null = $state(null);
  const progress = writable(0);
  setSceneProgress(progress);

  onMount(() => {
    if (!host) return;
    const unsub = reducedMotion.subscribe((reduced) => {
      if (reduced) {
        progress.set(1);
        return;
      }
      getGsap();
      const st = ScrollTrigger.create({
        trigger: host!,
        start: 'top top',
        end: 'bottom bottom',
        pin: pin ? host!.querySelector('.pin-target') ?? false : false,
        scrub: scrub === true ? 0.6 : scrub,
        onUpdate: (self) => progress.set(self.progress)
      });
      return () => st.kill();
    });
    return () => unsub();
  });
</script>

<div bind:this={host} class="scroll-scene" style="--height: {height}; min-height: {height};">
  <div class="pin-target">
    {@render children()}
  </div>
</div>

<style>
  .scroll-scene {
    position: relative;
    width: 100%;
  }
  .pin-target {
    width: 100%;
    min-height: 100vh;
  }
</style>
