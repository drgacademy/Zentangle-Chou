import { InkStroke } from "@/components/motion/InkStroke";

type Props = {
  className?: string;
};

export function HeroTile({ className }: Props) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 400 400" className="w-full h-auto text-ink">
        <rect
          x="14"
          y="14"
          width="372"
          height="372"
          rx="4"
          fill="var(--color-paper-soft)"
        />

        <InkStroke d="M 22 22 L 378 22" duration={1.4} length={400} delay={0.1} strokeWidth={0.6} />
        <InkStroke d="M 378 22 L 378 378" duration={1.4} length={400} delay={0.5} strokeWidth={0.6} />
        <InkStroke d="M 378 378 L 22 378" duration={1.4} length={400} delay={0.9} strokeWidth={0.6} />
        <InkStroke d="M 22 378 L 22 22" duration={1.4} length={400} delay={1.3} strokeWidth={0.6} />

        <InkStroke
          d="M 60 200 C 60 110, 200 60, 340 110 C 380 240, 280 360, 120 340 C 70 320, 50 280, 60 200 Z"
          duration={3.2}
          length={1200}
          delay={2.0}
          strokeWidth={0.8}
        />

        <g>
          <InkStroke d="M 80 80 Q 120 60 160 80" duration={1.4} length={140} delay={3.4} />
          <InkStroke d="M 80 80 Q 120 50 160 80" duration={1.4} length={140} delay={3.6} />
          <InkStroke d="M 80 80 Q 120 40 160 80" duration={1.4} length={140} delay={3.8} />
          <InkStroke d="M 160 80 Q 200 60 240 80" duration={1.4} length={140} delay={4.0} />
          <InkStroke d="M 160 80 Q 200 50 240 80" duration={1.4} length={140} delay={4.2} />
          <InkStroke d="M 240 80 Q 280 60 320 80" duration={1.4} length={140} delay={4.4} />
        </g>

        <g>
          {Array.from({ length: 8 }).map((_, i) => (
            <InkStroke
              key={`s-${i}`}
              d={`M ${250 + i * 8} 200 L ${254 + i * 8} 180 L ${258 + i * 8} 200 L ${262 + i * 8} 180`}
              duration={1.0}
              length={120}
              delay={4.6 + i * 0.08}
              strokeWidth={1}
            />
          ))}
        </g>

        <g>
          {[
            { cx: 90, cy: 250, r: 4 },
            { cx: 120, cy: 290, r: 7 },
            { cx: 160, cy: 260, r: 5 },
            { cx: 100, cy: 330, r: 3 },
            { cx: 200, cy: 310, r: 6 },
            { cx: 170, cy: 350, r: 4 },
          ].map((c, i) => (
            <InkStroke
              key={`t-${i}`}
              d={`M ${c.cx} ${c.cy} m ${-c.r} 0 a ${c.r} ${c.r} 0 1 0 ${c.r * 2} 0 a ${c.r} ${c.r} 0 1 0 ${-c.r * 2} 0`}
              duration={1.0}
              length={70}
              delay={5.4 + i * 0.16}
              strokeWidth={1.1}
            />
          ))}
        </g>

        <g>
          <InkStroke d="M 290 250 C 290 240, 270 230, 270 220" duration={1.4} length={120} delay={6.4} />
          <InkStroke d="M 290 250 C 290 240, 310 230, 310 220" duration={1.4} length={120} delay={6.6} />
          <InkStroke d="M 290 250 C 290 235, 280 230, 280 220" duration={1.2} length={100} delay={6.9} />
          <InkStroke d="M 290 250 C 290 235, 300 230, 300 220" duration={1.2} length={100} delay={7.1} />
          <InkStroke d="M 290 250 L 290 280" duration={1.0} length={50} delay={7.4} />
        </g>

        <text
          x="350"
          y="362"
          textAnchor="end"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="14"
          fill="var(--color-ink-mute)"
        >
          ZZ
        </text>
      </svg>
    </div>
  );
}
