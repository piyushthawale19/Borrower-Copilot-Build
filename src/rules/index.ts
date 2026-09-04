import { BorrowerProfile } from '../types';
import { calculateFOIR } from './foir';
import { calculateAmountLimits } from './eligibility';
import { calculateFairInterestRate } from './rates';
import { calculateEMICalculation } from './emi';
import { calculateConfidence } from './confidence';
import { calculateBorrowingVerdict } from './verdict';
import { generateNegotiationCard } from './negotiation';

export * from './foir';
export * from './eligibility';
export * from './rates';
export * from './emi';
export * from './confidence';
export * from './verdict';
export * from './negotiation';

/**
 * Complete Master Rule Engine Execution for Lokta Borrower Copilot
 */
export function calculateBorrowerCopilot(profile: BorrowerProfile) {
  const foir = calculateFOIR(profile);
  const rate = calculateFairInterestRate(profile);
  const amount = calculateAmountLimits(profile, rate.expectedRate);
  const emi = calculateEMICalculation(profile, amount.recommendedAmount);
  const confidence = calculateConfidence(profile);
  const verdict = calculateBorrowingVerdict(profile);
  const negotiationCard = generateNegotiationCard(profile);

  return {
    foir,
    rate,
    amount,
    emi,
    confidence,
    verdict,
    negotiationCard
  };
}
