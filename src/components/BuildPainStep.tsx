import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { Category, Frequency, JudgmentLevel, ManualEffort } from '../types';
import { calculateOpportunity } from '../utils/opportunityHeuristic';

const CATEGORIES_LIST: { id: Category; name: string; description: string }[] = [
  { id: 'Close', name: 'Close', description: 'Month-end checklist & status' },
  { id: 'Reporting', name: 'Reporting', description: 'Management decks & consolidation' },
  { id: 'Reconciliation', name: 'Reconciliations', description: 'Variance & clearing lines' },
  { id: 'Compliance', name: 'Compliance', description: 'Statutory & tax filings' },
  { id: 'Audit', name: 'Audit', description: 'PBC requests & exhibits' },
  { id: 'Follow-up', name: 'Follow-up', description: 'Chasing sign-offs & approvals' },
];

const COMMON_PROMPT_INSPIRATIONS = [
  'Consolidating monthly close variance reports across 8 entity spreadsheets',
  'Matching bank statements to ERP accounts payable clearing lines',
  'Monitoring local statutory tax rate and withholding regulation changes',
  'Chasing project managers and regional leads for month-end WIP approvals',
  'Gathering supporting documentation samples for external SOX auditors',
  'Reconciling intercompany billing imbalances before quarterly freeze',
];

