import React, { useState } from 'react';

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

const STEP_ICONS: Record<number, string> = {
  1: '✓',
  2: '◯',
  3: '∿',
  4: '∼',
  5: '◐',
  6: '◑',
  7: '⌓',
  8: '✍',
};

export default function ProcessTabs({ steps, lang = 'zh' }: ProcessTabsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const current = steps[activeStep];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {steps.map((step, idx) => (
          <button
            key={step.num}
            onClick={() => setActiveStep(idx)}
            className={`
              flex flex-col items-center p-3 rounded-sm transition-colors
              ${activeStep === idx
                ? 'bg-gold-500 dark:bg-gold-400 text-ink-50 dark:text-ink-900'
                : 'bg-ink-100 dark:bg-ink-700 text-ink-700 dark:text-ink-100 hover:bg-ink-200 dark:hover:bg-ink-600'
              }
            `}
            aria-label={`Step ${step.num}: ${step.name}`}
            aria-pressed={activeStep === idx}
          >
            <span className="text-2xl mb-1">{STEP_ICONS[step.num]}</span>
            <span className="text-xs font-bold">{step.num}</span>
            <span className="text-xs mt-1 text-center max-w-16 leading-tight">
              {step.name}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-ink-50 dark:bg-ink-800 p-8 rounded-sm border border-ink-200 dark:border-ink-700 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-display-zh text-2xl text-ink-700 dark:text-ink-50 mb-6">
            Step {current.num}: {current.name}
          </h3>

          {/* Official Description */}
          <div className="mb-8">
            <h4 className="font-body font-bold text-ink-600 dark:text-ink-300 mb-3">
              {lang === 'zh' ? '官方方法' : 'Official Method'}
            </h4>
            <p className="font-body text-ink-600 dark:text-ink-300 leading-relaxed">
              {current.officialDesc}
            </p>
          </div>

          {/* Personal Version */}
          <div className="border-t border-ink-200 dark:border-ink-700 pt-8">
            <h4 className="font-body font-bold text-ink-600 dark:text-ink-300 mb-3">
              {lang === 'zh' ? '我的版本' : 'My Approach'}
            </h4>
            <p className="font-body text-ink-600 dark:text-ink-300 leading-relaxed italic">
              {current.personalDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 w-8 transition-colors ${
              idx <= activeStep
                ? 'bg-gold-500 dark:bg-gold-400'
                : 'bg-ink-200 dark:bg-ink-700'
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
