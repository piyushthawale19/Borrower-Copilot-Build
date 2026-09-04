import { BorrowerProfile, EMICalculationResult, StressTestResult } from '../types';
import { calculateFOIR } from './foir';
import { calculateFairInterestRate } from './rates';
import { LOAN_PRODUCTS } from '../data/loanProducts';

/**
 * Standard EMI Formula = P * r * (1+r)^n / [ (1+r)^n - 1 ]
 */
export function calculateEMI(principal: number, annualInterestRatePercent: number, tenureMonths: number): number {
  if (principal <= 0 || annualInterestRatePercent <= 0 || tenureMonths <= 0) return 0;
  const r = annualInterestRatePercent / 12 / 100;
  const compound = Math.pow(1 + r, tenureMonths);
  const emi = principal * r * compound / (compound - 1);
  return Math.round(emi);
}

/**
 * Computes EMI options across tenures, recommended ceiling, and stress scenarios
 */
export function calculateEMICalculation(
  profile: BorrowerProfile, 
  targetAmount: number
): EMICalculationResult {
  const foir = calculateFOIR(profile);
  const rateAnalysis = calculateFairInterestRate(profile);
  const interestRate = rateAnalysis.expectedRate;

  const productKey = profile.loanType || 'personal';
  const productConfig = LOAN_PRODUCTS[productKey] || LOAN_PRODUCTS.personal;

  // Determine Primary Recommended Tenure
  let primaryTenure = 36; // 3 years standard default
  if (targetAmount > 1000000 && productConfig.maxStandardTenureMonths >= 60) {
    primaryTenure = 60; // 5 years for large loans
  } else if (targetAmount <= 200000) {
    primaryTenure = 24; // 2 years for smaller loans / bikes
  }

  const calculatedEMI = calculateEMI(targetAmount, interestRate, primaryTenure);
  const totalRepayment = calculatedEMI * primaryTenure;
  const totalInterest = Math.max(0, totalRepayment - targetAmount);

  // Tenure Breakdown Options (12m, 24m, 36m, 48m, 60m)
  const availableTenures = [12, 24, 36, 48, 60].filter(
    (t) => t <= productConfig.maxStandardTenureMonths
  );

  const tenureOptions = availableTenures.map((m) => {
    const emi = calculateEMI(targetAmount, interestRate, m);
    const rep = emi * m;
    const int = Math.max(0, rep - targetAmount);
    return {
      months: m,
      emi,
      totalInterest: int,
      isRecommended: m === primaryTenure
    };
  });

  // Recommended EMI Ceiling
  const recommendedEMICeiling = foir.borrowerSafeEMICeiling;

  // -------------------------------------------------------------
  // STRESS TEST CALCULATIONS (Section 10 of Prompt)
  // -------------------------------------------------------------
  
  // Stress Scenario 1: Income Falls by 20%
  const stressedIncome = Math.round(foir.effectiveMonthlyIncome * 0.80);
  const totalStressedEMIs = profile.existingMonthlyEMI + calculatedEMI;
  const stressedDTI = stressedIncome > 0 ? Math.round((totalStressedEMIs / stressedIncome) * 100) : 100;
  
  let incomeDropStatus: 'MANAGEABLE' | 'TIGHT' | 'HIGH_RISK' = 'MANAGEABLE';
  let incomeDropDesc = '';
  
  if (stressedDTI > 65) {
    incomeDropStatus = 'HIGH_RISK';
    incomeDropDesc = `If income drops 20% (to ₹${stressedIncome.toLocaleString('en-IN')}), total EMIs will consume ${stressedDTI}% of income, causing severe debt distress.`;
  } else if (stressedDTI > 50) {
    incomeDropStatus = 'TIGHT';
    incomeDropDesc = `If income drops 20%, total EMIs will consume ${stressedDTI}% of income. Tight, but manageable with strict budgeting.`;
  } else {
    incomeDropStatus = 'MANAGEABLE';
    incomeDropDesc = `If income drops 20%, total EMIs remain at a safe ${stressedDTI}% of reduced income.`;
  }

  const stressScenarioIncomeDrop: StressTestResult = {
    scenarioName: 'Income Reduction (-20%)',
    incomeDropPercent: 20,
    stressedIncome,
    stressedEMI: calculatedEMI,
    stressedDTI,
    status: incomeDropStatus,
    impactDescription: incomeDropDesc
  };

  // Stress Scenario 2: Interest Rate Increases by +2.0%
  const stressedRate = interestRate + 2.0;
  const stressedRateEMI = calculateEMI(targetAmount, stressedRate, primaryTenure);
  const emiDelta = stressedRateEMI - calculatedEMI;
  const totalStressedDTI = foir.effectiveMonthlyIncome > 0 
    ? Math.round(((profile.existingMonthlyEMI + stressedRateEMI) / foir.effectiveMonthlyIncome) * 100)
    : 100;

  let rateHikeStatus: 'MANAGEABLE' | 'TIGHT' | 'HIGH_RISK' = 'MANAGEABLE';
  if (totalStressedDTI > 60) {
    rateHikeStatus = 'HIGH_RISK';
  } else if (totalStressedDTI > 45) {
    rateHikeStatus = 'TIGHT';
  }

  const stressScenarioRateHike: StressTestResult = {
    scenarioName: 'Interest Rate Spike (+2.0%)',
    rateHikePercent: 2.0,
    stressedRate,
    stressedEMI: stressedRateEMI,
    stressedDTI: totalStressedDTI,
    status: rateHikeStatus,
    impactDescription: `If interest rates spike by +2.0% (to ${stressedRate}%), your monthly EMI increases by ₹${emiDelta.toLocaleString('en-IN')}/month.`
  };

  const items = [
    `Recommended EMI Ceiling: ₹${recommendedEMICeiling.toLocaleString('en-IN')}/month`,
    `Calculated EMI for ₹${targetAmount.toLocaleString('en-IN')} @ ${interestRate}% (${primaryTenure}m): ₹${calculatedEMI.toLocaleString('en-IN')}/month`,
    `Total Interest Payable: ₹${totalInterest.toLocaleString('en-IN')}`,
    `Total Repayment (Principal + Interest): ₹${totalRepayment.toLocaleString('en-IN')}`,
    `Tenure Comparison: 2-Year EMI is ₹${(tenureOptions.find(t=>t.months===24)?.emi || 0).toLocaleString('en-IN')} vs 3-Year EMI is ₹${calculatedEMI.toLocaleString('en-IN')}`
  ];

  const assumptions = [
    `EMI calculated assuming reducing balance method at ${interestRate}% p.a.`,
    `Stress scenario assumes a potential 20% income disruption or a 2.0% floating rate hike.`
  ];

  return {
    recommendedEMICeiling,
    tenureMonths: primaryTenure,
    calculatedEMI,
    totalInterest,
    totalRepayment,
    tenureOptions,
    stressScenarios: [stressScenarioIncomeDrop, stressScenarioRateHike],
    explanation: {
      title: 'How is your recommended EMI ceiling and stress test calculated?',
      items,
      assumptions
    }
  };
}
