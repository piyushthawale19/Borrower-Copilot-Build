// Centralized Config for Loan Product Rate Bands & FOIR Caps
// As required by Section 8 of the prompt - No magic numbers inside UI!

export interface ProductConfig {
  name: string;
  code: string;
  baseRateMin: number;
  baseRateMax: number;
  processingFeePercentMin: number;
  processingFeePercentMax: number;
  maxStandardTenureMonths: number;
  lenderMaxFOIRCap: number; // Maximum Debt-to-Income % lenders allow
  borrowerSafeFOIRCap: number; // Conservative borrower safety cap
}

export const LOAN_PRODUCTS: Record<string, ProductConfig> = {
  personal: {
    name: 'Unsecured Personal Loan',
    code: 'personal',
    baseRateMin: 10.5,
    baseRateMax: 15.5,
    processingFeePercentMin: 1.5,
    processingFeePercentMax: 2.5,
    maxStandardTenureMonths: 60,
    lenderMaxFOIRCap: 0.55, // 55%
    borrowerSafeFOIRCap: 0.40 // 40%
  },
  business: {
    name: 'Unsecured / Secured Business Loan',
    code: 'business',
    baseRateMin: 13.5,
    baseRateMax: 21.0,
    processingFeePercentMin: 2.0,
    processingFeePercentMax: 3.0,
    maxStandardTenureMonths: 48,
    lenderMaxFOIRCap: 0.50,
    borrowerSafeFOIRCap: 0.35
  },
  lap: {
    name: 'Loan Against Property (LAP)',
    code: 'lap',
    baseRateMin: 9.5,
    baseRateMax: 13.0,
    processingFeePercentMin: 1.0,
    processingFeePercentMax: 2.0,
    maxStandardTenureMonths: 120, // 10 years
    lenderMaxFOIRCap: 0.60,
    borrowerSafeFOIRCap: 0.45
  },
  two_wheeler: {
    name: 'Two-Wheeler / Commercial EV Loan',
    code: 'two_wheeler',
    baseRateMin: 12.0,
    baseRateMax: 20.0,
    processingFeePercentMin: 2.0,
    processingFeePercentMax: 3.5,
    maxStandardTenureMonths: 36,
    lenderMaxFOIRCap: 0.45,
    borrowerSafeFOIRCap: 0.30
  }
};
