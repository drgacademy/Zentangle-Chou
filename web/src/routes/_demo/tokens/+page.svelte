<script lang="ts">
  const swatches = [
    { name: '--paper-rice', hex: '#FCFAF4' },
    { name: '--paper-bg', hex: '#FAF7F1' },
    { name: '--paper-cream', hex: '#F6EFDF' },
    { name: '--paper-tea', hex: '#EFE6D2' },
    { name: '--paper-night', hex: '#1B1A18' },
    { name: '--ink', hex: '#1A1A1A' },
    { name: '--ink-warm', hex: '#2A1F12' },
    { name: '--ink-pencil', hex: '#C8C2B5' },
    { name: '--ink-shade', hex: 'rgba(26,26,26,.55)' },
    { name: '--ink-red-stamp', hex: '#B23A38' },
    { name: '--gold-500', hex: '#C9A961' },
    { name: '--sepia-500', hex: '#B89668' }
  ];
  const sizes = ['caption', 'body', 'lede', 'h3', 'h2', 'h1', 'pull', 'display'];
</script>

<h1 class="h-pull mb-8">Tokens</h1>

<section class="mb-16">
  <h2 class="text-h3 mb-4">Color</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {#each swatches as s}
      <div>
        <div class="h-20 border border-ink/10" style="background: var({s.name});"></div>
        <p class="font-mono text-caption mt-2">{s.name}</p>
        <p class="font-mono text-caption text-ink-shade">{s.hex}</p>
      </div>
    {/each}
  </div>
</section>

<section class="mb-16">
  <h2 class="text-h3 mb-4">Type scale</h2>
  <div class="space-y-3">
    {#each sizes as s}
      <div class="flex items-baseline gap-4">
        <span class="font-mono text-caption text-ink-shade w-24">--fs-{s}</span>
        <span style="font-size: var(--fs-{s}); line-height: 1.1;">一筆一畫 — One stroke at a time</span>
      </div>
    {/each}
  </div>
</section>

<section>
  <h2 class="text-h3 mb-4">Fonts</h2>
  <div class="space-y-4">
    <p class="h-masthead">Zentangle Chou</p>
    <p class="h-pull">There are no mistakes, only opportunities.</p>
    <p class="h-script text-3xl">One Stroke at a Time</p>
    <p class="h-marginal">這頁的字 — 都是手寫感。</p>
    <p class="h-signature">Zentangle Chou</p>
  </div>
</section>
