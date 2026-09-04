import { BorrowerProfile } from '../types';

export interface QuestionOption {
  label: string;
  value: string | number | null;
  description?: string;
}

export interface QuestionDefinition {
  id: keyof BorrowerProfile | string;
  step: 1 | 2 | 3;
  label: string;
  subtitle?: string;
  type: 'number' | 'currency' | 'select' | 'radio' | 'boolean';
  options?: QuestionOption[];
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  condition?: (profile: Partial<BorrowerProfile>) => boolean;
}

export const QUESTIONNAIRE_STEPS = [
  { step: 1, title: 'Basic Profile', subtitle: 'Demographics & Loan Request' },
  { step: 2, title: 'Financial Profile', subtitle: 'Obligations & Debt History' },
  { step: 3, title: 'Adaptive Details', subtitle: 'Tailored Domain Questions' }
];

export const MANDATORY_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'age',
    step: 1,
    label: 'What is your age?',
    type: 'number',
    placeholder: '29',
    min: 18,
    max: 70,
    helpText: 'Must be between 18 and 70 years old.'
  },
  {
    id: 'location',
    step: 1,
    label: 'Where are you located?',
    type: 'select',
    options: [
      { label: 'Bengaluru (Tier 1 Metro)', value: 'Bengaluru' },
      { label: 'Mumbai / Delhi NCR (Tier 1)', value: 'Metro' },
      { label: 'Mysuru (Tier 2 City)', value: 'Mysuru' },
      { label: 'Hubballi (Tier 2/3 City)', value: 'Hubballi' },
      { label: 'Other Tier 2 / Tier 3 / Rural', value: 'Other' }
    ]
  },
  {
    id: 'employmentType',
    step: 1,
    label: 'What is your primary income type?',
    type: 'radio',
    options: [
      { label: 'Salaried', value: 'salaried', description: 'Monthly fixed salary in bank account' },
      { label: 'Self-Employed / Business', value: 'self_employed', description: 'Own store, trade, or business' },
      { label: 'Informal / Gig Worker', value: 'informal', description: 'Platform delivery, freelance tailoring, daily wages' }
    ]
  },
  {
    id: 'monthlyNetIncome',
    step: 1,
    label: 'What is your average monthly net income?',
    subtitle: 'After tax or direct business cost',
    type: 'currency',
    placeholder: '₹1,10,000'
  },
  {
    id: 'loanPurpose',
    step: 1,
    label: 'What is the primary purpose of this loan?',
    type: 'select',
    options: [
      { label: 'Wedding / Family Event', value: 'wedding' },
      { label: 'Business Expansion / Stock Inventory', value: 'business_expansion' },
      { label: 'Delivery Vehicle / EV Purchase', value: 'delivery_vehicle' },
      { label: 'Debt Consolidation (High-cost loan payoff)', value: 'debt_consolidation' },
      { label: 'Personal Medical / Emergency', value: 'personal_emergency' },
      { label: 'Education / Skill Development', value: 'education' },
      { label: 'Home Renovation', value: 'home_renovation' }
    ]
  },
  {
    id: 'requestedAmount',
    step: 1,
    label: 'How much loan are you requesting?',
    type: 'currency',
    placeholder: '₹8,00,000'
  },

  // STEP 2: Financial Profile
  {
    id: 'existingMonthlyEMI',
    step: 2,
    label: 'Total existing monthly EMIs you pay right now',
    subtitle: 'Car loan, home loan, bike EMI, or active app loan EMIs',
    type: 'currency',
    placeholder: '₹14,000'
  },
  {
    id: 'householdExpenses',
    step: 2,
    label: 'Monthly household living expenses',
    subtitle: 'Rent, groceries, school fees, utilities',
    type: 'currency',
    placeholder: '₹35,000'
  },
  {
    id: 'creditScore',
    step: 2,
    label: 'What is your credit score (CIBIL / Experian)?',
    subtitle: 'Selecting "I don\'t know" will NOT default to 0 or 300; it widens rate ranges conservatively.',
    type: 'radio',
    options: [
      { label: 'Excellent (750+)', value: 780 },
      { label: 'Good (700–749)', value: 720 },
      { label: 'Fair (650–699)', value: 670 },
      { label: 'Below 650 / Low', value: 615 },
      { label: "I don't know my score (Unknown)", value: null, description: 'No credit history or unrated' }
    ]
  },
  {
    id: 'incomeStability',
    step: 2,
    label: 'How stable is your income month-to-month?',
    type: 'radio',
    options: [
      { label: 'High (Fixed guaranteed monthly credit)', value: 'high' },
      { label: 'Moderate (Minor seasonal fluctuation)', value: 'moderate' },
      { label: 'Variable (Fluctuates significantly)', value: 'variable' }
    ]
  }
];

