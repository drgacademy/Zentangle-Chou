<script lang="ts">
  const items = [
    { href: '/_demo/tokens', label: 'Design tokens — paper, ink, type scale' },
    { href: '/_demo/paper', label: 'PaperTexture — rice / cream / tea / night' },
    { href: '/_demo/sketch-border', label: 'SketchBorder — wobbly hand-drawn frames' },
    { href: '/_demo/torn', label: 'TornEdge — torn paper clip-path' },
    { href: '/_demo/polaroid', label: 'Polaroid — TornEdge + SketchBorder + image' },
    { href: '/_demo/marginal', label: 'MarginalNote — editorial marginalia' },
    { href: '/_demo/handdrawn-text', label: 'HandDrawnText — character-by-character reveal' },
    { href: '/_demo/parallax', label: 'ParallaxLayer — scroll-driven offset' },
    { href: '/_demo/scroll-scene', label: 'ScrollScene — pinned scroll progress' },
    { href: '/_demo/tangle', label: 'TangleCanvas — interactive tangle engine' },
    { href: '/_demo/tile', label: 'TangleTile — full 4-region tile with phases + controls' },
    { href: '/_demo/transitions', label: 'InkTransition — page transition wash' }
  ];
</script>

<svelte:head>
  <title>Zentangle design system / demo</title>
</svelte:head>

<h1 class="h-pull mb-8">Design System Playground</h1>
<p class="text-ink-shade mb-12 max-w-prose">
  Each primitive has an isolated demo so we can audit motion, spacing, contrast, and reduced-motion fallback in
  isolation before composing the homepage scenes.
</p>

<ul class="grid gap-3">
  {#each items as item}
    <li>
      <a href={item.href} class="block py-2 border-b border-ink/10 hover:text-gold-700 transition">
        <span class="font-mono text-sm text-ink-shade mr-3">{item.href}</span>
        {item.label}
      </a>
    </li>
  {/each}
</ul>
