import React, { createContext, useContext, useEffect, useState } from 'react';
import { CONTROLLER_ROSTER, findControllerByCodeOrName } from '../data/controllersRoster';
import { EPAM_COUNTRIES, INITIAL_SESSION, STARTER_PAIN_POINTS } from '../data/initialData';
import {
  Category,
  ControllerEntry,
  Frequency,
  JudgmentLevel,
  ManualEffort,
  PainPoint,
  Participant,
  WorkshopSession,
} from '../types';
import { calculateOpportunity } from '../utils/opportunityHeuristic';

export type ActiveView = 'dashboard' | 'starters' | 'build' | 'wall' | 'facilitator' | 'presentation' | 'framework';

export interface BuilderDraft {
  title?: string;
  description?: string;
  category?: Category;
  frequency?: Frequency;
  manualEffort?: ManualEffort;
  judgmentLevel?: JudgmentLevel;
}

export const DEFAULT_CONTROLLER_ROSTER = CONTROLLER_ROSTER.map(c => c.fullName);

interface WorkshopContextType {
  isDark: boolean;
  toggleTheme: () => void;
  session: WorkshopSession;
  participant: Participant | null;
  participants: Participant[];
  roster: string[];
  controllerRoster: ControllerEntry[];
  updateRoster: (names: string[]) => void;
  isRosterModalOpen: boolean;
  setIsRosterModalOpen: (open: boolean) => void;
  switchParticipant: (nameOrCode: string) => void;
  loginWithCode: (codeOrQuery: string) => { success: boolean; controller?: ControllerEntry; error?: string };
  welcomeBanner: string | null;
  setWelcomeBanner: (msg: string | null) => void;
  painPoints: PainPoint[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  builderDraft: BuilderDraft | null;
  setBuilderDraft: (draft: BuilderDraft | null) => void;
  selectedPainForPresentation: PainPoint | null;
  setSelectedPainForPresentation: (pain: PainPoint | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isJoinModalOpen: boolean;
  setIsJoinModalOpen: (open: boolean) => void;
  isExplainerOpen: boolean;
  setIsExplainerOpen: (open: boolean) => void;
  joinLab: (name: string, country?: string, team?: string) => void;
  votePainPoint: (painPointId: string) => boolean;
  hasVoted: (painPointId: string) => boolean;
  addPainPoint: (data: {
    title: string;
    description?: string;
    category: Category;
    frequency: Frequency;
    manualEffort: ManualEffort;
    judgmentLevel: JudgmentLevel;
  }) => void;
  deletePainPoint: (id: string) => void;
  togglePinPainPoint: (id: string) => void;
  togglePipeline: (id: string) => void;
  simulateWorkshopActivity: () => void;
  exportToCsv: () => void;
  resetSession: () => void;
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

const STORAGE_KEY_PAINS = 'epam_controller_pains_v1';
const STORAGE_KEY_USER = 'epam_controller_user_v1';
const STORAGE_KEY_THEME = 'epam_controller_theme_v1';
const STORAGE_KEY_ROSTER = 'epam_controller_roster_v1';

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved !== null ? saved === 'dark' : false;
  });

  const [session] = useState<WorkshopSession>(INITIAL_SESSION);

