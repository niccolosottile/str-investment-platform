import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useInvestmentWizard } from "@/hooks/useInvestmentWizard";
import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/lib/utils/utils";
import { InvestmentWizardHeader } from "@/components/features/wizard/InvestmentWizardHeader";
import { InvestmentTypeStep } from "@/components/features/wizard/InvestmentTypeStep";
import { BudgetStep } from "@/components/features/wizard/BudgetStep";
import { PropertyStep } from "@/components/features/wizard/PropertyStep";
import { GoalsStep } from "@/components/features/wizard/GoalsStep";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { Location } from "@/types";

interface InvestmentWizardProps {
  location: Location;
  onComplete: (data: {
    investmentType: "buy" | "rent";
    budget: number;
    propertyType: "apartment" | "house" | "room";
    goals: "max-roi" | "stable-income" | "quick-payback";
  }) => void;
}

export const InvestmentWizard = ({ location, onComplete }: InvestmentWizardProps) => {
  const {
    currentStep,
    investmentType,
    budget,
    propertyType,
    goals,
    steps,
    currentStepIndex,
    loading,
    error,
    isComplete,
    setInvestmentType,
    setBudget,
    setPropertyType,
    setGoals,
    next,
    previous,
    reinitialize,
    getState,
  } = useInvestmentWizard(location);

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isComplete) {
      const state = getState();
      onComplete({
        investmentType: state.investmentType,
        budget: state.budget[0],
        propertyType: state.propertyType,
        goals: state.goals,
      });
      return;
    }
    next();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <InvestmentWizardHeader location={location} />

      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-1",
                index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                index <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <span className="hidden md:block text-center">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Card */}
      <Card className="card-metric">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{steps[currentStepIndex].title}</CardTitle>
          <p className="text-muted-foreground">{steps[currentStepIndex].description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loading / Error handling */}
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3 mx-auto" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <div className="text-red-600">An error occurred while initializing the wizard.</div>
              <div className="text-sm text-muted-foreground">{error.message}</div>
              <div className="flex justify-center">
                <Button onClick={() => reinitialize()}>Retry</Button>
              </div>
            </div>
          ) : null}

          {/* Steps wrapped in runtime ErrorBoundary */}
          <ErrorBoundary onReset={reinitialize}>
            {!loading && currentStep === "type" && (
              <InvestmentTypeStep investmentType={investmentType} setInvestmentType={setInvestmentType} />
            )}

            {!loading && currentStep === "budget" && (
              <BudgetStep investmentType={investmentType} budget={budget} setBudget={setBudget} />
            )}

            {!loading && currentStep === "property" && (
              <PropertyStep propertyType={propertyType} setPropertyType={setPropertyType} />
            )}

            {!loading && currentStep === "goals" && (
              <GoalsStep goals={goals} setGoals={setGoals} />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={previous}
                disabled={currentStepIndex === 0 || loading}
                className="btn-analysis"
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                className="btn-investment flex items-center space-x-2"
                disabled={loading}
              >
                <span>{currentStepIndex === steps.length - 1 ? "Analyze Investment" : "Next"}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
};