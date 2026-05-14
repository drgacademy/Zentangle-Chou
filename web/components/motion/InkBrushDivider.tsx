import { InkStroke } from "./InkStroke";

type Props = {
  className?: string;
};

export function InkBrushDivider({ className }: Props) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 800 40" className="w-full h-8 text-ink-soft" preserveAspectRatio="none">
        <InkStroke
          d="M 20 20 C 120 8, 240 28, 360 18 S 600 30, 780 16"
          duration={3.2}
          length={1100}
          strokeWidth={1.2}
        />
      </svg>
    </div>
  );
}
