<script lang="ts">
  import TornEdge from './TornEdge.svelte';
  import SketchBorder from './SketchBorder.svelte';

  type Props = {
    src: string;
    alt: string;
    caption?: string;
    rotate?: number;
    seed?: string;
  };
  let { src, alt, caption, rotate = 0, seed = 'p' }: Props = $props();
</script>

<figure class="polaroid" style="--rot: {rotate}deg;">
  <SketchBorder seed={seed + 'b'} jitter={1.4} inset={6} width={1}>
    <TornEdge seed={seed + 't'} severity={0.4}>
      <img {src} {alt} loading="lazy" />
    </TornEdge>
  </SketchBorder>
  {#if caption}
    <figcaption class="cap">{caption}</figcaption>
  {/if}
</figure>

<style>
  .polaroid {
    transform: rotate(var(--rot));
    transform-origin: center;
    display: inline-block;
    background: var(--paper-rice);
    padding: 0.75rem 0.75rem 1.25rem;
    box-shadow: 0 12px 28px -22px var(--ink-shade);
  }
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  .cap {
    margin-top: 0.65rem;
    font-family: var(--font-display-script);
    font-size: 1.05rem;
    text-align: center;
    color: var(--ink-warm);
  }
</style>
