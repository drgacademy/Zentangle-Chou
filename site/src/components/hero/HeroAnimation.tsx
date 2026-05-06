import React, { useEffect, useRef, useState } from 'react';

interface HeroAnimationProps {
  paused?: boolean;
  isReduced?: boolean;
}

export default function HeroAnimation({
  paused = false,
  isReduced = false
}: HeroAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(!isReduced);

  useEffect(() => {
    if (!svgRef.current || isReduced) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll<SVGPathElement>('[data-draw]');

    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.setProperty('--length', `${length}`);
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    setIsAnimating(true);
  }, [isReduced]);

  const handleReset = () => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement>('[data-draw]');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.animation = 'none';
      path.offsetHeight; // trigger reflow
      path.style.animation = '';
    });
  };

  // 暗模式檢查
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const strokeColor = isDark ? '#E8E6E1' : '#2E2D2A';

  if (isReduced) {
    return (
      <svg
        viewBox="0 0 800 600"
        className="w-full h-auto"
        style={{ maxWidth: '600px' }}
        aria-label="Hero Zentangle"
      >
        {/* 簡化版本 - 直接顯示最終狀態 */}
        <g opacity="0.3" pointerEvents="none">
          {/* 四個角點 */}
          <circle cx="20" cy="20" r="3" fill={strokeColor} />
          <circle cx="780" cy="20" r="3" fill={strokeColor} />
          <circle cx="780" cy="580" r="3" fill={strokeColor} />
          <circle cx="20" cy="580" r="3" fill={strokeColor} />

          {/* 邊框 */}
          <rect x="20" y="20" width="760" height="560" fill="none" stroke={strokeColor} strokeWidth="1" />

          {/* String 曲線 */}
          <path
            d="M 50 300 Q 200 150, 400 200 T 750 300"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.5"
          />
        </g>
      </svg>
    );
  }

  return (
    <div className="relative w-full" style={{ maxWidth: '600px' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-auto block"
        aria-label="Hero Zentangle Animation"
        role="img"
      >
        <defs>
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              [data-draw] {
                animation: none !important;
                stroke-dashoffset: 0 !important;
                opacity: 1 !important;
              }
            }

            /* 四個角點 fade in */
            .dot {
              fill: ${strokeColor};
              opacity: 0;
              animation: fadeIn 0.3s ease-out forwards;
            }
            .dot-1 { animation-delay: 0s; }
            .dot-2 { animation-delay: 0.15s; }
            .dot-3 { animation-delay: 0.3s; }
            .dot-4 { animation-delay: 0.45s; }

            /* 邊框繪製 */
            .border {
              fill: none;
              stroke: ${strokeColor};
              stroke-width: 1;
              opacity: 0;
              animation: fadeInAndDraw 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
            }

            /* String 曲線繪製 */
            .string {
              fill: none;
              stroke: ${strokeColor};
              stroke-width: 0.75;
              opacity: 0;
              animation: fadeInAndDraw 1.5s cubic-bezier(0.4, 0, 0.2, 1) 2s forwards;
            }

            /* Crescent Moon 路徑 */
            .crescent {
              fill: none;
              stroke: ${strokeColor};
              stroke-width: 0.75;
              opacity: 0;
            }
            .crescent-1 { animation: fadeInAndDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 3.6s forwards; }
            .crescent-2 { animation: fadeInAndDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 4.1s forwards; }
            .crescent-3 { animation: fadeInAndDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 4.6s forwards; }
            .crescent-4 { animation: fadeInAndDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 5.1s forwards; }

            /* Hollibaugh 路徑 */
            .hollibaugh {
              fill: none;
              stroke: ${strokeColor};
              stroke-width: 0.75;
              opacity: 0;
            }
            .hollibaugh-1 { animation: fadeInAndDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 5.2s forwards; }
            .hollibaugh-2 { animation: fadeInAndDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 5.7s forwards; }
            .hollibaugh-3 { animation: fadeInAndDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 6.2s forwards; }

            /* Shading */
            .shading {
              opacity: 0;
              animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 7s forwards;
              fill: ${strokeColor};
            }

            /* Signature */
            .signature {
              fill: none;
              stroke: ${strokeColor};
              stroke-width: 0.5;
              opacity: 0;
              animation: fadeInAndDraw 1.5s cubic-bezier(0.4, 0, 0.2, 1) 8s forwards;
            }

            /* H1 和 subtitle */
            .text-content {
              opacity: 0;
            }
            .text-h1 {
              animation: fadeIn 0.8s ease-out 9s forwards;
            }
            .text-subtitle {
              animation: fadeIn 0.8s ease-out 9.4s forwards;
            }

            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes fadeInAndDraw {
              from {
                opacity: 0;
                stroke-dashoffset: var(--length, 1000);
              }
              to {
                opacity: 1;
                stroke-dashoffset: 0;
              }
            }

            /* 行動版（< 768px）壓縮到 5 秒 */
            @media (max-width: 767px) {
              .dot-1 { animation-delay: 0s; }
              .dot-2 { animation-delay: 0.1s; }
              .dot-3 { animation-delay: 0.2s; }
              .dot-4 { animation-delay: 0.3s; }
              .border { animation-delay: 0.4s !important; animation-duration: 0.7s !important; }
              .string { animation-delay: 1s !important; animation-duration: 0.9s !important; }
              .crescent-1 { animation-delay: 1.8s !important; }
              .crescent-2 { animation-delay: 2.1s !important; }
              .crescent-3 { animation-delay: 2.4s !important; }
              .crescent-4 { animation-delay: 2.7s !important; }
              .hollibaugh-1 { animation-delay: 2.9s !important; }
              .hollibaugh-2 { animation-delay: 3.1s !important; }
              .hollibaugh-3 { animation-delay: 3.3s !important; }
              .shading { animation-delay: 3.5s !important; }
              .signature { animation-delay: 3.8s !important; animation-duration: 0.9s !important; }
              .text-h1 { animation-delay: 4.5s !important; }
              .text-subtitle { animation-delay: 4.75s !important; }
            }
          `}</style>
        </defs>

        {/* 四個角點 */}
        <circle cx="20" cy="20" r="3" className="dot dot-1" />
        <circle cx="780" cy="20" r="3" className="dot dot-2" />
        <circle cx="780" cy="580" r="3" className="dot dot-3" />
        <circle cx="20" cy="580" r="3" className="dot dot-4" />

        {/* 邊框 */}
        <rect
          x="20"
          y="20"
          width="760"
          height="560"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          className="border"
          data-draw
        />

        {/* String 曲線 */}
        <path
          d="M 50 300 Q 150 150, 300 200 Q 500 180, 700 250"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.75"
          className="string"
          data-draw
        />

        {/* Crescent Moon（4 個路徑） */}
        <g id="crescent-moon">
          <path
            d="M 200 150 Q 210 145, 220 150"
            className="crescent crescent-1"
            data-draw
          />
          <path
            d="M 210 160 Q 220 155, 230 160"
            className="crescent crescent-2"
            data-draw
          />
          <path
            d="M 220 170 Q 230 165, 240 170"
            className="crescent crescent-3"
            data-draw
          />
          <path
            d="M 215 180 Q 225 175, 235 180"
            className="crescent crescent-4"
            data-draw
          />
        </g>

        {/* Hollibaugh（3 個路徑） */}
        <g id="hollibaugh">
          <path
            d="M 550 300 L 570 280 L 590 300 L 570 320 Z"
            className="hollibaugh hollibaugh-1"
            data-draw
          />
          <path
            d="M 570 300 L 575 295 L 580 300 L 575 305 Z"
            className="hollibaugh hollibaugh-2"
            data-draw
          />
          <path
            d="M 580 300 L 585 295 L 590 300 L 585 305 Z"
            className="hollibaugh hollibaugh-3"
            data-draw
          />
        </g>

        {/* Shading（半透明） */}
        <ellipse
          cx="400"
          cy="400"
          rx="120"
          ry="80"
          fill={strokeColor}
          opacity="0.08"
          className="shading"
        />

        {/* Signature */}
        <path
          d="M 650 480 Q 660 475, 670 480 Q 680 485, 690 480"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.5"
          className="signature"
          data-draw
        />
      </svg>

      {/* 文字疊層 - 放在 SVG 上方 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <h1 className="text-content text-h1 font-display-zh md:text-4xl text-ink-700 dark:text-ink-50">
          一筆一畫，皆是可能
        </h1>
        <p className="text-content text-subtitle text-sm md:text-base text-ink-500 dark:text-ink-400 mt-4">
          YuChiao Chou 的禪繞畫作品集
        </p>
      </div>

      {/* 暫停/重播按鈕（可選） */}
      {isAnimating && (
        <button
          onClick={handleReset}
          className="absolute bottom-4 right-4 px-3 py-1.5 text-xs bg-ink-100 dark:bg-ink-700 text-ink-700 dark:text-ink-100 rounded hover:bg-ink-200 dark:hover:bg-ink-600 transition-colors"
          aria-label="Replay animation"
        >
          ↻
        </button>
      )}
    </div>
  );
}
