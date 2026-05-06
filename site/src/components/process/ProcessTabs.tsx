import React, { useEffect, useRef, useState } from 'react';

export interface ProcessStep {
  num: number;
  name: string;
  officialDesc: string;
  personalDesc: string;
}

interface ProcessTabsProps {
  steps: ProcessStep[];
  lang?: 'zh' | 'en';
}

interface IconProps {
  active: boolean;
}

// Hand-drawn SVG icons that echo the eight stages of a Zentangle tile.
// Stroke widths and slight irregularities match the ink-on-paper aesthetic.
const STEP_ICONS: Record<number, (p: IconProps) => React.ReactElement> = {
  1: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <path
        d="M5.5 6.5 Q4.6 5.4 6.4 5.2 L25.6 5.6 Q27.2 5.5 27 7.2 L26.5 25.5 Q26.8 27 25 26.7 L6.7 26.4 Q5 27.1 5.2 25 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 16.5 L14.5 20 L21.5 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? 'icon-stroke active' : 'icon-stroke'}
      />
    </svg>
  ),
  2: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <path
        d="M16 4.5 C 23.4 4.5 27.5 9.6 27.5 16 C 27.5 22.6 23.2 27.5 16 27.5 C 8.8 27.5 4.5 22.6 4.5 16 C 4.5 9.4 8.8 4.5 16 4.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={active ? 'icon-stroke active' : 'icon-stroke'}
      />
    </svg>
  ),
  3: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <path
        d="M3.5 16 C 7 9, 11 23, 16 16 S 25 9, 28.5 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={active ? 'icon-stroke active' : 'icon-stroke'}
      />
      <path
        d="M3.5 22 C 7 15, 11 29, 16 22 S 25 15, 28.5 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  ),
  4: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <rect
        x="5"
        y="5"
        width="22"
        height="22"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 12 L27 12 M5 19 L27 19 M12 5 L12 27 M19 5 L19 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
        className={active ? 'icon-stroke active' : 'icon-stroke'}
      />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
      <circle cx="22.5" cy="22.5" r="1" fill="currentColor" />
    </svg>
  ),
  5: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M16 5 A 11 11 0 0 0 16 27 Z"
        fill="currentColor"
        className={active ? 'icon-fill active' : 'icon-fill'}
      />
    </svg>
  ),
  6: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M16 5 A 11 11 0 0 1 16 27 Z"
        fill="currentColor"
        className={active ? 'icon-fill active' : 'icon-fill'}
      />
    </svg>
  ),
  7: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <path
        d="M4.5 22 Q 16 7, 27.5 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={active ? 'icon-stroke active' : 'icon-stroke'}
      />
      <path
        d="M7 22 Q 16 12, 25 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  ),
  8: ({ active }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
      <path
        d="M21.5 5.5 L26 10 L13 23 L8 24 L9 19 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        className={active ? 'icon-stroke active' : 'icon-stroke'}
      />
      <path
        d="M5 28 Q 14 25, 23 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  ),
};

