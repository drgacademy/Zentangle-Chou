import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  t: number;
}

export default function TangleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Don't show on mobile or if reduced motion is preferred
    const isMobile = matchMedia('(pointer: coarse)').matches;
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    let lastT = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastT < 16) return; // throttle to ~60fps
      lastT = now;
      pointsRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      if (pointsRef.current.length > 200) pointsRef.current.shift();
    };

    window.addEventListener('mousemove', onMove);

    const draw = () => {
      const now = performance.now();
      const lifetime = 2000; // 2 second fade out

      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      pointsRef.current = pointsRef.current.filter(p => now - p.t < lifetime);

      if (pointsRef.current.length < 2) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < pointsRef.current.length; i++) {
        const p1 = pointsRef.current[i - 1];
        const p2 = pointsRef.current[i];
        const age = now - p2.t;
        const opacity = 1 - age / lifetime;
        ctx.strokeStyle = `rgba(46, 45, 42, ${opacity * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      aria-hidden="true"
    />
  );
}
