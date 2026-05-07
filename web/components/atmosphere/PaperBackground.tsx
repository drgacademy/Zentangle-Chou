"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./PaperBackgroundInner"), {
  ssr: false,
  loading: () => null,
});

/**
 * Full-viewport, fixed-position R3F canvas that renders paper grain + warp
 * + edge vignette behind the entire app.  Lazy-mounted and SSR-disabled so
 * it never blocks LCP.
 */
export default function PaperBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Inner />
    </div>
  );
}
