export type Category =
  | 'Close'
  | 'Reconciliation'
  | 'Compliance'
  | 'Tax'
  | 'Audit'
  | 'Reporting'
  | 'Financial Analysis'
  | 'Data'
  | 'Communication'
  | 'Follow-up'
  | 'Documentation'
  | 'Other';

export type Frequency =
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Quarterly'
  | 'Annually'
  | 'Ad hoc';

export type ManualEffort = 'Low' | 'Medium' | 'High';

export type JudgmentLevel =
  | 'Mostly administrative'
  | 'Combination'
  | 'Mostly professional judgment';

export type OpportunityRating =
  | 'Strong candidate'
  | 'Worth exploring'
  | 'Primarily Controller judgment';

export interface ControllerEntry {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  code: string;
}

export interface Participant {
  id: string;
  displayName: string; // Controller First Name only (e.g. "Anna", "Laszlo", "Maik")
  fullName?: string;
  email?: string;
  code?: string;
  country?: string;
  team?: string;
  isFacilitator?: boolean;
  joinedAt: string;
}

export interface PainPoint {
  id: string;
  title: string;
  description?: string;
  category: Category;
  frequency: Frequency;
  manualEffort: ManualEffort;
  judgmentLevel: JudgmentLevel;
  opportunityRating: OpportunityRating;
  opportunityRationale: string;
  authorId: string;
  authorName: string;
  authorCountry?: string;
  votes: number;
  voterIds: string[];
  isStarter?: boolean;
  isPinned?: boolean;
  inPipeline?: boolean;
  status: 'active' | 'archived' | 'merged';
  createdAt: string;
  demoSelected?: boolean;
}

export interface WorkshopSession {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'completed' | 'draft';
  activeQuestion: string;
}
