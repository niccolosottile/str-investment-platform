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

export interface LocationSearchResult {
  coordinates: { lat: number; lng: number };
  address: string;
  city: string;
  region: string;
  country: string;
  distanceFromUser?: {
    km: number;
    drivingTime: number; // minutes
    isWithinDayTrip: boolean; // Can visit and return same day
  };
  dataAvailability: 'high' | 'medium' | 'low';
  lastUpdated?: Date;
  propertyCount?: number;
}

export interface UserLocationContext {
  currentLocation: { lat: number; lng: number } | null;
  searchRadius: number; // km
  maxDrivingTime: number; // hours
  preferredRegions: string[];
  locationPermissionGranted: boolean;
}

export interface GeolocationError {
  code: number;
  message: string;
  type: 'permission_denied' | 'position_unavailable' | 'timeout' | 'unsupported';
}
