import React from 'react';
import { useBorrowerCopilot } from './hooks/useBorrowerCopilot';
import { BrandHeader } from './components/common/BrandHeader';
import { Footer } from './components/common/Footer';
import { PersonaSwitcher } from './components/persona/PersonaSwitcher';
import { LandingPage } from './pages/LandingPage';
import { QuestionnaireForm } from './components/questionnaire/QuestionnaireForm';
import { AnalysisLoadingState } from './components/analysis/AnalysisLoadingState';
import { VerdictCard } from './components/results/VerdictCard';
import { AmountComparisonCard } from './components/results/AmountComparisonCard';
import { RateRangeCard } from './components/results/RateRangeCard';
import { EMICalculatorCard } from './components/results/EMICalculatorCard';
import { NegotiationCardView } from './components/negotiation/NegotiationCardView';
import { FileText, RotateCcw } from 'lucide-react';

export function App() {
  const {
    currentScreen,
    activeQuestionStep,
    activePersonaId,
    profile,
    copilotResults,
    loadPersona,
    updateProfileField,
    startAssessment,
    nextStep,
    prevStep,
    goToResults,
    goToNegotiationCard,
    goToLanding
  } = useBorrowerCopilot();

  const { verdict, amount, rate, emi, negotiationCard } = copilotResults;

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Persona Test Bar */}
      <PersonaSwitcher
        activePersonaId={activePersonaId}
        onSelectPersona={(id) => loadPersona(id)}
      />

      {/* Brand Navigation Header */}
      <BrandHeader
        currentScreen={currentScreen}
        activeStep={activeQuestionStep}
        onGoLanding={goToLanding}
        onGoNegotiationCard={goToNegotiationCard}
        onGoResults={goToResults}
        onStartAssessment={startAssessment}
      />

      {/* Main Screen Router */}
      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingPage
            onStart={startAssessment}
            onSelectPersona={loadPersona}
          />
        )}

        {currentScreen === 'questionnaire' && (
          <QuestionnaireForm
            activeStep={activeQuestionStep}
            profile={profile}
            onUpdateField={updateProfileField}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentScreen === 'analysis' && <AnalysisLoadingState />}

        {currentScreen === 'results' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Top Results Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white font-heading">Borrowing Position & Rule Evaluation</h1>
                <p className="text-xs text-slate-400">Deterministic self-assessment rules for {profile.name || 'Borrower'}.</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={startAssessment}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Modify Answers</span>
                </button>

                <button
                  onClick={goToNegotiationCard}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Negotiation Card</span>
                </button>
              </div>
            </div>

            {/* Output 1: Verdict */}
            <VerdictCard verdict={verdict} />

            {/* Output 2: Maximum Amount (Lender Limit vs Safe Limit) */}
            <AmountComparisonCard amount={amount} requestedAmount={profile.requestedAmount} />

            {/* Output 3: Fair Interest Rate & APR */}
            <RateRangeCard rate={rate} creditScore={profile.creditScore} />

            {/* Output 4: Monthly EMI Outflow & Stress Ceiling */}
            <EMICalculatorCard emi={emi} />

            {/* Bottom CTA for Negotiation Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 text-center space-y-4 glow-emerald">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white font-heading">Ready to negotiate with your lender?</h3>
                <p className="text-xs text-slate-300">Generate your polished single-screen Negotiation Card to take with you to the bank branch.</p>
              </div>
              <button
                onClick={goToNegotiationCard}
                className="px-8 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 inline-flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" />
                <span>Open Lender Negotiation Card</span>
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'negotiation_card' && (
          <NegotiationCardView
            cardData={negotiationCard}
            onBackToResults={goToResults}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
