<script lang="ts">
  import SceneCover from '$lib/components/home/SceneCover.svelte';
  import SceneManifesto from '$lib/components/home/SceneManifesto.svelte';
  import SceneFeatured from '$lib/components/home/SceneFeatured.svelte';
  import SceneTangleDemo from '$lib/components/home/SceneTangleDemo.svelte';
  import SceneProcess from '$lib/components/home/SceneProcess.svelte';
  import SceneSignature from '$lib/components/home/SceneSignature.svelte';
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

<SceneCover {dict} {lang} />
<SceneManifesto {dict} {lang} />
<SceneFeatured {dict} {lang} />
<SceneTangleDemo {dict} {lang} />
<SceneProcess {dict} />
<SceneSignature {dict} />
