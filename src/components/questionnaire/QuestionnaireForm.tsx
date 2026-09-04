import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertCircle, Info, Sparkles } from 'lucide-react';
import { BorrowerProfile, EmploymentType, LoanPurpose, LoanType, EmployerType, CityTier } from '../../types';
import { MANDATORY_QUESTIONS, ADAPTIVE_QUESTIONS } from '../../data/questions';

interface QuestionnaireFormProps {
  activeStep: 1 | 2 | 3;
  profile: BorrowerProfile;
  onUpdateField: <K extends keyof BorrowerProfile>(field: K, value: BorrowerProfile[K]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  activeStep,
  profile,
  onUpdateField,
  onNext,
  onPrev
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateAndNext = () => {
    setErrorMsg(null);

    if (activeStep === 1) {
      if (!profile.age || profile.age < 18 || profile.age > 70) {
        setErrorMsg('Please enter a valid age between 18 and 70.');
        return;
      }
      if (!profile.monthlyNetIncome || profile.monthlyNetIncome <= 0) {
        setErrorMsg('Please enter a valid net monthly income greater than ₹0.');
        return;
      }
      if (!profile.requestedAmount || profile.requestedAmount <= 0) {
        setErrorMsg('Please enter a valid requested loan amount.');
        return;
      }
    }

    if (activeStep === 2) {
      if (profile.householdExpenses === undefined || profile.householdExpenses < 0) {
        setErrorMsg('Please enter valid monthly household expenses.');
        return;
      }
    }

    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="uppercase tracking-wider">Step {activeStep} of 3</span>
          <span className="text-emerald-400">
            {activeStep === 1 && 'Basic Demographics'}
            {activeStep === 2 && 'Financial Obligations'}
            {activeStep === 3 && 'Adaptive Domain Questions'}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${(activeStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
        {/* STEP 1: Basic Profile */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">Basic Profile & Loan Request</h2>
              <p className="text-xs text-slate-400 mt-1">Tell us about your background and what loan you require.</p>
            </div>

            {/* Age & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Age (Years)</label>
                <input
                  type="number"
                  min="18"
                  max="70"
                  value={profile.age || ''}
                  onChange={(e) => onUpdateField('age', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="29"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / City</label>
                <select
                  value={profile.location}
                  onChange={(e) => {
                    const loc = e.target.value;
                    onUpdateField('location', loc);
                    if (loc === 'Bengaluru' || loc === 'Metro') {
                      onUpdateField('cityTier', 'tier_1');
                    } else {
                      onUpdateField('cityTier', 'tier_2');
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Bengaluru">Bengaluru (Tier 1 Metro)</option>
                  <option value="Metro">Mumbai / Delhi NCR (Tier 1 Metro)</option>
                  <option value="Mysuru">Mysuru (Tier 2 City)</option>
                  <option value="Hubballi">Hubballi (Tier 2/3 City)</option>
                  <option value="Other">Other Tier 2 / Tier 3 Town</option>
                </select>
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Employment Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'salaried', label: 'Salaried', desc: 'Fixed monthly salary in bank' },
                  { id: 'self_employed', label: 'Self-Employed', desc: 'Kirana, trade, business owner' },
                  { id: 'informal', label: 'Informal / Gig', desc: 'Platform delivery, tailoring, cash' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateField('employmentType', item.id as EmploymentType)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      profile.employmentType === item.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Income & Requested Loan Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Net Monthly Income (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    value={profile.monthlyNetIncome || ''}
                    onChange={(e) => onUpdateField('monthlyNetIncome', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="110000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Requested Loan Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    value={profile.requestedAmount || ''}
                    onChange={(e) => onUpdateField('requestedAmount', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="800000"
                  />
                </div>
              </div>
            </div>

            {/* Loan Purpose & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Loan Purpose</label>
                <select
                  value={profile.loanPurpose}
                  onChange={(e) => {
                    const purpose = e.target.value as LoanPurpose;
                    onUpdateField('loanPurpose', purpose);
                    if (purpose === 'delivery_vehicle') {
                      onUpdateField('loanType', 'two_wheeler');
                    } else if (purpose === 'business_expansion') {
                      onUpdateField('loanType', 'business');
                    } else {
                      onUpdateField('loanType', 'personal');
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="wedding">Wedding / Family Event</option>
                  <option value="business_expansion">Business Stock / Expansion</option>
                  <option value="delivery_vehicle">EV Scooter / Delivery Vehicle</option>
                  <option value="debt_consolidation">Debt Consolidation (Pay off high-cost apps)</option>
                  <option value="personal_emergency">Personal Emergency / Medical</option>
                  <option value="education">Education / Skill Upgrade</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Loan Category</label>
                <select
                  value={profile.loanType}
                  onChange={(e) => onUpdateField('loanType', e.target.value as LoanType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="personal">Unsecured Personal Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="lap">Loan Against Property (LAP)</option>
                  <option value="two_wheeler">Two-Wheeler / EV Loan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Financial Profile */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">Financial Obligations & Bureau History</h2>
              <p className="text-xs text-slate-400 mt-1">Provide your monthly commitments so we can calculate true affordability.</p>
            </div>

            {/* Existing Monthly EMIs & Expenses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Existing Monthly EMIs (₹)</label>
                <input
                  type="number"
                  value={profile.existingMonthlyEMI}
                  onChange={(e) => onUpdateField('existingMonthlyEMI', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="14000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Household Expenses (₹)</label>
                <input
                  type="number"
                  value={profile.householdExpenses}
                  onChange={(e) => onUpdateField('householdExpenses', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="35000"
                />
              </div>
            </div>

            {/* Credit Score Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">Credit Score (CIBIL / Experian)</label>
                <span className="text-[11px] text-emerald-400 font-medium">No bureau pull required</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { label: 'Excellent (750+)', value: 780, desc: 'Prime borrower rates' },
                  { label: 'Good (700–749)', value: 720, desc: 'Standard market rates' },
                  { label: 'Fair (650–699)', value: 670, desc: 'Slightly higher risk' },
                  { label: 'Low (< 650)', value: 615, desc: 'Sub-prime risk tier' },
                  { label: "I don't know my score (Unknown)", value: null, desc: 'Widens rate range (+2.5%), no 0 penalty' }
                ].map((item, i) => {
                  const isSelected = profile.creditScore === item.value;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onUpdateField('creditScore', item.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Income Stability */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Income Stability Month-to-Month</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'high', label: 'High Stability', desc: 'Guaranteed salary/cash flow' },
                  { id: 'moderate', label: 'Moderate', desc: 'Minor seasonal variance' },
                  { id: 'variable', label: 'Variable', desc: 'Gig earnings fluctuate' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateField('incomeStability', item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      profile.incomeStability === item.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Adaptive Domain Questions */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Adaptive Domain Questions</h2>
                <p className="text-xs text-slate-400 mt-1">Questions tailored specifically for your profile.</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="capitalize">{profile.employmentType} Path</span>
              </span>
            </div>

            {/* Salaried Specific Fields */}
            {profile.employmentType === 'salaried' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employer Category</label>
                  <select
                    value={profile.employerType || 'mnc_govt'}
                    onChange={(e) => onUpdateField('employerType', e.target.value as EmployerType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="mnc_govt">MNC / Public Sector / Govt</option>
                    <option value="private_pvt">Established Private Company</option>
                    <option value="startup_small">Startup / Small Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Monthly House Rent (₹)</label>
                  <input
                    type="number"
                    value={profile.monthlyRent || ''}
                    onChange={(e) => onUpdateField('monthlyRent', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="28000"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Separated from general household expenses for precise surplus calculation.</p>
                </div>
              </div>
            )}

            {/* Self-Employed Specific Fields */}
            {profile.employmentType === 'self_employed' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Vintage (Years)</label>
                    <input
                      type="number"
                      value={profile.businessVintageYears || ''}
                      onChange={(e) => onUpdateField('businessVintageYears', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="14"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Declared Annual ITR Income (₹)</label>
                    <input
                      type="number"
                      value={profile.itrAnnualIncome || ''}
                      onChange={(e) => onUpdateField('itrAnnualIncome', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="420000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Unencumbered Shop / Property Value (₹)</label>
                  <input
                    type="number"
                    value={profile.unencumberedPropertyStoreValue || ''}
                    onChange={(e) => onUpdateField('unencumberedPropertyStoreValue', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="4500000"
                  />
                  <p className="text-[11px] text-emerald-400 mt-1">Property owned without mortgage can lower interest rate by 3-4% via LAP.</p>
                </div>
              </div>
            )}

            {/* Informal / Gig Worker Specific Fields */}
            {profile.employmentType === 'informal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Active Instant App Loans</label>
                    <input
                      type="number"
                      value={profile.existingAppLoansCount || 0}
                      onChange={(e) => onUpdateField('existingAppLoansCount', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recent EMI Bounces (Last 6 Months)</label>
                    <input
                      type="number"
                      value={profile.recentEmiBounceCount || 0}
                      onChange={(e) => onUpdateField('recentEmiBounceCount', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total High-Cost App Debt Balance (₹)</label>
                  <input
                    type="number"
                    value={profile.existingHighCostDebtAmount || ''}
                    onChange={(e) => onUpdateField('existingHighCostDebtAmount', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="35000"
                  />
                  <p className="text-[11px] text-rose-400 mt-1">High-cost loans (30%+ rates) trigger strict debt overhang warnings.</p>
                </div>
              </div>
            )}

            {/* Productive Revenue Asset Purpose */}
            {(profile.loanPurpose === 'business_expansion' || profile.loanPurpose === 'delivery_vehicle') && (
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expected Monthly Incremental Revenue (₹)</label>
                <input
                  type="number"
                  value={profile.expectedAdditionalMonthlyRevenue || ''}
                  onChange={(e) => onUpdateField('expectedAdditionalMonthlyRevenue', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="8000"
                />
                <p className="text-[11px] text-slate-400 mt-1">Extra cash flow generated directly by the asset purchased with this loan.</p>
              </div>
            )}
          </div>
        )}

        {/* Buttons Bar */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={validateAndNext}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
          >
            <span>{activeStep === 3 ? 'Run Rule Engine' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
