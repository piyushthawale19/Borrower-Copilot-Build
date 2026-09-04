import { BorrowerProfile, NegotiationCardData } from '../types';
import { calculateFOIR } from './foir';
import { calculateAmountLimits } from './eligibility';
import { calculateFairInterestRate } from './rates';
import { calculateEMICalculation } from './emi';
import { calculateBorrowingVerdict } from './verdict';

/**
 * Generates the complete Negotiation Card payload for export & lender discussion
 */
export function generateNegotiationCard(profile: BorrowerProfile): NegotiationCardData {
  const verdict = calculateBorrowingVerdict(profile);
  const amount = calculateAmountLimits(profile);
  const rate = calculateFairInterestRate(profile);
  const emi = calculateEMICalculation(profile, amount.recommendedAmount);
  const foir = calculateFOIR(profile);

  // 1. Borrower Profile Summary Format
  const employmentLabels: Record<string, string> = {
    salaried: 'Salaried Professional',
    self_employed: 'Self-Employed / Business Owner',
    informal: 'Informal / Gig Worker'
  };

  const purposeLabels: Record<string, string> = {
    wedding: 'Wedding / Family Event',
    business_expansion: 'Business Expansion / Inventory',
    delivery_vehicle: 'EV Delivery Vehicle',
    debt_consolidation: 'Debt Consolidation',
    personal_emergency: 'Personal Emergency',
    education: 'Education',
    home_renovation: 'Home Renovation'
  };

  const profileSummary = {
    name: profile.name || 'Borrower',
    age: profile.age,
    location: profile.location,
    employmentTypeLabel: employmentLabels[profile.employmentType] || profile.employmentType,
    incomeFormatted: `₹${profile.monthlyNetIncome.toLocaleString('en-IN')}/month`,
    purposeLabel: purposeLabels[profile.loanPurpose] || profile.loanPurpose,
    requestedAmountFormatted: `₹${profile.requestedAmount.toLocaleString('en-IN')}`
  };

  // 2. Generate Actionable Negotiation Talking Points for Borrower
  const negotiationPoints: string[] = [];

  negotiationPoints.push(
    `Fair Interest Target: Benchmark your rate negotiation between ${rate.fairRateRange.min}% and ${rate.fairRateRange.max}%. Ask the lender to explain any quote above ${rate.fairRateRange.max}%.`
  );

  negotiationPoints.push(
    `EMI Ceiling: Do NOT accept any EMI exceeding ₹${emi.recommendedEMICeiling.toLocaleString('en-IN')}/month. Explain to the loan officer that your household cash flow safety cap is ₹${emi.recommendedEMICeiling.toLocaleString('en-IN')}.`
  );

  negotiationPoints.push(
    `Processing Fee Cap: Insist on capping the upfront processing fee at ${rate.processingFeePercent}% (₹${rate.processingFeeAmount.toLocaleString('en-IN')}). Request a fee waiver or reduction.`
  );

  if (profile.employmentType === 'self_employed' && profile.unencumberedPropertyStoreValue) {
    negotiationPoints.push(
      `Leverage Collateral: You hold unencumbered property worth ₹${(profile.unencumberedPropertyStoreValue / 100000).toFixed(2)} Lakh. Request the lender to route this as LAP (Loan Against Property) to lower your interest rate by 3-4%.`
    );
  }

  if (profile.creditScore && profile.creditScore >= 750) {
    negotiationPoints.push(
      `CIBIL Advantage: Highlight your high credit score (${profile.creditScore}) to demand zero pre-closure penalty and waiver of administrative charges.`
    );
  }

  if (profile.loanPurpose === 'debt_consolidation' || (profile.existingAppLoansCount && profile.existingAppLoansCount > 0)) {
    negotiationPoints.push(
      `Direct Debt Payoff: Offer the lender to directly disburse funds to pay off your active high-cost app loans to reduce risk.`
    );
  }

  // 3. Red Flags & Traps to Avoid
  const redFlagsForLender = [
    `Unbundled Loan Insurance: Beware of lenders bundling mandatory credit life insurance without your consent (can add 2-4% to loan cost).`,
    `Floating Rate Escalation: Ensure the loan interest rate reset frequency is clearly defined in writing.`,
    `Pre-closure & Part-payment Penalties: Floating rate loans for individuals must have 0% foreclosure penalty per RBI guidelines.`,
    `Difference Between Quoted Rate & Effective APR: Lenders often quote flat interest rates. Always calculate effective Reducing Balance APR.`
  ];

  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return {
    profileSummary,
    verdict,
    amount,
    rate,
    emi,
    negotiationPoints,
    redFlagsForLender,
    disclaimer: 'This Negotiation Card is a self-assessment decision aid based on user-provided financial information. It does not constitute a formal loan sanction letter or official financial advice.',
    generatedDate
  };
}
