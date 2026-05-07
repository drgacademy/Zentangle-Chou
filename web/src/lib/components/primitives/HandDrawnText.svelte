<script lang="ts">
  import { onMount } from 'svelte';
  import { reducedMotion } from '$lib/stores/reducedMotion';

  type Props = {
    text: string;
    font?: string; // CSS font-family value or var(--font-...)
    size?: string; // CSS length
    color?: string;
    weight?: number | string;
    perCharMs?: number;
    delayMs?: number;
    autoplay?: boolean;
    el?: 'h1' | 'h2' | 'p' | 'span';
    align?: 'left' | 'center' | 'right';
  };
  let {
    text,
    font = 'inherit',
    size = 'inherit',
    color = 'currentColor',
    weight = 'inherit',
    perCharMs = 110,
    delayMs = 0,
    autoplay = true,
    el = 'span',
    align = 'left'
  }: Props = $props();

  let host: HTMLElement | null = $state(null);
  let started = $state(false);

  function isCJK(ch: string): boolean {
    const code = ch.charCodeAt(0);
    return (
      (code >= 0x3000 && code <= 0x303f) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0xff00 && code <= 0xffef)
    );
  }

  function play() {
    if (!host || started) return;
    started = true;
    if ($reducedMotion) {
      host.querySelectorAll<HTMLSpanElement>('.ch').forEach((s) => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0)';
        s.style.filter = 'none';
      });
      return;
    }
    const chars = host.querySelectorAll<HTMLSpanElement>('.ch');
    let cumDelay = delayMs;
    chars.forEach((s) => {
      const ch = s.dataset.ch || '';
      const weight = isCJK(ch) ? 1.6 : 1;
      const dur = perCharMs * weight;
      s.style.transition = `opacity ${dur * 1.4}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${cumDelay}ms, transform ${dur * 1.4}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${cumDelay}ms, filter ${dur * 1.6}ms ease ${cumDelay}ms`;
      requestAnimationFrame(() => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0)';
        s.style.filter = 'none';
      });
      cumDelay += dur;
    });
  }

  onMount(() => {
    if (autoplay) play();
  });

  export function start() {
    play();
  }

  const chars = $derived([...text]);
</script>

<svelte:element
  this={el}
  bind:this={host}
  class="hd"
  style="font-family: {font}; font-size: {size}; color: {color}; font-weight: {weight}; text-align: {align};"
>
  {#each chars as ch, i (i)}
    {#if ch === ' '}
      <span class="ch space" data-ch=" ">&nbsp;</span>
    {:else if ch === '\n'}
      <br />
    {:else}
      <span class="ch" data-ch={ch}>{ch}</span>
    {/if}
  {/each}
</svelte:element>

<style>
  .hd {
    display: block;
  }
  .ch {
    display: inline-block;
    opacity: 0;
    transform: translateY(0.3em);
    filter: blur(2px);
  }
  .ch.space {
    opacity: 1;
    filter: none;
    transform: none;
  }
</style>
