import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  delay?: number;
  hue?: "neutral" | "rouge" | "cool";
};

export function GlassOrb({ className, size = 320, delay = 0, hue = "neutral" }: Props) {
  const tint =
    hue === "rouge"
      ? "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7), rgba(220,170,160,0.22) 30%, transparent 70%)"
      : hue === "cool"
        ? "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7), rgba(180,200,220,0.25) 30%, transparent 70%)"
        : undefined;
  return (
    <div
      aria-hidden
      className={cn("glass-orb", className)}
      style={{
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        ...(tint ? { background: tint } : {}),
      }}
    />
  );
}
