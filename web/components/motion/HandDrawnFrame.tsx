import { InkStroke } from "./InkStroke";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  ratio?: "square" | "tile" | "video";
  delay?: number;
};

const ratioClass: Record<NonNullable<Props["ratio"]>, string> = {
  square: "aspect-square",
  tile: "aspect-square",
  video: "aspect-video",
};

export function HandDrawnFrame({ children, className, ratio = "square", delay = 0 }: Props) {
  return (
    <div className={cn("relative paper-grain tile-frame", ratioClass[ratio], className)}>
      <svg
        className="absolute inset-0 w-full h-full text-ink-soft"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <InkStroke
          d="M 6 6 L 94 6"
          duration={1.4}
          length={180}
          delay={delay}
          strokeWidth={0.4}
        />
        <InkStroke
          d="M 94 6 L 94 94"
          duration={1.4}
          length={180}
          delay={delay + 0.3}
          strokeWidth={0.4}
        />
        <InkStroke
          d="M 94 94 L 6 94"
          duration={1.4}
          length={180}
          delay={delay + 0.6}
          strokeWidth={0.4}
        />
        <InkStroke
          d="M 6 94 L 6 6"
          duration={1.4}
          length={180}
          delay={delay + 0.9}
          strokeWidth={0.4}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-6">{children}</div>
    </div>
  );
}
