<script lang="ts">
  type Props = { title: string; lang: 'zh' | 'en' };
  let { title, lang }: Props = $props();
</script>

<main class="stub">
  <p class="kicker">{lang === 'zh' ? '即將上線' : 'coming soon'}</p>
  <h1 class="text-h1 font-masthead">{title}</h1>
  <p class="meta">
    {lang === 'zh'
      ? '本頁將在後續 sprint 中以新設計系統建構。先回'
      : 'This page will be composed in a subsequent sprint with the same design system. For now, return '}<a class="underline" href={'/' + lang}>{lang === 'zh' ? '首頁' : 'home'}</a>。
  </p>
</main>

<style>
  .stub {
    min-height: 60vh;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 6rem 2rem;
    gap: 1rem;
  }
  .kicker {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--ink-shade);
  }
  .meta { color: var(--ink-shade); max-width: 30rem; }
</style>
