// Core type definitions for the application

export interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
  address: string;
}

export interface LocationMetrics {
  avgRevenue: string;
  occupancy: string;
  competition: string;
}

export interface PopularLocation {
  name: string;
  description: string;
  metrics: LocationMetrics;
  location: Location;
}

export interface InvestmentData {
  location: Location;
  investmentType: "buy" | "rent";
  budget: number;
  propertyType: "apartment" | "house" | "room";
  goals: "max-roi" | "stable-income" | "quick-payback";
}

export interface InvestmentResults {
  monthlyRevenue: number;
  yearlyRevenue: number;
  roi: number;
  paybackMonths: number;
  occupancyRate: number;
  competitorCount: number;
  marketScore: number;
  confidence: "high" | "medium" | "low";
}
