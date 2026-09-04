import { BorrowerProfile, RateCalculationResult } from '../types';
import { LOAN_PRODUCTS } from '../data/loanProducts';

/**
 * Calculates Fair Interest Rate Range, Expected Rate, Processing Fee & All-in APR
 */
export function calculateFairInterestRate(profile: BorrowerProfile): RateCalculationResult {
  const productKey = profile.loanType || 'personal';
  const productConfig = LOAN_PRODUCTS[productKey] || LOAN_PRODUCTS.personal;

  let rateMin = productConfig.baseRateMin;
  let rateMax = productConfig.baseRateMax;

  const drivers: string[] = [];

  // 1. Credit Score Modifier & Unknown Credit Score Logic
  if (profile.creditScore === null) {
    // UNKNOWN SCORE RULE: Widen rate range conservatively (+2.5%), do NOT assume 300 or 0!
    rateMax += 2.5;
    drivers.push('Credit score is Unknown/Unrated: Rate range widened by +2.5% due to missing bureau history.');
  } else if (profile.creditScore >= 780) {
    rateMin -= 1.0;
    rateMax -= 1.5;
    drivers.push(`High Credit Score (${profile.creditScore}): Eligible for prime borrower rate discount (-1.5%).`);
  } else if (profile.creditScore >= 720) {
    rateMin -= 0.5;
    rateMax -= 0.5;
    drivers.push(`Good Credit Score (${profile.creditScore}): Baseline risk tier.`);
  } else if (profile.creditScore < 650) {
    rateMin += 2.0;
    rateMax += 3.0;
    drivers.push(`Low Credit Score (${profile.creditScore}): Risk premium added (+2.5%).`);
  }

  // 2. Employment & Income Stability Modifier
  if (profile.employmentType === 'salaried') {
    if (profile.employerType === 'mnc_govt') {
      rateMin -= 0.5;
      rateMax -= 0.5;
      drivers.push('Salaried at MNC / Govt: Tier-1 employer discount applied.');
    }
  } else if (profile.employmentType === 'self_employed') {
    if (profile.unencumberedPropertyStoreValue && profile.unencumberedPropertyStoreValue > 2000000) {
      rateMin -= 2.0;
      rateMax -= 2.5;
      drivers.push('Unencumbered Property Security: LAP/Secured business path lowers rate significantly.');
    }
  } else if (profile.employmentType === 'informal') {
    rateMin += 1.5;
    rateMax += 2.5;
    drivers.push('Informal / Gig Income: Higher lender risk premium applied for non-standard documentation.');
    
    if (profile.recentEmiBounceCount && profile.recentEmiBounceCount > 0) {
      rateMin += 2.0;
      rateMax += 2.0;
      drivers.push(`Recent EMI Bounce History (${profile.recentEmiBounceCount}): Additional +2.0% risk penalty.`);
    }
  }

  // Round rates to 1 decimal place
  rateMin = Math.round(Math.max(8.5, rateMin) * 10) / 10;
  rateMax = Math.round(Math.max(rateMin + 1.5, rateMax) * 10) / 10;

  const expectedRate = Math.round(((rateMin + rateMax) / 2) * 10) / 10;

  // 3. Processing Fee & APR Calculation
  const processingFeePercent = Math.round(((productConfig.processingFeePercentMin + productConfig.processingFeePercentMax) / 2) * 10) / 10;
  const processingFeeAmount = Math.round(profile.requestedAmount * (processingFeePercent / 100));

  // Amortized APR estimation (Rate + Upfront Fee spread over tenure)
  const defaultTenureYears = Math.min(5, productConfig.maxStandardTenureMonths / 12);
  const feeAnnualizedSpread = processingFeePercent / defaultTenureYears;
  const estimatedAPR = Math.round((expectedRate + feeAnnualizedSpread) * 10) / 10;

  const items = [
    `Product Category: ${productConfig.name}`,
    `Base Market Rate Range: ${productConfig.baseRateMin}% – ${productConfig.baseRateMax}%`,
    ...drivers,
    `Upfront Processing Fee (${processingFeePercent}%): ₹${processingFeeAmount.toLocaleString('en-IN')}`,
    `All-in Effective APR: ${estimatedAPR}% (includes interest + annualized fee spread)`
  ];

  const assumptions = [
    `Fair rate represents reasonable market pricing for your profile, not a official lender quote.`,
    `Processing fee assumed at standard market average of ${processingFeePercent}%.`,
    `APR is calculated over an assumed tenure of ${defaultTenureYears} years.`
  ];

  return {
    fairRateRange: { min: rateMin, max: rateMax },
    expectedRate,
    processingFeePercent,
    processingFeeAmount,
    estimatedAPR,
    drivers,
    explanation: {
      title: 'How is your fair interest rate and APR calculated?',
      items,
      assumptions
    }
  };
}
