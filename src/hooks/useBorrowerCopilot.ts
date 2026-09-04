import { useState, useMemo } from 'react';
import { BorrowerProfile } from '../types';
import { PERSONA_PRESETS } from '../data/personas';
import { calculateBorrowerCopilot } from '../rules';

export type AppScreen = 'landing' | 'questionnaire' | 'analysis' | 'results' | 'negotiation_card';

export function useBorrowerCopilot() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [activeQuestionStep, setActiveQuestionStep] = useState<1 | 2 | 3>(1);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);

  // Default initial blank profile
  const defaultProfile: BorrowerProfile = {
    age: 29,
    location: 'Bengaluru',
    cityTier: 'tier_1',
    employmentType: 'salaried',
    monthlyNetIncome: 110000,
    loanPurpose: 'wedding',
    loanType: 'personal',
    requestedAmount: 800000,
    existingMonthlyEMI: 14000,
    householdExpenses: 35000,
    creditScore: 780,
    incomeStability: 'high',
    employerType: 'mnc_govt',
    experienceYears: 5,
    monthlyRent: 28000
  };

  const [profile, setProfile] = useState<BorrowerProfile>(defaultProfile);

  // Load Preset Personas (Priya, Ravi, Anita)
  const loadPersona = (personaId: string) => {
    const found = PERSONA_PRESETS.find((p) => p.id === personaId);
    if (found) {
      setProfile({ ...found.profile });
      setActivePersonaId(found.id);
      // Immediately calculate and navigate to results if requested
      setCurrentScreen('results');
    }
  };

  const updateProfileField = <K extends keyof BorrowerProfile>(field: K, value: BorrowerProfile[K]) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value
    }));
    setActivePersonaId(null); // Clear active persona indicator if user modifies custom fields
  };

  // Run Master Rule Engine
  const copilotResults = useMemo(() => {
    return calculateBorrowerCopilot(profile);
  }, [profile]);

  // Screen transition handlers
  const startAssessment = () => {
    setActiveQuestionStep(1);
    setCurrentScreen('questionnaire');
  };

  const nextStep = () => {
    if (activeQuestionStep === 1) {
      setActiveQuestionStep(2);
    } else if (activeQuestionStep === 2) {
      setActiveQuestionStep(3);
    } else if (activeQuestionStep === 3) {
      // Trigger short analysis transition state
      setCurrentScreen('analysis');
      setTimeout(() => {
        setCurrentScreen('results');
      }, 1200);
    }
  };

  const prevStep = () => {
    if (activeQuestionStep === 3) {
      setActiveQuestionStep(2);
    } else if (activeQuestionStep === 2) {
      setActiveQuestionStep(1);
    } else {
      setCurrentScreen('landing');
    }
  };

  const goToResults = () => setCurrentScreen('results');
  const goToNegotiationCard = () => setCurrentScreen('negotiation_card');
  const goToLanding = () => setCurrentScreen('landing');

  return {
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
    goToLanding,
    setActiveQuestionStep
  };
}
