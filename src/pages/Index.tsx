import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LocationSelector } from "@/components/features/location/LocationSelector";
import { saveWizardLocation, clearResultsData } from "@/lib/session";
import type { Location } from "@/types";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MainLayout } from "@/components/layouts/MainLayout";

const Index = () => {
  const navigate = useNavigate();

  const handleLocationSelect = useCallback((location: Location) => {
    // Persist selection so the wizard can recover on refresh, then navigate
    saveWizardLocation(location);
    navigate("/wizard", { state: { location } });
  }, [navigate]);

  // When visiting the landing page, clear any previously persisted results to avoid accidental reuse
  useEffect(() => {
    clearResultsData();
  }, []);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <ErrorBoundary onReset={() => { /* nothing to reset on the landing page */ }}>
          <LocationSelector onLocationSelect={handleLocationSelect} />
        </ErrorBoundary>
      </div>
    </MainLayout>
  );
};

export default Index;