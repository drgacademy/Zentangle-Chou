import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollInkReveal } from "@/components/motion/ScrollInkReveal";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
};

export function PageShell({ eyebrow, title, intro, children, className }: Props) {
  return (
    <article className={cn("pb-20", className)}>
      <header className="container-paper pt-16 md:pt-28 pb-12 md:pb-20">
        <ScrollInkReveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-4 max-w-4xl">{title}</h1>
          {intro && <p className="lede mt-8">{intro}</p>}
        </ScrollInkReveal>
      </header>
      <div className="container-paper">{children}</div>
    </article>
  );
}
