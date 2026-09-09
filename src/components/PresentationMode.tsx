import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Flame,
  Globe2,
  Layers,
  Lightbulb,
  Maximize2,
  Minimize2,
  Rocket,
  Share2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { PainPoint } from '../types';

export const PresentationMode: React.FC = () => {
  const {
    isDark,
    painPoints,
    selectedPainForPresentation,
    setSelectedPainForPresentation,
    togglePipeline,
    setActiveView,
  } = useWorkshop();

  const [isPipelineLabActive, setIsPipelineLabActive] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Fallback to highest voted if none specifically chosen
  const activePain: PainPoint =
    selectedPainForPresentation ||
    [...painPoints].sort((a, b) => b.votes - a.votes)[0] ||
    painPoints[0];

  const handleNext = () => {
    const sorted = [...painPoints].sort((a, b) => b.votes - a.votes);
    const currIdx = sorted.findIndex((p) => p.id === activePain.id);
    const nextIdx = (currIdx + 1) % sorted.length;
    setSelectedPainForPresentation(sorted[nextIdx]);
    setIsPipelineLabActive(false);
  };

  const handlePrev = () => {
    const sorted = [...painPoints].sort((a, b) => b.votes - a.votes);
    const currIdx = sorted.findIndex((p) => p.id === activePain.id);
    const prevIdx = (currIdx - 1 + sorted.length) % sorted.length;
    setSelectedPainForPresentation(sorted[prevIdx]);
    setIsPipelineLabActive(false);
  };

  const handleCommitToPipeline = () => {
    if (!activePain.inPipeline) {
      togglePipeline(activePain.id);
    }
    setIsPipelineLabActive(true);
    try {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  // Generate actionable Copilot / Enterprise AI prompt tailored to this controller pain point
  const samplePrompt = `As a Senior Financial Controller assistant for EPAM Systems, help me streamline the following recurring ${activePain.category} workflow:

PROBLEM CONTEXT:
"${activePain.title}"
${activePain.description ? `Specific friction: "${activePain.description}"` : ''}

FREQUENCY & RIGOR:
- Recurrence: ${activePain.frequency}
- Manual effort: ${activePain.manualEffort}
- Fiduciary requirement: US GAAP compliance, audit-trail verified

INSTRUCTIONS FOR COPILOT:
1. Standardize and consolidate input data across entity tables without altering raw records.
2. Highlight exceptions, unexplained variances > 5%, or missing sign-offs.
3. Draft a succinct executive commentary summary for the Country Controller's review.
4. Prepare a validation checklist ensuring the Controller retains final sign-off authority.`;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(samplePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[85vh] flex flex-col justify-between space-y-8 animate-in fade-in duration-200">
      {/* Top Presenter Bar */}
      <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveView('wall')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#000000] border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pain Wall
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary)] font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Bootcamp Pipeline Spotlight Stage</span>
        </div>

        {/* Carousel Prev/Next */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            title="Previous priority"
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#000000] border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            title="Next priority"
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#000000] border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Spotlight Card */}
      {!isPipelineLabActive ? (
        <div
          className={`p-8 md:p-12 rounded-3xl border flex flex-col justify-between space-y-8 transition-all ${
            isDark
              ? 'bg-[#000000] border-zinc-800 text-zinc-100 shadow-[0_0_50px_rgba(0,71,255,0.2)]'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="space-y-6">
            {/* Header Eyebrow */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-blue-500/15 text-[var(--primary)] border border-blue-500/30">
                CONTROLLER BOOTCAMP CANDIDATE
              </span>

              <div className="flex items-center gap-2 text-sm font-mono font-bold text-orange-500">
                <Flame className="w-4 h-4" />
                <span>{activePain.votes} Country Controllers Affected</span>
              </div>
            </div>

            {/* Display Title */}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              &ldquo;{activePain.title}&rdquo;
            </h1>

            {/* Detailed Description */}
            {activePain.description && (
              <p className={`text-base md:text-lg max-w-3xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {activePain.description}
              </p>
            )}

            {/* Metadata Badges */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <div
                className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Discipline</div>
                <div className="text-sm font-bold text-[var(--primary)] mt-0.5">{activePain.category}</div>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Frequency</div>
                <div className="text-sm font-bold mt-0.5">{activePain.frequency}</div>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Manual Effort</div>
                <div
                  className={`text-sm font-bold mt-0.5 ${
                    activePain.manualEffort === 'High' ? 'text-orange-500' : isDark ? 'text-zinc-300' : 'text-slate-700'
                  }`}
                >
                  {activePain.manualEffort}
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>AI Suitability</div>
                <div className="text-sm font-bold text-emerald-500 mt-0.5 truncate">
                  {activePain.opportunityRating}
                </div>
              </div>
            </div>

            {/* Philosophy quote */}
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                isDark
                  ? 'bg-blue-950/20 border-[#0047ff]/30 text-blue-300'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">
                  Bootcamp Philosophy Anchor:
                </strong>
                &ldquo;You gave me this problem. Let&apos;s see what AI can actually do with it. AI supports data consolidation and variance triage; the Country Controller retains fiduciary professional judgment.&rdquo;
              </div>
            </div>
          </div>

          {/* Central Call-to-Action: Bring to Bootcamp Pipeline */}
          <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Submitted from <strong className="text-[var(--primary)]">{activePain.authorCountry}</strong> entity · Voted by {activePain.votes} controllers
            </div>

            <button
              onClick={handleCommitToPipeline}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-white shadow-md transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2.5 hover:opacity-95"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <Rocket className="w-4 h-4" />
              <span>BRING TO BOOTCAMP PIPELINE &amp; ARCHITECTURE LAB</span>
            </button>
          </div>
        </div>
      ) : (
        /* BOOTCAMP PIPELINE & ARCHITECTURE WORKFLOW STAGE */
        <div
          className={`p-8 md:p-10 rounded-3xl border shadow-2xl space-y-6 transition-all ${
            isDark
              ? 'bg-[#000000] border-zinc-800 text-zinc-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <h2 className="text-lg sm:text-xl font-bold">
                Bootcamp Working Pipeline &amp; Solution Architecture Stage
              </h2>
            </div>

            <button
              onClick={() => setIsPipelineLabActive(false)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              &larr; Return to Spotlight Card
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-[var(--primary)] tracking-wider">
              Selected Bootcamp Priority:
            </div>
            <h3 className="text-2xl font-bold">
              &ldquo;{activePain.title}&rdquo;
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              {activePain.opportunityRationale}
            </p>
          </div>

          {/* Prompt Bridge for Corporate Environment (Microsoft 365 Copilot / Enterprise AI) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                <Terminal className="w-4 h-4 text-[var(--primary)]" />
                Actionable Copilot Prompt (Ready for Controller Validation):
              </span>
              <button
                onClick={copyPromptToClipboard}
                className="px-3 py-1 rounded-lg text-xs font-medium border bg-blue-500/15 text-[var(--primary)] border-blue-500/30 hover:bg-blue-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>

            <pre
              className={`p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto ${
                isDark ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {samplePrompt}
            </pre>
          </div>

          {/* Bootcamp Working Architecture Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-[var(--primary)] block mb-1">Module 1: Ingestion &amp; Sanitization</span>
              <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>Isolate entity workbooks, strip proprietary PII, and normalize headers across countries.</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-[var(--primary)] block mb-1">Module 2: Copilot Rule Validation</span>
              <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>Enforce statutory variance thresholds (&gt;5%) and surface discrepancies automatically.</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-[var(--primary)] block mb-1">Module 3: Fiduciary Controller Sign-Off</span>
              <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>Generate structured commentary for country controllers to inspect, adjust, and approve.</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer Tip */}
      <div className={`text-center text-xs ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
        Controller AI Lab · Bootcamp Pipeline Instrument · EPAM Systems
      </div>
    </div>
  );
};