export const BuildPainStep: React.FC = () => {
  const {
    isDark,
    participant,
    builderDraft,
    setBuilderDraft,
    addPainPoint,
    setActiveView,
    setIsExplainerOpen,
  } = useWorkshop();

  const [title, setTitle] = useState(builderDraft?.title || '');
  const [description, setDescription] = useState(builderDraft?.description || '');
  const [category, setCategory] = useState<Category>(builderDraft?.category || 'Close');
  const [frequency, setFrequency] = useState<Frequency>(builderDraft?.frequency || 'Monthly');
  const [manualEffort, setManualEffort] = useState<ManualEffort>(builderDraft?.manualEffort || 'High');
  const [judgmentLevel, setJudgmentLevel] = useState<JudgmentLevel>(
    builderDraft?.judgmentLevel || 'Mostly administrative'
  );

  useEffect(() => {
    if (builderDraft) {
      if (builderDraft.title) setTitle(builderDraft.title);
      if (builderDraft.description) setDescription(builderDraft.description);
      if (builderDraft.category) setCategory(builderDraft.category);
      if (builderDraft.frequency) setFrequency(builderDraft.frequency);
      if (builderDraft.manualEffort) setManualEffort(builderDraft.manualEffort);
      if (builderDraft.judgmentLevel) setJudgmentLevel(builderDraft.judgmentLevel);
    }
  }, [builderDraft]);

  const evaluation = calculateOpportunity(manualEffort, frequency, judgmentLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addPainPoint({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      manualEffort,
      judgmentLevel,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // ignore
    }

    setBuilderDraft(null);
    setActiveView('wall');
  };

  const handleApplyInspiration = (text: string) => {
    setTitle(text);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <button
          onClick={() => setActiveView('starters')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Step 1
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--purple)] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          STEP 2 · PAIN BUILDER
        </div>

        <button
          onClick={() => setActiveView('wall')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          View Wall
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Help the Controller build their pain
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            State what takes too much of your time in your operations. We&apos;ll evaluate how Copilots and AI can assist while you preserve fiduciary oversight.
          </p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Card: Prompt Construction */}
        <div
          className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {/* Sentence Prompt: I spend too much time: ... */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              The Controller Friction Point:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-xs font-semibold text-[var(--primary)] pointer-events-none">
                I spend too much time:
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. consolidating statutory tax reports across 8 entity spreadsheets..."
                className="w-full pl-44 pr-4 py-3 rounded-xl border border-[var(--outline-light)] bg-[var(--surface-subtle)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)] font-medium transition-colors"
              />
            </div>

            {/* Quick Inspiration Chips */}
            <div className="pt-2">
              <span className="text-[11px] text-[var(--text-muted)] font-mono block mb-1.5">
                Quick inspiration (click to use):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_PROMPT_INSPIRATIONS.map((insp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyInspiration(insp)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] border text-left transition-colors cursor-pointer ${
                      title === insp
                        ? isDark
                          ? 'dark-option-selected font-bold text-white shadow-xs'
                          : 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : isDark
                        ? 'bg-[#0a0a0a] border-white/10 text-zinc-300 hover:text-white hover:border-white/25'
                        : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    + {insp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Friction Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Where does it break or delay? (Optional Context):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Local vendor invoices arrive in non-standard PDFs, requiring line-by-line manual retyping into SAP before the 5th business day."
              className="w-full p-3 rounded-xl border border-[var(--outline-light)] bg-[var(--surface-subtle)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* Category Selector Tiles */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Controller Discipline:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {CATEGORIES_LIST.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as Category)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'dark-option-selected font-bold text-white shadow-[0_0_16px_rgba(0,235,214,0.18)]'
                          : 'bg-white border-2 border-[var(--primary)] text-[var(--primary)] ring-1 ring-[var(--primary)]'
                        : isDark
                        ? 'bg-[#0a0a0a] border-white/10 text-zinc-300 hover:border-white/20 hover:text-white'
                        : 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--outline-light)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <span className="text-xs font-bold">{cat.name}</span>
                    <span className={`text-[10px] truncate ${isSelected && isDark ? 'text-zinc-200' : 'text-[var(--text-muted)]'}`}>
                      {cat.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameters: Frequency, Effort, Judgment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[var(--border)]">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0a0a0a] border-white/15 text-zinc-100'
                    : 'bg-[var(--surface-subtle)] border-[var(--outline-light)] text-[var(--text-primary)]'
                }`}
              >
                <option value="Daily" className={isDark ? 'bg-black text-white' : ''}>Daily</option>
                <option value="Weekly" className={isDark ? 'bg-black text-white' : ''}>Weekly</option>
                <option value="Monthly" className={isDark ? 'bg-black text-white' : ''}>Monthly</option>
                <option value="Quarterly" className={isDark ? 'bg-black text-white' : ''}>Quarterly</option>
                <option value="Annually" className={isDark ? 'bg-black text-white' : ''}>Annually</option>
                <option value="Ad hoc" className={isDark ? 'bg-black text-white' : ''}>Ad hoc / On Demand</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Manual Effort
              </label>
              <select
                value={manualEffort}
                onChange={(e) => setManualEffort(e.target.value as ManualEffort)}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0a0a0a] border-white/15 text-zinc-100'
                    : 'bg-[var(--surface-subtle)] border-[var(--outline-light)] text-[var(--text-primary)]'
                }`}
              >
                <option value="High" className={isDark ? 'bg-black text-white' : ''}>High (Spreadsheets &amp; copy-paste)</option>
                <option value="Medium" className={isDark ? 'bg-black text-white' : ''}>Medium (Mixed automation &amp; manual steps)</option>
                <option value="Low" className={isDark ? 'bg-black text-white' : ''}>Low (Mostly automated)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Nature of Work
              </label>
              <select
                value={judgmentLevel}
                onChange={(e) => setJudgmentLevel(e.target.value as JudgmentLevel)}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0a0a0a] border-white/15 text-zinc-100'
                    : 'bg-[var(--surface-subtle)] border-[var(--outline-light)] text-[var(--text-primary)]'
                }`}
              >
                <option value="Mostly administrative" className={isDark ? 'bg-black text-white' : ''}>Administrative / Routine collation</option>
                <option value="Combination" className={isDark ? 'bg-black text-white' : ''}>Combination (Analysis + Routine collation)</option>
                <option value="Mostly professional judgment" className={isDark ? 'bg-black text-white' : ''}>Professional Controller Judgment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Opportunity Assessment Card (Transparent dark in dark mode with border only; no solid color shape fill) */}
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
            isDark
              ? evaluation.rating === 'Strong candidate'
                ? 'bg-[#0a0a0a] border-emerald-500/40 text-emerald-300'
                : evaluation.rating === 'Worth exploring'
                ? 'bg-[#0a0a0a] border-amber-500/40 text-amber-300'
                : 'bg-[#0a0a0a] border-blue-500/40 text-blue-300'
              : evaluation.rating === 'Strong candidate'
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : evaluation.rating === 'Worth exploring'
              ? 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-blue-50/70 border-blue-300 text-blue-950'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Automated AI Opportunity Rating:
              </span>
              <span
                className={`font-extrabold text-sm px-2.5 py-0.5 rounded-md border border-current shadow-2xs ${
                  isDark ? 'bg-transparent text-white' : 'bg-white text-inherit'
                }`}
              >
                {evaluation.rating}
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-xl ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              {evaluation.rationale}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsExplainerOpen(true)}
            className="text-xs font-semibold underline flex items-center gap-1 shrink-0 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Heuristic Rule
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setDescription('');
              setBuilderDraft(null);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>

          <button
            type="submit"
            disabled={!title.trim()}
            className={`px-8 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-white shadow-md flex items-center gap-2.5 transition-all cursor-pointer ${
              title.trim()
                ? 'hover:opacity-95 active:scale-95'
                : 'bg-slate-400 cursor-not-allowed opacity-50'
            }`}
            style={title.trim() ? { background: 'var(--brand-gradient)' } : {}}
          >
            <Plus className="w-4 h-4" />
            <span>Post to Controller Pain Wall</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};
