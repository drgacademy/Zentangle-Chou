"use client";

import { useMemo, useRef, useState } from "react";
import TangleTile, { type TangleTileHandle } from "@/components/tangle/TangleTile";
import {
  DEFAULT_REGION_CLIPS,
  DEFAULT_REGION_RECTS,
  DEFAULT_STRING_CURVES,
  type PhaseDef,
  type RegionDef,
} from "@/lib/tangles/tileCompose";
import { hollibaugh } from "@/lib/tangles/patterns/hollibaugh";
import { paradox } from "@/lib/tangles/patterns/paradox";
import { printemps } from "@/lib/tangles/patterns/printemps";
import { nzeppel } from "@/lib/tangles/patterns/nzeppel";
import { t, type Dict, type Lang } from "@/lib/i18n";
import { motion } from "framer-motion";

type Props = { dict: Dict; lang: Lang };

export default function SceneHeroTile({ dict, lang }: Props) {
  const [phaseZh, setPhaseZh] = useState("");
  const [phaseEn, setPhaseEn] = useState("");
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [seed, setSeed] = useState("hero-tile-1");
  const tileRef = useRef<TangleTileHandle>(null);

  const regions: RegionDef[] = useMemo(
    () => [
      {
        id: "hollibaugh",
        pattern: hollibaugh,
        rect: DEFAULT_REGION_RECTS.hollibaugh,
        clipD: DEFAULT_REGION_CLIPS.hollibaugh,
        stepLabel: { zh: t(dict, "tile.phases.hollibaugh"), en: "Hollibaugh" },
      },
      {
        id: "paradox",
        pattern: paradox,
        rect: DEFAULT_REGION_RECTS.paradox,
        clipD: DEFAULT_REGION_CLIPS.paradox,
        stepLabel: { zh: t(dict, "tile.phases.paradox"), en: "Paradox" },
      },
      {
        id: "printemps",
        pattern: printemps,
        rect: DEFAULT_REGION_RECTS.printemps,
        clipD: DEFAULT_REGION_CLIPS.printemps,
        stepLabel: { zh: t(dict, "tile.phases.printemps"), en: "Printemps × Tipple" },
      },
      {
        id: "nzeppel",
        pattern: nzeppel,
        rect: DEFAULT_REGION_RECTS.nzeppel,
        clipD: DEFAULT_REGION_CLIPS.nzeppel,
        stepLabel: { zh: t(dict, "tile.phases.nzeppel"), en: "'Nzeppel" },
      },
    ],
    [dict],
  );

  const onPhase = (p: PhaseDef) => {
    setPhaseZh(p.labelZh);
    setPhaseEn(p.labelEn);
  };

  const cycleSpeed = () => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1));
  const restart = () => {
    setSeed("hero-tile-" + Math.floor(Math.random() * 1e6).toString(36));
    tileRef.current?.restart();
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-paper-tile"
      style={{ background: "var(--bg-spotlight)" }}
      aria-labelledby="hero-mast"
    >
      <div className="relative w-full max-w-3xl text-center">
        <motion.h1
          id="hero-mast"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 font-masthead text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-[0.04em]"
        >
          {t(dict, "hero.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-10 font-mono text-[0.78rem] uppercase tracking-[0.32em] text-paper-tile/60"
        >
          {t(dict, "hero.subtitle")}
        </motion.p>

        <div className="relative mx-auto" style={{ width: "min(85vmin, 720px)", aspectRatio: "1 / 1" }}>
          <TangleTile
            ref={tileRef}
            regions={regions}
            stringCurves={DEFAULT_STRING_CURVES}
            seed={seed}
            speed={speed}
            ariaLabel={t(dict, "tile.ariaLabel")}
            onPhaseEnter={onPhase}
            onProgress={setProgress}
          />
          <motion.div
            key={phaseZh + phaseEn}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[rgba(20,15,10,0.86)] px-5 py-2.5 text-center backdrop-blur-md min-w-[14rem]"
            aria-live="polite"
          >
            <span className="block text-[0.95rem] tracking-[0.04em] text-paper-tile">
              {lang === "zh" ? phaseZh : phaseEn}
            </span>
            <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper-tile/60">
              {lang === "zh" ? phaseEn : phaseZh}
            </span>
          </motion.div>
        </div>

        <div className="mx-auto mt-6 h-[3px] w-[min(85vmin,720px)] overflow-hidden rounded-full bg-paper-tile/12">
          <span
            className="block h-full w-full origin-left transition-transform duration-100 ease-linear"
            style={{
              transform: `scaleX(${progress})`,
              background: "linear-gradient(90deg, #d4a574, #f0e4c8)",
            }}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={restart}
            className="rounded-full bg-paper-tile px-6 py-2.5 text-sm font-medium text-[#1a1410] transition-transform hover:-translate-y-0.5"
          >
            ↻ {t(dict, "tile.controls.restart")}
          </button>
          <button
            type="button"
            onClick={cycleSpeed}
            className="rounded-full border-[1.5px] border-paper-tile/55 bg-transparent px-6 py-2.5 text-sm tracking-[0.06em] text-paper-tile transition-transform hover:-translate-y-0.5 hover:bg-paper-tile/10"
          >
            {t(dict, "tile.controls.speed")}: {speed}×
          </button>
        </div>
      </div>
    </section>
  );
}
