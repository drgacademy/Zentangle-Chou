import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  drawBorder?: boolean;
  drawDelay?: number;
}

/**
 * ScrollReveal — 滾動進入視窗時觸發「筆觸繪製」動畫
 * drawBorder: 在元素周圍畫出像紙磚邊框一樣的線條
 */
export default function ScrollReveal({
  children,
  className = '',
  drawBorder = true,
  drawDelay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

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
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [drawDelay, hasAnimated]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* 邊框繪製 SVG */}
      {drawBorder && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className={`text-ink-300 dark:text-ink-600 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-40' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: isVisible ? '0' : '2000',
              strokeDashoffset: isVisible ? '0' : '2000',
              transitionProperty: 'stroke-dasharray, stroke-dashoffset, opacity',
              transitionDuration: '1.5s',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            rx="2"
          />
        </svg>
      )}

      {/* 內容淡入 + 上移 */}
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
        style={{
          transitionDelay: drawBorder ? '0.3s' : '0s',
        }}
      >
        {children}
      </div>
    </div>
  );
}
