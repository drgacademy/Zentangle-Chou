import React, { useEffect, useState } from 'react';

export default function ScrollInkLines() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY * 0.3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 生成有機波浪曲線
  const generateWavePath = (isLeft: boolean): string => {
    const points = [];
    const amplitude = 15;
    const frequency = 0.02;
    const startX = isLeft ? 0 : 100;
    const xDirection = isLeft ? 1 : -1;

    for (let y = 0; y <= 100; y += 5) {
      const wave = amplitude * Math.sin(y * frequency);
      const x = startX + wave * xDirection;
      points.push(`${x},${y}`);
    }

    return points.join(' L ');
  };

  return (
    <>
      {/* 左側裝飾線 */}
      <div
        className="fixed left-0 top-0 h-screen w-32 pointer-events-none hidden lg:block"
        style={{
          transform: `translateY(${scrollY}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="left-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 背景虛線 */}
          <polyline
            points={generateWavePath(true)}
            fill="none"
            stroke="url(#left-gradient)"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.2"
          />

          {/* 主線條：粗細變化 */}
          <g opacity="0.35">
            <polyline
              points={generateWavePath(true)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* 裝飾點 */}
          <g opacity="0.25" className="text-ink-400">
            {[10, 30, 50, 70, 90].map((y) => (
              <circle key={y} cx={15 + Math.sin(y * 0.02) * 8} cy={y} r="1.5" fill="currentColor" />
            ))}
          </g>
        </svg>
      </div>

      {/* 右側裝飾線 */}
      <div
        className="fixed right-0 top-0 h-screen w-32 pointer-events-none hidden lg:block"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="right-gradient" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 背景虛線 */}
          <polyline
            points={generateWavePath(false)}
            fill="none"
            stroke="url(#right-gradient)"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.2"
          />

          {/* 主線條：粗細變化 */}
          <g opacity="0.35">
            <polyline
              points={generateWavePath(false)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* 裝飾點 */}
          <g opacity="0.25" className="text-ink-400">
            {[15, 35, 55, 75, 95].map((y) => (
              <circle key={y} cx={85 - Math.sin(y * 0.02) * 8} cy={y} r="1.5" fill="currentColor" />
            ))}
          </g>
        </svg>
      </div>
    </>
  );
}
