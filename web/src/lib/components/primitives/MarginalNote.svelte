<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    side?: 'left' | 'right';
    rotate?: number; // deg, recommended -2..2
    color?: string;
    children: Snippet;
  };
  let { side = 'right', rotate = -1.5, color = 'var(--ink-shade)', children }: Props = $props();
</script>

<aside class="note" class:right={side === 'right'} class:left={side === 'left'} style="--rot: {rotate}deg; color: {color};">
  {@render children()}
</aside>

<style>
  .note {
    font-family: var(--font-marginal);
    font-size: 1rem;
    line-height: 1.45;
    transform: rotate(var(--rot));
    transform-origin: top center;
    white-space: pre-line;
    max-width: 18ch;
  }
  @media (min-width: 768px) {
    .note {
      position: absolute;
    }
    .note.right {
      right: -16ch;
      top: 0;
    }
    .note.left {
      left: -16ch;
      top: 0;
      text-align: right;
    }
  }
  @media (max-width: 767px) {
    .note {
      display: block;
      margin: 1rem 0;
      font-style: italic;
      max-width: none;
    }
  }
</style>
