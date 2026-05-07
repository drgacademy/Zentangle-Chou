<script lang="ts">
  import { onMount } from 'svelte';
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import { getGsap, ScrollTrigger } from '$lib/animations/gsapClient';
  import { t, type Lang } from '$lib/i18n';
  import { wobblyCircle } from '$lib/tangles/geometry';
  import { makeRng } from '$lib/tangles/rng';

  type Props = { dict: Record<string, unknown>; lang: Lang };
  let { dict, lang }: Props = $props();

  let host: HTMLElement | null = $state(null);
  let ensoPath: SVGPathElement | null = $state(null);
  let stamp: HTMLDivElement | null = $state(null);
  let wordmark: HTMLHeadingElement | null = $state(null);

  // Build a near-closed enso (Zen circle) — opens slightly at ~10 o'clock.
  const ensoD = (() => {
    const rng = makeRng('zentangle-chou-enso');
    const full = wobblyCircle(60, 60, 48, rng, 1.4, 60);
    // wobblyCircle returns "M ... L ... L ... Z". Drop the closing "Z" so the
    // ring stays open — that's the "single breath" gesture of the enso.
    return full.replace(/\s*Z\s*$/, '');
  })();

  onMount(() => {
    if (!host) return;
    if ($reducedMotion) {
      if (ensoPath) {
        ensoPath.style.strokeDasharray = '';
        ensoPath.style.strokeDashoffset = '';
      }
      return;
    }
    const gsap = getGsap();
    const tl = gsap.timeline({ paused: true });
    if (ensoPath) {
      try {
        const len = ensoPath.getTotalLength();
        ensoPath.style.strokeDasharray = String(len);
        ensoPath.style.strokeDashoffset = String(len);
        tl.to(ensoPath, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.out' });
      } catch {
        /* ignore */
      }
    }
    if (stamp) {
      gsap.set(stamp, { opacity: 0, scale: 0.7 });
      tl.to(stamp, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.4');
    }
    if (wordmark) {
      gsap.set(wordmark, { opacity: 0, y: 16 });
      tl.to(wordmark, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');
    }
    const trigger = ScrollTrigger.create({
      trigger: host,
      start: 'top 75%',
      once: true,
      onEnter: () => tl.play()
    });
    return () => {
      trigger.kill();
      tl.kill();
    };
  });
</script>

<section class="end-mark" bind:this={host} aria-label="signature">
  <div class="stamp-wrap" bind:this={stamp}>
    <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
      <path
        bind:this={ensoPath}
        d={ensoD}
        fill="none"
        stroke="var(--ink-red-stamp)"
        stroke-width="3"
        stroke-linecap="round"
      />
      <text
        x="60"
        y="68"
        text-anchor="middle"
        font-size="38"
        font-family="var(--font-masthead)"
        font-weight="600"
        fill="var(--ink-red-stamp)"
      >
        {t(dict, 'signature.stamp')}
      </text>
    </svg>
  </div>

  <h2 class="wordmark" bind:this={wordmark}>{t(dict, 'site.title')}</h2>
  <p class="tagline">{t(dict, 'hero.subtitle')}</p>
</section>

<style>
  .end-mark {
    background: var(--bg-spotlight);
    color: #f0e4c8;
    padding: clamp(5rem, 10vw, 8rem) 1.5rem clamp(3rem, 6vw, 5rem);
    text-align: center;
  }
  .stamp-wrap {
    display: inline-block;
    margin-bottom: 1.5rem;
  }
  .wordmark {
    font-family: var(--font-masthead);
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 600;
    margin: 0 0 0.4rem;
    letter-spacing: 0.04em;
    color: #f0e4c8;
  }
  .tagline {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: rgba(240, 228, 200, 0.55);
    margin: 0;
  }
</style>
