import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  Mail,
  Search,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import { CONTROLLER_ROSTER } from '../data/controllersRoster';
import { useWorkshop } from '../context/WorkshopContext';

export const ControllerRosterModal: React.FC = () => {
  const {
    isDark,
    isRosterModalOpen,
    setIsRosterModalOpen,
    participant,
    loginWithCode,
  } = useWorkshop();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isRosterModalOpen) return null;

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    : 'https://ais-pre-xvvmqg2joagzvtv7tqmj5m-310638567227.europe-west2.run.app';

  const getDirectLink = (code: string) => {
    return `${baseUrl}?code=${code}`;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyDirectLink = (code: string) => {
    navigator.clipboard.writeText(getDirectLink(code));
    setCopiedCode(`link-${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyAllForEmail = () => {
    const header = `EPAM Country Controller AI Lab — Participant Access Codes Directory\n` +
      `Each controller receives a unique 6-character code that connects them with their first name.\n\n` +
      `---------------------------------------------------------------------------------------------------\n` +
      `#  | Controller Full Name            | App Display  | Email Address                         | Access Code | Direct Zero-Login Link\n` +
      `---------------------------------------------------------------------------------------------------\n`;

    const rows = CONTROLLER_ROSTER.map((c, i) => {
      const idx = String(i + 1).padEnd(2, ' ');
      const name = c.fullName.padEnd(30, ' ');
      const first = c.firstName.padEnd(12, ' ');
      const email = c.email.padEnd(37, ' ');
      const code = c.code.padEnd(11, ' ');
      return `${idx} | ${name} | ${first} | ${email} | ${code} | ${getDirectLink(c.code)}`;
    });

    const emailInstructions = `\n\nInstructions for Tomorrow's Session Email:\n` +
      `"Dear Controllers,\n` +
      `For tomorrow's Country Controller AI Session, please access the platform here:\n` +
      `${baseUrl}\n` +
      `Enter your 6-character access code listed above (e.g. your code) to sign in. The system will automatically display your first name on your contributions and voting cards."`;

    navigator.clipboard.writeText(header + rows.join('\n') + emailInstructions);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  const filtered = CONTROLLER_ROSTER.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.firstName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#000000] border-zinc-800 text-zinc-100 shadow-[0_0_60px_rgba(0,0,0,0.95)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 sm:p-6 border-b flex items-center justify-between gap-4 ${
            isDark ? 'border-zinc-800 bg-[#050505]' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white shadow-xs"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Controller Access Codes Directory
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[var(--blue-soft)] text-[var(--primary)] border border-[#0047ff]/20">
                  23 Controllers
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Each code is assigned to a controller and automatically displays their first name only.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRosterModalOpen(false)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-inherit space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name, email, or code..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-[var(--primary)]'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[var(--primary)]'
                }`}
              />
            </div>

            {/* Email Broadcast Table Copy Button */}
            <button
              onClick={handleCopyAllForEmail}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-95 shrink-0"
              style={{ background: 'var(--brand-gradient)' }}
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-300" /> : <Mail className="w-4 h-4" />}
              <span>{copiedAll ? 'Table Copied for Email!' : 'Copy All 23 Codes (For Email)'}</span>
            </button>
          </div>
        </div>

        {/* Controllers Table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-2">
          {filtered.map((c, index) => {
            const isCurrent = participant?.displayName === c.firstName;
            const isCopied = copiedCode === c.code;
            const isLinkCopied = copiedCode === `link-${c.code}`;

            return (
              <div
                key={c.id}
                className={`p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                  isCurrent
                    ? isDark
                      ? 'bg-blue-950/20 border-[#0047ff]/40 ring-1 ring-[#0047ff]/40'
                      : 'bg-blue-50 border-blue-200'
                    : isDark
                    ? 'bg-[#0a0a0a] border-zinc-800/80 hover:border-zinc-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left: Controller Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-[var(--primary)] text-white'
                        : isDark
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold tracking-tight text-[var(--text-primary)]">
                        {c.fullName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Displays as &quot;{c.firstName}&quot;
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--primary)] text-white">
                          Logged In
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] truncate block">
                      {c.email}
                    </span>
                  </div>
                </div>

                {/* Right: Code Badge & Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] font-mono text-xs font-bold text-[var(--primary)]">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{c.code}</span>
                  </div>

                  {/* Switch to this profile */}
                  <button
                    onClick={() => {
                      loginWithCode(c.code);
                      setIsRosterModalOpen(false);
                    }}
                    title={`Log in as ${c.firstName}`}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isCurrent ? 'Active' : 'Switch'}
                  </button>

                  {/* Copy Code */}
                  <button
                    onClick={() => handleCopyCode(c.code)}
                    title="Copy 6-character access code"
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        : isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {/* Copy Direct Link */}
                  <button
                    onClick={() => handleCopyDirectLink(c.code)}
                    title="Copy direct link (?code=...)"
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isLinkCopied
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        : isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isLinkCopied ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t text-[11px] flex items-center justify-between ${
            isDark ? 'border-zinc-800 bg-[#050505] text-zinc-500' : 'border-slate-100 bg-slate-50 text-slate-500'
          }`}
        >
          <span>Share code with controller or use direct link <code>?code=CODE</code></span>
          <button
            onClick={() => setIsRosterModalOpen(false)}
            className="font-semibold text-[var(--primary)] hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
