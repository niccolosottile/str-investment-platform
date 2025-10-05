import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Home, 
  Building, 
  Bed, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ShoppingCart,
  Key,
  Target,
  ChevronRight,
  MapPin
} from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
  address: string;
}

interface InvestmentWizardProps {
  location: Location;
  onComplete: (data: {
    investmentType: "buy" | "rent";
    budget: number;
    propertyType: "apartment" | "house" | "room";
    goals: "max-roi" | "stable-income" | "quick-payback";
  }) => void;
}

type WizardStep = "type" | "budget" | "property" | "goals";

export const InvestmentWizard = ({ location, onComplete }: InvestmentWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("type");
  const [investmentType, setInvestmentType] = useState<"buy" | "rent">("buy");
  const [budget, setBudget] = useState<number[]>([150000]);
  const [propertyType, setPropertyType] = useState<"apartment" | "house" | "room">("apartment");
  const [goals, setGoals] = useState<"max-roi" | "stable-income" | "quick-payback">("max-roi");

  const steps = [
    { id: "type", title: "Investment Type", description: "Buy or rent to sublet?" },
    { id: "budget", title: "Budget", description: "How much can you invest?" },
    { id: "property", title: "Property Type", description: "What type of property?" },
    { id: "goals", title: "Investment Goals", description: "What's your priority?" }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: WizardStep[] = ["type", "budget", "property", "goals"];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      // Complete wizard
      onComplete({
        investmentType,
        budget: budget[0],
        propertyType,
        goals
      });
    }
  };

  const handlePrevious = () => {
    const stepOrder: WizardStep[] = ["type", "budget", "property", "goals"];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location.city}, {location.country}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Investment Analysis</h1>
        <p className="text-muted-foreground">Let's configure your investment parameters</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-1 ${
                index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                index <= currentStepIndex 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>
              <span className="hidden md:block text-center">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="card-metric">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{steps[currentStepIndex].title}</CardTitle>
          <p className="text-muted-foreground">{steps[currentStepIndex].description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step 1: Investment Type */}
          {currentStep === "type" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  investmentType === "buy" 
                    ? "ring-2 ring-primary bg-accent/50" 
                    : "hover:bg-accent/20"
                }`}
                onClick={() => setInvestmentType("buy")}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <ShoppingCart className="h-12 w-12 text-primary mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Buy Property</h3>
                    <p className="text-muted-foreground">Purchase a property and rent it out on Airbnb</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Higher Returns</Badge>
                    <Badge variant="secondary">Long-term Investment</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  investmentType === "rent" 
                    ? "ring-2 ring-primary bg-accent/50" 
                    : "hover:bg-accent/20"
                }`}
                onClick={() => setInvestmentType("rent")}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <Key className="h-12 w-12 text-primary mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Rent & Sublet</h3>
                    <p className="text-muted-foreground">Rent a property and sublet it on Airbnb</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Lower Risk</Badge>
                    <Badge variant="secondary">Quick Start</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Budget */}
          {currentStep === "budget" && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="metric-large">
                  {formatCurrency(budget[0])}
                </div>
                <p className="text-muted-foreground">
                  {investmentType === "buy" ? "Purchase Budget" : "Available Capital"}
                </p>
              </div>

              <div className="space-y-6">
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  max={investmentType === "buy" ? 500000 : 50000}
                  min={investmentType === "buy" ? 50000 : 5000}
                  step={investmentType === "buy" ? 10000 : 1000}
                  className="w-full"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(investmentType === "buy" 
                    ? [100000, 200000, 300000, 500000]
                    : [10000, 20000, 30000, 50000]
                  ).map((amount) => (
                    <Button
                      key={amount}
                      variant={budget[0] === amount ? "default" : "outline"}
                      onClick={() => setBudget([amount])}
                      className="h-auto py-3"
                    >
                      <div className="text-center">
                        <div className="font-semibold">{formatCurrency(amount)}</div>
                        <div className="text-xs opacity-80">
                          {investmentType === "buy" 
                            ? amount <= 150000 ? "Starter" : amount <= 300000 ? "Standard" : "Premium"
                            : amount <= 15000 ? "Conservative" : amount <= 30000 ? "Moderate" : "Aggressive"
                          }
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Property Type */}
          {currentStep === "property" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  type: "apartment" as const,
                  icon: Building,
                  title: "Apartment",
                  description: "1-3 bedroom apartments in residential areas",
                  pros: ["Lower maintenance", "Urban locations", "Higher occupancy"]
                },
                {
                  type: "house" as const,
                  icon: Home,
                  title: "House",
                  description: "Standalone houses with garden/terrace",
                  pros: ["Family-friendly", "Higher rates", "More space"]
                },
                {
                  type: "room" as const,
                  icon: Bed,
                  title: "Private Room",
                  description: "Single room in shared accommodation",
                  pros: ["Lower investment", "Flexible", "High demand"]
                }
              ].map(({ type, icon: Icon, title, description, pros }) => (
                <Card
                  key={type}
                  className={`cursor-pointer transition-all duration-300 ${
                    propertyType === type 
                      ? "ring-2 ring-primary bg-accent/50" 
                      : "hover:bg-accent/20"
                  }`}
                  onClick={() => setPropertyType(type)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center space-y-3">
                      <Icon className="h-12 w-12 text-primary mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <p className="text-muted-foreground text-sm">{description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {pros.map((pro, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 4: Goals */}
          {currentStep === "goals" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  goal: "max-roi" as const,
                  icon: TrendingUp,
                  title: "Maximum ROI",
                  description: "Optimize for highest return on investment",
                  features: ["Aggressive pricing", "Peak season focus", "Premium properties"]
                },
                {
                  goal: "stable-income" as const,
                  icon: DollarSign,
                  title: "Stable Income",
                  description: "Consistent monthly revenue with lower risk",
                  features: ["Competitive pricing", "Year-round demand", "Reliable bookings"]
                },
                {
                  goal: "quick-payback" as const,
                  icon: Clock,
                  title: "Quick Payback",
                  description: "Fastest return of initial investment",
                  features: ["High turnover", "Lower investment", "Rapid scaling"]
                }
              ].map(({ goal, icon: Icon, title, description, features }) => (
                <Card
                  key={goal}
                  className={`cursor-pointer transition-all duration-300 ${
                    goals === goal 
                      ? "ring-2 ring-primary bg-accent/50" 
                      : "hover:bg-accent/20"
                  }`}
                  onClick={() => setGoals(goal)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center space-y-3">
                      <Icon className="h-12 w-12 text-primary mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <p className="text-muted-foreground text-sm">{description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="btn-analysis"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              className="btn-investment flex items-center space-x-2"
            >
              <span>{currentStepIndex === steps.length - 1 ? "Analyze Investment" : "Next"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};