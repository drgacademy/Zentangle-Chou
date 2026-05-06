import React from 'react';

export default function ScrollCue() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-center pointer-events-none z-10">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-ink-400 dark:text-ink-600"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
      <p className="text-xs text-ink-400 dark:text-ink-600 mt-2">向下滾動</p>
    </div>
  );
}
