import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';

export const AnalysisLoadingState: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    'Evaluating Fixed Obligation to Income Ratio (FOIR)...',
    'Separating Lender Sanction Limit from Borrower Safe Ceiling...',
    'Adjusting Interest Rate Band for Risk Modifiers...',
    'Running 20% Income Drop & 2% Interest Rate Hike Stress Tests...',
    'Generating Decision Reasons & Negotiation Card...'
  ];

  useEffect(() => {
    steps.forEach((_, idx) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, idx]);
      }, (idx + 1) * 220);
    });
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 glow-emerald animate-pulse">
          <Cpu className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-extrabold text-white">Analyzing Financial Rules</h3>
        <p className="text-xs text-slate-400">Executing deterministic lending judgment engine...</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left space-y-3 font-mono text-xs">
        {steps.map((step, idx) => {
          const isDone = completedSteps.includes(idx);
          return (
            <div key={idx} className={`flex items-start space-x-2.5 transition-opacity ${isDone ? 'opacity-100' : 'opacity-30'}`}>
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0 mt-0.5" />
              )}
              <span className={isDone ? 'text-slate-200 font-medium' : 'text-slate-500'}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
