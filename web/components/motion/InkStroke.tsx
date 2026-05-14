import { cn } from "@/lib/utils";

type Props = {
  d: string;
  className?: string;
  duration?: number;
  delay?: number;
  length?: number;
  strokeWidth?: number;
  loop?: boolean;
};

export function InkStroke({
  d,
  className,
  duration = 2.2,
  delay = 0,
  length = 1000,
  strokeWidth = 1.5,
  loop = false,
}: Props) {
  const style: React.CSSProperties = {
    ["--ink-duration" as string]: `${duration}s`,
    ["--ink-delay" as string]: `${delay}s`,
    ["--ink-len" as string]: `${length}`,
  };
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(loop ? "ink-path-loop" : "ink-path", className)}
      style={style}
    />
  );
}
