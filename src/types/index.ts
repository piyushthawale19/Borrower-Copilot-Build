// Core Domain Types for Lokta Borrower Copilot

export type EmploymentType = 'salaried' | 'self_employed' | 'informal';

export type LoanType = 'personal' | 'business' | 'lap' | 'two_wheeler';

export type LoanPurpose = 
  | 'wedding'
  | 'business_expansion'
  | 'delivery_vehicle'
  | 'personal_emergency'
  | 'debt_consolidation'
  | 'education'
  | 'home_renovation';

export type CityTier = 'tier_1' | 'tier_2' | 'tier_3_rural';

export type IncomeStability = 'high' | 'moderate' | 'variable';

export type EmployerType = 'mnc_govt' | 'private_pvt' | 'startup_small';

export type VerdictType = 'BORROW' | 'BORROW_LESS' | 'DONT_BORROW';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface BorrowerProfile {
  // Mandatory profile fields
  id?: string;
  name?: string;
  age: number;
  location: string;
  cityTier: CityTier;
  employmentType: EmploymentType;
  monthlyNetIncome: number;
  loanPurpose: LoanPurpose;
  loanType: LoanType;
  requestedAmount: number;
  existingMonthlyEMI: number;
  householdExpenses: number;
  creditScore: number | null; // NULL means unknown score (NEVER set to 0 or 300!)
  incomeStability: IncomeStability;

  // Adaptive Salaried Fields
  employerType?: EmployerType;
  experienceYears?: number;
  monthlyRent?: number;

  // Adaptive Self-Employed Fields
  businessVintageYears?: number;
  itrAnnualIncome?: number;
  cashIncomeMonthly?: number;
  unencumberedPropertyStoreValue?: number;
  wifeIncomeMonthly?: number;

  // Adaptive Informal / Gig Fields
  minMonthlyIncome?: number;
  maxMonthlyIncome?: number;
  existingAppLoansCount?: number;
  existingHighCostDebtAmount?: number;
  recentEmiBounceCount?: number;
  dependentsCount?: number;

  // Adaptive Business / Asset Purpose
  expectedAdditionalMonthlyRevenue?: number;
}

export interface DetailedExplanation {
  title: string;
  items: string[];
  assumptions: string[];
}

export interface AmountCalculationResult {
  likelyLenderLimit: { min: number; max: number };
  safeBorrowerLimit: { min: number; max: number };
  recommendedAmount: number;
  differenceReason: string;
  explanation: DetailedExplanation;
}

export interface RateCalculationResult {
  fairRateRange: { min: number; max: number };
  expectedRate: number;
  processingFeePercent: number;
  processingFeeAmount: number;
  estimatedAPR: number;
  drivers: string[];
  explanation: DetailedExplanation;
}

export interface StressTestResult {
  scenarioName: string;
  incomeDropPercent?: number;
  rateHikePercent?: number;
  stressedIncome?: number;
  stressedRate?: number;
  stressedEMI: number;
  stressedDTI: number; // Debt-to-income ratio %
  status: 'MANAGEABLE' | 'TIGHT' | 'HIGH_RISK';
  impactDescription: string;
}

export interface EMICalculationResult {
  recommendedEMICeiling: number;
  tenureMonths: number;
  calculatedEMI: number;
  totalInterest: number;
  totalRepayment: number;
  tenureOptions: Array<{
    months: number;
    emi: number;
    totalInterest: number;
    isRecommended?: boolean;
  }>;
  stressScenarios: StressTestResult[];
  explanation: DetailedExplanation;
}

export interface VerdictResult {
  verdict: VerdictType;
  headline: string;
  summaryReason: string;
  keyRiskFactors: string[];
  confidence: ConfidenceLevel;
  confidenceReasons: string[];
  explanation: DetailedExplanation;
}

export interface NegotiationCardData {
  profileSummary: {
    name?: string;
    age: number;
    location: string;
    employmentTypeLabel: string;
    incomeFormatted: string;
    purposeLabel: string;
    requestedAmountFormatted: string;
  };
  verdict: VerdictResult;
  amount: AmountCalculationResult;
  rate: RateCalculationResult;
  emi: EMICalculationResult;
  negotiationPoints: string[];
  redFlagsForLender: string[];
  disclaimer: string;
  generatedDate: string;
}

export interface PersonaPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  profile: BorrowerProfile;
}
