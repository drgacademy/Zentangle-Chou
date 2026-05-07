<script lang="ts">
  import { t, type Lang } from '$lib/i18n';

  type Props = { lang: Lang; dict: Record<string, unknown> };
  let { lang, dict }: Props = $props();
</script>

<footer class="footer">
  <div class="cols">
    <div class="brand">
      <p class="name">Zentangle Chou</p>
      <p class="tag">{t(dict, 'site.tagline')}</p>
    </div>
    <nav class="links" aria-label="footer">
      <a href={'/' + lang + '/about'}>{t(dict, 'footer.about')}</a>
      <a href={'/' + lang + '/contact'}>{t(dict, 'footer.contact')}</a>
      <a href="https://instagram.com" rel="noopener noreferrer" target="_blank">{t(dict, 'footer.instagram')}</a>
    </nav>
  </div>
  <p class="rights">{t(dict, 'footer.rights')}</p>
</footer>

<style>
  .footer {
    padding: 4rem 2rem 3rem;
    border-top: 1px solid var(--ink-bleed);
    background: var(--paper-bg);
    margin-top: 4rem;
  }
  .cols {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    max-width: 80rem;
    margin: 0 auto 2rem;
  }
  .name {
    font-family: var(--font-masthead);
    font-size: 1.1rem;
    margin: 0;
  }
  .tag {
    font-family: var(--font-display-script);
    color: var(--ink-warm);
    margin: 0.25rem 0 0;
  }
  .links {
    display: flex;
    gap: 1.5rem;
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
  .links a { color: var(--ink-shade); }
  .links a:hover { color: var(--ink); text-decoration: none; }
  .rights {
    text-align: center;
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    color: var(--ink-shade);
    max-width: 80rem;
    margin: 0 auto;
  }
</style>
