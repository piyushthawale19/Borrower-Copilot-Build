import { BorrowerProfile, ConfidenceLevel } from '../types';

export interface ConfidenceAnalysis {
  level: ConfidenceLevel;
  score: number; // 0 to 100
  reasons: string[];
}

/**
 * Calculates Confidence Rating & Data Completeness Score
 * As mandated by Section 11 of the prompt:
 * Unknown credit score or unverified income MUST widen uncertainty & lower confidence score!
 */
export function calculateConfidence(profile: BorrowerProfile): ConfidenceAnalysis {
  let score = 100;
  const reasons: string[] = [];

  // 1. Credit Score Check
  if (profile.creditScore === null) {
    score -= 30;
    reasons.push('Credit score is Unknown: Requires bureau verification or bank statement check.');
  } else if (profile.creditScore >= 750) {
    reasons.push('Verified Credit Score (750+): High creditworthiness signal.');
  } else {
    score -= 10;
    reasons.push(`Sub-prime Credit Score (${profile.creditScore}): Increases rate variability.`);
  }

  // 2. Employment & Income Stability Check
  if (profile.incomeStability === 'variable') {
    score -= 20;
    reasons.push('Variable Income: Month-to-month earnings fluctuate, requiring wider buffer.');
  } else if (profile.incomeStability === 'high') {
    reasons.push('Stable Monthly Income: Predictable cash flow.');
  }

  if (profile.employmentType === 'informal') {
    score -= 15;
    reasons.push('Informal Employment: Lenders require bank statement validation for unbacked cash/gig flow.');
  }

  // 3. Existing Debt & Delinquency Check
  if (profile.recentEmiBounceCount && profile.recentEmiBounceCount > 0) {
    score -= 25;
    reasons.push(`Recent EMI Delinquency (${profile.recentEmiBounceCount} bounce): Significant risk flag.`);
  }

  if (profile.existingAppLoansCount && profile.existingAppLoansCount >= 3) {
    score -= 15;
    reasons.push(`Multiple Active App Loans (${profile.existingAppLoansCount}): High-cost debt cluster detected.`);
  }

  // Determine Level
  let level: ConfidenceLevel = 'HIGH';
  if (score < 55) {
    level = 'LOW';
  } else if (score < 80) {
    level = 'MEDIUM';
  }

  return {
    level,
    score: Math.max(0, score),
    reasons
  };
}