export default function ProcessTabs({ steps, lang = 'zh' }: ProcessTabsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [contentKey, setContentKey] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const current = steps[activeStep];

  const handleStepChange = (idx: number) => {
    if (idx === activeStep) return;
    setActiveStep(idx);
    setContentKey((k) => k + 1);
  };

  // Auto-scroll focus into view on small screens after switching tabs.
  useEffect(() => {
    if (!contentRef.current) return;
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 768) return;
    contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeStep]);

  return (
    <div className="process-tabs space-y-10 md:space-y-14">
      {/* Tab Navigation with flowing string */}
      <div className="relative pt-2">
        {/* Flowing 'string' that connects all steps — drawn on mount */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 60"
          preserveAspectRatio="none"
          className="hidden md:block absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-16 pointer-events-none process-string-svg"
        >
          <path
            d="M 30 30 C 110 8, 170 52, 250 30 C 320 12, 380 48, 450 30 C 520 12, 580 50, 650 30 C 720 14, 750 38, 770 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="3 4"
            className="text-ink-300 dark:text-ink-500 process-string-path"
          />
        </svg>

        <div className="relative grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isPast = idx < activeStep;
            const Icon = STEP_ICONS[step.num];
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => handleStepChange(idx)}
                style={{ animationDelay: `${idx * 70}ms` }}
                className={[
                  'group step-tab relative flex flex-col items-center justify-end',
                  'px-2 py-3 md:px-3 md:py-4 rounded-sm',
                  'transition-[transform,background-color,color,box-shadow,border-color] duration-500 ease-out',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 dark:focus-visible:ring-offset-ink-900',
                  isActive
                    ? 'is-active bg-gradient-to-br from-gold-500 to-sepia-500 text-ink-50 shadow-lg dark:from-gold-300 dark:to-sepia-300 dark:text-ink-900'
                    : isPast
                      ? 'bg-ink-100 dark:bg-ink-700 text-sepia-700 dark:text-sepia-300 border border-ink-200 dark:border-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600'
                      : 'bg-ink-50 dark:bg-ink-800 text-ink-500 dark:text-ink-300 border border-ink-200 dark:border-ink-700 hover:bg-ink-100 dark:hover:bg-ink-700 hover:text-ink-700 dark:hover:text-ink-100',
                ].join(' ')}
                aria-label={`${lang === 'zh' ? '步驟' : 'Step'} ${step.num}: ${step.name}`}
                aria-pressed={isActive}
              >
                {/* Soft ink halo behind active button */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-sm pointer-events-none ink-halo"
                  />
                )}

                <span
                  className={[
                    'relative block w-7 h-7 md:w-9 md:h-9 mb-2',
                    'transition-transform duration-700 ease-out',
                    isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-3',
                  ].join(' ')}
                >
                  <Icon active={isActive} />
                </span>

                <span className="font-mono text-[9px] md:text-[10px] tracking-widest opacity-80">
                  0{step.num}
                </span>
                <span
                  className={[
                    lang === 'zh' ? 'font-display-zh' : 'font-heading',
                    'text-[11px] md:text-xs mt-1 text-center leading-tight max-w-[7rem]',
                  ].join(' ')}
                >
                  {step.name}
                </span>

                {/* Active underline brush stroke */}
                {isActive && (
                  <span aria-hidden="true" className="active-brush" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative bg-gradient-to-b from-ink-50 to-ink-100/40 dark:from-ink-800 dark:to-ink-900/60 p-6 md:p-12 rounded-sm border border-ink-200 dark:border-ink-700 overflow-hidden process-card"
      >
        {/* Decorative ink wash */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="absolute -top-16 -right-16 w-56 h-56 text-gold-500 dark:text-gold-300 pointer-events-none opacity-[0.07] dark:opacity-[0.10]"
        >
          <path
            d="M 40 100 Q 50 30, 110 50 T 170 110 Q 160 170, 100 160 T 40 100 Z"
            fill="currentColor"
          />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="absolute -bottom-20 -left-12 w-48 h-48 text-sepia-500 dark:text-sepia-300 pointer-events-none opacity-[0.05]"
        >
          <path
            d="M 30 100 Q 60 30, 120 60 T 170 130 Q 130 180, 70 150 T 30 100 Z"
            fill="currentColor"
          />
        </svg>

        <div key={contentKey} className="relative max-w-3xl mx-auto process-content">
          <div className="flex items-center gap-4 mb-4 anim-rise">
            <span className="font-mono text-xs md:text-sm text-gold-700 dark:text-gold-300 tracking-[0.25em]">
              STEP&nbsp;0{current.num}
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-gold-500/40 via-sepia-500/30 to-transparent" />
          </div>

          <h3
            className={[
              lang === 'zh' ? 'font-display-zh' : 'font-heading',
              'text-3xl md:text-4xl text-ink-700 dark:text-ink-50 mb-8 anim-rise',
            ].join(' ')}
            style={{ animationDelay: '80ms' }}
          >
            {current.name}
          </h3>

          <div className="space-y-8">
            <div className="anim-rise" style={{ animationDelay: '160ms' }}>
              <h4 className="font-body font-bold text-sepia-700 dark:text-sepia-300 mb-3 flex items-center gap-3">
                <span className="block w-8 h-px bg-sepia-500 dark:bg-sepia-300" />
                <span className="tracking-wide text-sm uppercase">
                  {lang === 'zh' ? '官方方法' : 'Official Method'}
                </span>
              </h4>
              <p className="font-body text-ink-600 dark:text-ink-300 leading-relaxed">
                {current.officialDesc}
              </p>
            </div>

            <div
              className="border-t border-dashed border-ink-300 dark:border-ink-600 pt-8 anim-rise"
              style={{ animationDelay: '240ms' }}
            >
              <h4 className="font-body font-bold text-gold-700 dark:text-gold-300 mb-3 flex items-center gap-3">
                <span className="block w-8 h-px bg-gold-500 dark:bg-gold-300" />
                <span className="tracking-wide text-sm uppercase">
                  {lang === 'zh' ? '我的版本' : 'My Approach'}
                </span>
              </h4>
              <p className="font-body text-ink-600 dark:text-ink-300 leading-relaxed italic">
                {current.personalDesc}
              </p>
            </div>
          </div>

          {/* Step navigation */}
          <div
            className="mt-10 pt-6 border-t border-ink-200 dark:border-ink-700 flex items-center justify-between anim-rise"
            style={{ animationDelay: '320ms' }}
          >
            <button
              type="button"
              onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="font-mono text-xs tracking-widest text-ink-500 dark:text-ink-300 hover:text-gold-700 dark:hover:text-gold-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← {lang === 'zh' ? '上一步' : 'PREV'}
            </button>
            <span className="font-mono text-xs text-ink-400 dark:text-ink-500 tracking-wider">
              {activeStep + 1} / {steps.length}
            </span>
            <button
              type="button"
              onClick={() => handleStepChange(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className="font-mono text-xs tracking-widest text-ink-500 dark:text-ink-300 hover:text-gold-700 dark:hover:text-gold-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {lang === 'zh' ? '下一步' : 'NEXT'} →
            </button>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center items-center gap-2">
        {steps.map((_, idx) => {
          const isActive = idx === activeStep;
          const isPast = idx < activeStep;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleStepChange(idx)}
              aria-label={`${lang === 'zh' ? '跳到步驟' : 'Go to step'} ${idx + 1}`}
              className={[
                'progress-dot rounded-full transition-all duration-500 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 dark:focus-visible:ring-offset-ink-900',
                isActive
                  ? 'is-active w-10 h-2 bg-gold-500 dark:bg-gold-400'
                  : isPast
                    ? 'w-2 h-2 bg-sepia-500 dark:bg-sepia-300 hover:scale-125'
                    : 'w-2 h-2 bg-ink-300 dark:bg-ink-600 hover:bg-ink-400 hover:scale-125',
              ].join(' ')}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes processFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes processInkBloom {
          0%   { opacity: 0; transform: scale(0.92); filter: blur(2px); }
          60%  { opacity: 1; transform: scale(1.02); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes processBreathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        @keyframes processGlow {
          0%, 100% { box-shadow: 0 4px 14px -4px rgba(201, 169, 97, 0.35); }
          50%      { box-shadow: 0 6px 22px -2px rgba(201, 169, 97, 0.55); }
        }
        @keyframes processDrawString {
          from { stroke-dashoffset: 1200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes processBrush {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes processIconDraw {
          from { stroke-dasharray: 200; stroke-dashoffset: 200; }
          to   { stroke-dasharray: 200; stroke-dashoffset: 0; }
        }
        @keyframes processInkPulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.85; }
        }

        .process-tabs .step-tab {
          opacity: 0;
          animation: processFadeIn 0.7s var(--easing-smooth, cubic-bezier(0.4,0,0.2,1)) forwards;
        }
        .process-tabs .step-tab.is-active {
          animation:
            processFadeIn 0.7s var(--easing-smooth, cubic-bezier(0.4,0,0.2,1)) forwards,
            processBreathe 6s ease-in-out 0.7s infinite,
            processGlow 4s ease-in-out 0.7s infinite;
        }

        .process-tabs .ink-halo {
          background: radial-gradient(closest-side, rgba(255, 255, 255, 0.18), transparent 70%);
          animation: processInkPulse 4s ease-in-out infinite;
        }

        .process-tabs .active-brush {
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: 6px;
          height: 2px;
          background: linear-gradient(to right, transparent, currentColor, transparent);
          opacity: 0.6;
          transform-origin: left center;
          animation: processBrush 0.6s var(--easing-smooth, cubic-bezier(0.4,0,0.2,1)) forwards;
          border-radius: 2px;
        }

        .process-tabs .icon-stroke.active {
          animation: processIconDraw 1.4s var(--easing-smooth, cubic-bezier(0.4,0,0.2,1)) forwards;
        }
        .process-tabs .icon-fill.active {
          transform-origin: center;
          animation: processInkBloom 0.9s var(--easing-smooth, cubic-bezier(0.4,0,0.2,1)) forwards;
        }

        .process-tabs .process-string-svg {
          z-index: 0;
        }
        .process-tabs .process-string-path {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: processDrawString 4s ease-out 0.2s forwards;
        }

        .process-tabs .process-content .anim-rise {
          opacity: 0;
          animation: processFadeIn 0.75s var(--easing-smooth, cubic-bezier(0.4,0,0.2,1)) forwards;
        }
        .process-tabs .process-card {
          box-shadow: 0 1px 0 rgba(0,0,0,0.02), 0 8px 30px -12px rgba(0,0,0,0.08);
        }

        .process-tabs .progress-dot.is-active {
          animation: processBreathe 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .process-tabs .step-tab,
          .process-tabs .step-tab.is-active,
          .process-tabs .icon-stroke.active,
          .process-tabs .icon-fill.active,
          .process-tabs .process-string-path,
          .process-tabs .process-content .anim-rise,
          .process-tabs .progress-dot.is-active,
          .process-tabs .ink-halo,
          .process-tabs .active-brush {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
