import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  opacity: number;
  width: number;
  age: number;
}

interface InkPool {
  x: number;
  y: number;
  born: number;
  radius: number;
  opacity: number;
}

/**
 * TangleCursor — desktop ink trail that responds like a dip pen:
 *   - moving slow → thicker stroke, with a touch of ink pooling
 *   - moving fast → thin, dry line
 *   - holding still → a slowly blooming ink pool appears at the cursor
 */
export default function TangleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const poolsRef = useRef<InkPool[]>([]);
  const lastMoveTime = useRef<number>(Date.now());
  const lastPosRef = useRef({ x: -100, y: -100, time: Date.now() });
  const animationFrameRef = useRef<number>();
  const stoppedAt = useRef<number | null>(null);

  useEffect(() => {
    const isDesktop = !matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    const maxPoints = 90;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTime;
      if (dt < 8) return;
      lastTime = now;
      lastMoveTime.current = now;
      stoppedAt.current = null;

      const x = e.clientX;
      const y = e.clientY;
      const prev = lastPosRef.current;
      const dist = Math.hypot(x - prev.x, y - prev.y);
      const speed = dist / Math.max(dt, 1);

      // Pressure curve: slow → thicker (max 3.2), fast → thin (min 0.4).
      // Cap at 3.5 px/ms so very fast flicks don't underflow.
      const cappedSpeed = Math.min(3.5, speed);
      const t = 1 - cappedSpeed / 3.5;
      const width = 0.4 + Math.pow(t, 1.6) * 2.8;

      const jitter = (Math.random() - 0.5) * 0.3;

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

    const handleMouseLeave = () => {
      stoppedAt.current = null;
    };

    const animate = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');
      const r = isDark ? 232 : 26;
      const g = isDark ? 230 : 26;
      const b = isDark ? 225 : 26;

      // Trail
      const points = pointsRef.current;
      if (points.length >= 2) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < points.length; i++) {
          const point = points[i];
          const prevPoint = points[i - 1];
          point.age += 1;
          point.opacity -= 0.009;
          if (point.opacity <= 0) {
            points.splice(i, 1);
            i--;
            continue;
          }
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${point.opacity * 0.45})`;
          ctx.lineWidth = point.width * point.opacity;
          const midX = (prevPoint.x + point.x) / 2;
          const midY = (prevPoint.y + point.y) / 2;
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.quadraticCurveTo(midX, midY, point.x, point.y);
          ctx.stroke();
        }
      }

      // Ink pool: when cursor has been still for 250ms, start growing a pool
      const stillFor = now - lastMoveTime.current;
      if (stillFor > 250 && lastPosRef.current.x > -50) {
        if (stoppedAt.current === null) {
          stoppedAt.current = now;
          poolsRef.current.push({
            x: lastPosRef.current.x,
            y: lastPosRef.current.y,
            born: now,
            radius: 0.5,
            opacity: 0,
          });
        }
      }

      // Update + render pools
      const livePools: InkPool[] = [];
      for (const pool of poolsRef.current) {
        const age = (now - pool.born) / 1000;
        if (age > 2.6) continue;
        // grow logarithmically, cap radius
        pool.radius = Math.min(7, 0.5 + Math.log(1 + age * 4) * 2.2);
        // fade in (0..0.6s) hold, then fade out
        if (age < 0.6) pool.opacity = age / 0.6 * 0.55;
        else if (age < 1.6) pool.opacity = 0.55;
        else pool.opacity = 0.55 * (1 - (age - 1.6) / 1.0);
        livePools.push(pool);

        const grad = ctx.createRadialGradient(pool.x, pool.y, 0, pool.x, pool.y, pool.radius * 2);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${pool.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pool.x, pool.y, pool.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      poolsRef.current = livePools;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
