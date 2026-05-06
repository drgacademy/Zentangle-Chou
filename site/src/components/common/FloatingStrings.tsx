import React, { useEffect, useRef } from 'react';

/**
 * FloatingStrings — 背景緩慢飄動的有機曲線
 * 像禪繞畫的 string 一樣，營造寧靜氛圍
 */
export default function FloatingStrings() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 產生有機曲線 path data
    const generateOrganicPath = (seed: number): string => {
      const points: string[] = [];
      const segments = 6;
      const width = 1200;
      const height = 800;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = t * width + (Math.sin(seed + i * 1.5) * 80);
        const y = height / 2 + (Math.cos(seed + i * 2.3) * 150) + (Math.sin(seed * 2 + i) * 60);
        points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      return points.join(' ');
    };

    // 產生柔和的二次貝茲曲線
    const generateBezierPath = (seed: number): string => {
      const width = 1200;
      const height = 800;
      const yBase = 200 + (seed % 3) * 200;

      let d = `M -50 ${yBase}`;
      for (let i = 0; i < 5; i++) {
        const cx1 = (i * 250) + 80 + Math.sin(seed + i) * 60;
        const cy1 = yBase + Math.cos(seed + i * 1.7) * 100;
        const cx2 = (i * 250) + 170 + Math.sin(seed + i + 1) * 50;
        const cy2 = yBase + Math.cos(seed + i * 1.3) * 120;
        const x = (i + 1) * 250;
        const y = yBase + Math.sin(seed + i * 0.8) * 40;
        d += ` C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      return d;
    };

    const paths = svg.querySelectorAll<SVGPathElement>('.floating-string');
    const pathData: string[] = [];

    paths.forEach((path, i) => {
      const d = generateBezierPath(i * 2.7 + 1);
      pathData.push(d);
      path.setAttribute('d', d);
    });

    // 緩慢飄動動畫
    let offset = 0;
    const animate = () => {
      offset += 0.0003; // 極慢，禪意
      paths.forEach((path, i) => {
        const baseD = pathData[i];
        // 簡單的 Y 軸偏移
        const yShift = Math.sin(offset + i * 1.5) * 15;
        // 使用 transform 而不是重算 path（效能更好）
        path.style.transform = `translateY(${yShift}px)`;
      });
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 0,
        opacity: 0.06,
      }}
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="floating-string text-ink-400 dark:text-ink-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        style={{ transition: 'transform 3s ease-in-out' }}
      />
      <path
        className="floating-string text-ink-300 dark:text-ink-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        style={{ transition: 'transform 3s ease-in-out', animationDelay: '1s' }}
      />
      <path
        className="floating-string text-sepia-300 dark:text-sepia-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        style={{ transition: 'transform 3s ease-in-out', animationDelay: '2s' }}
      />
    </svg>
  );
}
