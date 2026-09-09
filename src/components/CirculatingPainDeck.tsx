import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Globe2,
  HelpCircle,
  Layers,
  LayoutGrid,
  Lightbulb,
  Maximize2,
  MousePointer,
  Orbit,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { PainPoint } from '../types';

export const CirculatingPainDeck: React.FC = () => {
  const {
    isDark,
    painPoints,
    votePainPoint,
    hasVoted,
    setActiveView,
    setBuilderDraft,
    setIsExplainerOpen,
  } = useWorkshop();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'circulating' | 'grid'>('circulating');
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  // Cursor scrub & drag refs
  const stageRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastIndexRef = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    'All',
    'Close',
    'Reporting',
    'Reconciliation',
    'Compliance',
    'Audit',
    'Follow-up',
  ];

  // Filter pain points by category
  const filteredPoints = painPoints.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Keep active index within bounds
  useEffect(() => {
    if (activeIndex >= filteredPoints.length) {
      setActiveIndex(Math.max(0, filteredPoints.length - 1));
    }
  }, [filteredPoints.length, activeIndex]);

  // Autoplay circulation (pauses on user cursor action)
  useEffect(() => {
    if (isAutoPlaying && filteredPoints.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % filteredPoints.length);
      }, 3500);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, filteredPoints.length]);

  // Handle dynamic cursor movement across the stage
  const handleMouseMoveStage = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (filteredPoints.length <= 1) return;
      if (!stageRef.current) return;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - startXRef.current;
        const threshold = 60;
        const steps = Math.trunc(deltaX / threshold);
        if (steps !== 0) {
          const newIdx =
            (((lastIndexRef.current - steps) % filteredPoints.length) +
              filteredPoints.length) %
            filteredPoints.length;
          setActiveIndex(newIdx);
        }
        return;
      }

      // Smooth horizontal cursor tracking across stage width
      const rect = stageRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;
      const clampedX = Math.max(0.05, Math.min(0.95, relativeX));
      const targetIndex = Math.floor(clampedX * filteredPoints.length);
      if (targetIndex !== activeIndex && targetIndex < filteredPoints.length) {
        setActiveIndex(targetIndex);
      }
    },
    [filteredPoints.length, activeIndex]
  );

  const handlePointerDownStage = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastIndexRef.current = activeIndex;
    setIsAutoPlaying(false);
  };

  const handlePointerUpStage = () => {
    isDraggingRef.current = false;
  };

  const handleNext = () => {
    if (filteredPoints.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredPoints.length);
  };

  const handlePrev = () => {
    if (filteredPoints.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredPoints.length) % filteredPoints.length);
  };

  const handleVote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = votePainPoint(id);
    if (success) {
      setJustVotedId(id);
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // ignore
      }
      setTimeout(() => setJustVotedId(null), 1800);
    }
  };

  const handleUseToBuild = (point: PainPoint, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const activePoint = filteredPoints[activeIndex] || filteredPoints[0];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-pill)] text-[11px] font-mono font-semibold tracking-wider uppercase bg-[var(--blue-soft)] text-[var(--primary)] border border-[#0047ff]/20">
            <Orbit className="w-3.5 h-3.5 animate-spin-slow" />
            CONTROLLER DISCOVERY · STEP 1
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            What&apos;s the painful point?
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Move your cursor across the stage to explore recurrent bottlenecks circulating across country entities, or add your own to the bootcamp agenda.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
            <button
              onClick={() => setViewMode('circulating')}
              title="Circulating 3D Deck View"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'circulating'
                  ? isDark
                    ? 'dark-option-selected font-bold text-white shadow-xs'
                    : 'bg-white text-[var(--primary)] shadow-[var(--shadow-card)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Circulate</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Standard Grid View"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? isDark
                    ? 'dark-option-selected font-bold text-white shadow-xs'
                    : 'bg-white text-[var(--primary)] shadow-[var(--shadow-card)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <button
            onClick={() => {
              setBuilderDraft(null);
              setActiveView('build');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:opacity-95 active:scale-95"
            style={{ background: 'var(--brand-gradient)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Build Your Pain</span>
          </button>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveIndex(0);
              }}
              className={`px-3 py-1.5 rounded-[var(--radius-pill)] text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                selectedCategory === cat
                  ? isDark
                    ? 'dark-option-selected-pill font-bold text-white shadow-xs'
                    : 'bg-[var(--primary)] text-white shadow-xs'
                  : isDark
                  ? 'bg-[#0a0a0a] text-zinc-300 hover:bg-[#141414] hover:text-white border border-white/10'
                  : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsExplainerOpen(true)}
          className="text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          AI Opportunity Framework
        </button>
      </div>

      {/* MODE 1: DYNAMIC CURSOR-TRACKED 3D SPATIAL DECK */}
      {viewMode === 'circulating' && filteredPoints.length > 0 && (
        <div className="space-y-6">
          {/* 3D Stage Container with cursor tracking */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMoveStage}
            onPointerDown={handlePointerDownStage}
            onPointerUp={handlePointerUpStage}
            onPointerLeave={handlePointerUpStage}
            className={`relative min-h-[460px] sm:min-h-[480px] w-full flex items-center justify-center overflow-hidden py-8 select-none perspective-stage cursor-ew-resize rounded-3xl border transition-colors ${
              isDark
                ? 'bg-[#000000] border-zinc-800/80 shadow-2xl'
                : 'bg-gradient-to-b from-slate-50 to-white border-slate-200/80 shadow-sm'
            }`}
          >
            {/* Ambient center glow */}
            <div
              className="absolute w-[500px] h-[300px] rounded-full pointer-events-none opacity-30 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(0, 71, 255, 0.25) 0%, rgba(0, 71, 255, 0) 70%)',
              }}
            />

            {/* Orbiting Cards Deck */}
            <div className="relative w-full max-w-md sm:max-w-lg h-[380px] flex items-center justify-center pointer-events-none">
              {filteredPoints.map((point, index) => {
                const total = filteredPoints.length;
                let offset = (index - activeIndex) % total;
                if (offset < -Math.floor(total / 2)) offset += total;
                if (offset > Math.floor(total / 2)) offset -= total;

                const isCurrent = offset === 0;
                const isNeighbor = Math.abs(offset) === 1;

                // Don't render cards that are too far behind
                if (Math.abs(offset) > 3) return null;

                // 3D coordinates on orbital curve
                const translateX = offset * 210;
                const translateZ = -Math.abs(offset) * 160;
                const rotateY = offset * -18;
                const scale = 1 - Math.abs(offset) * 0.12;
                const opacity = isCurrent ? 1 : isNeighbor ? 0.7 : 0.25;
                const zIndex = 30 - Math.abs(offset) * 5;

                const userVoted = hasVoted(point.id);

                return (
                  <div
                    key={point.id}
                    onClick={() => setActiveIndex(index)}
                    className={`absolute w-full h-full rounded-2xl border p-6 sm:p-7 flex flex-col justify-between cursor-pointer pointer-events-auto transition-all duration-300 ease-out ${
                      isCurrent
                        ? isDark
                          ? 'dark-option-selected text-white shadow-[0_0_35px_rgba(0,235,214,0.2)]'
                          : 'bg-white border-[var(--primary)] ring-2 ring-[var(--primary)]/40 text-[#0f172a] shadow-xl'
                        : isDark
                        ? 'bg-[#0a0a0a] border-white/10 text-zinc-300 shadow-md hover:border-white/20'
                        : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300'
                    }`}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                    }}
                  >
                    {/* Top Row: Country Entity & Category */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-mono font-bold tracking-wider uppercase border ${
                              isCurrent
                                ? 'bg-[var(--blue-soft)] text-[var(--primary)] border-[#0047ff]/30'
                                : isDark
                                ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {point.category}
                          </span>
                          <span className="text-[11px] font-medium text-[var(--text-muted)]">
                            {point.frequency}
                          </span>
                        </div>

                        {/* Votes badge */}
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-500">
                          <Flame className="w-3.5 h-3.5" />
                          <span>{point.votes} votes</span>
                        </div>
                      </div>

                      {/* Title: The specific Controller friction */}
                      <h3
                        className={`text-lg sm:text-xl font-bold tracking-tight leading-snug pt-1 ${
                          isCurrent
                            ? isDark
                              ? 'text-white'
                              : 'text-slate-900'
                            : isDark
                            ? 'text-zinc-200'
                            : 'text-slate-800'
                        }`}
                      >
                        &ldquo;{point.title}&rdquo;
                      </h3>

                      {/* Description */}
                      {point.description && (
                        <p
                          className={`text-xs leading-relaxed line-clamp-3 ${
                            isDark ? 'text-zinc-400' : 'text-slate-600'
                          }`}
                        >
                          {point.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer: Opportunity heuristic + Interactive voting */}
                    <div
                      className={`space-y-4 pt-4 border-t ${
                        isDark ? 'border-zinc-800' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)] text-[11px]">AI Suitability:</span>
                        <span
                          className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-[var(--radius-xs)] border ${
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

                      {/* Action Row */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleVote(point.id, e)}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            userVoted
                              ? isDark
                                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/50 shadow-sm'
                                : 'bg-[var(--green-soft)] text-[var(--positive)] border border-emerald-300'
                              : isDark
                              ? 'bg-[#141414] hover:bg-[var(--primary)] hover:text-white text-zinc-200 border border-zinc-800'
                              : 'bg-slate-100 hover:bg-[var(--primary)] hover:text-white text-slate-800 border border-slate-200'
                          }`}
                        >
                          {userVoted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Voted ({point.votes})</span>
                            </>
                          ) : (
                            <>
                              <Flame className="w-4 h-4 text-orange-500" />
                              <span>I have this too ({point.votes})</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => handleUseToBuild(point, e)}
                          title="Use as foundation to build your own pain point"
                          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:text-white hover:border-[var(--primary)]'
                              : 'bg-white border-slate-200 text-slate-700 hover:text-[var(--primary)] hover:border-[var(--primary)]'
                          }`}
                        >
                          Build from this
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Interactive Cursor Scrubber Bar */}
          <div
            className={`p-3.5 rounded-2xl border max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors ${
              isDark
                ? 'bg-[#000000] border-zinc-800 text-zinc-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            {/* Guidance cue with cursor icon */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <MousePointer className="w-3.5 h-3.5 text-[var(--primary)] animate-bounce" />
              <span className="font-semibold">Move cursor across deck to glide</span>
            </div>

            {/* Interactive scrub pips */}
            <div className="flex items-center gap-1.5">
              {filteredPoints.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  title={`Option ${idx + 1}: ${p.title}`}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    activeIndex === idx
                      ? 'w-7 bg-[var(--primary)]'
                      : isDark
                      ? 'w-2 bg-zinc-800 hover:bg-zinc-700'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Position counter & auto-toggle */}
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
              <span>
                {String(activeIndex + 1).padStart(2, '0')} / {String(filteredPoints.length).padStart(2, '0')}
              </span>
              <span className="opacity-30">|</span>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer ${
                  isAutoPlaying
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isAutoPlaying ? 'Auto on' : 'Auto'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: EXPANDED GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPoints.map((point) => {
            const userVoted = hasVoted(point.id);

            return (
              <div
                key={point.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-5 transition-all ${
                  isDark
                    ? 'bg-[#000000] border-zinc-800 text-zinc-100 hover:border-zinc-700 hover:shadow-[0_0_25px_rgba(0,71,255,0.15)]'
                    : 'bg-white border-slate-200 text-slate-900 hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-mono font-bold tracking-wider uppercase border ${
                        isDark
                          ? 'bg-blue-950/50 border-[#0047ff]/40 text-[#497fff]'
                          : 'bg-blue-50 border-blue-200 text-[var(--primary)]'
                      }`}
                    >
                      {point.category} · {point.frequency}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-orange-500">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{point.votes}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold leading-snug tracking-tight">
                    &ldquo;{point.title}&rdquo;
                  </h3>

                  {point.description && (
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      {point.description}
                    </p>
                  )}
                </div>

                <div
                  className={`space-y-3 pt-3 border-t ${
                    isDark ? 'border-zinc-800' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>
                      Effort: <strong className={isDark ? 'text-zinc-200' : 'text-slate-800'}>{point.manualEffort}</strong>
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-[var(--radius-xs)] border text-[11px] ${
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleVote(point.id, e)}
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
                          <span>Voted</span>
                        </>
                      ) : (
                        <>
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          <span>I have this too</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => handleUseToBuild(point, e)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:text-white hover:border-[var(--primary)]'
                          : 'bg-white border-slate-200 text-slate-700 hover:text-[var(--primary)] hover:border-[var(--primary)]'
                      }`}
                    >
                      Build
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Callout */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-colors ${
          isDark
            ? 'bg-[#000000] border-zinc-800 text-zinc-200'
            : 'bg-[var(--surface-subtle)] border-[var(--border)] text-slate-800'
        }`}
      >
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[var(--text-primary)]">
            Have a recurrent controller friction to solve?
          </h4>
          <p className="text-xs text-[var(--text-secondary)]">
            Add your operational friction to the priority wall to see its AI automation opportunity score and copilot roadmap.
          </p>
        </div>

        <button
          onClick={() => {
            setBuilderDraft(null);
            setActiveView('build');
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2 shrink-0 cursor-pointer transition-all hover:opacity-95 active:scale-95"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Your Pain Point &rarr;</span>
        </button>
      </div>
    </div>
  );
};
