<script lang="ts">
  import RevealOnScroll from '$lib/components/primitives/RevealOnScroll.svelte';
  import TangleSection from '$lib/components/primitives/TangleSection.svelte';
  import { t, type Lang } from '$lib/i18n';

  type Props = { data: { lang: Lang; dict: Record<string, unknown> } };
  let { data }: Props = $props();
  const dict = $derived(data.dict);
  const lang = $derived(data.lang);
</script>

<svelte:head>
  <title>{t(dict, 'nav.contact')} — {t(dict, 'site.title')}</title>
</svelte:head>

<main class="contact">
  <RevealOnScroll>
    <h1 class="title">{t(dict, 'nav.contact')}</h1>
  </RevealOnScroll>

  <RevealOnScroll yFrom={32} duration={0.7}>
    <TangleSection seed="contact" pad={48}>
      <div class="card">
        <p class="lede">
          {lang === 'zh'
            ? '想合作、收藏、或聊聊禪繞畫？歡迎透過 Instagram 或 Email 聯絡。'
            : 'For collaborations, prints, or just to talk tangling — reach out via Instagram or email.'}
        </p>
        <div class="links">
          <a class="link primary" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            Instagram →
          </a>
          <a class="link ghost" href="mailto:hello@zentanglechou.com"> hello@zentanglechou.com </a>
        </div>
      </div>
    </TangleSection>
  </RevealOnScroll>
</main>

<style>
  .contact {
    padding: 4rem 1.5rem 6rem;
    max-width: 56rem;
    margin: 0 auto;
    color: var(--ink);
  }
  .title {
    font-family: var(--font-masthead);
    font-size: var(--fs-pull);
    font-weight: 600;
    margin: 0 0 3rem;
    text-align: center;
  }
  .card {
    text-align: center;
    padding: 1rem;
  }
  .lede {
    font-family: var(--font-masthead);
    font-size: var(--fs-h3);
    color: var(--ink);
    line-height: 1.45;
    margin: 0 0 2.4rem;
    font-weight: 500;
  }
  .links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .link {
    padding: 0.8rem 1.6rem;
    border-radius: 999px;
    font-size: 1rem;
    text-decoration: none;
    transition: transform 0.2s ease;
    border: 1.5px solid transparent;
  }
  .link:hover {
    transform: translateY(-2px);
  }
  .link.primary {
    background: var(--ink);
    color: var(--paper-rice);
  }
  .link.ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--ink-bleed);
  }
  .link.ghost:hover {
    background: var(--ink-bleed);
  }
</style>
