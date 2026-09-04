import React from 'react';
import { Shield, ChevronRight, RotateCcw, FileText } from 'lucide-react';
import { AppScreen } from '../../hooks/useBorrowerCopilot';

interface BrandHeaderProps {
  currentScreen: AppScreen;
  activeStep: 1 | 2 | 3;
  onGoLanding: () => void;
  onGoNegotiationCard: () => void;
  onGoResults: () => void;
  onStartAssessment: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  currentScreen,
  activeStep,
  onGoLanding,
  onGoNegotiationCard,
  onGoResults,
  onStartAssessment
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={onGoLanding}
          className="flex items-center space-x-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-heading">Lokta</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Copilot
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Borrower Self-Assessment</p>
          </div>
        </button>

        {/* Step Indicator when in Questionnaire */}
        {currentScreen === 'questionnaire' && (
          <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-400">
            <span className={activeStep === 1 ? 'text-emerald-400 font-bold' : ''}>1. Demographics</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className={activeStep === 2 ? 'text-emerald-400 font-bold' : ''}>2. Financials</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className={activeStep === 3 ? 'text-emerald-400 font-bold' : ''}>3. Adaptive</span>
          </div>
        )}

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2">
          {currentScreen === 'results' && (
            <>
              <button
                onClick={onStartAssessment}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Edit Answers</span>
              </button>
              <button
                onClick={onGoNegotiationCard}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Negotiation Card</span>
              </button>
            </>
          )}

          {currentScreen === 'negotiation_card' && (
            <button
              onClick={onGoResults}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Back to Analysis
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
