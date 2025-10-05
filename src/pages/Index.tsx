import { useState } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { InvestmentWizard } from "@/components/InvestmentWizard";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type AppStep = "location" | "wizard" | "results";

interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
  address: string;
}

interface InvestmentData {
  location: Location;
  investmentType: "buy" | "rent";
  budget: number;
  propertyType: "apartment" | "house" | "room";
  goals: "max-roi" | "stable-income" | "quick-payback";
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("location");
  const [investmentData, setInvestmentData] = useState<Partial<InvestmentData>>({});

  const handleLocationSelect = (location: Location) => {
    setInvestmentData(prev => ({ ...prev, location }));
    setCurrentStep("wizard");
  };

  const handleWizardComplete = (data: Omit<InvestmentData, "location">) => {
    setInvestmentData(prev => ({ ...prev, ...data }));
    setCurrentStep("results");
  };

  const handleBackToWizard = () => {
    setCurrentStep("wizard");
  };

  const handleBackToLocation = () => {
    setCurrentStep("location");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow"></div>
            <h1 className="text-xl font-bold text-foreground">STR Invest</h1>
          </div>
          
          {currentStep !== "location" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={currentStep === "wizard" ? handleBackToLocation : handleBackToWizard}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep === "location" && (
          <div className="animate-fade-in">
            <LocationSelector onLocationSelect={handleLocationSelect} />
          </div>
        )}

        {currentStep === "wizard" && investmentData.location && (
          <div className="animate-slide-up">
            <InvestmentWizard
              location={investmentData.location}
              onComplete={handleWizardComplete}
            />
          </div>
        )}

        {currentStep === "results" && investmentData.location && (
          <div className="animate-scale-in">
            <ResultsDashboard investmentData={investmentData as InvestmentData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;