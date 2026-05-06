import React, { useEffect, useState } from 'react';

interface InkTransitionProps {
  children?: React.ReactNode;
  isActive?: boolean;
  duration?: number;
  onTransitionEnd?: () => void;
}

/**
 * InkTransition — a two-stage page entrance:
 *   stage 1 (0–40% of duration): a transparent water-mark radiates from center,
 *   stage 2 (40–100%): ink blooms into the water and dissipates into the page.
 * The two stages overlap so it reads as "ink falling into water".
 */
export default function InkTransition({
  children,
  isActive = true,
  duration = 1.4,
  onTransitionEnd,
}: InkTransitionProps) {
  const [isAnimating, setIsAnimating] = useState(isActive);

  useEffect(() => {
    if (!isActive) {
      setIsAnimating(false);
      return;
    }
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onTransitionEnd?.();
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [isActive, duration, onTransitionEnd]);

  return (
    <>
      {isAnimating && (
        <>
          <div
            className="fixed inset-0 pointer-events-none z-[60]"
            style={{ animation: `ink-water ${duration}s ease-out forwards` }}
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 pointer-events-none z-[61]"
            style={{
              animation: `ink-bloom ${duration}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
              animationDelay: `${duration * 0.18}s`,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {children}

      <style>{`
        :root {
          --ink-water-rgb: 220, 215, 200;
          --ink-bloom-rgb: 26, 26, 26;
        }
        .dark {
          --ink-water-rgb: 60, 55, 50;
          --ink-bloom-rgb: 242, 239, 233;
        }

        @keyframes ink-water {
          0%   { background: radial-gradient(circle at center, rgba(var(--ink-water-rgb), 0.75) 0%, rgba(var(--ink-water-rgb), 0) 12%); }
          50%  { background: radial-gradient(circle at center, rgba(var(--ink-water-rgb), 0.35) 0%, rgba(var(--ink-water-rgb), 0) 55%); }
          100% { background: radial-gradient(circle at center, rgba(var(--ink-water-rgb), 0) 0%, rgba(var(--ink-water-rgb), 0) 100%); }
        }

        @keyframes ink-bloom {
          0%   { background: radial-gradient(circle at center, rgba(var(--ink-bloom-rgb), 0.85) 0%, rgba(var(--ink-bloom-rgb), 0) 4%); }
          35%  { background: radial-gradient(circle at center, rgba(var(--ink-bloom-rgb), 0.55) 0%, rgba(var(--ink-bloom-rgb), 0) 38%); }
          70%  { background: radial-gradient(circle at center, rgba(var(--ink-bloom-rgb), 0.2) 0%, rgba(var(--ink-bloom-rgb), 0) 75%); }
          100% { background: radial-gradient(circle at center, rgba(var(--ink-bloom-rgb), 0) 0%, rgba(var(--ink-bloom-rgb), 0) 100%); }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes ink-water { 0%, 100% { background: transparent; } }
          @keyframes ink-bloom { 0%, 100% { background: transparent; } }
        }
      `}</style>
    </>
  );
}
