<script lang="ts">
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import MotionToggle from './MotionToggle.svelte';
  import { t, type Lang } from '$lib/i18n';

  type Props = { lang: Lang; dict: Record<string, unknown> };
  let { lang, dict }: Props = $props();

  const navItems = $derived([
    { href: '/' + lang, label: t(dict, 'nav.home') },
    { href: '/' + lang + '/about', label: t(dict, 'nav.about') },
    { href: '/' + lang + '/portfolio', label: t(dict, 'nav.portfolio') },
    { href: '/' + lang + '/tangles', label: t(dict, 'nav.tangles') },
    { href: '/' + lang + '/process', label: t(dict, 'nav.process') },
    { href: '/' + lang + '/contact', label: t(dict, 'nav.contact') }
  ]);
</script>

<header class="header">
  <a href={'/' + lang} class="brand" aria-label={t(dict, 'site.title')}>
    <span class="zh">周語喬</span>
    <span class="en">YuChiao Chou</span>
  </a>

  <nav class="nav" aria-label="primary">
    {#each navItems as item}
      <a href={item.href}>{item.label}</a>
    {/each}
  </nav>

  <div class="controls">
    <LanguageSwitcher {lang} />
    <ThemeToggle />
    <MotionToggle />
  </div>
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 2rem;
    background: color-mix(in oklab, var(--paper-bg) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--ink-bleed);
  }
  .brand {
    display: inline-flex;
    flex-direction: column;
    line-height: 1;
    color: var(--ink);
  }
  .brand .zh {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 1rem;
  }
  .brand .en {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    color: var(--ink-shade);
    margin-top: 0.15rem;
  }
  .nav {
    display: flex;
    gap: 1.5rem;
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--ink-shade);
  }
  .nav a:hover { color: var(--ink); text-decoration: none; }
  .controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  @media (max-width: 767px) {
    .nav { display: none; }
  }
</style>
