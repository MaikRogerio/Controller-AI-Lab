import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Flame,
  Globe2,
  HelpCircle,
  Lightbulb,
  Pin,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { Category, OpportunityRating, PainPoint } from '../types';

type DimensionFilter = 'all' | 'most-common' | 'high-frequency' | 'high-opportunity';

export const LivePainWall: React.FC = () => {
  const {
    isDark,
    painPoints,
    votePainPoint,
    hasVoted,
    setIsAddModalOpen,
    setIsExplainerOpen,
    setSelectedPainForPresentation,
    setActiveView,
    deletePainPoint,
    togglePinPainPoint,
  } = useWorkshop();

  const [dimensionFilter, setDimensionFilter] = useState<DimensionFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Categories present in the dataset
  const availableCategories = useMemo(() => {
    const set = new Set<Category>();
    painPoints.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [painPoints]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    painPoints.forEach((p) => {
      if (p.authorCountry) set.add(p.authorCountry);
    });
    return ['All', ...Array.from(set)];
  }, [painPoints]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...painPoints];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Country filter
    if (selectedCountry !== 'All') {
      result = result.filter((p) => p.authorCountry === selectedCountry);
    }

    // 3 Visual Dimensions from PRD page 7:
    // 1. Most common (Most votes)
    // 2. High-frequency (Daily/Weekly)
    // 3. High opportunity (Strong candidate)
    if (dimensionFilter === 'most-common') {
      result.sort((a, b) => b.votes - a.votes);
    } else if (dimensionFilter === 'high-frequency') {
      result = result.filter((p) => ['Daily', 'Weekly'].includes(p.frequency));
      result.sort((a, b) => b.votes - a.votes);
    } else if (dimensionFilter === 'high-opportunity') {
      result = result.filter((p) => p.opportunityRating === 'Strong candidate');
      result.sort((a, b) => b.votes - a.votes);
    } else {
      // Default: Pinned items first, then by votes
      result.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.votes - a.votes;
      });
    }

    return result;
  }, [painPoints, searchQuery, selectedCategory, selectedCountry, dimensionFilter]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-inherit pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            Step 4 — The Live Pain Wall (Centerpiece)
          </div>
          <h1
            className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            What is hurting us most?
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Live aggregated Controller bottlenecks across entities. Vote on issues you experience to help the facilitator spotlight top priorities for today&apos;s AI demonstration.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            Add My Pain Point
          </button>
        </div>
      </div>

      {/* Visual Dimension Prioritization Tabs (PRD Section 8) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* The 3 Core Visual Dimensions from PRD */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDimensionFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              dimensionFilter === 'all'
                ? 'bg-cyan-500 text-white font-semibold shadow-xs'
                : isDark
                ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Submissions ({painPoints.length})
          </button>

          <button
            onClick={() => setDimensionFilter('most-common')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              dimensionFilter === 'most-common'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : isDark
                ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            🔥 Most Common (Top Voted)
          </button>

          <button
            onClick={() => setDimensionFilter('high-frequency')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              dimensionFilter === 'high-frequency'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : isDark
                ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            ⚡ High-Frequency (Daily/Weekly)
          </button>

          <button
            onClick={() => setDimensionFilter('high-opportunity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              dimensionFilter === 'high-opportunity'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : isDark
                ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
            💡 High AI Opportunity
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pain points, keywords..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
            }`}
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-mono shrink-0 uppercase tracking-wider mr-1">
          Category:
        </span>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-colors ${
              selectedCategory === cat
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-blue-100 text-blue-800 border border-blue-200 font-semibold'
                : isDark
                ? 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* The Cards Grid */}
      {filteredItems.length === 0 ? (
        <div
          className={`text-center py-16 px-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3
            className={`text-base font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            No pain points match your filters
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Try clearing filters or submit a new Controller pain point.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedCountry('All');
              setDimensionFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const voted = hasVoted(item.id);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 group relative hover:-translate-y-1 ${
                  item.isPinned
                    ? isDark
                      ? 'bg-gradient-to-b from-slate-900 to-slate-900/90 border-cyan-500/40 shadow-xl'
                      : 'bg-blue-50/30 border-blue-300 shadow-md'
                    : isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Card Top Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full font-mono ${
                          isDark ? 'bg-cyan-500/15 text-cyan-300' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.category}
                      </span>
                      {item.isPinned && (
                        <span
                          title="Pinned Starter Question"
                          className="inline-flex items-center p-0.5 text-cyan-400"
                        >
                          <Pin className="w-3 h-3 rotate-45" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.frequency}
                      </span>
                      <span>·</span>
                      <span
                        className={`font-semibold ${
                          item.manualEffort === 'High' ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {item.manualEffort} effort
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-base font-bold leading-snug ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Description if present */}
                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Submitter Country and Judgment Level */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Globe2 className="w-3 h-3 text-cyan-400" />
                      {item.authorCountry}
                    </span>
                    <span>·</span>
                    <span className="italic">{item.judgmentLevel}</span>
                  </div>

                  {/* Heuristic AI Opportunity Indicator (PRD Section 8 & 9) */}
                  <div className="pt-1">
                    <div
                      onClick={() => setIsExplainerOpen(true)}
                      className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-opacity hover:opacity-90 ${
                        item.opportunityRating === 'Strong candidate'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.opportunityRating === 'Worth exploring'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
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

                {/* Card Bottom: Votes & Interactive CTA */}
                <div className="pt-5 mt-4 border-t border-inherit/40 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-mono font-bold text-cyan-400">
                      {item.votes} Controllers
                    </span>
                    <span className="text-[10px] text-slate-400">
                      have this problem
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Facilitator Spotlight Button */}
                    <button
                      onClick={() => {
                        setSelectedPainForPresentation(item);
                        setActiveView('presentation');
                      }}
                      title="Spotlight for Live AI Demo Presentation"
                      className={`p-2 rounded-lg text-xs border transition-colors ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                          : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {/* Pin toggle */}
                    <button
                      onClick={() => togglePinPainPoint(item.id)}
                      title={item.isPinned ? 'Unpin' : 'Pin to top'}
                      className={`p-2 rounded-lg text-xs border transition-colors ${
                        item.isPinned
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : isDark
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400'
                          : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete for custom points */}
                    {!item.isStarter && (
                      <button
                        onClick={() => deletePainPoint(item.id)}
                        title="Delete pain point"
                        className={`p-2 rounded-lg text-xs border transition-colors ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 hover:bg-rose-900/30 hover:text-rose-400 text-slate-400'
                            : 'bg-slate-100 border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Primary Vote Button */}
                    <button
                      onClick={() => votePainPoint(item.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        voted
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : isDark
                          ? 'bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {voted ? 'Voted' : 'I have this'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
