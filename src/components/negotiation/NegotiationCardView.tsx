import React, { useState } from 'react';
import { Printer, Copy, Check, Shield, AlertTriangle, FileText, ChevronLeft } from 'lucide-react';
import { NegotiationCardData } from '../../types';

interface NegotiationCardViewProps {
  cardData: NegotiationCardData;
  onBackToResults: () => void;
}

export const NegotiationCardView: React.FC<NegotiationCardViewProps> = ({ cardData, onBackToResults }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `
LOKTA BORROWER COPILOT — LENDER NEGOTIATION CARD
Date: ${cardData.generatedDate}
Borrower: ${cardData.profileSummary.name} (${cardData.profileSummary.age} yrs, ${cardData.profileSummary.location})
Monthly Income: ${cardData.profileSummary.incomeFormatted}

------------------------------------------------
1. VERDICT: ${cardData.verdict.headline}
2. RECOMMENDED LOAN AMOUNT: ₹${cardData.amount.recommendedAmount.toLocaleString('en-IN')} (Lender Limit: ₹${cardData.amount.likelyLenderLimit.max.toLocaleString('en-IN')})
3. SAFE EMI CEILING: ₹${cardData.emi.recommendedEMICeiling.toLocaleString('en-IN')}/month
4. FAIR INTEREST RATE TARGET: ${cardData.rate.fairRateRange.min}% – ${cardData.rate.fairRateRange.max}% (Effective APR: ${cardData.rate.estimatedAPR}%)
------------------------------------------------

KEY TALKING POINTS FOR LENDER:
${cardData.negotiationPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

DISCLAIMER: Self-assessment decision aid based on self-reported data.
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { profileSummary, verdict, amount, rate, emi, negotiationPoints, redFlagsForLender } = cardData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar Navigation & Print Actions */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToResults}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Interactive Analysis</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE NEGOTIATION CARD DOCUMENT */}
      <div className="print-card bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl text-slate-100">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Shield className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-heading">Lokta Borrower Copilot</h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Negotiation Card
                </span>
              </div>
              <p className="text-xs text-slate-400">Self-Assessment Loan Position & Negotiation Brief</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400">
            <div>Document Ref: <span className="font-mono text-slate-200 font-bold">LOK-{Math.floor(100000 + Math.random() * 900000)}</span></div>
            <div>Generated: <span className="font-medium text-slate-300">{cardData.generatedDate}</span></div>
          </div>
        </div>

        {/* Borrower Profile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Borrower</span>
            <div className="font-bold text-slate-200 mt-0.5">{profileSummary.name}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Location / Category</span>
            <div className="font-bold text-slate-200 mt-0.5">{profileSummary.location} ({profileSummary.employmentTypeLabel})</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Monthly Net Income</span>
            <div className="font-bold font-mono text-emerald-400 mt-0.5">{profileSummary.incomeFormatted}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Loan Purpose</span>
            <div className="font-bold text-slate-200 mt-0.5">{profileSummary.purposeLabel}</div>
          </div>
        </div>

        {/* Core Financial Targets Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recommended Amount</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              ₹{amount.recommendedAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500">Lender Limit: ₹{amount.likelyLenderLimit.max.toLocaleString('en-IN')}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Safe Monthly EMI Ceiling</span>
            <div className="text-2xl font-extrabold font-mono text-white">
              ₹{emi.recommendedEMICeiling.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <div className="text-[10px] text-slate-500">Includes mandatory safety buffer</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fair Interest Rate Range</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              {rate.fairRateRange.min}% – {rate.fairRateRange.max}%
            </div>
            <div className="text-[10px] text-emerald-400/80 font-mono">All-in APR: {rate.estimatedAPR}%</div>
          </div>
        </div>

        {/* Actionable Negotiation Points */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <FileText className="w-4 h-4 shrink-0" />
            <span>Negotiation Strategy for Lender Discussion</span>
          </div>
          <div className="space-y-2">
            {negotiationPoints.map((point, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-start space-x-3">
                <span className="font-mono font-bold text-emerald-400 shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags & Traps */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Borrower Protections & Traps to Avoid</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {redFlagsForLender.map((flag, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-slate-300">
                {flag}
              </div>
            ))}
          </div>
        </div>

        {/* Stress Test Brief */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-200">Affordability Stress Test Result:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">{emi.stressScenarios[0].impactDescription}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 font-bold text-[11px] shrink-0 ml-3">
            {emi.stressScenarios[0].status}
          </span>
        </div>

        {/* Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 space-y-1 text-center">
          <p>{cardData.disclaimer}</p>
          <p className="font-mono">Generated via Lokta Borrower Copilot • Standard Reducing Balance Method</p>
        </div>
      </div>
    </div>
  );
};
