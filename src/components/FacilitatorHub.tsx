import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Flame,
  Globe2,
  Layers,
  Lightbulb,
  Maximize2,
  PieChart,
  Pin,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { Category, Frequency, ManualEffort, PainPoint } from '../types';

type FacilitatorTab = 'map' | 'categories' | 'countries' | 'matrix' | 'backlog';

export const FacilitatorHub: React.FC = () => {
  const {
    isDark,
    painPoints,
    participants,
    setSelectedPainForPresentation,
    setActiveView,
    exportToCsv,
    simulateWorkshopActivity,
    resetSession,
  } = useWorkshop();

  const [activeTab, setActiveTab] = useState<FacilitatorTab>('map');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const totalVotes = painPoints.reduce((acc, p) => acc + p.votes, 0);
  const distinctCountries = Array.from(new Set(participants.map((p) => p.country)));

  // Ranked pain points
  const sortedByVotes = useMemo(() => {
    return [...painPoints].sort((a, b) => b.votes - a.votes);
  }, [painPoints]);

  const topOpportunities = sortedByVotes.slice(0, 5);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, { count: number; votes: number }> = {};
    painPoints.forEach((p) => {
      if (!counts[p.category]) counts[p.category] = { count: 0, votes: 0 };
      counts[p.category].count += 1;
      counts[p.category].votes += p.votes;
    });
    return Object.entries(counts).sort((a, b) => b[1].votes - a[1].votes);
  }, [painPoints]);

  // Country breakdown
  const countryStats = useMemo(() => {
    const counts: Record<string, { participants: number; votes: number; pains: number }> = {};
    participants.forEach((p) => {
      if (!counts[p.country]) counts[p.country] = { participants: 0, votes: 0, pains: 0 };
      counts[p.country].participants += 1;
    });
    painPoints.forEach((p) => {
      const c = p.authorCountry || 'Global';
      if (!counts[c]) counts[c] = { participants: 1, votes: 0, pains: 0 };
      counts[c].pains += 1;
      counts[c].votes += p.votes;
    });
    return Object.entries(counts).sort((a, b) => b[1].votes - a[1].votes);
  }, [participants, painPoints]);

  // Heuristic distribution
  const opportunityStats = useMemo(() => {
    const strong = painPoints.filter((p) => p.opportunityRating === 'Strong candidate');
    const exploring = painPoints.filter((p) => p.opportunityRating === 'Worth exploring');
    const controller = painPoints.filter((p) => p.opportunityRating === 'Primarily Controller judgment');
    return { strong, exploring, controller };
  }, [painPoints]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Facilitator Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-inherit pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Facilitator &amp; Leadership Command Center (Section 10 PRD)
          </div>
          <h1
            className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            THE CONTROLLER AI OPPORTUNITY MAP
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Live synthesis designed for screen sharing. Prioritize where AI should be demonstrated today during the live boot camp session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={simulateWorkshopActivity}
            title="Simulate realistic attendee submissions/votes"
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-cyan-300 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-blue-700 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            + Simulate Activity
          </button>

          <button
            onClick={exportToCsv}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Backlog (CSV)
          </button>
        </div>
      </div>

      {/* Primary 4 Metric Blocks (PRD Page 8-9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Participants</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-cyan-400 mt-2">
            {participants.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Country &amp; Regional Controllers</div>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Pain Points Submitted</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-amber-400 mt-2">
            {painPoints.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Discovered bottlenecks</div>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Votes Cast</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-emerald-400 mt-2">
            {totalVotes}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">&quot;I have this problem too&quot;</div>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>High AI Opportunities</span>
            <Lightbulb className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-purple-400 mt-2">
            {opportunityStats.strong.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Strong candidates for demo</div>
        </div>
      </div>

      {/* Screen-sharing Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-inherit pb-3 overflow-x-auto">
        {[
          { id: 'map', label: 'Top Priorities & Map', icon: <Flame className="w-4 h-4" /> },
          { id: 'matrix', label: 'AI Opportunity Matrix (Quadrant)', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'categories', label: 'By Category', icon: <PieChart className="w-4 h-4" /> },
          { id: 'countries', label: 'By Country Entity', icon: <Globe2 className="w-4 h-4" /> },
          { id: 'backlog', label: 'Complete Backlog Table', icon: <Layers className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FacilitatorTab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-white shadow-xs'
                : isDark
                ? 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Top Priorities & Opportunity Map (PRD Page 9-10) */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 5 Opportunities Leaderboard */}
          <div
            className={`lg:col-span-2 p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Top 5 Controller AI Opportunities
                </h3>
                <p className="text-xs text-slate-400">
                  Directly sorted by Controller peer validation. Click any row to launch full-screen Presentation Mode.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                Ranked by Votes
              </span>
            </div>

            <div className="space-y-3">
              {topOpportunities.map((point, idx) => (
                <div
                  key={point.id}
                  onClick={() => {
                    setSelectedPainForPresentation(point);
                    setActiveView('presentation');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group flex items-center justify-between gap-4 hover:scale-[1.01] ${
                    isDark
                      ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        idx === 0
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : idx === 1
                          ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="space-y-1">
                      <h4
                        className={`text-sm font-semibold group-hover:text-cyan-400 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {point.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span className="text-cyan-400">{point.category}</span>
                        <span>·</span>
                        <span>{point.frequency}</span>
                        <span>·</span>
                        <span>Effort: {point.manualEffort}</span>
                        <span>·</span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-sans font-medium ${
                            point.opportunityRating === 'Strong candidate'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : point.opportunityRating === 'Worth exploring'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-blue-400 bg-blue-500/10'
                          }`}
                        >
                          {point.opportunityRating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-cyan-400">
                        {point.votes}
                      </div>
                      <div className="text-[10px] text-slate-400">votes</div>
                    </div>

                    <button
                      className="p-2 rounded-lg bg-cyan-500 text-white shadow-xs group-hover:bg-cyan-400 transition-colors"
                      title="Launch for Live AI Demo"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facilitation Quick Action Sidebar */}
          <div className="space-y-6">
            {/* Spotlight Demo Callout */}
            <div
              className={`p-5 rounded-2xl border space-y-4 ${
                isDark
                  ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/30'
                  : 'bg-blue-50/80 border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4
                  className={`text-sm font-bold uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Live Facilitator Sequence
                </h4>
              </div>

              <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center">1</span>
                  <span>Controllers submit and vote on pain points.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center">2</span>
                  <span>Top priority surfaces organically.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center">3</span>
                  <span className="font-semibold text-cyan-400">Facilitator selects #1 for live AI demo.</span>
                </div>
              </div>

              {topOpportunities[0] && (
                <button
                  onClick={() => {
                    setSelectedPainForPresentation(topOpportunities[0]);
                    setActiveView('presentation');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-cyan-500 hover:bg-cyan-400 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  Present #1 ({topOpportunities[0].category})
                </button>
              )}
            </div>

            {/* Heuristic Breakdown Stats */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                AI Suitability Distribution
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Strong candidate
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {opportunityStats.strong.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Worth exploring
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {opportunityStats.exploring.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Controller judgment
                  </span>
                  <span className="font-mono font-bold text-blue-400">
                    {opportunityStats.controller.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Quadrant / Opportunity Matrix */}
      {activeTab === 'matrix' && (
        <div
          className={`p-6 rounded-2xl border space-y-6 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <h3
              className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Effort vs. Frequency AI Matrix
            </h3>
            <p className="text-xs text-slate-400">
              High manual effort + high frequency tasks offer the fastest return on AI copilot assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Right: High Effort & Recurring (The Sweet Spot) */}
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                isDark
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-emerald-50/80 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prime AI Candidates (High Effort + Recurring)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {painPoints.filter((p) => p.manualEffort === 'High' && ['Daily', 'Weekly', 'Monthly'].includes(p.frequency)).length} items
                </span>
              </div>
              <div className="space-y-2">
                {painPoints
                  .filter((p) => p.manualEffort === 'High' && ['Daily', 'Weekly', 'Monthly'].includes(p.frequency))
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPainForPresentation(p);
                        setActiveView('presentation');
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between ${
                        isDark ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-400' : 'bg-white border-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      <span className="font-medium truncate mr-2">{p.title}</span>
                      <span className="font-mono text-emerald-400 shrink-0">{p.votes} votes</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Left: Medium Effort & Recurring */}
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                isDark
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-amber-50/80 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Quick Wins (Medium Effort + High Frequency)
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {painPoints.filter((p) => p.manualEffort === 'Medium' && ['Daily', 'Weekly', 'Monthly'].includes(p.frequency)).length} items
                </span>
              </div>
              <div className="space-y-2">
                {painPoints
                  .filter((p) => p.manualEffort === 'Medium' && ['Daily', 'Weekly', 'Monthly'].includes(p.frequency))
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPainForPresentation(p);
                        setActiveView('presentation');
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between ${
                        isDark ? 'bg-slate-900/80 border-slate-800 hover:border-amber-400' : 'bg-white border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <span className="font-medium truncate mr-2">{p.title}</span>
                      <span className="font-mono text-amber-400 shrink-0">{p.votes} votes</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Category Breakdown */}
      {activeTab === 'categories' && (
        <div
          className={`p-6 rounded-2xl border space-y-6 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <h3
              className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Pain Points by Controller Discipline
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated friction across accounting functions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map(([cat, stats]) => (
              <div
                key={cat}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-cyan-400 uppercase">
                      {cat}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {stats.count} issues
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold font-mono text-white">
                    {stats.votes} <span className="text-xs font-sans font-normal text-slate-400">total votes</span>
                  </div>
                </div>

                <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (stats.votes / Math.max(1, totalVotes)) * 100 * 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: By Country Entity */}
      {activeTab === 'countries' && (
        <div
          className={`p-6 rounded-2xl border space-y-6 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <h3
              className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Controller Participation by Country
            </h3>
            <p className="text-xs text-slate-400">
              Engagement across EPAM regional subsidiaries (Latvia, Poland, Germany, etc.).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryStats.map(([country, stats]) => (
              <div
                key={country}
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    {country}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    {stats.votes} votes
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                  <span>{stats.participants} Controllers</span>
                  <span>·</span>
                  <span>{stats.pains} Submissions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Complete Backlog Table */}
      {activeTab === 'backlog' && (
        <div
          className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="p-4 border-b border-inherit flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold">Complete Prioritized Backlog ({painPoints.length} items)</h3>
            <button
              onClick={exportToCsv}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download Full CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b border-inherit font-mono uppercase tracking-wider text-[10px] ${
                isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'
              }`}>
                <tr>
                  <th className="p-3">Votes</th>
                  <th className="p-3">Pain Point</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Effort</th>
                  <th className="p-3">AI Opportunity</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {sortedByVotes.map((p) => (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-cyan-400">{p.votes}</td>
                    <td className="p-3 font-semibold max-w-xs truncate">{p.title}</td>
                    <td className="p-3 font-mono">{p.category}</td>
                    <td className="p-3">{p.frequency}</td>
                    <td className="p-3">{p.manualEffort}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                          p.opportunityRating === 'Strong candidate'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : p.opportunityRating === 'Worth exploring'
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-blue-400 bg-blue-500/10'
                        }`}
                      >
                        {p.opportunityRating}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedPainForPresentation(p);
                          setActiveView('presentation');
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-white font-semibold cursor-pointer text-[11px]"
                      >
                        Present
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
