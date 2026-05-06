import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  drawBorder?: boolean;
  drawDelay?: number;
  withInkBlur?: boolean;
  withDots?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  drawBorder = true,
  drawDelay = 0,
  withInkBlur = true,
  withDots = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [sketchPath, setSketchPath] = useState('');
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  // 生成手繪不規則邊框路徑（加入微細抖動）
  const generateSketchPath = (width: number, height: number) => {
    const jitter = 1.5; // 抖動幅度
    const points = [];

    // 上邊
    for (let x = 0; x <= width; x += 20) {
      const y = Math.random() * jitter - jitter / 2;
      points.push(`${x},${y}`);
    }
    points.push(`${width},0`);

    // 右邊
    for (let y = 0; y <= height; y += 20) {
      const x = width + (Math.random() * jitter - jitter / 2);
      points.push(`${x},${y}`);
    }
    points.push(`${width},${height}`);

    // 下邊
    for (let x = width; x >= 0; x -= 20) {
      const y = height + (Math.random() * jitter - jitter / 2);
      points.push(`${x},${y}`);
    }
    points.push(`0,${height}`);

    // 左邊
    for (let y = height; y >= 0; y -= 20) {
      const x = Math.random() * jitter - jitter / 2;
      points.push(`${x},${y}`);
    }
    points.push(`0,0`);

    return points.join(' L ');
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
            if (drawBorder && svgRef.current) {
              const svg = svgRef.current;
              const width = svg.clientWidth;
              const height = svg.clientHeight;
              setSvgSize({ width, height });
              setSketchPath(generateSketchPath(width, height));
            }
          }, drawDelay);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [drawDelay, hasAnimated, drawBorder]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {drawBorder && (
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          {withInkBlur && isVisible && (
            <defs>
              <filter id="ink-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
              </filter>
            </defs>
          )}

          <polyline
            points={sketchPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`text-ink-300 dark:text-ink-600 transition-all ease-out ${
              isVisible ? 'opacity-40' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: isVisible ? '0' : '2000',
              strokeDashoffset: isVisible ? '0' : '2000',
              transitionProperty: 'stroke-dasharray, stroke-dashoffset, opacity',
              transitionDuration: '1.5s',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              filter: withInkBlur && isVisible ? 'url(#ink-blur)' : 'none',
            }}
          />

          {withDots && isVisible && (
            <>
              <circle cx="8" cy="8" r="2" fill="currentColor" className="text-ink-400 dark:text-ink-500" style={{ opacity: 0.3 }} />
              <circle cx={svgSize.width - 8} cy="8" r="1.5" fill="currentColor" className="text-ink-400 dark:text-ink-500" style={{ opacity: 0.25 }} />
              <circle cx="8" cy={svgSize.height - 8} r="1.5" fill="currentColor" className="text-ink-400 dark:text-ink-500" style={{ opacity: 0.25 }} />
              <circle cx={svgSize.width - 8} cy={svgSize.height - 8} r="2" fill="currentColor" className="text-ink-400 dark:text-ink-500" style={{ opacity: 0.3 }} />
            </>
          )}
        </svg>
      )}

      {/* 內容淡入 + 上移 + 輕微墨暈 */}
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
        style={{
          transitionDelay: drawBorder ? '0.3s' : '0s',
          filter: withInkBlur && isVisible ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.05))' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