export const ADAPTIVE_QUESTIONS: QuestionDefinition[] = [
  // SALARIED BRANCH
  {
    id: 'employerType',
    step: 3,
    label: 'What category is your employer?',
    type: 'radio',
    options: [
      { label: 'MNC / Govt / Large Corporate', value: 'mnc_govt' },
      { label: 'Established Private Ltd', value: 'private_pvt' },
      { label: 'Startup / Small Firm', value: 'startup_small' }
    ],
    condition: (p) => p.employmentType === 'salaried'
  },
  {
    id: 'monthlyRent',
    step: 3,
    label: 'How much rent do you pay monthly?',
    type: 'currency',
    placeholder: '₹28,000',
    helpText: 'Separated from general household expenses for precise surplus calculation.',
    condition: (p) => p.employmentType === 'salaried'
  },

  // SELF-EMPLOYED BRANCH
  {
    id: 'businessVintageYears',
    step: 3,
    label: 'How many years has your business been operational?',
    type: 'number',
    placeholder: '14',
    min: 0,
    max: 50,
    condition: (p) => p.employmentType === 'self_employed'
  },
  {
    id: 'itrAnnualIncome',
    step: 3,
    label: 'Annual income declared in latest ITR (Income Tax Return)',
    subtitle: 'Lenders check ITR for official eligibility',
    type: 'currency',
    placeholder: '₹4,20,000',
    condition: (p) => p.employmentType === 'self_employed'
  },
  {
    id: 'unencumberedPropertyStoreValue',
    step: 3,
    label: 'Estimated value of unencumbered business/residential property (if any)',
    subtitle: 'Property owned with no existing mortgage, usable as loan security/LAP',
    type: 'currency',
    placeholder: '₹45,00,000',
    condition: (p) => p.employmentType === 'self_employed'
  },

  // INFORMAL / GIG BRANCH
  {
    id: 'existingAppLoansCount',
    step: 3,
    label: 'How many active instant app / micro loans do you have?',
    type: 'number',
    placeholder: '3',
    min: 0,
    max: 10,
    condition: (p) => p.employmentType === 'informal'
  },
  {
    id: 'existingHighCostDebtAmount',
    step: 3,
    label: 'Total outstanding balance on high-cost app/informal loans',
    type: 'currency',
    placeholder: '₹35,000',
    condition: (p) => p.employmentType === 'informal'
  },
  {
    id: 'recentEmiBounceCount',
    step: 3,
    label: 'Number of bounced/delayed EMIs in the last 6 months',
    type: 'number',
    placeholder: '1',
    min: 0,
    max: 10,
    condition: (p) => p.employmentType === 'informal'
  },

  // PRODUCTIVE ASSET REVENUE
  {
    id: 'expectedAdditionalMonthlyRevenue',
    step: 3,
    label: 'Expected additional net income generated by this loan per month',
    subtitle: 'E.g., extra delivery income from EV scooter or margin from shop inventory',
    type: 'currency',
    placeholder: '₹8,000',
    condition: (p) => p.loanPurpose === 'business_expansion' || p.loanPurpose === 'delivery_vehicle'
  }
];
