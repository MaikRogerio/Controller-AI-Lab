import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Check,
  Clock,
  HelpCircle,
  Lightbulb,
  Sparkles,
  X,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';
import { Category, Frequency, JudgmentLevel, ManualEffort } from '../types';
import { calculateOpportunity } from '../utils/opportunityHeuristic';

const CATEGORIES: Category[] = [
  'Close',
  'Reconciliation',
  'Compliance',
  'Tax',
  'Audit',
  'Reporting',
  'Financial Analysis',
  'Data',
  'Communication',
  'Follow-up',
  'Documentation',
  'Other',
];

const FREQUENCIES: Frequency[] = [
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Annually',
  'Ad hoc',
];

const EFFORTS: ManualEffort[] = ['Low', 'Medium', 'High'];

const JUDGMENTS: JudgmentLevel[] = [
  'Mostly administrative',
  'Combination',
  'Mostly professional judgment',
];

export const AddPainPointModal: React.FC = () => {
  const {
    isDark,
    isAddModalOpen,
    setIsAddModalOpen,
    addPainPoint,
    participant,
    setIsJoinModalOpen,
    setActiveView,
  } = useWorkshop();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Close');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [manualEffort, setManualEffort] = useState<ManualEffort>('High');
  const [judgmentLevel, setJudgmentLevel] = useState<JudgmentLevel>('Mostly administrative');
  const [error, setError] = useState<string | null>(null);

  if (!isAddModalOpen) return null;

  const evaluation = calculateOpportunity(manualEffort, frequency, judgmentLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please describe what takes too much of your time.');
      return;
    }

    if (!participant) {
      setIsJoinModalOpen(true);
      return;
    }

    // Format title if user didn't start with "I spend too much time"
    const formattedTitle = title.trim();

    addPainPoint({
      title: formattedTitle,
      description: description.trim() || undefined,
      category,
      frequency,
      manualEffort,
      judgmentLevel,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {
      // ignore
    }

    // Reset and switch to wall
    setTitle('');
    setDescription('');
    setError(null);
    setActiveView('wall');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0b1120] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">What&apos;s your Controller pain?</h2>
              <p className="text-xs text-slate-400">
                Submit an unneeded manual burden for collective prioritization.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              I spend too much time... <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Consolidating information from different teams before I can actually analyze it"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Additional Context / Impact (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly explain what causes this friction or what tools/steps are involved..."
              className={`w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Category Single-select */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-white shadow-xs font-semibold'
                        : isDark
                        ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency & Manual Effort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Frequency */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Frequency
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {FREQUENCIES.map((freq) => {
                  const isSelected = frequency === freq;
                  return (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold'
                          : isDark
                          ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {freq}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Effort */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Manual Effort
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {EFFORTS.map((effort) => {
                  const isSelected = manualEffort === effort;
                  return (
                    <button
                      key={effort}
                      type="button"
                      onClick={() => setManualEffort(effort)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                        isSelected
                          ? effort === 'High'
                            ? 'bg-amber-600 text-white font-semibold'
                            : 'bg-blue-600 text-white font-semibold'
                          : isDark
                          ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {effort}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Judgment Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Judgment Required
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {JUDGMENTS.map((judg) => {
                const isSelected = judgmentLevel === judg;
                return (
                  <button
                    key={judg}
                    type="button"
                    onClick={() => setJudgmentLevel(judg)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                        : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{judg}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live AI Opportunity Transparent Evaluation Box */}
          <div
            className={`p-3.5 rounded-xl border space-y-1.5 transition-colors ${
              evaluation.rating === 'Strong candidate'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : evaluation.rating === 'Worth exploring'
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-blue-500/10 border-blue-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                Transparent Opportunity Evaluation:
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-mono ${
                  evaluation.rating === 'Strong candidate'
                    ? 'text-emerald-400 bg-emerald-500/20'
                    : evaluation.rating === 'Worth exploring'
                    ? 'text-amber-400 bg-amber-500/20'
                    : 'text-blue-400 bg-blue-500/20'
                }`}
              >
                {evaluation.rating}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {evaluation.rationale}
            </p>
          </div>

          {/* Footer CTAs */}
          <div className="pt-3 border-t border-inherit flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Posting as <strong className="text-cyan-400">{participant?.displayName}</strong> ({participant?.country})
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md cursor-pointer active:scale-98"
              >
                Add to the Wall
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
