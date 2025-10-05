import { useState } from "react";

export interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
  address: string;
}

export type PopularLocation = {
  name: string;
  description: string;
  metrics: { avgRevenue: string; occupancy: string; competition: string };
  location: Location;
};

const popularLocations: PopularLocation[] = [
  {
    name: "Barcelona, Spain",
    description: "High tourist demand, year-round season",
    metrics: { avgRevenue: "€2,400", occupancy: "82%", competition: "High" },
    location: { lat: 41.3851, lng: 2.1734, city: "Barcelona", country: "Spain", address: "Barcelona, Spain" },
  },
  {
    name: "Rome, Italy",
    description: "Historic center, premium pricing",
    metrics: { avgRevenue: "€2,800", occupancy: "75%", competition: "Medium" },
    location: { lat: 41.9028, lng: 12.4964, city: "Rome", country: "Italy", address: "Rome, Italy" },
  },
  {
    name: "Lisbon, Portugal",
    description: "Growing market, digital nomads",
    metrics: { avgRevenue: "€1,900", occupancy: "88%", competition: "Medium" },
    location: { lat: 38.7223, lng: -9.1393, city: "Lisbon", country: "Portugal", address: "Lisbon, Portugal" },
  },
  {
    name: "Amsterdam, Netherlands",
    description: "High-value market, strict regulations",
    metrics: { avgRevenue: "€3,200", occupancy: "69%", competition: "Very High" },
    location: { lat: 52.3676, lng: 4.9041, city: "Amsterdam", country: "Netherlands", address: "Amsterdam, Netherlands" },
  },
];

export function useLocationSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<Location[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock async search to simulate a real API call.
  const search = async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const q = query ?? searchQuery;

      const result: Location[] = await new Promise((resolve) =>
        setTimeout(() => {
          if (q && q.trim()) {
            resolve([
              {
                lat: 48.8566,
                lng: 2.3522,
                city: q,
                country: "France",
                address: q,
              },
            ]);
          } else {
            resolve([]);
          }
        }, 600),
      );

      setData(result.length ? result : null);
      return result;
    } catch (err) {
      setError(err as Error);
      return [] as Location[];
    } finally {
      setLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    search,
    data,
    loading,
    error,
    popularLocations,
  } as const;
}
