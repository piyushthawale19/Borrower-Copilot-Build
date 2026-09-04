import React, { useState } from 'react';
import { Calendar, AlertTriangle, ShieldCheck, TrendingDown, ArrowUpRight } from 'lucide-react';
import { EMICalculationResult } from '../../types';
import { ExplanationAccordion } from '../common/ExplainabilityModal';

interface EMICalculatorCardProps {
  emi: EMICalculationResult;
}

export const EMICalculatorCard: React.FC<EMICalculatorCardProps> = ({ emi }) => {
  const [selectedTenure, setSelectedTenure] = useState<number>(emi.tenureMonths);

  const activeTenureObj = emi.tenureOptions.find((t) => t.months === selectedTenure) || emi.tenureOptions[0];

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            OUTPUT 4 — EMI & STRESS TEST
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">Monthly Outflow & Stress Ceiling</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Safe Monthly Ceiling:</span>
          <div className="text-sm font-extrabold font-mono text-emerald-400">
            ₹{emi.recommendedEMICeiling.toLocaleString('en-IN')}/mo
          </div>
        </div>
      </div>

      {/* Primary Recommended EMI Highlight */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">Calculated Monthly EMI ({selectedTenure} Months):</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            ₹{activeTenureObj.emi.toLocaleString('en-IN')}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ month</span>
          </div>
        </div>

        <div className="space-y-1 text-right sm:text-right">
          <div className="text-xs text-slate-400">Total Interest Payable:</div>
          <div className="text-sm font-bold font-mono text-emerald-300">
            ₹{activeTenureObj.totalInterest.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Tenure Breakdown Selector Table */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Tenure Options & Interest Trade-off:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {emi.tenureOptions.map((opt) => {
            const isSelected = opt.months === selectedTenure;
            const exceedsCeiling = opt.emi > emi.recommendedEMICeiling;

            return (
              <button
                key={opt.months}
                onClick={() => setSelectedTenure(opt.months)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">{opt.months} Months</span>
                  {opt.isRecommended && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                      REC
                    </span>
                  )}
                </div>
                <div className="text-sm font-extrabold font-mono mt-1 text-emerald-300">
                  ₹{opt.emi.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Int: ₹{(opt.totalInterest / 1000).toFixed(0)}k
                </div>
                {exceedsCeiling && (
                  <div className="text-[9px] text-rose-400 font-semibold mt-1">Exceeds Safe Ceiling</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* STRESS TEST SCENARIOS SECTION (Section 10 of Prompt) */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Affordability Stress Testing
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emi.stressScenarios.map((stress, idx) => {
            const isHighRisk = stress.status === 'HIGH_RISK';
            const isTight = stress.status === 'TIGHT';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 ${
                  isHighRisk
                    ? 'bg-rose-950/40 border-rose-800/80'
                    : isTight
                    ? 'bg-amber-950/40 border-amber-800/80'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{stress.scenarioName}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      isHighRisk
                        ? 'bg-rose-500 text-slate-950'
                        : isTight
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {stress.status}
                  </span>
                </div>

                <div className="text-sm font-bold font-mono text-slate-100">
                  Stressed EMI: ₹{stress.stressedEMI.toLocaleString('en-IN')}/mo
                  <span className="text-xs font-sans text-slate-400 ml-2">({stress.stressedDTI}% DTI)</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">{stress.impactDescription}</p>
              </div>
            );
          })}
        </div>
      </div>

      <ExplanationAccordion explanation={emi.explanation} />
    </div>
  );
};
