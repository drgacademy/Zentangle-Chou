import React, { useEffect, useState } from 'react';

interface InkTransitionProps {
  children?: React.ReactNode;
  isActive?: boolean;
  duration?: number;
  onTransitionEnd?: () => void;
}

export default function InkTransition({
  children,
  isActive = true,
  duration = 1.2,
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
      {/* 頁面首次載入時的全屏墨暈動畫 */}
      {isAnimating && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, var(--color-bg) 100%)',
            animation: `inkBloom ${duration}s ease-out forwards`,
          }}
        />
      )}

      {children}

      <style>{`
        @keyframes inkBloom {
          0% {
            background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, var(--color-bg) 30%);
          }
          40% {
            background: radial-gradient(circle at center, rgba(0, 0, 0, 0.5) 0%, var(--color-bg) 60%);
          }
          70% {
            background: radial-gradient(circle at center, rgba(0, 0, 0, 0.2) 0%, var(--color-bg) 80%);
          }
          100% {
            background: radial-gradient(circle at center, transparent 0%, var(--color-bg) 100%);
          }
        }

        @keyframes inkBloomDark {
          0% {
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, var(--color-bg) 30%);
          }
          40% {
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.5) 0%, var(--color-bg) 60%);
          }
          70% {
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, var(--color-bg) 80%);
          }
          100% {
            background: radial-gradient(circle at center, transparent 0%, var(--color-bg) 100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes inkBloom {
            0%, 100% {
              background: var(--color-bg);
            }
          }
          @keyframes inkBloomDark {
            0%, 100% {
              background: var(--color-bg);
            }
          }
        }
      `}</style>
    </>
  );
}
