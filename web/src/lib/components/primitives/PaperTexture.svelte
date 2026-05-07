<script lang="ts">
  type Tone = 'rice' | 'cream' | 'tea' | 'night';
  type Props = {
    tone?: Tone;
    intensity?: number; // 0..1
    fixed?: boolean;
  };
  let { tone = 'rice', intensity = 0.55, fixed = true }: Props = $props();

  const baseColor = $derived(
    tone === 'rice'
      ? 'var(--paper-rice)'
      : tone === 'cream'
        ? 'var(--paper-cream)'
        : tone === 'tea'
          ? 'var(--paper-tea)'
          : 'var(--paper-night)'
  );
</script>

<div class="paper-texture" class:fixed style="--paper: {baseColor}; --noise-alpha: {intensity * 0.12};">
  <svg class="grain" aria-hidden="true" preserveAspectRatio="none">
    <filter id="paperNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.85 0"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#paperNoise)" />
  </svg>
</div>

<style>
  .paper-texture {
    position: absolute;
    inset: 0;
    background: var(--paper);
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  }
  .paper-texture.fixed {
    position: fixed;
  }
  .grain {
    position: absolute;
    inset: -10%;
    width: 120%;
    height: 120%;
    opacity: var(--noise-alpha);
    mix-blend-mode: multiply;
  }
  :global(html.dark) .grain {
    mix-blend-mode: screen;
  }
</style>
