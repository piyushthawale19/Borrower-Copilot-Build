import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { VerdictResult } from '../../types';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ExplanationAccordion } from '../common/ExplainabilityModal';

interface VerdictCardProps {
  verdict: VerdictResult;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ verdict }) => {
  const getStyle = () => {
    switch (verdict.verdict) {
      case 'BORROW':
        return {
          cardBg: 'bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 border-emerald-500/50 glow-emerald',
          badgeBg: 'bg-emerald-500 text-slate-950',
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
        };
      case 'BORROW_LESS':
        return {
          cardBg: 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 border-amber-500/50 glow-amber',
          badgeBg: 'bg-amber-500 text-slate-950',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
        };
      case 'DONT_BORROW':
        return {
          cardBg: 'bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-950 border-rose-500/50 glow-rose',
          badgeBg: 'bg-rose-500 text-slate-950',
          icon: <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border ${style.cardBg} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          {style.icon}
          <div>
            <span className={`text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded ${style.badgeBg}`}>
              OUTPUT 1 — VERDICT
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">{verdict.headline}</h2>
          </div>
        </div>

        <ConfidenceBadge level={verdict.confidence} reasons={verdict.confidenceReasons} />
      </div>

      <p className="text-sm text-slate-200 leading-relaxed font-medium">
        {verdict.summaryReason}
      </p>

      {verdict.keyRiskFactors.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Key Risk Factors Evaluated:</span>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {verdict.keyRiskFactors.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>
      )}

      <ExplanationAccordion explanation={verdict.explanation} />
    </div>
  );
};
