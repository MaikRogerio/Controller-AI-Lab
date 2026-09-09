import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Globe2,
  Layers,
  Lightbulb,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  Vote,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { EPAM_COUNTRIES } from '../data/initialData';

export const DashboardHome: React.FC = () => {
  const {
    isDark,
    participant,
    participants,
    painPoints,
    setActiveView,
    setIsAddModalOpen,
    votePainPoint,
    hasVoted,
    setSelectedPainForPresentation,
  } = useWorkshop();

  const totalVotes = painPoints.reduce((acc, p) => acc + p.votes, 0);
  const distinctCountries = Array.from(new Set(participants.map((p) => p.country)));
  const topVotedPoints = [...painPoints].sort((a, b) => b.votes - a.votes).slice(0, 3);
  const starterPoints = painPoints.filter((p) => p.isStarter).slice(0, 4);

  const currentCountryObj = EPAM_COUNTRIES.find((c) => c.name === participant?.country) || EPAM_COUNTRIES[0];

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-12">
      {/* Top Breadcrumb & Metadata Matching Screenshot Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs tracking-wider">
        <div className="flex items-center gap-2 font-mono font-medium">
          <span className="text-base">{currentCountryObj.flag}</span>
          <span className={isDark ? 'text-cyan-400 font-bold' : 'text-blue-600 font-bold'}>
            {participant?.country || currentCountryObj.name}
          </span>
          <span className="text-slate-500">·</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
            MONTH APR 2026 · US GAAP · EUR
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Controller AI Boot Camp Active
          </span>
        </div>
      </div>

      {/* Hero Visual Section matching Screenshot Typography */}
      <div className="text-center py-6 md:py-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          CONTROLLER AI LAB
        </div>

        <h1
          className={`text-6xl md:text-8xl font-extrabold tracking-tighter uppercase select-none transition-colors ${
            isDark
              ? 'text-white drop-shadow-[0_4px_24px_rgba(0,210,230,0.15)]'
              : 'text-slate-900 drop-shadow-sm'
          }`}
        >
          PERFORMANCE
        </h1>

        <div
          className={`text-2xl md:text-3xl font-extrabold tracking-wide uppercase italic ${
            isDark ? 'text-cyan-400' : 'text-indigo-600'
          }`}
        >
          CLARITY &amp; AUTOMATION
        </div>

        <p
          className={`max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          From Chat to Co-Worker — One Controller Problem at a Time.
        </p>

        <div
          className={`max-w-xl mx-auto text-sm px-4 py-2 rounded-lg font-medium border inline-block ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 text-slate-400'
              : 'bg-white border-slate-200 text-slate-500 shadow-xs'
          }`}
        >
          <span className="font-semibold text-cyan-400 mr-1">Today's Question:</span>
          What part of your Controller work takes more time than it should?
        </div>

        {/* Hero CTAs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('starters')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white cursor-pointer active:scale-98"
          >
            Enter the Lab &amp; See Examples
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-cyan-500/50'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-xs hover:border-blue-400'
            }`}
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            Add My Controller Pain
          </button>
        </div>
      </div>

      {/* Real-time Workshop Stats Banner (PRD light gamification: 'competition is with manual work') */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl border backdrop-blur-md ${
          isDark
            ? 'bg-slate-900/50 border-slate-800 shadow-2xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Problems Discovered
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {painPoints.length}
          </div>
          <div className="text-[11px] text-slate-400">Identified by Country Controllers</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            Countries Represented
          </div>
          <div className="text-3xl font-extrabold font-mono text-blue-400">
            {distinctCountries.length}
          </div>
          <div className="text-[11px] text-slate-400">Latvia, Poland, Germany &amp; more</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Vote className="w-3.5 h-3.5 text-emerald-400" />
            Total Peer Votes
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {totalVotes}
          </div>
          <div className="text-[11px] text-slate-400">&quot;I have this problem too&quot;</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
            High AI Opportunities
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-400">
            {painPoints.filter((p) => p.opportunityRating === 'Strong candidate').length}
          </div>
          <div className="text-[11px] text-slate-400">Prime candidates for live demo</div>
        </div>
      </div>

      {/* Starter Pain Points Teaser - Page 14-15 of PRD */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              What Should AI Help Us With?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recognize any of these recurring controller bottlenecks? Click to cast your vote.
            </p>
          </div>
          <button
            onClick={() => setActiveView('starters')}
            className={`text-xs font-semibold flex items-center gap-1 hover:underline ${
              isDark ? 'text-cyan-400' : 'text-blue-600'
            }`}
          >
            View all 6 starter cards
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {starterPoints.map((item) => {
            const voted = hasVoted(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 group hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full font-mono ${
                        isDark ? 'bg-cyan-500/15 text-cyan-300' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.frequency}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-semibold leading-snug line-clamp-2 ${
                      isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-inherit/40 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-slate-400">
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>
                      {item.votes}
                    </strong>{' '}
                    Controllers
                  </span>

                  <button
                    onClick={() => votePainPoint(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      voted
                        ? 'bg-cyan-500 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {voted ? 'Voted' : 'I have this'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Emerging Priorities for Facilitator Demo */}
      <div
        className={`p-6 rounded-2xl border ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3
              className={`text-base font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Top Community Priorities Emerging Live
            </h3>
          </div>
          <button
            onClick={() => setActiveView('wall')}
            className={`text-xs font-semibold hover:underline ${
              isDark ? 'text-cyan-400' : 'text-blue-600'
            }`}
          >
            Explore Live Pain Wall &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {topVotedPoints.map((point, index) => (
            <div
              key={point.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    index === 0
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : index === 1
                      ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  #{index + 1}
                </span>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {point.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span className="font-mono text-cyan-400">{point.category}</span>
                    <span>·</span>
                    <span>{point.frequency}</span>
                    <span>·</span>
                    <span>Effort: {point.manualEffort}</span>
                    <span>·</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-medium ${
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

              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="text-right mr-1">
                  <div className="text-sm font-bold font-mono text-cyan-400">
                    {point.votes} votes
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPainForPresentation(point);
                    setActiveView('presentation');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                      : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Spotlight for Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
