export interface OpportunityMarker {
  id: string;
  coordinates: { lat: number; lng: number };
  city: string;
  region?: string;
  country?: string;
  price?: number;
  currency?: string;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}
