import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  MapPin, 
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Download,
  Heart,
  Share
} from "lucide-react";

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

interface ResultsDashboardProps {
  investmentData: InvestmentData;
}

export const ResultsDashboard = ({ investmentData }: ResultsDashboardProps) => {
  const { location, investmentType, budget, propertyType, goals } = investmentData;

  // Mock calculated results based on investment data
  const calculateResults = () => {
    const baseRevenue = propertyType === "apartment" ? 2200 : propertyType === "house" ? 3200 : 800;
    const locationMultiplier = location.city.toLowerCase().includes("rome") ? 1.3 : 
                              location.city.toLowerCase().includes("barcelona") ? 1.2 : 
                              location.city.toLowerCase().includes("amsterdam") ? 1.4 : 1.0;
    
    const monthlyRevenue = Math.round(baseRevenue * locationMultiplier);
    const yearlyRevenue = monthlyRevenue * 12;
    
    const roi = investmentType === "buy" 
      ? Math.round((yearlyRevenue / budget) * 100)
      : Math.round(((monthlyRevenue - (budget * 0.1)) * 12 / budget) * 100);
    
    const paybackMonths = investmentType === "buy" 
      ? Math.round(budget / monthlyRevenue)
      : Math.round(budget / (monthlyRevenue * 0.3));

    return {
      monthlyRevenue,
      yearlyRevenue,
      roi,
      paybackMonths,
      occupancyRate: 78,
      competitorCount: 45,
      marketScore: 82,
      confidence: roi > 15 ? "high" : roi > 8 ? "medium" : "low"
    };
  };

  const results = calculateResults();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getConfidenceColor = (confidence: string) => {
    return confidence === "high" ? "default" : confidence === "medium" ? "secondary" : "destructive";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location.city}, {location.country}</span>
          <span>•</span>
          <span className="capitalize">{propertyType}</span>
          <span>•</span>
          <span>{formatCurrency(budget)}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Investment Analysis Results</h1>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant={getConfidenceColor(results.confidence)} className="capitalize">
            {results.confidence} Confidence
          </Badge>
          <Badge variant="outline">
            {investmentType === "buy" ? "Purchase" : "Rental"} Strategy
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Revenue */}
        <Card className="card-metric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="metric-large mb-2">
              {formatCurrency(results.monthlyRevenue)}
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success font-medium">+12.5%</span>
              <span className="text-muted-foreground">vs market avg</span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Conservative</span>
                <span>Optimistic</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(Math.round(results.monthlyRevenue * 0.8))} - {formatCurrency(Math.round(results.monthlyRevenue * 1.3))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI */}
        <Card className="card-metric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual ROI</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="metric-large mb-2">
              {results.roi}%
            </div>
            <div className="flex items-center space-x-1 text-sm">
              {results.roi > 15 ? (
                <>
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span className="text-success font-medium">Excellent</span>
                </>
              ) : results.roi > 8 ? (
                <>
                  <Clock className="h-3 w-3 text-warning" />
                  <span className="text-warning font-medium">Good</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  <span className="text-destructive font-medium">Consider alternatives</span>
                </>
              )}
            </div>
            <div className="mt-3">
              <Progress value={Math.min(results.roi * 2, 100)} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Target: 12-20% for STR investments
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payback Period */}
        <Card className="card-metric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="metric-large mb-2">
              {Math.floor(results.paybackMonths / 12)}y {results.paybackMonths % 12}m
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {results.paybackMonths < 60 ? "Fast recovery" : "Long-term investment"}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-muted-foreground">
                Monthly cash flow: {formatCurrency(Math.round(results.monthlyRevenue * 0.7))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonality</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-metric">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Market Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Occupancy Rate</span>
                    <span className="font-semibold">{results.occupancyRate}%</span>
                  </div>
                  <Progress value={results.occupancyRate} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Score</span>
                    <span className="font-semibold">{results.marketScore}/100</span>
                  </div>
                  <Progress value={results.marketScore} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price Growth (YoY)</span>
                    <span className="font-semibold text-success">+8.2%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-metric">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>Revenue Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { factor: "Location Quality", impact: 35, score: "High" },
                  { factor: "Property Type", impact: 25, score: "Good" },
                  { factor: "Market Demand", impact: 20, score: "High" },
                  { factor: "Competition Level", impact: 15, score: "Medium" },
                  { factor: "Seasonality", impact: 5, score: "Low Risk" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-sm font-medium">{item.factor}</span>
                      <div className="text-xs text-muted-foreground">{item.impact}% impact</div>
                    </div>
                    <Badge variant="outline" className="text-xs">{item.score}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competition" className="space-y-6">
          <Card className="card-metric">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Competition Analysis</span>
              </CardTitle>
              <CardDescription>
                Analysis of {results.competitorCount} similar properties within 2km radius
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-foreground">{results.competitorCount}</div>
                  <div className="text-xs text-muted-foreground">Total Competitors</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-warning">€1,950</div>
                  <div className="text-xs text-muted-foreground">Avg. Price</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-success">4.3★</div>
                  <div className="text-xs text-muted-foreground">Avg. Rating</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">72%</div>
                  <div className="text-xs text-muted-foreground">Avg. Occupancy</div>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold">Competitive Advantages</h4>
                {[
                  "Premium pricing justified by location",
                  "Higher occupancy rate potential",
                  "Modern amenities gap in market",
                  "Better guest experience opportunity"
                ].map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm">{advantage}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <Card className="card-metric">
            <CardHeader>
              <CardTitle>Seasonal Patterns</CardTitle>
              <CardDescription>Revenue and occupancy trends throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gradient-to-r from-accent/20 to-primary/10 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto" />
                  <p className="text-muted-foreground">Seasonal chart visualization</p>
                  <p className="text-xs text-muted-foreground">Peak: Jun-Aug (+40%), Low: Nov-Feb (-25%)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { season: "Spring", months: "Mar-May", multiplier: "1.1x", color: "success" },
                  { season: "Summer", months: "Jun-Aug", multiplier: "1.4x", color: "primary" },
                  { season: "Autumn", months: "Sep-Nov", multiplier: "0.9x", color: "warning" },
                  { season: "Winter", months: "Dec-Feb", multiplier: "0.7x", color: "muted" }
                ].map((season, index) => (
                  <div key={index} className="text-center space-y-2 p-3 rounded-lg bg-muted/20">
                    <div className="font-semibold">{season.season}</div>
                    <div className="text-xs text-muted-foreground">{season.months}</div>
                    <div className="text-lg font-bold">{season.multiplier}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <Card className="card-metric">
            <CardHeader>
              <CardTitle>Investment Breakdown</CardTitle>
              <CardDescription>Detailed cost analysis and projections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Initial Investment</h4>
                  {(investmentType === "buy" ? [
                    { item: "Property Purchase", amount: budget * 0.85, percentage: 85 },
                    { item: "Renovation & Setup", amount: budget * 0.10, percentage: 10 },
                    { item: "Legal & Fees", amount: budget * 0.05, percentage: 5 }
                  ] : [
                    { item: "Security Deposit", amount: budget * 0.30, percentage: 30 },
                    { item: "Setup & Furnishing", amount: budget * 0.50, percentage: 50 },
                    { item: "Marketing & Legal", amount: budget * 0.20, percentage: 20 }
                  ]).map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.item}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                      <Progress value={item.percentage} className="h-1" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Monthly Operating Costs</h4>
                  {[
                    { item: "Cleaning & Maintenance", amount: results.monthlyRevenue * 0.15 },
                    { item: "Platform Fees", amount: results.monthlyRevenue * 0.12 },
                    { item: "Utilities & Insurance", amount: results.monthlyRevenue * 0.08 },
                    { item: "Management", amount: results.monthlyRevenue * 0.05 }
                  ].map((cost, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{cost.item}</span>
                      <span className="font-medium">{formatCurrency(cost.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Net Monthly Profit</span>
                      <span className="text-success">
                        {formatCurrency(results.monthlyRevenue * 0.6)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button className="btn-investment flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download Full Report</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Heart className="h-4 w-4" />
          <span>Save Analysis</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Share className="h-4 w-4" />
          <span>Share Results</span>
        </Button>
      </div>
    </div>
  );
};