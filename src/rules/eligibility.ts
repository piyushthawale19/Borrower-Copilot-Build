import { BorrowerProfile, AmountCalculationResult } from '../types';
import { calculateFOIR } from './foir';
import { LOAN_PRODUCTS } from '../data/loanProducts';

/**
 * Calculates present value loan sanction amount from a monthly EMI budget, annual rate, and tenure months
 */
function calculateLoanPrincipalFromEMI(emi: number, annualInterestRatePercent: number, tenureMonths: number): number {
  if (emi <= 0 || annualInterestRatePercent <= 0 || tenureMonths <= 0) return 0;
  const monthlyRate = annualInterestRatePercent / 12 / 100;
  // PV Formula = EMI * [ (1 + r)^n - 1 ] / [ r * (1 + r)^n ]
  const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const principal = emi * (compoundFactor - 1) / (monthlyRate * compoundFactor);
  return Math.round(principal);
}

/**
 * Calculates Lender Eligibility Amount vs Borrower Safe Amount
 */
export function calculateAmountLimits(
  profile: BorrowerProfile, 
  estimatedInterestRatePercent: number = 13.5
): AmountCalculationResult {
  const foir = calculateFOIR(profile);
  const productKey = profile.loanType || 'personal';
  const productConfig = LOAN_PRODUCTS[productKey] || LOAN_PRODUCTS.personal;

  const defaultTenureMonths = productConfig.maxStandardTenureMonths;

  // 1. Calculate Lender Sanction Limit
  // For self-employed like Ravi, lenders evaluate based on ITR income if uncollateralized,
  // or property LTV (up to 60-70% of store value) if LAP!
  let lenderMaxEMI = foir.lenderMaxAllowedEMI;
  let lenderPrincipal = calculateLoanPrincipalFromEMI(lenderMaxEMI, estimatedInterestRatePercent, defaultTenureMonths);

  // Special Self-Employed LAP / Store Collateral check (Ravi's case)
  if (profile.employmentType === 'self_employed' && profile.unencumberedPropertyStoreValue) {
    const ltvCap = profile.unencumberedPropertyStoreValue * 0.65; // 65% LTV on property
    lenderPrincipal = Math.max(lenderPrincipal, Math.round(ltvCap));
  }

  // Lender Limit Range (+/- 10%)
  const likelyLenderMin = Math.round((lenderPrincipal * 0.9) / 10000) * 10000;
  const likelyLenderMax = Math.round((lenderPrincipal * 1.1) / 10000) * 10000;

  // 2. Calculate Safe Borrower Limit (Strictly within safe EMI surplus ceiling)
  let safePrincipal = calculateLoanPrincipalFromEMI(
    foir.borrowerSafeEMICeiling, 
    estimatedInterestRatePercent, 
    Math.min(36, defaultTenureMonths) // Recommend safer 3-year tenure for personal/unsecured
  );

  // Capped by realistic affordability
  const safeBorrowerMin = Math.round((safePrincipal * 0.85) / 5000) * 5000;
  const safeBorrowerMax = Math.round((safePrincipal * 1.0) / 5000) * 5000;

  // 3. Recommended Amount Decision
  const recommendedAmount = Math.min(profile.requestedAmount, safeBorrowerMax);

  // 4. Difference Reason & Explainability
  let differenceReason = '';
  if (likelyLenderMax > safeBorrowerMax) {
    differenceReason = `Your lender may approve up to ₹${(likelyLenderMax / 100000).toFixed(2)} Lakh based on gross income rules, but based on your actual monthly expenses and rent, we recommend staying below ₹${(safeBorrowerMax / 100000).toFixed(2)} Lakh to keep your household safe.`;
  } else {
    differenceReason = `Your safe borrowing limit matches your lender eligibility because your existing EMI burden is minimal relative to your surplus.`;
  }

  const items = [
    `Net Monthly Income: ₹${profile.monthlyNetIncome.toLocaleString('en-IN')}`,
    `Existing Obligations (EMIs + Rent): ₹${(profile.existingMonthlyEMI + (profile.monthlyRent || 0)).toLocaleString('en-IN')}`,
    `Monthly Living Expenses & Safety Buffer: ₹${(profile.householdExpenses + foir.safetyBufferAmount).toLocaleString('en-IN')}`,
    `Safe Monthly EMI Surplus Ceiling: ₹${foir.borrowerSafeEMICeiling.toLocaleString('en-IN')}/month`,
    `Likely Lender Sanction Range: ₹${(likelyLenderMin / 100000).toFixed(2)}L – ₹${(likelyLenderMax / 100000).toFixed(2)}L`
  ];

  const assumptions = [
    `Lender FOIR cap assumed at ${(productConfig.lenderMaxFOIRCap * 100)}% of income.`,
    `Borrower safe EMI ceiling reserves a mandatory 15% emergency cash buffer.`,
    `Calculations use an estimated interest rate of ${estimatedInterestRatePercent}%.`
  ];

  return {
    likelyLenderLimit: { min: likelyLenderMin, max: likelyLenderMax },
    safeBorrowerLimit: { min: safeBorrowerMin, max: safeBorrowerMax },
    recommendedAmount,
    differenceReason,
    explanation: {
      title: 'Why is the safe borrower limit different from the lender limit?',
      items,
      assumptions
    }
  };
}
