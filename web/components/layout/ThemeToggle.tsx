"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ dark = false }: { dark?: boolean }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
      className={[
        "h-7 w-7 rounded-full border text-[0.85rem] transition-colors duration-300",
        dark
          ? "border-paper-tile/40 text-paper-tile hover:bg-paper-tile/10"
          : "border-ink-bleed hover:bg-ink-bleed/40",
      ].join(" ")}
    >
      {isDark ? "☾" : "☀"}
    </button>
  );
}
