import { Frequency, JudgmentLevel, ManualEffort, OpportunityRating } from '../types';

export interface OpportunityEvaluation {
  rating: OpportunityRating;
  color: 'green' | 'yellow' | 'blue';
  badgeClass: string;
  rationale: string;
}

/**
 * Transparent heuristic for AI opportunity evaluation based on the Controller AI Bootcamp PRD.
 * Highly explainable: AI excels at recurring, high-effort administrative/data prep,
 * while strategic interpretation remains with the Controller.
 */
export function calculateOpportunity(
  effort: ManualEffort,
  frequency: Frequency,
  judgment: JudgmentLevel
): OpportunityEvaluation {
  const isRecurring = ['Daily', 'Weekly', 'Monthly'].includes(frequency);

  // If mostly professional judgment, Controller judgment is paramount
  if (judgment === 'Mostly professional judgment') {
    return {
      rating: 'Primarily Controller judgment',
      color: 'blue',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      rationale:
        'Requires nuanced accounting/tax interpretation and fiduciary authority. AI can assist in discovery, but controllers retain final professional judgment.',
    };
  }

  // Strong candidate: high/medium effort + mostly administrative + recurring
  if (
    judgment === 'Mostly administrative' &&
    effort !== 'Low' &&
    isRecurring
  ) {
    return {
      rating: 'Strong candidate',
      color: 'green',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      rationale:
        'High manual overhead with recurring frequency and administrative structure. Prime target for automated consolidation and copilot summarization.',
    };
  }

  // If high effort and administrative even if ad hoc
  if (effort === 'High' && judgment === 'Mostly administrative') {
    return {
      rating: 'Strong candidate',
      color: 'green',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      rationale:
        'Substantial manual effort on administrative steps. High potential for prompt-based extraction or repetitive task delegation.',
    };
  }

  // Otherwise worth exploring (combination of judgment, or medium effort)
  return {
    rating: 'Worth exploring',
    color: 'yellow',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rationale:
      'Hybrid workflow combining data prep with analytical reasoning. AI can draft initial variances or gather inputs, saving valuable triage time.',
  };
}
