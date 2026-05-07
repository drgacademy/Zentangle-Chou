import React, { useEffect, useRef, useState } from 'react';

interface HandwritingRevealProps {
  text: string;
  className?: string;
  charDelay?: number;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Returns a per-character delay multiplier. CJK ideographs (which take more
 * brush strokes) get a longer pause; punctuation and whitespace are quick.
 * This makes Chinese text feel hand-written rather than type-written.
 */
function charWeight(ch: string): number {
  const code = ch.charCodeAt(0);
  // Whitespace / punctuation
  if (/\s/.test(ch)) return 0.6;
  if (/[、。,.!?;:""''「」『』()()]/.test(ch)) return 0.8;
  // CJK Unified Ideographs (U+4E00–U+9FFF) — most Chinese characters
  if (code >= 0x4e00 && code <= 0x9fff) return 2.4;
  // CJK Extension A
  if (code >= 0x3400 && code <= 0x4dbf) return 2.6;
  // Hiragana / Katakana — simpler than kanji but still hand-written
  if (code >= 0x3040 && code <= 0x30ff) return 1.6;
  // Default Latin
  return 1.0;
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
        if (entry.isIntersecting && !isVisible) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || displayedChars >= text.length) return;
    const nextChar = text.charAt(displayedChars);
    // weight + tiny random variation makes it feel less mechanical
    const wait = charDelay * 1000 * charWeight(nextChar) * (0.85 + Math.random() * 0.3);
    const timer = setTimeout(() => {
      setDisplayedChars(prev => prev + 1);
    }, wait);
    return () => clearTimeout(timer);
  }, [isVisible, displayedChars, text, charDelay]);

  const displayText = text.substring(0, displayedChars);
  const cursorVisible = isVisible && displayedChars < text.length;

  return (
    <Component
      ref={ref as any}
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <span>{displayText}</span>
      {cursorVisible && (
        <span
          className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-text-bottom"
          style={{ animation: 'hw-blink 0.7s infinite', verticalAlign: '-0.1em' }}
        />
      )}
      <style>{`
        @keyframes hw-blink {
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
