import React, { useState } from 'react';
import { Check, Copy, KeyRound, Sparkles, User, Users, X } from 'lucide-react';
import { CONTROLLER_ROSTER } from '../data/controllersRoster';
import { useWorkshop } from '../context/WorkshopContext';

export const EnterLabModal: React.FC = () => {
  const {
    isDark,
    isJoinModalOpen,
    setIsJoinModalOpen,
    participant,
    loginWithCode,
    setIsRosterModalOpen,
  } = useWorkshop();

  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isJoinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!inputCode.trim()) {
      setErrorMessage('Please enter your access code (e.g. ANNA26 or your first name)');
      return;
    }

    const result = loginWithCode(inputCode.trim());
    if (!result.success && result.error) {
      setErrorMessage(result.error);
    } else {
      setIsJoinModalOpen(false);
      setInputCode('');
    }
  };

  const handleSelectController = (code: string) => {
    loginWithCode(code);
    setIsJoinModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-5 overflow-y-auto ${
          isDark
            ? 'bg-[#000000] border-zinc-800 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.95)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl text-white shadow-xs"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Controller Code Login</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Enter your unique code to identify with your first name
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsJoinModalOpen(false)}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Identity Notice */}
        {participant && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--text-muted)]">Currently active profile:</span>
              <span className="font-bold text-[var(--primary)] text-sm">{participant.displayName}</span>
              {participant.code && (
                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)]">
                  {participant.code}
                </span>
              )}
            </div>
            {participant.fullName && (
              <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
                {participant.fullName}
              </span>
            )}
          </div>
        )}

        {/* Code Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Your Access Code or Name
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="e.g. ANNA26, UMUT26, MAIK26 or your first name"
                className={`w-full pl-10 pr-3 py-3 rounded-xl border text-sm font-medium transition-all min-h-[44px] ${
                  isDark
                    ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]'
                    : 'bg-[var(--surface-subtle)] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]'
                }`}
                autoFocus
              />
            </div>
            {errorMessage && (
              <p className="text-xs text-rose-500 font-medium pt-1">{errorMessage}</p>
            )}
            <p className="text-[11px] text-[var(--text-muted)]">
              Each Country Controller receives a 6-character code via email. Entering your code links directly to your first name.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer transition-all hover:opacity-95 active:scale-95 min-h-[44px]"
              style={{ background: 'var(--brand-gradient)' }}
            >
              Identify &amp; Enter Lab
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center pt-1">
          <div className="border-t border-[var(--border)] w-full" />
          <span
            className={`absolute px-2 text-[10px] uppercase tracking-wider font-mono ${
              isDark ? 'bg-[#000000] text-zinc-500' : 'bg-white text-slate-400'
            }`}
          >
            Or 1-Tap Select From Roster
          </span>
        </div>

        {/* 1-Tap Roster List for 23 Controllers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              23 Enrolled Country Controllers
            </span>
            <button
              type="button"
              onClick={() => {
                setIsJoinModalOpen(false);
                setIsRosterModalOpen(true);
              }}
              className="text-[11px] text-[var(--primary)] hover:underline font-semibold cursor-pointer"
            >
              Facilitator Email Directory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {CONTROLLER_ROSTER.map((c) => {
              const isSelected = participant?.displayName === c.firstName;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectController(c.code)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border flex items-center justify-between gap-1.5 transition-all cursor-pointer min-h-[40px] ${
                    isSelected
                      ? isDark
                        ? 'dark-option-selected font-bold text-white shadow-xs'
                        : 'bg-[var(--blue-soft)] border-[var(--primary)] text-[var(--primary)] font-bold'
                      : isDark
                      ? 'bg-[#0a0a0a] border-zinc-800/80 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-[var(--text-primary)]">{c.firstName}</span>
                    <span className="text-[10px] text-[var(--text-muted)] truncate">({c.fullName.split(' ').slice(1).join(' ')})</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)] shrink-0">
                    {c.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
