import { PersonaPreset } from '../types';

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    subtitle: '29 yrs • Bengaluru • Salaried SE',
    description: 'High income, strong credit score (780), but existing car EMI & high rent burden.',
    badge: 'Salaried Tech',
    profile: {
      id: 'priya',
      name: 'Priya Sharma',
      age: 29,
      location: 'Bengaluru',
      cityTier: 'tier_1',
      employmentType: 'salaried',
      monthlyNetIncome: 110000,
      loanPurpose: 'wedding',
      loanType: 'personal',
      requestedAmount: 800000,
      existingMonthlyEMI: 14000,
      householdExpenses: 35000,
      creditScore: 780,
      incomeStability: 'high',
      employerType: 'mnc_govt',
      experienceYears: 5,
      monthlyRent: 28000
    }
  },
  {
    id: 'ravi',
    name: 'Ravi Kumar',
    subtitle: '42 yrs • Mysuru • Kirana Store Owner',
    description: '14-year vintage, strong cash flow, unencumbered ₹45L shop, no credit score (Unknown).',
    badge: 'Self-Employed Kirana',
    profile: {
      id: 'ravi',
      name: 'Ravi Kumar',
      age: 42,
      location: 'Mysuru',
      cityTier: 'tier_2',
      employmentType: 'self_employed',
      monthlyNetIncome: 60000, // Average of ₹40k–₹80k cash income
      loanPurpose: 'business_expansion',
      loanType: 'business',
      requestedAmount: 1500000,
      existingMonthlyEMI: 0,
      householdExpenses: 25000,
      creditScore: null, // Unknown credit score (stored as null!)
      incomeStability: 'moderate',
      businessVintageYears: 14,
      itrAnnualIncome: 420000,
      cashIncomeMonthly: 60000,
      unencumberedPropertyStoreValue: 4500000,
      wifeIncomeMonthly: 18000,
      expectedAdditionalMonthlyRevenue: 30000
    }
  },
  {
    id: 'anita',
    name: 'Anita Devi',
    subtitle: '35 yrs • Hubballi • Gig Delivery & Tailor',
    description: 'Informal gig income, 3 high-cost app loans (30%+), 1 EMI bounce, requests EV scooter.',
    badge: 'Informal / Gig Worker',
    profile: {
      id: 'anita',
      name: 'Anita Devi',
      age: 35,
      location: 'Hubballi',
      cityTier: 'tier_2',
      employmentType: 'informal',
      monthlyNetIncome: 28000, // Average of ₹26k–₹30k income
      loanPurpose: 'delivery_vehicle',
      loanType: 'two_wheeler',
      requestedAmount: 150000,
      existingMonthlyEMI: 6500, // Approximate EMI for ₹35,000 app loans
      householdExpenses: 18000,
      creditScore: 615,
      incomeStability: 'variable',
      minMonthlyIncome: 26000,
      maxMonthlyIncome: 30000,
      existingAppLoansCount: 3,
      existingHighCostDebtAmount: 35000,
      recentEmiBounceCount: 1,
      dependentsCount: 2,
      expectedAdditionalMonthlyRevenue: 8000
    }
  }
];
