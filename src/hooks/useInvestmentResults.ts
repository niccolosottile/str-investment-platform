import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { InvestmentData, InvestmentResults } from "@/types";

interface AnalysisApiResponse {
  id: string;
  locationId: string;
  configuration: {
    investmentType: string;
    budget: number;
    currency: string;
    propertyType: string;
    goal: string | null;
    acceptsRenovation: boolean;
  };
  metrics: {
    monthlyRevenueExpected: { amount: number; currency: string };
    annualRevenue: { amount: number; currency: string };
    annualROI: number;
    paybackPeriodMonths: number;
    occupancyRate: number;
  };
  marketAnalysis: {
    totalListings: number;
  };
  marketScore?: number;
  confidence?: string;
}

function toApiEnum(value: string): string {
  return value.replace(/-/g, "_").toUpperCase();
}

function mapConfidence(value?: string): InvestmentResults["confidence"] {
  if (!value) {
    return "medium";
  }

  const normalized = value.toLowerCase();
  if (normalized === "high" || normalized === "low") {
    return normalized;
  }

  return "medium";
}

export function useInvestmentResults(investmentData: InvestmentData) {
  const locationId = investmentData.location.id ?? investmentData.location.opportunityData?.id;

  return useQuery({
    queryKey: ["investment-results", locationId, investmentData.investmentType, investmentData.budget, investmentData.propertyType, investmentData.goals],
    enabled: Boolean(investmentData.location.city && investmentData.location.country),
    queryFn: async (): Promise<InvestmentResults> => {
      let resolvedLocationId = locationId;

      if (!resolvedLocationId) {
        const lookup = `${investmentData.location.city}, ${investmentData.location.country}`;
        const params = new URLSearchParams({ query: lookup, limit: "1" });
        const locationLookupResponse = await apiFetch(`/api/locations/search?${params.toString()}`);

        if (!locationLookupResponse.ok) {
          const payload = await locationLookupResponse.json().catch(() => ({ message: locationLookupResponse.statusText }));
          throw new Error(payload.message || "Failed to resolve location ID for analysis");
        }

        const locations = await locationLookupResponse.json() as Array<{ id: string }>;
        if (locations.length === 0) {
          throw new Error("Unable to resolve location in backend for analysis");
        }

        resolvedLocationId = locations[0].id;
      }

      const response = await apiFetch(`/api/analysis/location/${resolvedLocationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investmentType: toApiEnum(investmentData.investmentType),
          budget: investmentData.budget,
          propertyType: toApiEnum(investmentData.propertyType),
          investmentGoal: toApiEnum(investmentData.goals),
          acceptsRenovation: false,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(payload.message || "Failed to load investment analysis");
      }

      const data: AnalysisApiResponse = await response.json();
      const occupancyRatePct = Math.round((data.metrics.occupancyRate || 0) * 100);

      return {
        monthlyRevenue: Math.round(data.metrics.monthlyRevenueExpected.amount || 0),
        yearlyRevenue: Math.round(data.metrics.annualRevenue.amount || 0),
        roi: Math.round((data.metrics.annualROI || 0) * 10) / 10,
        paybackMonths: data.metrics.paybackPeriodMonths || 0,
        occupancyRate: occupancyRatePct,
        competitorCount: data.marketAnalysis.totalListings || 0,
        marketScore: data.marketScore ?? 0,
        confidence: mapConfidence(data.confidence),
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}
