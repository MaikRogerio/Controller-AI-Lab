import React from 'react';
import { CheckCircle2, HelpCircle, Lightbulb, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';

export const OpportunityExplainerModal: React.FC = () => {
  const { isDark, isExplainerOpen, setIsExplainerOpen } = useWorkshop();

  if (!isExplainerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl space-y-5 ${
          isDark
            ? 'bg-[#000000] border-zinc-800 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.95)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-950/50 text-[#497fff] border border-[#0047ff]/40' : 'bg-blue-50 text-[var(--primary)] border border-blue-200'}`}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">The AI Opportunity Concept</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Section 8 &amp; 9 — Transparent Bootcamp Heuristic</p>
            </div>
          </div>
          <button
            onClick={() => setIsExplainerOpen(false)}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${isDark ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-300' : 'bg-blue-50/60 border-blue-100 text-slate-700'}`}>
          <div className="font-semibold text-[var(--primary)] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Why we don&apos;t ask: &ldquo;Can AI solve this?&rdquo;
          </div>
          <p className={isDark ? 'text-zinc-400' : 'text-slate-600'}>
            Controllers shouldn&apos;t need to be AI engineers to participate. You just identify where manual work is consuming your calendar. The app applies a transparent, explainable rule based on manual effort, recurrence, and judgment level.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Green - Strong candidate */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-[var(--green-soft)] border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-emerald-500 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Strong Candidate (Green)
            </div>
            <p className={isDark ? 'text-zinc-400 leading-relaxed' : 'text-slate-600 leading-relaxed'}>
              <strong>Criteria:</strong> High/Medium manual effort + Recurring frequency (daily, weekly, monthly) + Mostly administrative.
            </p>
            <p className={isDark ? 'text-zinc-500' : 'text-slate-500'}>
              <em>Example:</em> Consolidating country close spreadsheets, extracting data from multi-format vendor payroll files, chasing deadline sign-offs.
            </p>
          </div>

          {/* Yellow - Worth exploring */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-[var(--amber-soft)] border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-amber-500 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Worth Exploring (Yellow)
            </div>
            <p className={isDark ? 'text-zinc-400 leading-relaxed' : 'text-slate-600 leading-relaxed'}>
              <strong>Criteria:</strong> Combination of analytical reasoning and structured data inputs.
            </p>
            <p className={isDark ? 'text-zinc-500' : 'text-slate-500'}>
              <em>Example:</em> Reviewing reconciliation exceptions, drafting month-over-month SG&amp;A variance explanations.
            </p>
          </div>

          {/* Blue - Primarily Controller judgment */}
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-[var(--primary)] text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></span>
              Primarily Controller Judgment (Blue)
            </div>
            <p className={isDark ? 'text-zinc-400 leading-relaxed' : 'text-slate-600 leading-relaxed'}>
              <strong>Criteria:</strong> High degree of professional fiduciary judgment, legal/tax compliance risk, or policy interpretation.
            </p>
            <p className={isDark ? 'text-zinc-500' : 'text-slate-500'}>
              <em>Example:</em> Determining tax treatment of complex multi-jurisdiction royalties, assessing warranty reserve adequacy.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setIsExplainerOpen(false)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs cursor-pointer transition-all hover:opacity-95"
            style={{ background: 'var(--brand-gradient)' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
