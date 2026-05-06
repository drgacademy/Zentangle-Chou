import React from 'react';

interface SketchBorderProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  strokeWidth?: number;
  jitterAmount?: number;
}

export default function SketchBorder({
  children,
  className = '',
  borderColor = 'currentColor',
  strokeWidth = 1.5,
  jitterAmount = 1.2,
}: SketchBorderProps) {
  // 生成手繪路徑：在矩形邊框上加入隨機抖動
  const generateSketchBorderPath = (width: number, height: number): string => {
    const points = [];
    const segmentLength = 15;
    const jitter = jitterAmount;

    // 上邊：左到右
    for (let x = 0; x <= width; x += segmentLength) {
      const nextX = Math.min(x + segmentLength, width);
      const y = Math.random() * jitter - jitter / 2;
      points.push({ x: nextX, y });
    }

    // 右邊：上到下
    for (let y = 0; y <= height; y += segmentLength) {
      const nextY = Math.min(y + segmentLength, height);
      const x = width + (Math.random() * jitter - jitter / 2);
      points.push({ x, y: nextY });
    }

    // 下邊：右到左
    for (let x = width; x >= 0; x -= segmentLength) {
      const nextX = Math.max(x - segmentLength, 0);
      const y = height + (Math.random() * jitter - jitter / 2);
      points.push({ x: nextX, y });
    }

    // 左邊：下到上
    for (let y = height; y >= 0; y -= segmentLength) {
      const nextY = Math.max(y - segmentLength, 0);
      const x = Math.random() * jitter - jitter / 2;
      points.push({ x, y: nextY });
    }

    // 閉合路徑
    points.push({ x: points[0].x, y: points[0].y });

    return points.map((p, i) => `${p.x},${p.y}`).join(' L ');
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        <defs>
          {/* 手繪效果濾鏡：用於產生粗糙邊線感 */}
          <filter id="sketch-effect">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" />
          </filter>
        </defs>

        {/* 背景裝飾線 - 虛線效果 */}
        <polyline
          points={generateSketchBorderPath(100, 100)}
          fill="none"
          stroke={borderColor}
          strokeWidth={strokeWidth}
          strokeDasharray="4,2"
          opacity="0.15"
          style={{ filter: 'url(#sketch-effect)' }}
        />

        {/* 主邊框線 */}
        <polyline
          points={generateSketchBorderPath(100, 100)}
          fill="none"
          stroke={borderColor}
          strokeWidth={strokeWidth}
          opacity="0.4"
          style={{ filter: 'url(#sketch-effect)' }}
        />
      </svg>

      {/* 內容容器 */}
      <div className="relative px-4 py-4">{children}</div>
    </div>
  );
}
