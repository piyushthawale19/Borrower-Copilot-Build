import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { ConfidenceLevel } from '../../types';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  reasons?: string[];
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level, reasons = [] }) => {
  const getBadgeStyle = () => {
    switch (level) {
      case 'HIGH':
        return {
          bg: 'bg-emerald-950/80 border-emerald-700/50 text-emerald-300',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />,
          label: 'High Confidence'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-950/80 border-amber-700/50 text-amber-300',
          icon: <Shield className="w-4 h-4 text-amber-400 shrink-0" />,
          label: 'Medium Confidence'
        };
      case 'LOW':
        return {
          bg: 'bg-rose-950/80 border-rose-700/50 text-rose-300',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />,
          label: 'Low Confidence (Uncertain Data)'
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="inline-flex flex-col group relative">
      <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center space-x-1.5 ${style.bg}`}>
        {style.icon}
        <span>{style.label}</span>
      </div>

      {reasons.length > 0 && (
        <div className="hidden group-hover:block absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 text-xs text-slate-200 space-y-1">
          <p className="font-bold text-slate-100 text-[11px] uppercase tracking-wider">Confidence Factors:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
