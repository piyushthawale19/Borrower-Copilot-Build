import React from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { PERSONA_PRESETS } from '../../data/personas';

interface PersonaSwitcherProps {
  activePersonaId: string | null;
  onSelectPersona: (id: string) => void;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ activePersonaId, onSelectPersona }) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Quick Test Scenarios (Lokta Challenge):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PERSONA_PRESETS.map((persona) => {
            const isActive = activePersonaId === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => onSelectPersona(persona.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
                title={persona.description}
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{persona.name.split(' ')[0]} ({persona.badge})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
