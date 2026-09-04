import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print mt-16 border-t border-slate-900 bg-slate-950 py-10 px-4 text-xs text-slate-500">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-slate-300 text-sm">Lokta Borrower Copilot</span>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-400">
            <span>No Bureau Credit Pull</span>
            <span>•</span>
            <span>No Backend / No Login</span>
            <span>•</span>
            <span>100% Deterministic Financial Rules</span>
          </div>
        </div>

        <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>Self-Assessment Disclaimer:</strong> Lokta Borrower Copilot is an educational self-assessment product designed to help borrowers evaluate their affordability, compare lender offers, and negotiate fair interest terms. This tool does not guarantee loan approval or official lender sanctioning.
          </p>
          <p>
            Built for the Lokta Borrower Copilot Build Challenge. Domain logic conforms strictly to conservative Indian lending frameworks (FOIR, Reducing Balance APR, and Collateral LTV).
          </p>
        </div>

        <div className="text-center pt-2 text-slate-400 font-mono text-[11px]">
          Lokta © {new Date().getFullYear()} • Empowering Borrowers Across India
        </div>
      </div>
    </footer>
  );
};
