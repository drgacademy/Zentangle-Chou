import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  opacity: number;
  width: number; // 墨線粗細
  age: number;
}

export default function TangleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const isDesktop = !matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const maxPoints = 80;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTime;
      if (dt < 10) return; // ~100fps max
      lastTime = now;

      const x = e.clientX;
      const y = e.clientY;
      const prev = lastPosRef.current;
      const dist = Math.hypot(x - prev.x, y - prev.y);
      const speed = dist / Math.max(dt, 1);

      // 墨線粗細：速度慢則粗，快則細
      // speed 範圍約 0 ~ 5 px/ms
      const baseWidth = 3;
      const minWidth = 0.5;
      const width = Math.max(minWidth, baseWidth - speed * 0.8);

      // 加入隨機擾動，模擬手抖
      const jitter = (Math.random() - 0.5) * 0.5;

      pointsRef.current.push({
        x: x + jitter,
        y: y + jitter,
        opacity: 1,
        width,
        age: 0,
      });

      if (pointsRef.current.length > maxPoints) {
        pointsRef.current.shift();
      }

      lastPosRef.current = { x, y, time: now };
    };

    const handleWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      if (points.length < 2) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // 使用 quadratic curves 讓線條更平滑、有機
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const prevPoint = points[i - 1];

        point.age += 1;
        point.opacity -= 0.008; // 緩慢淡出

        if (point.opacity <= 0) {
          points.splice(i, 1);
          i--;
          continue;
        }

        // 動態顏色：暗模式用淺灰，亮模式用深灰
        const isDark = document.documentElement.classList.contains('dark');
        const r = isDark ? 232 : 46;
        const g = isDark ? 230 : 45;
        const b = isDark ? 225 : 42;

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${point.opacity * 0.35})`;
        ctx.lineWidth = point.width * point.opacity;

        // 用 midpoint 畫 quadratic curve，更柔順
        const midX = (prevPoint.x + point.x) / 2;
        const midY = (prevPoint.y + point.y) / 2;

        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.quadraticCurveTo(midX, midY, point.x, point.y);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleWindowResize);

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleWindowResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ cursor: 'none' }}
    />
  );
}
