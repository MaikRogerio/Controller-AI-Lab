import React from 'react';
import {
  Moon,
  Presentation,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { EpamLogo } from './EpamLogo';

export const TopNavbar: React.FC = () => {
  const {
    isDark,
    toggleTheme,
    participant,
    setIsJoinModalOpen,
    activeView,
    setActiveView,
    painPoints,
    welcomeBanner,
    setWelcomeBanner,
  } = useWorkshop();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md transition-colors duration-200">
      {/* Welcome Toast / Access Code recognition banner */}
      {welcomeBanner && (
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white text-xs font-medium px-4 py-2 flex items-center justify-between shadow-xs animate-in slide-in-from-top duration-300">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between">
            <span className="truncate pr-2">✨ {welcomeBanner}</span>
            <button
              onClick={() => setWelcomeBanner(null)}
              className="p-1 hover:bg-white/20 rounded cursor-pointer shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Bar: Synchronized left-edge alignment and edge-to-edge full width */}
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 h-16 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {/* Left: Clean <epam> Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('starters')}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
            title="Controller AI Lab Home"
          >
            <EpamLogo isDark={isDark} size="md" />
          </button>
        </div>

        {/* Center: The 3-Step Selection & Building Navigation (Protected against shrinking and text wrapping) */}
        <nav className="flex items-center p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] shrink-0 flex-nowrap">
          <button
            onClick={() => setActiveView('starters')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeView === 'starters' || activeView === 'dashboard'
                ? isDark
                  ? 'dark-option-selected font-bold text-white shadow-xs'
                  : 'bg-white text-[var(--primary)] shadow-[var(--shadow-card)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
              1
            </span>
            <span className="whitespace-nowrap">What&apos;s the Pain?</span>
          </button>

          <button
            onClick={() => setActiveView('build')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeView === 'build'
                ? isDark
                  ? 'dark-option-selected font-bold text-white shadow-xs'
                  : 'bg-white text-[var(--primary)] shadow-[var(--shadow-card)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[var(--purple)] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
              2
            </span>
            <span className="whitespace-nowrap">Build Your Pain</span>
          </button>

          <button
            onClick={() => setActiveView('wall')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeView === 'wall'
                ? isDark
                  ? 'dark-option-selected font-bold text-white shadow-xs'
                  : 'bg-white text-[var(--primary)] shadow-[var(--shadow-card)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[var(--warning)] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
              3
            </span>
            <span className="whitespace-nowrap">Overall Wall</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">
              {painPoints.length}
            </span>
          </button>
        </nav>

        {/* Right: Controller First Name & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Spotlight for live demo (desktop only to preserve space on tablet/mobile) */}
          <button
            onClick={() => setActiveView('presentation')}
            title="Open Facilitator Spotlight for Screen Sharing"
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
              activeView === 'presentation'
                ? 'text-white border-transparent shadow-xs'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--primary)] hover:bg-[var(--blue-soft)]'
            }`}
            style={activeView === 'presentation' ? { background: 'var(--brand-gradient)' } : {}}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Spotlight</span>
          </button>

          {/* Participant First Name Pill (Connected with 6-char code) */}
          <button
            onClick={() => setIsJoinModalOpen(true)}
            title="Controller Access Code / Profile"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--outline)] transition-all cursor-pointer min-h-[38px] shrink-0"
          >
            <User className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
            <span className="max-w-[80px] sm:max-w-[130px] md:max-w-[160px] truncate text-[var(--text-primary)] font-bold whitespace-nowrap">
              {participant?.displayName ? participant.displayName : 'Sign In'}
            </span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
          >
            {isDark ? <Sun className="w-4 h-4 text-[var(--warning)]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
