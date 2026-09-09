import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Download,
  Flame,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Lightbulb,
  PlusCircle,
  Presentation,
  Radio,
  Sliders,
  Sparkles,
  Sun,
  Moon,
  Users,
} from 'lucide-react';
import { ActiveView, useWorkshop } from '../context/WorkshopContext';
import { EpamLogo } from './EpamLogo';

export const Sidebar: React.FC = () => {
  const {
    isDark,
    toggleTheme,
    activeView,
    setActiveView,
    participant,
    participants,
    painPoints,
    setIsAddModalOpen,
    setIsJoinModalOpen,
    setIsExplainerOpen,
    simulateWorkshopActivity,
    exportToCsv,
  } = useWorkshop();

  const totalVotes = painPoints.reduce((acc, p) => acc + p.votes, 0);
  const distinctCountries = Array.from(new Set(participants.map((p) => p.country)));

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; section: string; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Home',
      icon: <LayoutDashboard className="w-4 h-4" />,
      section: 'OVERVIEW',
    },
    {
      id: 'starters',
      label: 'Starter Pain Points',
      icon: <Layers className="w-4 h-4" />,
      section: 'OVERVIEW',
      badge: '6 Examples',
    },
    {
      id: 'wall',
      label: 'Live Pain Wall',
      icon: <Flame className="w-4 h-4" />,
      section: 'OVERVIEW',
      badge: painPoints.length,
    },
    {
      id: 'facilitator',
      label: 'Opportunity Map',
      icon: <BarChart3 className="w-4 h-4" />,
      section: 'FACILITATOR HUB',
      badge: 'Live Analytics',
    },
    {
      id: 'presentation',
      label: 'Presenter Mode',
      icon: <Presentation className="w-4 h-4" />,
      section: 'FACILITATOR HUB',
      badge: 'Screen Share',
    },
    {
      id: 'framework',
      label: 'AI Heuristic Guide',
      icon: <HelpCircle className="w-4 h-4" />,
      section: 'METHODOLOGY',
    },
  ];

  return (
    <aside
      className={`w-72 shrink-0 border-r flex flex-col justify-between z-20 backdrop-blur-md transition-colors duration-300 ${
        isDark
          ? 'bg-[#090d16]/90 border-slate-800 text-slate-300'
          : 'bg-white/95 border-slate-200 text-slate-700 shadow-sm'
      }`}
    >
      {/* Top Brand Header */}
      <div className="p-5 pb-4 border-b border-inherit">
        <div className="flex items-start justify-between">
          <EpamLogo
            isDark={isDark}
            subText="ESLV · APR 2026 · BOOTCAMP LAB"
          />
          {/* Theme Toggle matching the pill in the screenshot */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
              isDark ? 'bg-cyan-950/80 border border-cyan-500/40' : 'bg-blue-600'
            }`}
          >
            <span className="sr-only">Toggle theme</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            >
              {isDark ? (
                <Moon className="w-2.5 h-2.5 text-cyan-700" />
              ) : (
                <Sun className="w-2.5 h-2.5 text-blue-600" />
              )}
            </span>
          </button>
        </div>

        {/* Current Participant Entity / Profile Pill */}
        <div
          onClick={() => setIsJoinModalOpen(true)}
          className={`mt-4 p-2.5 rounded-lg border cursor-pointer transition-all duration-200 group ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900'
              : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold truncate flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {participant?.displayName || 'Set Participant'}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                isDark ? 'bg-cyan-500/10 text-cyan-300' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {participant?.country || 'Global'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
            {participant?.team || 'EPAM Finance & Controlling'}
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {['OVERVIEW', 'FACILITATOR HUB', 'METHODOLOGY'].map((section) => (
          <div key={section} className="space-y-1">
            <div
              className={`px-3 text-[10px] font-bold tracking-wider uppercase mb-1.5 ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {section}
            </div>
            {navItems
              .filter((item) => item.section === section)
              .map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 ${
                      isActive
                        ? isDark
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs'
                          : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs font-semibold'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? (isDark ? 'text-cyan-400' : 'text-blue-600') : ''}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isActive
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-blue-200 text-blue-800'
                            : isDark
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}

        {/* Live Workshop Status Card */}
        <div
          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
            isDark
              ? 'bg-gradient-to-b from-slate-900/90 to-slate-900/50 border-slate-800/80'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Workshop Pulse
            </span>
            <span className="font-mono text-emerald-400">LIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-center">
            <div className={`p-1.5 rounded ${isDark ? 'bg-slate-800/50' : 'bg-white border border-slate-100'}`}>
              <div className="text-base font-bold text-cyan-400">{participants.length}</div>
              <div className="text-[10px] text-slate-400 font-sans">Controllers</div>
            </div>
            <div className={`p-1.5 rounded ${isDark ? 'bg-slate-800/50' : 'bg-white border border-slate-100'}`}>
              <div className="text-base font-bold text-emerald-400">{totalVotes}</div>
              <div className="text-[10px] text-slate-400 font-sans">Votes Cast</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-cyan-400" />
              {distinctCountries.length} Countries
            </span>
            <button
              onClick={simulateWorkshopActivity}
              title="Simulate incoming vote / attendee activity during live workshop"
              className={`hover:underline text-[10px] font-medium ${
                isDark ? 'text-cyan-400' : 'text-blue-600'
              }`}
            >
              + Sim Activity
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Controls */}
      <div className="p-4 border-t border-inherit space-y-2.5">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs shadow-md transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold cursor-pointer active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          Add My Controller Pain
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCsv}
            title="Download CSV of all pain points and votes"
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md text-[11px] font-medium border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Download className="w-3 h-3 text-cyan-400" />
            Export CSV
          </button>

          <button
            onClick={() => setIsExplainerOpen(true)}
            title="AI Opportunity Heuristic Explanation"
            className={`p-1.5 rounded-md border text-slate-400 hover:text-slate-200 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
