import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { DetailedExplanation } from '../../types';

interface ExplanationAccordionProps {
  explanation: DetailedExplanation;
  className?: string;
}

export const ExplanationAccordion: React.FC<ExplanationAccordionProps> = ({ explanation, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`mt-3 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-emerald-400 hover:bg-slate-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Why did I get this number?</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-300 space-y-3 bg-slate-950/80">
          <h5 className="font-semibold text-slate-200">{explanation.title}</h5>

          <div className="space-y-1.5">
            <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Key Calculation Drivers:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {explanation.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {explanation.assumptions.length > 0 && (
            <div className="pt-2 border-t border-slate-900 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400 font-medium text-[11px] uppercase tracking-wider">
                <Info className="w-3 h-3 shrink-0" />
                <span>Underlying Assumptions:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 italic text-[11px]">
                {explanation.assumptions.map((asm, idx) => (
                  <li key={idx}>{asm}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
