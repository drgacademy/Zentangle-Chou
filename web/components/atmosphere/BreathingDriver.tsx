"use client";

import { useEffect } from "react";

/**
 * Drives the global --breath-phase CSS variable in a slow sine cycle so
 * any element can sync subtle scaling / opacity to the site's breathing.
 * Pauses if reduced motion is requested.
 */
export default function BreathingDriver() {
  useEffect(() => {
    const reduce = () => document.documentElement.dataset.motion === "reduce";
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (!reduce()) {
        const t = (now - start) / 1000;
        // 0..1..0 cycle every 8s.
        const phase = (Math.sin((t / 4) * Math.PI) + 1) / 2;
        document.documentElement.style.setProperty("--breath-phase", phase.toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}
