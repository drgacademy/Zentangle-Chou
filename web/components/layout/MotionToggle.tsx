"use client";

import { useEffect, useState } from "react";

type Pref = "auto" | "on" | "off";
const KEY = "motion-pref";

export default function MotionToggle({ dark = false }: { dark?: boolean }) {
  const [pref, setPref] = useState<Pref>("auto");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(KEY) as Pref)) || "auto";
    setPref(saved);
    apply(saved);
  }, []);

  const apply = (p: Pref) => {
    const reduce =
      p === "off" ||
      (p === "auto" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    document.documentElement.dataset.motion = reduce ? "reduce" : "full";
  };

  const cycle = () => {
    const next: Pref = pref === "auto" ? "on" : pref === "on" ? "off" : "auto";
    setPref(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    apply(next);
  };

  const label = pref === "auto" ? "auto" : pref === "on" ? "full" : "reduce";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Motion: ${label}`}
      title={`Motion: ${label}`}
      className={[
        "h-7 px-2 rounded-full border font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-300",
        dark
          ? "border-paper-tile/40 text-paper-tile hover:bg-paper-tile/10"
          : "border-ink-bleed text-ink-shade hover:bg-ink-bleed/40",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
