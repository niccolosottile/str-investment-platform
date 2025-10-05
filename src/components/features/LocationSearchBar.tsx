import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function LocationSearchBar({
  value,
  onChange,
  onSearch,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => Promise<void> | void;
  loading?: boolean;
}) {
  return (
    <div className="max-w-md mx-auto">
      <label htmlFor="location-search" className="sr-only">
        Search location
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          id="location-search"
          placeholder="Search any European city..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? onSearch() : undefined)}
          className="pl-10 h-12 text-base"
          aria-label="Search any European city"
        />
        <Button
          onClick={onSearch}
          className="absolute right-2 top-1/2 h-8 -translate-y-1/2 btn-investment px-4"
          aria-label="Analyze location"
          disabled={loading}
        >
          Analyze
        </Button>
      </div>
    </div>
  );
}
