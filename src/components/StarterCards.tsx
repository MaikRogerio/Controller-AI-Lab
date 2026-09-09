import React from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  HelpCircle,
  Lightbulb,
  PlusCircle,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';

export const StarterCards: React.FC = () => {
  const {
    isDark,
    painPoints,
    votePainPoint,
    hasVoted,
    setIsAddModalOpen,
    setActiveView,
    setSelectedPainForPresentation,
    setIsExplainerOpen,
  } = useWorkshop();

  const starters = painPoints.filter((p) => p.isStarter);

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-inherit pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Step 2 — Kickstart Collective Discovery
          </div>
          <h1
            className={`text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Starter Controller Pain Points
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            You don&apos;t need to know AI — you just need to identify what takes too much of your time. Vote on the common tasks below or contribute your own.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white cursor-pointer active:scale-98 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add My Controller Pain
        </button>
      </div>

      {/* Grid of 6 Starter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {starters.map((item) => {
          const voted = hasVoted(item.id);
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                isDark
                  ? 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 shadow-xl'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg'
              }`}
            >
              <div className="space-y-3">
                {/* Category badge & Frequency */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full font-mono ${
                      isDark ? 'bg-cyan-500/15 text-cyan-300' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.frequency}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-base font-bold leading-snug ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Heuristic Opportunity Tag */}
                <div className="pt-2">
                  <div
                    onClick={() => setIsExplainerOpen(true)}
                    className={`cursor-pointer inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-opacity hover:opacity-90 ${
                      item.opportunityRating === 'Strong candidate'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : item.opportunityRating === 'Worth exploring'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.opportunityRating === 'Strong candidate'
                          ? 'bg-emerald-400'
                          : item.opportunityRating === 'Worth exploring'
                          ? 'bg-amber-400'
                          : 'bg-blue-400'
                      }`}
                    />
                    <span>{item.opportunityRating}</span>
                    <HelpCircle className="w-3 h-3 text-slate-400 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-5 mt-4 border-t border-inherit/50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {item.votes} Controllers
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    experience this
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedPainForPresentation(item);
                      setActiveView('presentation');
                    }}
                    title="Spotlight in Facilitator Presentation Mode"
                    className={`p-2 rounded-lg text-xs border transition-colors ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                        : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => votePainPoint(item.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                      voted
                        ? 'bg-cyan-500 text-white shadow-md'
                        : isDark
                        ? 'bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700'
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {voted ? 'Voted' : 'I have this problem too'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step Callout */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark
            ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-slate-800'
            : 'bg-blue-50/70 border-blue-200 shadow-xs'
        }`}
      >
        <div className="space-y-1 text-center sm:text-left">
          <h3
            className={`text-base font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Have a different bottleneck in your monthly workflow?
          </h3>
          <p className="text-xs text-slate-400">
            Submit your specific task — whether in VAT compliance, intercompany billing, or journal approvals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('wall')}
            className={`px-4 py-2.5 rounded-xl font-medium text-xs border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            View Live Pain Wall &rarr;
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md cursor-pointer"
          >
            + Add My Pain Point
          </button>
        </div>
      </div>
    </div>
  );
};
