<script lang="ts">
  import SceneHeroTile from '$lib/components/home/SceneHeroTile.svelte';
  import SceneManifesto from '$lib/components/home/SceneManifesto.svelte';
  import SceneEightBreaths from '$lib/components/home/SceneEightBreaths.svelte';
  import ScenePatternIndex from '$lib/components/home/ScenePatternIndex.svelte';
  import SceneFooterMark from '$lib/components/home/SceneFooterMark.svelte';
  import { t, type Lang } from '$lib/i18n';

  type Props = { data: { lang: Lang; dict: Record<string, unknown> } };
  let { data }: Props = $props();
  const dict = $derived(data.dict);
  const lang = $derived(data.lang);
</script>

<svelte:head>
  <title>{t(dict, 'site.title')} — {t(dict, 'site.tagline')}</title>
  <meta name="description" content={t(dict, 'site.tagline')} />
</svelte:head>

<SceneHeroTile {dict} {lang} />
<SceneManifesto {dict} {lang} />
<SceneEightBreaths {dict} {lang} />
<ScenePatternIndex {dict} {lang} />
<SceneFooterMark {dict} {lang} />
