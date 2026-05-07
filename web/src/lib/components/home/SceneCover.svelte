<script lang="ts">
  import HandDrawnText from '$lib/components/primitives/HandDrawnText.svelte';
  import MarginalNote from '$lib/components/primitives/MarginalNote.svelte';
  import TangleCanvas from '$lib/components/tangle/TangleCanvas.svelte';
  import { t, type Lang } from '$lib/i18n';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();
</script>

<section class="cover" aria-labelledby="masthead-title">
  <div class="ambient" aria-hidden="true">
    <TangleCanvas pattern="crescent-moon" mode="ambient" seed="cover-bg" density={0.7} withScaffold={true} />
  </div>

  <div class="content">
    <p class="kicker">{t(dict, 'hero.kicker')}</p>

    <HandDrawnText
      el="h1"
      text={t(dict, 'hero.title')}
      font="var(--font-masthead)"
      size="var(--fs-display)"
      perCharMs={lang === 'zh' ? 220 : 130}
      delayMs={1800}
      align="center"
    />

    <HandDrawnText
      el="p"
      text={t(dict, 'hero.subtitle')}
      font="var(--font-display-script)"
      size="clamp(2rem, 4vw, 3rem)"
      color="var(--ink-warm)"
      perCharMs={140}
      delayMs={4200}
      align="center"
    />

    <div class="margin-anchor">
      <MarginalNote side="right" rotate={-2}>{t(dict, 'hero.place')}</MarginalNote>
    </div>
  </div>

  <div class="scroll-cue" aria-hidden="true">
    <svg viewBox="0 0 12 60" width="12" height="60">
      <path d="M6 2 Q4 30 6 58" fill="none" stroke="var(--ink-pencil)" stroke-width="1" stroke-linecap="round" />
      <path d="M2 50 L6 58 L10 50" fill="none" stroke="var(--ink-pencil)" stroke-width="1" stroke-linecap="round" />
    </svg>
    <p class="cue-text">{t(dict, 'scrollCue')}</p>
  </div>
</section>

<style>
  .cover {
    position: relative;
    min-height: 100vh;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: 6rem 1.5rem 4rem;
  }
  .ambient {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.18;
    pointer-events: none;
  }
  .content {
    position: relative;
    text-align: center;
    z-index: 2;
    max-width: 60rem;
  }
  .kicker {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--ink-shade);
    margin-bottom: 3rem;
    opacity: 0;
    animation: fadeIn 1.2s ease 600ms forwards;
  }
  .margin-anchor {
    position: relative;
    margin-top: 4rem;
    height: 6rem;
    opacity: 0;
    animation: fadeIn 1.2s ease 6500ms forwards;
  }
  .scroll-cue {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 3;
    opacity: 0;
    animation: fadeIn 1.5s ease 7500ms forwards;
  }
  .cue-text {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    color: var(--ink-shade);
    text-transform: uppercase;
    letter-spacing: 0.25em;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
