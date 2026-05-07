<script lang="ts">
  import StubPage from '$lib/components/layout/StubPage.svelte';
  import { t } from '$lib/i18n';
  let { data } = $props();
  const dict = $derived(data.dict);
  const lang = $derived(data.lang);
</script>

<StubPage title={t(dict, 'nav.tangles')} {lang} />
