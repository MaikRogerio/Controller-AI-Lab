import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useWorkshop } from '../context/WorkshopContext';

export const MethodologyGuide: React.FC = () => {
  const { isDark, setActiveView, setIsAddModalOpen } = useWorkshop();

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-inherit pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Controller AI Boot Camp Architecture
        </div>
        <h1
          className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          From Chat to Co-Worker: The Methodology
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          The philosophy of the Boot Camp: AI can support preparation, extraction, and variance analysis; Country Controllers retain ultimate professional and fiduciary judgment.
        </p>
      </div>

      {/* The 5-Step Interaction Sequence (PRD Section 12) */}
      <div className="space-y-4">
        <h2
          className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          The Core Workshop Interaction Sequence
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Step 1</div>
            <div className="font-bold text-sm">Controller Identifies Friction</div>
            <p className="text-slate-400">&ldquo;I have this manual problem in my monthly close.&rdquo;</p>
          </div>

          <div
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Step 2</div>
            <div className="font-bold text-sm">Live Pain Wall</div>
            <p className="text-slate-400">&ldquo;Other controllers experience this exact same barrier.&rdquo;</p>
          </div>

          <div
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Step 3</div>
            <div className="font-bold text-sm">Peer Prioritization</div>
            <p className="text-slate-400">&ldquo;Here are the top bottlenecks hurting our regional entities.&rdquo;</p>
          </div>

          <div
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Step 4</div>
            <div className="font-bold text-sm">Facilitator Spotlight</div>
            <p className="text-slate-400">&ldquo;You gave me this problem. Let&apos;s see what AI can do with it.&rdquo;</p>
          </div>

          <div
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
              isDark ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase text-cyan-400">Step 5</div>
            <div className="font-bold text-sm">Live Demonstration</div>
            <p className="text-slate-400 text-inherit">&ldquo;Immediate proof in corporate Copilot environment.&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Why We Keep MVP Tool-Neutral (PRD Section 13 & 23) */}
      <div
        className={`p-6 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          Deliberate Design Principle: The Lab Surfaces the Problem
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The Controller AI Lab intentionally avoids simulated in-browser bots or proprietary LLM lock-in. Instead, it aggregates authentic enterprise problems so that live testing can occur directly inside EPAM&apos;s approved corporate AI environment (e.g. Microsoft 365 Copilot). This keeps data handling strictly compliant with finance and US GAAP governance standards.
        </p>
      </div>

      {/* Multi-Phase Extensibility (PRD Section 14) */}
      <div className="space-y-4">
        <h2
          className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Boot Camp Evolution Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDark ? 'bg-slate-900/70 border-cyan-500/40' : 'bg-white border-blue-200 shadow-xs'
            }`}
          >
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              CURRENT PHASE 1 (LIVE)
            </span>
            <h3 className="font-bold text-sm">Session 1 — Problem Discovery &amp; Live Prioritization</h3>
            <p className="text-slate-400 leading-relaxed">
              Starter examples, rapid participant voting, transparent heuristic scoring, screen-sharing facilitator mode, and CSV backlog export.
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              PHASE 2 (UPCOMING)
            </span>
            <h3 className="font-bold text-sm">AI Experiments &amp; Outcome Logging</h3>
            <p className="text-slate-400 leading-relaxed">
              Controllers record: &ldquo;What did you try in Copilot? What happened? What did AI get wrong? How much manual effort remained?&rdquo;
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              PHASE 3 (UPCOMING)
            </span>
            <h3 className="font-bold text-sm">Controller AI Workflows</h3>
            <p className="text-slate-400 leading-relaxed">
              Problem &rarr; Current process &rarr; AI contribution &rarr; Controller review &rarr; Final output &rarr; Control / validation sign-off.
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              PHASE 4 (VISION)
            </span>
            <h3 className="font-bold text-sm">Global Controller AI Playbook</h3>
            <p className="text-slate-400 leading-relaxed">
              Shared cross-country repository of validated prompts, templates, and month-end accelerators for all EPAM regional controllers.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="pt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveView('wall')}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md flex items-center gap-2 cursor-pointer"
        >
          Explore Live Pain Wall
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs border transition-colors ${
            isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
          }`}
        >
          Submit a Pain Point
        </button>
      </div>
    </div>
  );
};
