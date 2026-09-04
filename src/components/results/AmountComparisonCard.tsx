import React from 'react';
import { ShieldCheck, Building2, CheckCircle } from 'lucide-react';
import { AmountCalculationResult } from '../../types';
import { ExplanationAccordion } from '../common/ExplainabilityModal';

interface AmountComparisonCardProps {
  amount: AmountCalculationResult;
  requestedAmount: number;
}

export const AmountComparisonCard: React.FC<AmountComparisonCardProps> = ({ amount, requestedAmount }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            OUTPUT 2 — MAXIMUM BORROWING AMOUNT
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">Lender Limit vs Safe Limit</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Requested:</span>
          <div className="text-sm font-bold font-mono text-slate-200">₹{requestedAmount.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Likely Lender Limit Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>LIKELY LENDER SANCTION</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-blue-300">
            ₹{(amount.likelyLenderLimit.min / 100000).toFixed(2)}L – ₹{(amount.likelyLenderLimit.max / 100000).toFixed(2)}L
          </div>
          <p className="text-[11px] text-slate-400">
            Max principal a bank/NBFC may approve based on gross FOIR limits.
          </p>
        </div>

        {/* Safe Borrower Limit Card */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>YOUR SAFER LIMIT</span>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
              RECOMMENDED
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-300">
            ₹{(amount.safeBorrowerLimit.min / 100000).toFixed(2)}L – ₹{(amount.safeBorrowerLimit.max / 100000).toFixed(2)}L
          </div>
          <p className="text-[11px] text-emerald-200/80">
            Max principal keeping your monthly surplus safe for emergencies.
          </p>
        </div>
      </div>

      {/* Difference Explanation Box */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-bold text-white">Why are these numbers different?</span>
          <p className="leading-relaxed">{amount.differenceReason}</p>
        </div>
      </div>

      <ExplanationAccordion explanation={amount.explanation} />
    </div>
  );
};
