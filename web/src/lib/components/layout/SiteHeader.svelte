<script lang="ts">
  import { onMount } from 'svelte';
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

  let scrolled = $state(false);
  let onHero = $state(false);

  onMount(() => {
    const updateScrolled = () => {
      scrolled = window.scrollY > 80;
    };
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });

    // Detect "are we currently on the homepage hero (dark bg)?" by checking
    // for the #hero element in the document.
    const update = () => {
      const hero = document.getElementById('hero');
      onHero = !!hero;
    };
    update();
    // Re-check on every navigation (SvelteKit fires popstate + custom events).
    const obs = new MutationObserver(update);
    obs.observe(document.body, { childList: true, subtree: false });

    return () => {
      window.removeEventListener('scroll', updateScrolled);
      obs.disconnect();
    };
  });

  const transparent = $derived(onHero && !scrolled);
</script>

<header class="header" class:transparent class:scrolled>
  <a href={'/' + lang} class="brand" aria-label={t(dict, 'site.title')}>
    <span class="wordmark">Zentangle Chou</span>
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
    transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
  }
  .header.transparent {
    background: transparent;
    backdrop-filter: none;
    border-bottom-color: transparent;
    color: #f0e4c8;
  }
  .header.transparent .brand,
  .header.transparent .nav a {
    color: #f0e4c8;
  }
  .header.transparent .nav a:hover {
    color: #ffffff;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    color: var(--ink);
    transition: color 0.4s ease;
  }
  .brand .wordmark {
    font-family: var(--font-masthead, var(--font-body));
    font-weight: 600;
    font-size: 1.05rem;
    letter-spacing: 0.04em;
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
  .nav a {
    transition: color 0.4s ease;
  }
  .nav a:hover {
    color: var(--ink);
    text-decoration: none;
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  @media (max-width: 767px) {
    .nav {
      display: none;
    }
  }
</style>
