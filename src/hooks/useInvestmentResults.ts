// filepath: src/hooks/useInvestmentResults.ts
import { useMemo } from "react";
import type { InvestmentData, InvestmentResults } from "@/types";

export function useInvestmentResults(investmentData: InvestmentData): InvestmentResults {
  const { location, investmentType, budget, propertyType } = investmentData;

  return useMemo(() => {
    const baseRevenue = propertyType === "apartment" ? 2200 : propertyType === "house" ? 3200 : 800;
    const city = location.city || "";
    const locationMultiplier = city.toLowerCase().includes("rome")
      ? 1.3
      : city.toLowerCase().includes("barcelona")
      ? 1.2
      : city.toLowerCase().includes("amsterdam")
      ? 1.4
      : 1.0;

    const monthlyRevenue = Math.round(baseRevenue * locationMultiplier);
    const yearlyRevenue = monthlyRevenue * 12;

    const roi =
      investmentType === "buy"
        ? Math.round((yearlyRevenue / budget) * 100)
        : Math.round(((monthlyRevenue - budget * 0.1) * 12) / budget * 100);

    const paybackMonths =
      investmentType === "buy" ? Math.round(budget / monthlyRevenue) : Math.round(budget / (monthlyRevenue * 0.3));

    const confidence = roi > 15 ? "high" : roi > 8 ? "medium" : "low";

    const results: InvestmentResults = {
      monthlyRevenue,
      yearlyRevenue,
      roi,
      paybackMonths,
      occupancyRate: 78,
      competitorCount: 45,
      marketScore: 82,
      confidence,
    };

    return results;
  }, [location.city, investmentType, budget, propertyType]);
}
