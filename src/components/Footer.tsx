import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] py-6 relative z-10 transition-colors duration-200">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Controllership | CFO Office | EPAM Systems */}
        <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--text-secondary)]">
          Controllership &nbsp;|&nbsp; CFO Office &nbsp;|&nbsp; EPAM Systems
        </div>

        {/* Discreet status indicator */}
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--positive)] animate-pulse" />
          <span>Spring 2026 Boot Camp · Active Controller Session</span>
        </div>
      </div>
    </footer>
  );
};
