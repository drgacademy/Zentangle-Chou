<script lang="ts">
  import HandDrawnText from '$lib/components/primitives/HandDrawnText.svelte';
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';

  type Props = { dict: Record<string, unknown> };
  let { dict }: Props = $props();

  let host: HTMLElement | null = $state(null);
  let visible = $state(false);

  onMount(() => {
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visible = true;
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(host);
    return () => io.disconnect();
  });
</script>

<section class="signature" bind:this={host} aria-labelledby="sign-title">
  {#if visible}
    <HandDrawnText
      el="p"
      text="Zentangle Chou"
      font="var(--font-signature)"
      size="clamp(3rem, 8vw, 6rem)"
      perCharMs={260}
      delayMs={300}
      align="center"
    />
    <div class="stamp" aria-hidden="true">
      <span class="chop">{t(dict, 'signature.stamp')}</span>
    </div>
  {/if}
</section>

<style>
  .signature {
    min-height: 60vh;
    display: grid;
    place-items: center;
    padding: 8rem 6vw;
    text-align: center;
    position: relative;
  }
  .stamp {
    margin-top: 2rem;
    display: inline-block;
    width: 4rem;
    height: 4rem;
    border: 2px solid var(--ink-red-stamp);
    color: var(--ink-red-stamp);
    display: grid;
    place-items: center;
    transform: rotate(-3deg);
    background: var(--paper-rice);
  }
  .chop {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 1.6rem;
    letter-spacing: -0.05em;
    line-height: 1;
  }
</style>
