import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, TrendingUp, Users, DollarSign } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
  address: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
}

// Mock popular locations for demonstration
const popularLocations = [
  {
    name: "Barcelona, Spain",
    description: "High tourist demand, year-round season",
    metrics: { avgRevenue: "€2,400", occupancy: "82%", competition: "High" },
    location: { lat: 41.3851, lng: 2.1734, city: "Barcelona", country: "Spain", address: "Barcelona, Spain" }
  },
  {
    name: "Rome, Italy", 
    description: "Historic center, premium pricing",
    metrics: { avgRevenue: "€2,800", occupancy: "75%", competition: "Medium" },
    location: { lat: 41.9028, lng: 12.4964, city: "Rome", country: "Italy", address: "Rome, Italy" }
  },
  {
    name: "Lisbon, Portugal",
    description: "Growing market, digital nomads",
    metrics: { avgRevenue: "€1,900", occupancy: "88%", competition: "Medium" },
    location: { lat: 38.7223, lng: -9.1393, city: "Lisbon", country: "Portugal", address: "Lisbon, Portugal" }
  },
  {
    name: "Amsterdam, Netherlands",
    description: "High-value market, strict regulations", 
    metrics: { avgRevenue: "€3,200", occupancy: "69%", competition: "Very High" },
    location: { lat: 52.3676, lng: 4.9041, city: "Amsterdam", country: "Netherlands", address: "Amsterdam, Netherlands" }
  }
];

export const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location);
  };

  const handleSearch = () => {
    // Mock search result for demonstration
    if (searchQuery.trim()) {
      const mockLocation: Location = {
        lat: 48.8566,
        lng: 2.3522,
        city: searchQuery,
        country: "France",
        address: searchQuery
      };
      onLocationSelect(mockLocation);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Next
            <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              STR Investment
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze short-term rental opportunities across Europe with real market data and AI-powered insights
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search any European city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 text-base"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 h-8 -translate-y-1/2 btn-investment px-4"
            >
              Analyze
            </Button>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <Card className="card-metric">
        <CardContent className="p-8">
          <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
            <div className="text-center space-y-4 relative z-10">
              <MapPin className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">Interactive Map Coming Soon</h3>
                <p className="text-muted-foreground">Click anywhere in Europe to analyze STR opportunities</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Locations */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Popular Investment Markets</h2>
          <p className="text-muted-foreground">Start with proven markets or explore new opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularLocations.map((location, index) => (
            <Card
              key={index}
              className="card-metric cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              onClick={() => handleLocationClick(location.location)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{location.name}</CardTitle>
                    <CardDescription className="text-base">{location.description}</CardDescription>
                  </div>
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-sm font-medium text-foreground">{location.metrics.avgRevenue}</div>
                    <div className="text-xs text-muted-foreground">Avg. Monthly</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium text-foreground">{location.metrics.occupancy}</div>
                    <div className="text-xs text-muted-foreground">Occupancy</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-warning" />
                    </div>
                    <div className="text-sm font-medium text-foreground">{location.metrics.competition}</div>
                    <div className="text-xs text-muted-foreground">Competition</div>
                  </div>
                </div>
                
                <Button className="w-full btn-investment">
                  Analyze {location.location.city}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12">
        <Card className="card-hero p-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Ready to Start Investing?</h3>
            <p className="text-primary-foreground/80">
              Get detailed analysis for any European location with our AI-powered investment calculator
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => handleSearch()}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Explore Any Location
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};