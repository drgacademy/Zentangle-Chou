import React, { useEffect, useMemo, useRef, useState } from 'react';
import { rngFromSeed, sectionDivider } from '@/lib/tangles';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * If true, draws a hand-drawn "string" divider above the content as it
   * enters viewport. Replaces the old `drawBorder` prop — kept for backward
   * compat with existing pages.
   */
  drawBorder?: boolean;
  drawDivider?: boolean;
  drawDelay?: number;
  withInkBlur?: boolean;
  /** kept for backward compat, no longer renders corner dots */
  withDots?: boolean;
  seed?: string;
}

/**
 * ScrollReveal — fades content up as it enters the viewport, optionally
 * drawing a flowing "string" divider above it (replacing the old border).
 */
export default function ScrollReveal({
  children,
  className = '',
  drawBorder,
  drawDivider,
  drawDelay = 0,
  withInkBlur = false,
  seed,
}: ScrollRevealProps) {
  // honor either prop name — drawBorder used to mean "draw something
  // decorative around this block". Now it means "draw a divider above".
  const showDivider = drawDivider ?? drawBorder ?? false;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const dividerD = useMemo(() => {
    const rng = rngFromSeed(seed ?? 'divider-' + Math.random().toString(36).slice(2, 8));
    return sectionDivider(800, rng, 28);
  }, [seed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, drawDelay);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [drawDelay, hasAnimated]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {showDivider && (
        <div
          className="zen-divider hand-drawn"
          aria-hidden="true"
          style={{ marginBottom: '2.5rem' }}
        >
          <svg viewBox="0 0 800 28" preserveAspectRatio="none">
            <path
              d={dividerD}
              style={{
                strokeDasharray: 1200,
                strokeDashoffset: isVisible ? 0 : 1200,
                opacity: isVisible ? 0.55 : 0,
                transitionProperty: 'stroke-dashoffset, opacity',
                transitionDuration: '1.4s',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </svg>
        </div>
      )}

      <div
        className={`transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          transitionDelay: showDivider ? '0.35s' : '0s',
          filter: withInkBlur && isVisible ? 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.04))' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