  // Roster of 12-13 Country Controllers
  const [roster, setRoster] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROSTER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_CONTROLLER_ROSTER;
  });

  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);

  // Check URL query parameters immediately on boot for zero-login controller codes
  const [participant, setParticipant] = useState<Participant | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryCode = params.get('code') || params.get('c') || params.get('controller') || params.get('user') || params.get('name');
      if (queryCode && queryCode.trim()) {
        const matched = findControllerByCodeOrName(queryCode.trim());
        if (matched) {
          const p: Participant = {
            id: matched.id,
            displayName: matched.firstName, // FIRST NAME ONLY
            fullName: matched.fullName,
            email: matched.email,
            code: matched.code,
            team: 'Country Controller',
            joinedAt: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(p));
          return p;
        } else {
          const raw = queryCode.trim();
          const firstName = raw.split(' ')[0];
          const p: Participant = {
            id: `c-${raw.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            displayName: firstName,
            fullName: raw,
            team: 'Country Controller',
            joinedAt: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(p));
          return p;
        }
      }

      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }

    // Default active profile: Maik (Session Facilitator & Controller)
    return {
      id: 'c-23',
      displayName: 'Maik',
      fullName: 'Maik Souza',
      email: 'Maik_Souza@epam.com',
      code: 'MAIK26',
      team: 'Controllership',
      joinedAt: new Date().toISOString(),
    };
  });

  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);

  // Show welcome toast if query parameter recognized on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryCode = params.get('code') || params.get('c') || params.get('controller') || params.get('user') || params.get('name');
      if (queryCode && queryCode.trim()) {
        const matched = findControllerByCodeOrName(queryCode.trim());
        const display = matched ? matched.firstName : queryCode.trim().split(' ')[0];
        setWelcomeBanner(`Welcome, ${display}! Controller access code verified.`);
        setTimeout(() => setWelcomeBanner(null), 5000);
      }
    }
  }, []);

  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'c-elena-rostova', displayName: 'Elena Rostova', team: 'Country Controller', joinedAt: '2026-04-10T09:00:00Z' },
    { id: 'c-carlos-mendoza', displayName: 'Carlos Mendoza', team: 'Country Controller', joinedAt: '2026-04-10T09:01:00Z' },
    { id: 'c-kaspars-berzins', displayName: 'Kaspars Berzins', team: 'Country Controller', joinedAt: '2026-04-10T09:02:00Z' },
    { id: 'c-maria-santos', displayName: 'Maria Santos', team: 'Country Controller', joinedAt: '2026-04-10T09:03:00Z' },
    { id: 'c-florian-bauer', displayName: 'Florian Bauer', team: 'Country Controller', joinedAt: '2026-04-10T09:04:00Z' },
  ]);

  const [painPoints, setPainPoints] = useState<PainPoint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PAINS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return STARTER_PAIN_POINTS;
      }
    }
    return STARTER_PAIN_POINTS;
  });

  const [activeView, setActiveView] = useState<ActiveView>('starters');
  const [builderDraft, setBuilderDraft] = useState<BuilderDraft | null>(null);
  const [selectedPainForPresentation, setSelectedPainForPresentation] = useState<PainPoint | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  // Sync theme to local storage and document root
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#000000] text-white antialiased selection:bg-[#0047ff]/30 selection:text-white';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-[#ffffff] text-[#0f172a] antialiased selection:bg-[#0047ff]/20 selection:text-[#0047ff]';
    }
  }, [isDark]);

  // Persist pain points
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAINS, JSON.stringify(painPoints));
  }, [painPoints]);

  // Persist participant
  useEffect(() => {
    if (participant) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(participant));
    }
  }, [participant]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const updateRoster = (names: string[]) => {
    setRoster(names);
    localStorage.setItem(STORAGE_KEY_ROSTER, JSON.stringify(names));
  };

  const loginWithCode = (codeOrQuery: string) => {
    if (!codeOrQuery || !codeOrQuery.trim()) {
      return { success: false, error: 'Please enter your controller code.' };
    }
    const clean = codeOrQuery.trim();
    const matched = findControllerByCodeOrName(clean);
    if (matched) {
      const p: Participant = {
        id: matched.id,
        displayName: matched.firstName, // FIRST NAME ONLY
        fullName: matched.fullName,
        email: matched.email,
        code: matched.code,
        team: 'Country Controller',
        joinedAt: new Date().toISOString(),
      };
      setParticipant(p);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(p));
      setWelcomeBanner(`Welcome, ${matched.firstName}! Controller code (${matched.code}) verified.`);
      setTimeout(() => setWelcomeBanner(null), 5000);
      setIsJoinModalOpen(false);
      return { success: true, controller: matched };
    }

    // Fallback if not directly matched: take first name
    const firstName = clean.split(' ')[0];
    const p: Participant = {
      id: `c-${clean.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      displayName: firstName,
      fullName: clean,
      team: 'Country Controller',
      joinedAt: new Date().toISOString(),
    };
    setParticipant(p);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(p));
    setWelcomeBanner(`Signed in as ${firstName}.`);
    setTimeout(() => setWelcomeBanner(null), 4000);
    setIsJoinModalOpen(false);
    return { success: true };
  };

  const switchParticipant = (nameOrCode: string) => {
    loginWithCode(nameOrCode);
  };

  const joinLab = (name: string, country?: string, team?: string) => {
    loginWithCode(name);
  };

  const hasVoted = (painPointId: string): boolean => {
    if (!participant) return false;
    const item = painPoints.find((p) => p.id === painPointId);
    return item ? item.voterIds.includes(participant.id) : false;
  };

  const votePainPoint = (painPointId: string): boolean => {
    if (!participant) {
      setIsJoinModalOpen(true);
      return false;
    }

    let voted = false;
    setPainPoints((prev) =>
      prev.map((item) => {
        if (item.id !== painPointId) return item;

        const alreadyVoted = item.voterIds.includes(participant.id);
        if (alreadyVoted) {
          // Toggle off if already voted
          voted = false;
          return {
            ...item,
            votes: Math.max(0, item.votes - 1),
            voterIds: item.voterIds.filter((id) => id !== participant.id),
          };
        } else {
          // Vote for it
          voted = true;
          return {
            ...item,
            votes: item.votes + 1,
            voterIds: [...item.voterIds, participant.id],
          };
        }
      })
    );
    return voted;
  };

  const addPainPoint = (data: {
    title: string;
    description?: string;
    category: Category;
    frequency: Frequency;
    manualEffort: ManualEffort;
    judgmentLevel: JudgmentLevel;
  }) => {
    const evalResult = calculateOpportunity(data.manualEffort, data.frequency, data.judgmentLevel);
    const author = participant || {
      id: 'anon',
      displayName: 'Country Controller',
      country: 'Latvia',
    };

    const newPoint: PainPoint = {
      id: `pain-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      frequency: data.frequency,
      manualEffort: data.manualEffort,
      judgmentLevel: data.judgmentLevel,
      opportunityRating: evalResult.rating,
      opportunityRationale: evalResult.rationale,
      authorId: author.id,
      authorName: author.displayName,
      authorCountry: author.country,
      votes: 1,
      voterIds: [author.id],
      isStarter: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setPainPoints((prev) => [newPoint, ...prev]);
    setIsAddModalOpen(false);
  };

  const deletePainPoint = (id: string) => {
    setPainPoints((prev) => prev.filter((p) => p.id !== id));
    if (selectedPainForPresentation?.id === id) {
      setSelectedPainForPresentation(null);
    }
  };

  const togglePinPainPoint = (id: string) => {
    setPainPoints((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const togglePipeline = (id: string) => {
    setPainPoints((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inPipeline: !p.inPipeline } : p))
    );
  };

  const simulateWorkshopActivity = () => {
    const randomCountry = EPAM_COUNTRIES[Math.floor(Math.random() * EPAM_COUNTRIES.length)];
    const mockNames = ['Alexei M.', 'Dominika S.', 'Florian B.', 'Katarina V.', 'Matteo L.', 'Ananya R.'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

    // Add random votes to existing cards
    setPainPoints((prev) => {
      const idx = Math.floor(Math.random() * prev.length);
      return prev.map((item, i) => {
        if (i === idx) {
          const fakeVoterId = `sim-voter-${Date.now()}`;
          return {
            ...item,
            votes: item.votes + Math.floor(Math.random() * 2) + 1,
            voterIds: [...item.voterIds, fakeVoterId],
          };
        }
        return item;
      });
    });

    // Add participant to attendees
    setParticipants((prev) => [
      {
        id: `p-sim-${Date.now()}`,
        displayName: randomName,
        country: randomCountry.name,
        team: randomCountry.name,
        joinedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const exportToCsv = () => {
    const headers = [
      'ID',
      'Pain Point',
      'Category',
      'Country',
      'Frequency',
      'Manual Effort',
      'Judgment Level',
      'Votes',
      'AI Opportunity Classification',
      'Rationale',
      'Created At',
    ];

    const rows = painPoints.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.authorCountry}"`,
      `"${p.frequency}"`,
      `"${p.manualEffort}"`,
      `"${p.judgmentLevel}"`,
      p.votes,
      `"${p.opportunityRating}"`,
      `"${p.opportunityRationale.replace(/"/g, '""')}"`,
      `"${p.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `controller-ai-lab-backlog-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetSession = () => {
    localStorage.removeItem(STORAGE_KEY_PAINS);
    setPainPoints(STARTER_PAIN_POINTS);
  };

  return (
    <WorkshopContext.Provider
      value={{
        isDark,
        toggleTheme,
        session,
        participant,
        participants,
        roster,
        controllerRoster: CONTROLLER_ROSTER,
        updateRoster,
        isRosterModalOpen,
        setIsRosterModalOpen,
        switchParticipant,
        loginWithCode,
        welcomeBanner,
        setWelcomeBanner,
        painPoints,
        activeView,
        setActiveView,
        builderDraft,
        setBuilderDraft,
        selectedPainForPresentation,
        setSelectedPainForPresentation,
        isAddModalOpen,
        setIsAddModalOpen,
        isJoinModalOpen,
        setIsJoinModalOpen,
        isExplainerOpen,
        setIsExplainerOpen,
        joinLab,
        votePainPoint,
        hasVoted,
        addPainPoint,
        deletePainPoint,
        togglePinPainPoint,
        togglePipeline,
        simulateWorkshopActivity,
        exportToCsv,
        resetSession,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export const useWorkshop = () => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
};
