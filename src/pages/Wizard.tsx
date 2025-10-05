import React, { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WizardLayout from "@/components/layouts/WizardLayout";
import { InvestmentWizard } from "@/components/features/InvestmentWizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import type { Location, InvestmentData } from "@/types";
import { saveResultsData, clearWizardLocation, loadWizardLocation } from "@/lib/session";

const Wizard = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const state = (locationHook.state || {}) as { location?: Location };
  const selectedLocation = state.location ?? loadWizardLocation();

  useEffect(() => {
    if (!selectedLocation) {
      // If there's no selected location (neither navigation state nor session), go back to the landing page
      navigate("/", { replace: true });
    }
  }, [selectedLocation, navigate]);

  const handleComplete = useCallback((data: Omit<InvestmentData, "location">) => {
    // Assemble full investment data and navigate to results
    const investmentData: InvestmentData = { location: selectedLocation!, ...data };
    // Persist results so the results page can reload, and clear the transient wizard location
    saveResultsData(investmentData);
    clearWizardLocation();
    navigate("/results", { state: { investmentData } });
  }, [navigate, selectedLocation]);

  const backElement = (
    <Button variant="ghost" size="sm" onClick={() => navigate("/")}
      className="flex items-center space-x-2">
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  );

  if (!selectedLocation) return null; // guard while redirecting

  return (
    <WizardLayout backElement={backElement}>
      <div className="animate-slide-up">
        <ErrorBoundary onReset={() => navigate("/", { replace: true })}>
          <InvestmentWizard location={selectedLocation} onComplete={handleComplete} />
        </ErrorBoundary>
      </div>
    </WizardLayout>
  );
};

export default Wizard;
