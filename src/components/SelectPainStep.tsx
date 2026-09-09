import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  Plus,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { Category, PainPoint } from '../types';

export const SelectPainStep: React.FC = () => {
  const {
    isDark,
    painPoints,
    votePainPoint,
    hasVoted,
    setActiveView,
    setBuilderDraft,
    setIsExplainerOpen,
  } = useWorkshop();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  const starterPoints = painPoints.filter((p) => p.isStarter);
  const categories: string[] = [
    'All',
    'Close',
    'Reporting',
    'Reconciliations',
    'Compliance',
    'Audit',
    'Follow-up',
  ];

  const filteredPoints = starterPoints.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleVote = (id: string) => {
    const success = votePainPoint(id);
    if (success) {
      setJustVotedId(id);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
      setTimeout(() => setJustVotedId(null), 2000);
    }
  };

  const handleUseAsBase = (point: PainPoint) => {
    setBuilderDraft({
      title: point.title,
      description: point.description,
      category: point.category,
      frequency: point.frequency,
      manualEffort: point.manualEffort,
      judgmentLevel: point.judgmentLevel,
    });
    setActiveView('build');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          STEP 1 · SELECTION
        </div>

        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          What&apos;s the painful point?
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Where does manual effort, repetitive data juggling, or chasing information slow down your Controller rhythm?
          Select the bottlenecks affecting your entity or use them to construct your own.
        </p>

        {/* Quick Action Navigation Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setBuilderDraft(null);
              setActiveView('build');
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Build Your Own Pain Point
          </button>

          <button
            onClick={() => setActiveView('wall')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            View Overall Wall ({painPoints.length} points) &rarr;
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[var(--radius-pill)] text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                selectedCategory === cat
                  ? isDark
                    ? 'dark-option-selected-pill font-bold text-white shadow-xs'
                    : 'bg-[var(--primary)] text-white shadow-xs'
                  : isDark
                  ? 'bg-[#0a0a0a] text-zinc-300 hover:text-white border border-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsExplainerOpen(true)}
          className="text-xs font-medium text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          How we evaluate AI suitability
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPoints.map((point) => {
          const userVoted = hasVoted(point.id);
          const isJustVoted = justVotedId === point.id;

          return (
            <div
              key={point.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-5 transition-all duration-200 group relative ${
                isDark
                  ? 'bg-slate-900/70 border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Header Badges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      isDark
                        ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {point.category} · {point.frequency}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{point.votes} votes</span>
                  </div>
                </div>

                {/* Title */}
                <h2
                  className={`text-base font-bold leading-snug tracking-tight transition-colors ${
                    isDark ? 'text-slate-100 group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-blue-700'
                  }`}
                >
                  &ldquo;{point.title}&rdquo;
                </h2>

                {/* Description */}
                {point.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {point.description}
                  </p>
                )}
              </div>

              {/* AI Opportunity Badge & Controller Judgment */}
              <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">AI Suitability:</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-md border text-[11px] ${
                      point.opportunityRating === 'Strong candidate'
                        ? isDark
                          ? 'bg-transparent text-emerald-300 border-emerald-500/50'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isDark
                        ? 'bg-transparent text-amber-300 border-amber-500/50'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {point.opportunityRating}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleVote(point.id)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      userVoted
                        ? isDark
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : isDark
                        ? 'bg-slate-800 text-slate-200 hover:bg-cyan-600 hover:text-white border border-slate-700'
                        : 'bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {userVoted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>I have this problem too (Voted)</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span>I have this problem too</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleUseAsBase(point)}
                    className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isDark
                        ? 'text-slate-400 hover:text-cyan-400'
                        : 'text-slate-500 hover:text-blue-600'
                    }`}
                  >
                    <span>Use as base to build my pain</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Callout */}
      <div
        className={`p-6 rounded-2xl border text-center space-y-3 ${
          isDark
            ? 'bg-slate-900/40 border-slate-800'
            : 'bg-blue-50/60 border-blue-200 text-slate-800'
        }`}
      >
        <h3 className="text-base font-bold">Have a unique pain point in your country entity?</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Whether it&apos;s local statutory tax filings, multi-currency intercompany fees, or vendor billing approvals, help build the collective Controller backlog.
        </p>
        <button
          onClick={() => {
            setBuilderDraft(null);
            setActiveView('build');
          }}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md inline-flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          Start Building Your Pain Point
        </button>
      </div>
    </div>
  );
};
