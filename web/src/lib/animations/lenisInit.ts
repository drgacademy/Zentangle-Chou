import Lenis from 'lenis';
import { getGsap, ScrollTrigger } from './gsapClient';
import { browser } from '$app/environment';

let lenis: Lenis | null = null;

export function startLenis() {
  if (!browser || lenis) return lenis;
  lenis = new Lenis({
    autoRaf: false,
    duration: 1.4,
    smoothWheel: true,
    syncTouch: false
  });
  const gsap = getGsap();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function stopLenis() {
  lenis?.destroy();
  lenis = null;
}
