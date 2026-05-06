import React, { useEffect, useRef, useState } from 'react';

interface HandwritingRevealProps {
  text: string;
  className?: string;
  charDelay?: number;
  as?: keyof JSX.IntrinsicElements;
}

export default function HandwritingReveal({
  text,
  className = '',
  charDelay = 0.05,
  as: Component = 'div',
}: HandwritingRevealProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const ref = useRef<HTMLElement | HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || displayedChars >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayedChars(prev => prev + 1);
    }, charDelay * 1000);

    return () => clearTimeout(timer);
  }, [isVisible, displayedChars, text.length, charDelay]);

  const displayText = text.substring(0, displayedChars);
  const cursorVisible = isVisible && displayedChars < text.length;

  const commonStyles = {
    position: 'relative' as const,
    display: 'inline-block',
  };

  return (
    <Component
      ref={ref as any}
      className={className}
      style={commonStyles}
    >
      <span>{displayText}</span>
      {cursorVisible && (
        <span
          className="inline-block w-0.5 h-[1em] bg-current ml-0.5"
          style={{
            animation: 'blink 0.7s infinite',
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; }
        }
      `}</style>
    </Component>
  );
}
