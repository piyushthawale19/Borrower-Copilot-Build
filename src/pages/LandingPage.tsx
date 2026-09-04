import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, FileText, Percent, Calculator, Sparkles, Building2 } from 'lucide-react';
import { PERSONA_PRESETS } from '../data/personas';

interface LandingPageProps {
  onStart: () => void;
  onSelectPersona: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSelectPersona }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold glow-emerald">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Lokta Borrower Copilot • Indian Lending Domain Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-heading">
          Know what you can afford <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">before</span> you speak to a lender.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
          A self-assessment tool designed for Indian borrowers. Turn lending rules into clear, transparent advice—no credit bureau pull, no login, and zero personal data stored.
        </p>

        {/* Primary CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Check My Borrowing Position</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Value Proposition Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Bureau Credit Pull</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Login Required</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant Negotiation Card</span>
          </div>
        </div>
      </div>

      {/* 4 Core Borrower Questions Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white font-heading">4 Answers You Get Before Negotiating</h2>
          <p className="text-xs text-slate-400">The questions every borrower must answer before signing a loan agreement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Should I borrow at all?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clear verdict (<span className="text-emerald-400 font-bold">BORROW</span>, <span className="text-amber-400 font-bold">BORROW LESS</span>, or <span className="text-rose-400 font-bold">DON'T BORROW</span>) based on net cash flow surplus and existing debt overhang.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">2. How much am I really eligible for?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Distinguishes maximum <span className="text-blue-300 font-semibold">Lender Sanction Limit</span> from your conservative <span className="text-emerald-300 font-semibold">Safe Borrower Amount</span>.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">3. What interest rate is fair for me?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates a realistic fair rate range based on loan product, credit score, and collateral, along with all-in effective APR including fees.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">4. What EMI should I accept?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Establishes a safe monthly EMI ceiling and stress-tests your affordability against potential 20% income drops or 2% rate spikes.
            </p>
          </div>
        </div>
      </div>

      {/* Test Persona Demo Loader Cards */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="text-xl font-bold text-white font-heading">Explore Test Borrower Personas</h3>
          </div>
          <span className="text-xs text-slate-400">Lokta Challenge Required Profiles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERSONA_PRESETS.map((persona) => (
            <div
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {persona.badge}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">{persona.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{persona.subtitle}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{persona.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
