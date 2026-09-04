import { BorrowerProfile, VerdictResult, VerdictType } from '../types';
import { calculateFOIR } from './foir';
import { calculateAmountLimits } from './eligibility';
import { calculateEMICalculation } from './emi';
import { calculateConfidence } from './confidence';

/**
 * Calculates Primary Verdict: BORROW / BORROW_LESS / DONT_BORROW
 */
export function calculateBorrowingVerdict(profile: BorrowerProfile): VerdictResult {
  const foir = calculateFOIR(profile);
  const amountLimits = calculateAmountLimits(profile);
  const emiCalc = calculateEMICalculation(profile, profile.requestedAmount);
  const confidence = calculateConfidence(profile);

  const keyRiskFactors: string[] = [];
  let verdict: VerdictType = 'BORROW';
  let headline = '';
  let summaryReason = '';

  const requestedEMI = emiCalc.calculatedEMI;
  const totalNewDTI = foir.effectiveMonthlyIncome > 0
    ? ((foir.existingMonthlyEMI + requestedEMI) / foir.effectiveMonthlyIncome) * 100
    : 100;

  // -------------------------------------------------------------
  // CRITICAL RED FLAGS FOR DONT_BORROW
  // -------------------------------------------------------------

  // 1. Zero or Negative Cash Surplus
  if (foir.netSurplusCashFlow <= 0) {
    verdict = 'DONT_BORROW';
    keyRiskFactors.push('Your existing monthly EMIs and living expenses already consume 100% of your income.');
  }

  // 2. Severe High-Cost App Debt Overhang & Delinquency (Anita Persona Trigger)
  if (profile.existingAppLoansCount && profile.existingAppLoansCount >= 3 && profile.recentEmiBounceCount && profile.recentEmiBounceCount >= 1) {
    verdict = 'DONT_BORROW';
    keyRiskFactors.push(`You currently hold ${profile.existingAppLoansCount} high-cost app loans with a recent EMI bounce. Adding a new loan right now risks a severe debt trap.`);
  }

  // 3. New Total Debt Burden > 65% of net income
  if (totalNewDTI > 65 && verdict !== 'DONT_BORROW') {
    verdict = 'DONT_BORROW';
    keyRiskFactors.push(`Requested EMI of ₹${requestedEMI.toLocaleString('en-IN')} pushes your total debt obligations to ${Math.round(totalNewDTI)}% of monthly income, exceeding safe repayment capacity.`);
  }

  // -------------------------------------------------------------
  // CONDITIONS FOR BORROW_LESS
  // -------------------------------------------------------------

  if (verdict === 'BORROW') {
    if (profile.requestedAmount > amountLimits.safeBorrowerLimit.max) {
      verdict = 'BORROW_LESS';
      keyRiskFactors.push(`Requested amount of ₹${profile.requestedAmount.toLocaleString('en-IN')} exceeds your safe borrower limit of ₹${amountLimits.safeBorrowerLimit.max.toLocaleString('en-IN')}.`);
    } else if (emiCalc.stressScenarios.some(s => s.status === 'HIGH_RISK' || s.status === 'TIGHT')) {
      verdict = 'BORROW_LESS';
      keyRiskFactors.push('Under stress testing (20% income reduction or 2% rate hike), your monthly EMI becomes tight.');
    } else if (foir.existingDTI > 35) {
      verdict = 'BORROW_LESS';
      keyRiskFactors.push(`Your existing debt burden (${foir.existingDTI}% of income) is already significant.`);
    }
  }

  // -------------------------------------------------------------
  // HEADLINE & SUMMARY REASON CREATION
  // -------------------------------------------------------------

  if (verdict === 'DONT_BORROW') {
    headline = "DON'T BORROW — High Financial Risk";
    summaryReason = `Taking on a new loan of ₹${profile.requestedAmount.toLocaleString('en-IN')} is NOT recommended at this time. Focus on consolidating your existing high-cost debts or stabilizing cash flow first.`;
  } else if (verdict === 'BORROW_LESS') {
    headline = `BORROW LESS — Reduce to ₹${amountLimits.safeBorrowerLimit.max.toLocaleString('en-IN')}`;
    summaryReason = `You are eligible to borrow, but requesting ₹${profile.requestedAmount.toLocaleString('en-IN')} creates uncomfortable monthly EMI pressure. We recommend reducing your borrowing to ₹${amountLimits.safeBorrowerLimit.max.toLocaleString('en-IN')}.`;
  } else {
    headline = "BORROW — Safe & Affordability Approved";
    summaryReason = `Your requested loan of ₹${profile.requestedAmount.toLocaleString('en-IN')} fits comfortably within your monthly surplus and stays safe under stress test scenarios.`;
  }

  const items = [
    `Verdict Outcome: ${verdict}`,
    `Net Surplus Cash Flow: ₹${foir.netSurplusCashFlow.toLocaleString('en-IN')}/month`,
    `Safe EMI Ceiling: ₹${foir.borrowerSafeEMICeiling.toLocaleString('en-IN')}/month`,
    `Requested EMI: ₹${requestedEMI.toLocaleString('en-IN')}/month`,
    ...keyRiskFactors
  ];

  const assumptions = [
    `Verdict is generated strictly from self-reported affordability and conservative FOIR rules.`,
    `This recommendation prioritizes borrower financial safety over lender maximum sanction limits.`
  ];

  return {
    verdict,
    headline,
    summaryReason,
    keyRiskFactors,
    confidence: confidence.level,
    confidenceReasons: confidence.reasons,
    explanation: {
      title: 'Why did you get this borrowing recommendation?',
      items,
      assumptions
    }
  };
}
