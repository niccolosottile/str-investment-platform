import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ResultsDashboard } from "@/components/features/ResultsDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import type { InvestmentData } from "@/types";
import { loadResultsData, saveWizardLocation } from "@/lib/session";

const Results = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const state = (locationHook.state || {}) as { investmentData?: InvestmentData };
  // Prefer navigation state, fall back to persisted session results
  const investmentData = state.investmentData ?? loadResultsData();

  const handleBackToWizard = useCallback(() => {
    if (investmentData) {
      // ensure the wizard route can recover after refresh
      saveWizardLocation(investmentData.location);
      navigate("/wizard", { state: { location: investmentData.location } });
    } else {
      navigate("/");
    }
  }, [navigate, investmentData]);

  const backElement = (
    <Button variant="ghost" size="sm" onClick={handleBackToWizard} className="flex items-center space-x-2">
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  );

  // If no investmentData was provided via navigation state, redirect back to the landing page.
  useEffect(() => {
    if (!investmentData) {
      navigate("/", { replace: true });
    }
  }, [investmentData, navigate]);

  if (!investmentData) return null; // while redirecting

  return (
    <DashboardLayout backElement={backElement}>
      <div className="animate-scale-in">
        <ErrorBoundary onReset={() => navigate("/wizard", { replace: true })}>
          <ResultsDashboard investmentData={investmentData} />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default Results;
