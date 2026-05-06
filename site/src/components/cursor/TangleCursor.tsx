import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  opacity: number;
}

export default function TangleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Only render on desktop
    const isDesktop = !matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lineWidth = 1.5;
    const lineColor = 'rgba(46, 45, 42, 0.4)'; // ink-600 with opacity
    const maxPoints = 200;
    const throttleMs = 16; // ~60fps
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const x = e.clientX;
      const y = e.clientY;

      // Add new point
      pointsRef.current.push({ x, y, opacity: 1 });

      // Cap points
      if (pointsRef.current.length > maxPoints) {
        pointsRef.current.shift();
      }

      lastPosRef.current = { x, y };
    };

    const handleWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw points
      const points = pointsRef.current;
      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        // Fade out
        point.opacity -= 0.02;

        if (point.opacity <= 0) {
          points.splice(i, 1);
          i--;
          continue;
        }

        // Draw line segment
        ctx.strokeStyle = lineColor.replace('0.4', String(point.opacity * 0.4));
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (i > 0) {
          const prevPoint = points[i - 1];
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
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
