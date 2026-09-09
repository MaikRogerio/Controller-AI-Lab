import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Globe2,
  HelpCircle,
  Layers,
  Lightbulb,
  ListFilter,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { PainPoint } from '../types';

export const PainWallStep: React.FC = () => {
  const {
    isDark,
    painPoints,
    votePainPoint,
    hasVoted,
    togglePipeline,
    setActiveView,
    setIsExplainerOpen,
    exportToCsv,
    simulateWorkshopActivity,
  } = useWorkshop();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  // Sorting: Top voted first
  const sortedPoints = [...painPoints].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const topPriority = sortedPoints[0];
  const totalVotes = painPoints.reduce((acc, p) => acc + p.votes, 0);
  const pipelinePoints = painPoints.filter((p) => p.inPipeline || (p.id === topPriority?.id && p.inPipeline !== false));
  const pipelineCount = pipelinePoints.length;

  const filteredPoints = sortedPoints.filter((point) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = point.title.toLowerCase().includes(q);
      const matchDesc = point.description?.toLowerCase().includes(q) || false;
      const matchCat = point.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (activeFilter === 'all') return true;
    if (activeFilter === 'pipeline') return point.inPipeline || (point.id === topPriority?.id && point.inPipeline !== false);
    if (activeFilter === 'top') return point.votes >= 4;
    if (activeFilter === 'high_opportunity')
      return point.opportunityRating === 'Strong candidate';

    return point.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleVote = (id: string) => {
    const success = votePainPoint(id);
    if (success) {
      setJustVotedId(id);
      try {
        confetti({
          particleCount: 25,
          spread: 55,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
      setTimeout(() => setJustVotedId(null), 1800);
    }
  };

  const handleTogglePipeline = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    togglePipeline(id);
    try {
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <button
          onClick={() => setActiveView('build')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#000000] border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Add Another Pain Point</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--primary)] uppercase tracking-wider">
          <Workflow className="w-4 h-4" />
          <span>STEP 3 · THE OVERALL PAIN WALL &amp; BOOTCAMP PIPELINE</span>
        </div>

        <button
          onClick={() => setActiveFilter(activeFilter === 'pipeline' ? 'all' : 'pipeline')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
            activeFilter === 'pipeline'
              ? isDark
                ? 'dark-option-selected font-bold text-white shadow-xs'
                : 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
              : isDark
              ? 'bg-[#000000] border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
          }`}
        >
          <Rocket className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Bootcamp Pipeline ({pipelineCount})</span>
        </button>
      </div>

      {/* #1 Group Priority Hero Card: Anchors the Bootcamp Working Pipeline */}
      {topPriority && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
            isDark
              ? 'bg-[#000000] border-zinc-800 text-white shadow-[0_0_40px_rgba(0,71,255,0.18)]'
              : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}
        >
          {/* Subtle Ambient Background Accent */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(0, 71, 255, 0.4) 0%, transparent 70%)',
            }}
          />

          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-[var(--radius-pill)] text-xs font-mono font-bold uppercase tracking-wider bg-[var(--primary)] text-white shadow-2xs">
                  #1 BOOTCAMP PIPELINE PRIORITY
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Committed to Controller AI Bootcamp Working Backlog
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-500">
                <Flame className="w-4 h-4 fill-orange-500/20" />
                <span>{topPriority.votes} Controllers Impacted</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
              &ldquo;{topPriority.title}&rdquo;
            </h2>

            {topPriority.description && (
              <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {topPriority.description}
              </p>
            )}

            <div className={`pt-4 flex flex-wrap items-center justify-between gap-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[var(--primary)]">
                  {topPriority.category}
                </span>
                <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>·</span>
                <span className={isDark ? 'text-zinc-300' : 'text-slate-700'}>{topPriority.frequency}</span>
                <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>·</span>
                <span className={isDark ? 'text-zinc-300' : 'text-slate-700'}>Effort: {topPriority.manualEffort}</span>
                <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>·</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-[var(--radius-xs)] border ${
                    topPriority.opportunityRating === 'Strong candidate'
                      ? isDark
                        ? 'bg-transparent text-emerald-300 border-emerald-500/50'
                        : 'bg-[var(--green-soft)] text-[var(--positive)] border-emerald-200'
                      : isDark
                      ? 'bg-transparent text-amber-300 border-amber-500/50'
                      : 'bg-[var(--amber-soft)] text-[var(--warning)] border-amber-200'
                  }`}
                >
                  {topPriority.opportunityRating}
                </span>
              </div>

              {/* Pipeline Commitment Indicator */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleTogglePipeline(topPriority.id, e)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    topPriority.inPipeline !== false
                      ? isDark
                        ? 'bg-blue-950/70 text-[#598aff] border border-[#0047ff]/50'
                        : 'bg-blue-50 text-[var(--primary)] border border-blue-200'
                      : 'bg-[var(--primary)] text-white hover:opacity-90'
                  }`}
                >
                  <Check className="w-4 h-4 text-[var(--primary)]" />
                  <span>
                    {topPriority.inPipeline !== false ? 'In Bootcamp Pipeline' : 'Bring to Pipeline'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wall Stats & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bottlenecks, country, or category..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
              isDark
                ? 'bg-[#000000] border-zinc-800 text-zinc-100 placeholder-zinc-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Quick Tally Info */}
        <div className={`flex items-center gap-3 text-xs font-mono font-medium shrink-0 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
          <span>{painPoints.length} Bottlenecks</span>
          <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>·</span>
          <span className="text-orange-500 font-bold">{totalVotes} Total Votes</span>
          <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>·</span>
          <span className="text-[var(--primary)] font-bold">{pipelineCount} in Pipeline</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Pains' },
          { id: 'pipeline', label: `🚀 Pipeline (${pipelineCount})` },
          { id: 'top', label: '🔥 Most Voted' },
          { id: 'high_opportunity', label: '💡 Strong AI Fit' },
          { id: 'Close', label: 'Close' },
          { id: 'Reporting', label: 'Reporting' },
          { id: 'Reconciliation', label: 'Reconciliations' },
          { id: 'Compliance', label: 'Compliance' },
          { id: 'Audit', label: 'Audit' },
          { id: 'Follow-up', label: 'Follow-up' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-[var(--radius-pill)] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === tab.id
                ? isDark
                  ? 'dark-option-selected-pill font-bold text-white shadow-xs'
                  : 'bg-[var(--primary)] text-white shadow-xs'
                : isDark
                ? 'bg-[#0a0a0a] text-zinc-300 hover:text-white border border-white/10'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wall Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPoints.map((point, index) => {
          const userVoted = hasVoted(point.id);
          const inPipeline = point.inPipeline || (point.id === topPriority?.id && point.inPipeline !== false);

          return (
            <div
              key={point.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-200 ${
                isDark
                  ? 'bg-[#000000] border-zinc-800 text-zinc-100 hover:border-zinc-700'
                  : 'bg-white border-slate-200 text-slate-900 hover:shadow-md hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      #{index + 1} · {point.category}
                    </span>
                    <span className={`text-[11px] truncate flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      • {point.frequency}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-orange-500">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{point.votes}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold leading-snug tracking-tight">
                  &ldquo;{point.title}&rdquo;
                </h3>

                {point.description && (
                  <p className={`text-xs leading-relaxed line-clamp-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {point.description}
                  </p>
                )}
              </div>

              <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>
                    Frequency: {point.frequency}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-[var(--radius-xs)] border ${
                      point.opportunityRating === 'Strong candidate'
                        ? isDark
                          ? 'bg-transparent text-emerald-300 border-emerald-500/50'
                          : 'bg-[var(--green-soft)] text-[var(--positive)] border-emerald-200'
                        : isDark
                        ? 'bg-transparent text-amber-300 border-amber-500/50'
                        : 'bg-[var(--amber-soft)] text-[var(--warning)] border-amber-200'
                    }`}
                  >
                    {point.opportunityRating}
                  </span>
                </div>

                {/* Card Actions: Vote + Bring to Pipeline */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(point.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userVoted
                        ? isDark
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/50'
                          : 'bg-[var(--green-soft)] text-[var(--positive)] border border-emerald-300'
                        : isDark
                        ? 'bg-[#141414] hover:bg-[var(--primary)] hover:text-white text-zinc-200 border border-zinc-800'
                        : 'bg-slate-100 hover:bg-[var(--primary)] hover:text-white text-slate-800 border border-slate-200'
                    }`}
                  >
                    {userVoted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>I have this too</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span>I have this too</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => handleTogglePipeline(point.id, e)}
                    title={inPipeline ? 'Included in Bootcamp Pipeline' : 'Bring to Bootcamp Pipeline'}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      inPipeline
                        ? isDark
                          ? 'bg-blue-950/50 border-[#0047ff]/40 text-[#497fff]'
                          : 'bg-blue-50 border-blue-200 text-[var(--primary)]'
                        : isDark
                        ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:border-[var(--primary)] hover:text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                    }`}
                  >
                    {inPipeline ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span>Pipeline</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Bring</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Facilitator Workshop Toolstrip */}
      <div
        className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 text-xs transition-colors ${
          isDark
            ? 'bg-[#000000] border-zinc-800 text-zinc-300'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
          <span>Fiduciary Governance: Country Controllers retain final review and sign-off authority.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateWorkshopActivity}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            + Simulate Participant Activity
          </button>

          <button
            onClick={exportToCsv}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Pipeline Backlog (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
