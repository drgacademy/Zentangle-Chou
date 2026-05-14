import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  href?: string;
};

export function GlassPill({ as: Tag = "span", children, className, href, ...rest }: Props) {
  const Comp = Tag as ElementType;
  return (
    <Comp className={cn("glass-pill text-sm", className)} href={href} {...rest}>
      {children}
    </Comp>
  );
}
