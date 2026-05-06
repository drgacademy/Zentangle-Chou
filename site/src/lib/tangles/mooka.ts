import type { Pt, Rect, TangleOptions } from './types';
import { fmt, moveTo, quadTo } from './path';
import { randRange } from './random';

/**
 * Mooka — long organic bulb/tendril shapes that taper like calligraphic
 * leaves. Each mooka is a teardrop body with one or two curling tendrils
 * sweeping out, evoking Art Nouveau vines.
 */
export function mooka(rect: Rect, opts: TangleOptions): string {
  const { rng, stroke = 'currentColor', strokeWidth = 1.0, density = 1 } = opts;
  const target = Math.max(2, Math.floor(rect.w * rect.h * 0.0006 * density));
  const placed: { cx: number; cy: number; size: number; angle: number }[] = [];

  for (let i = 0; i < target * 5 && placed.length < target; i++) {
    const size = randRange(rng, 28, 60);
    const cx = randRange(rng, rect.x + size, rect.x + rect.w - size);
    const cy = randRange(rng, rect.y + size, rect.y + rect.h - size);
    const angle = randRange(rng, 0, Math.PI * 2);
    let ok = true;
    for (const q of placed) {
      if (Math.hypot(q.cx - cx, q.cy - cy) < (q.size + size) * 0.7) {
        ok = false;
        break;
      }
    }
    if (ok) placed.push({ cx, cy, size, angle });
  }

  const parts: string[] = [];
  for (const m of placed) {
    parts.push(drawSingleMooka(m.cx, m.cy, m.size, m.angle, rng));
  }
  return `<g stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round">${parts.join('')}</g>`;
}

function drawSingleMooka(cx: number, cy: number, size: number, angle: number, rng: () => number): string {
  // Body: a teardrop oriented along `angle`
  const tipX = cx + Math.cos(angle) * size;
  const tipY = cy + Math.sin(angle) * size;
  const baseAngle = angle + Math.PI;
  const baseX = cx + Math.cos(baseAngle) * size * 0.4;
  const baseY = cy + Math.sin(baseAngle) * size * 0.4;
  const sideOffset = size * 0.5;
  const nx = -Math.sin(angle);
  const ny = Math.cos(angle);

  const left: Pt = { x: cx + nx * sideOffset, y: cy + ny * sideOffset };
  const right: Pt = { x: cx - nx * sideOffset, y: cy - ny * sideOffset };

  // Outer teardrop (one wobbly closed curve)
  let body = moveTo({ x: baseX, y: baseY });
  body += ' ' + quadTo(
    { x: left.x + Math.cos(angle) * size * 0.3, y: left.y + Math.sin(angle) * size * 0.3 },
    { x: tipX, y: tipY }
  );
  body += ' ' + quadTo(
    { x: right.x + Math.cos(angle) * size * 0.3, y: right.y + Math.sin(angle) * size * 0.3 },
    { x: baseX, y: baseY }
  );

  // Inner echo (aura)
  const innerScale = 0.65;
  const innerTipX = cx + Math.cos(angle) * size * innerScale;
  const innerTipY = cy + Math.sin(angle) * size * innerScale;
  const innerLeft: Pt = { x: cx + nx * sideOffset * innerScale, y: cy + ny * sideOffset * innerScale };
  const innerRight: Pt = { x: cx - nx * sideOffset * innerScale, y: cy - ny * sideOffset * innerScale };
  let inner = moveTo({ x: baseX, y: baseY });
  inner += ' ' + quadTo(
    { x: innerLeft.x + Math.cos(angle) * size * 0.2, y: innerLeft.y + Math.sin(angle) * size * 0.2 },
    { x: innerTipX, y: innerTipY }
  );
  inner += ' ' + quadTo(
    { x: innerRight.x + Math.cos(angle) * size * 0.2, y: innerRight.y + Math.sin(angle) * size * 0.2 },
    { x: baseX, y: baseY }
  );

  // Curling tendril from base
  const tDir = angle + (rng() < 0.5 ? -1 : 1) * Math.PI * 0.6;
  const tEndX = baseX + Math.cos(tDir) * size * 0.7;
  const tEndY = baseY + Math.sin(tDir) * size * 0.7;
  const tCx = (baseX + tEndX) / 2 + Math.cos(tDir + Math.PI / 2) * size * 0.3;
  const tCy = (baseY + tEndY) / 2 + Math.sin(tDir + Math.PI / 2) * size * 0.3;
  const tendril = `M ${fmt(baseX)} ${fmt(baseY)} Q ${fmt(tCx)} ${fmt(tCy)} ${fmt(tEndX)} ${fmt(tEndY)}`;

  return `<path d="${body}" /><path d="${inner}" /><path d="${tendril}" />`;
}
