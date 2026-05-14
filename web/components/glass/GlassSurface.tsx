import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: "panel" | "card" | "floating";
  sweep?: boolean;
};

export function GlassSurface({
  as: Tag = "div",
  children,
  className,
  variant = "panel",
  sweep = false,
}: Props) {
  const base =
    variant === "card"
      ? "glass-card"
      : variant === "floating"
        ? "glass glass-floating"
        : "glass";
  return (
    <Tag className={cn(base, sweep && "glass-sweep", className)}>
      {children}
    </Tag>
  );
}
