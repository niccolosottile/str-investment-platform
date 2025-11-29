import { useEffect, useMemo, useState } from "react";
import type { Location, OpportunityResult } from '@/types';
import { saveWizardLocation, loadWizardLocation } from '@/lib/session';

export type WizardStep = "type" | "budget" | "property" | "goals";

export interface InvestmentWizardState {
  currentStep: WizardStep;
  location: Location;
  investmentType: "buy" | "rent";
  budget: number[];
  propertyType: "apartment" | "house" | "room";
  goals: "max-roi" | "stable-income" | "quick-payback";
}

export function useInvestmentWizard(initialLocation: Location) {
  const [location, setLocation] = useState<Location>(initialLocation);
  const [currentStep, setCurrentStep] = useState<WizardStep>("type");
  const [investmentType, setInvestmentType] = useState<"buy" | "rent">("buy");
  const [budget, setBudget] = useState<number[]>([150000]);
  const [propertyType, setPropertyType] = useState<"apartment" | "house" | "room">("apartment");
  const [goals, setGoals] = useState<"max-roi" | "stable-income" | "quick-payback">("max-roi");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [seed, setSeed] = useState<number>(0);

  // Save wizard state to sessionStorage whenever location or config changes
  useEffect(() => {
    saveWizardLocation({
      location,
      investmentType,
      budget: budget[0],
      propertyType,
      goals,
      currentStep,
    });
  }, [location, investmentType, budget, propertyType, goals, currentStep]);

  // Simulate initialization (e.g. fetching suggestions based on location)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      if (!mounted) return;

      try {
        // Basic heuristic to suggest a starting budget based on city
        const city = initialLocation.city.toLowerCase();
        if (city.includes("rome")) setBudget([150000]);
        else if (city.includes("barcelona")) setBudget([120000]);
        else if (city.includes("amsterdam")) setBudget([200000]);
        else setBudget([100000]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }, 250 + seed);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [initialLocation, seed]);

  const steps: { id: WizardStep; title: string; description: string }[] = useMemo(
    () => [
      { id: "type", title: "Investment Type", description: "Buy or rent to sublet?" },
      { id: "budget", title: "Budget", description: "How much can you invest?" },
      { id: "property", title: "Property Type", description: "What type of property?" },
      { id: "goals", title: "Investment Goals", description: "What's your priority?" },
    ],
    [],
  );

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const next = () => {
    const order: WizardStep[] = ["type", "budget", "property", "goals"];
    const idx = order.indexOf(currentStep);
    if (idx < order.length - 1) setCurrentStep(order[idx + 1]);
    else setCurrentStep(order[order.length - 1]);
  };

  const previous = () => {
    const order: WizardStep[] = ["type", "budget", "property", "goals"];
    const idx = order.indexOf(currentStep);
    if (idx > 0) setCurrentStep(order[idx - 1]);
  };

  const isComplete = useMemo(() => currentStep === "goals", [currentStep]);

  const getState = (): InvestmentWizardState => ({
    currentStep,
    location,
    investmentType,
    budget,
    propertyType,
    goals,
  });

  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
  };

  const reinitialize = () => {
    setSeed((s) => s + 1);
    setError(null);
    setLoading(true);
  };

  return {
    // state
    currentStep,
    location,
    investmentType,
    budget,
    propertyType,
    goals,
    // meta
    steps,
    currentStepIndex,
    loading,
    error,
    isComplete,
    // setters
    setInvestmentType,
    setBudget,
    setPropertyType,
    setGoals,
    updateLocation,
    // navigation
    next,
    previous,
    // helpers
    getState,
    reinitialize,
  } as const;
}
