"use client";

import { useId, useState } from "react";
import type { Pattern } from "@/content/patterns";
import { cn } from "@/lib/utils";

type Props = {
  pattern: Pattern;
  className?: string;
};

export function PatternCard({ pattern, className }: Props) {
  const id = useId().replace(/:/g, "");
  const [run, setRun] = useState(0);
  const restart = () => setRun((v) => v + 1);

  return (
    <article
      className={cn(
        "group glass-card glass-sweep p-5 aspect-[3/4] flex flex-col",
        className
      )}
      onMouseEnter={restart}
      onFocus={restart}
      tabIndex={0}
    >
      <div className="text-[10px] uppercase tracking-[0.32em] text-ink-mute flex items-center justify-between">
        <span>{pattern.origin}</span>
        <span aria-label={`difficulty ${pattern.difficulty}`}>
          {"●".repeat(pattern.difficulty)}
          <span className="text-ink-faint">{"●".repeat(3 - pattern.difficulty)}</span>
        </span>
      </div>
      <h3 className="mt-2 text-2xl tracking-wide">{pattern.name}</h3>
      <div className="relative flex-1 mt-4">
        <svg
          key={run}
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-ink"
          aria-hidden
        >
          {pattern.steps.map((step, i) => {
            const delay = i * 0.38;
            return (
              <path
                key={`${id}-${i}`}
                d={step.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ink-path"
                style={{
                  ["--ink-duration" as string]: `${step.duration ?? 0.9}s`,
                  ["--ink-delay" as string]: `${delay}s`,
                  ["--ink-len" as string]: "260",
                }}
              />
            );
          })}
        </svg>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed mt-4">{pattern.description}</p>
    </article>
  );
}
