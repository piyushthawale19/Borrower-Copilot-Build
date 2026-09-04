import React from 'react';
import { Percent, Info, AlertCircle } from 'lucide-react';
import { RateCalculationResult } from '../../types';
import { ExplanationAccordion } from '../common/ExplainabilityModal';

interface RateRangeCardProps {
  rate: RateCalculationResult;
  creditScore: number | null;
}

export const RateRangeCard: React.FC<RateRangeCardProps> = ({ rate, creditScore }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            OUTPUT 3 — FAIR INTEREST RATE & APR
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">Fair Market Rate Range</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Bureau Credit Score:</span>
          <div className="text-sm font-bold font-mono text-emerald-400">
            {creditScore === null ? 'Unknown (Unrated)' : creditScore}
          </div>
        </div>
      </div>

      {creditScore === null && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Unknown Credit Score Rule Applied:</span>
            <p className="mt-0.5 text-amber-300/90 leading-relaxed">
              Because your credit score is unknown, we have widened the rate range conservatively by +2.5%. We do NOT treat unknown scores as 0 or 300.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Fair Rate Range */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fair Rate Range</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {rate.fairRateRange.min}% – {rate.fairRateRange.max}%
          </div>
          <p className="text-[10px] text-slate-500">Benchmark target for lender negotiation.</p>
        </div>

        {/* Upfront Processing Fee */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Processing Fee</span>
          <div className="text-2xl font-extrabold font-mono text-slate-200">
            {rate.processingFeePercent}%
          </div>
          <p className="text-[10px] text-slate-400 font-mono">≈ ₹{rate.processingFeeAmount.toLocaleString('en-IN')}</p>
        </div>

        {/* All-in APR */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Estimated All-in APR</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-300">
            {rate.estimatedAPR}%
          </div>
          <p className="text-[10px] text-emerald-400/80">Includes interest + annualized fees.</p>
        </div>
      </div>

      {/* Key Drivers List */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rate Driver Analysis:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {rate.drivers.map((driver, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-start space-x-2">
              <Percent className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{driver}</span>
            </div>
          ))}
        </div>
      </div>

      <ExplanationAccordion explanation={rate.explanation} />
    </div>
  );
};
