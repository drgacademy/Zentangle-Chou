<script lang="ts">
  import { page } from '$app/state';
  import type { Lang } from '$lib/i18n';

  type Props = { lang: Lang };
  let { lang }: Props = $props();

  const otherLang = $derived(lang === 'zh' ? 'en' : 'zh');
  const otherHref = $derived(
    page.url.pathname.replace(/^\/(zh|en)(?=\/|$)/, '/' + otherLang) || '/' + otherLang
  );
</script>

<a
  href={otherHref}
  class="lang"
  hreflang={otherLang === 'zh' ? 'zh-Hant' : 'en'}
  aria-label="Switch language to {otherLang === 'zh' ? '中文' : 'English'}"
>
  <span aria-hidden="true">{lang === 'zh' ? 'EN' : '中'}</span>
</a>

<style>
  .lang {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-shade);
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--ink-bleed);
    transition: color 0.2s, border-color 0.2s;
  }
  .lang:hover {
    color: var(--ink);
    border-color: var(--ink-pencil);
    text-decoration: none;
  }
</style>
