import { BorrowerProfile } from '../types';
import { LOAN_PRODUCTS } from '../data/loanProducts';

export interface FOIRAnalysis {
  effectiveMonthlyIncome: number;
  existingMonthlyEMI: number;
  housingExpenses: number;
  livingExpenses: number;
  safetyBufferAmount: number;
  netSurplusCashFlow: number;
  lenderMaxAllowedEMI: number;
  borrowerSafeEMICeiling: number;
  existingDTI: number; // Existing EMI / Net Income %
}

/**
 * Calculates FOIR (Fixed Obligation to Income Ratio) & safe monthly surplus
 */
export function calculateFOIR(profile: BorrowerProfile): FOIRAnalysis {
  // 1. Determine Effective Conservative Monthly Income
  let effectiveMonthlyIncome = profile.monthlyNetIncome;

  // Conservative adjustment for variable / informal income
  if (profile.employmentType === 'informal') {
    if (profile.minMonthlyIncome && profile.maxMonthlyIncome) {
      // Use conservative weighted income rather than optimistic max
      effectiveMonthlyIncome = profile.minMonthlyIncome * 0.7 + profile.maxMonthlyIncome * 0.3;
    } else if (profile.incomeStability === 'variable') {
      effectiveMonthlyIncome = profile.monthlyNetIncome * 0.85; // 15% haircut for variable income
    }
  }

  // 2. Identify Obligations & Expenses
  const existingMonthlyEMI = profile.existingMonthlyEMI || 0;
  const housingExpenses = profile.monthlyRent || 0;
  const livingExpenses = profile.householdExpenses || 0;

  // 3. Safety Buffer (15% of net income retained for unexpected medical/life emergencies)
  const safetyBufferAmount = effectiveMonthlyIncome * 0.15;

  // 4. Calculate True Available Cash Surplus
  const netSurplusCashFlow = Math.max(
    0,
    effectiveMonthlyIncome - existingMonthlyEMI - housingExpenses - livingExpenses - safetyBufferAmount
  );

  // 5. Calculate Lender Max Allowed EMI (Standard Banking FOIR)
  const productKey = profile.loanType || 'personal';
  const productConfig = LOAN_PRODUCTS[productKey] || LOAN_PRODUCTS.personal;
  
  let lenderFOIRCap = productConfig.lenderMaxFOIRCap;
  if (effectiveMonthlyIncome >= 100000) {
    lenderFOIRCap += 0.05; // High earners get up to 60-65% FOIR in banks
  }
  
  const lenderMaxAllowedEMI = Math.max(0, (effectiveMonthlyIncome * lenderFOIRCap) - existingMonthlyEMI);

  // 6. Calculate Borrower Safe EMI Ceiling (Conservative Affordability)
  const safeCap = productConfig.borrowerSafeFOIRCap; // e.g. 40%
  const maxCapBasedEMI = Math.max(0, (effectiveMonthlyIncome * safeCap) - existingMonthlyEMI);
  
  // Safe EMI should NEVER exceed actual net surplus cash flow
  const borrowerSafeEMICeiling = Math.round(Math.min(maxCapBasedEMI, netSurplusCashFlow));

  // 7. Debt-to-Income Ratio
  const existingDTI = effectiveMonthlyIncome > 0 
    ? Math.round((existingMonthlyEMI / effectiveMonthlyIncome) * 100) 
    : 0;

  return {
    effectiveMonthlyIncome,
    existingMonthlyEMI,
    housingExpenses,
    livingExpenses,
    safetyBufferAmount,
    netSurplusCashFlow,
    lenderMaxAllowedEMI: Math.round(lenderMaxAllowedEMI),
    borrowerSafeEMICeiling,
    existingDTI
  };
}
