// LocalStorage utilities for caching search history and other user preferences

const RECENT_SEARCHES_KEY = 'str:recent:searches';
const MAX_RECENT_SEARCHES = 10;
const RECENT_SEARCHES_TTL_DAYS = 7;

export interface RecentSearch {
  query: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  timestamp: number;
}

/**
 * Get recent searches from localStorage
 * Filters out expired entries (older than TTL_DAYS)
 */
export function getRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    
    const searches: RecentSearch[] = JSON.parse(raw);
    const now = Date.now();
    const ttlMs = RECENT_SEARCHES_TTL_DAYS * 24 * 60 * 60 * 1000;
    
    // Filter out expired searches
    return searches.filter(search => now - search.timestamp < ttlMs);
  } catch (e) {
    console.warn('Failed to load recent searches from localStorage', e);
    return [];
  }
}

/**
 * Save a new search to recent searches
 * Automatically deduplicates and maintains max size
 */
export function saveRecentSearch(search: Omit<RecentSearch, 'timestamp'>): void {
  try {
    const existing = getRecentSearches();
    
    // Remove duplicate if exists (same city AND country with very close coordinates)
    // Use 0.001 degree tolerance (~100m) for coordinate comparison to handle floating point precision
    const filtered = existing.filter(s => {
      const isSameLocation = 
        s.city.toLowerCase() === search.city.toLowerCase() && 
        s.country.toLowerCase() === search.country.toLowerCase() &&
        Math.abs(s.coordinates.lat - search.coordinates.lat) < 0.001 && 
        Math.abs(s.coordinates.lng - search.coordinates.lng) < 0.001;
      return !isSameLocation;
    });
    
    // Add new search at the beginning
    const updated = [
      { ...search, timestamp: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save recent search to localStorage', e);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {
    console.warn('Failed to clear recent searches from localStorage', e);
  }
}

/**
 * Remove a specific search from recent searches
 */
export function removeRecentSearch(coordinates: { lat: number; lng: number }): void {
  try {
    const existing = getRecentSearches();
    const filtered = existing.filter(
      s => !(s.coordinates.lat === coordinates.lat && 
             s.coordinates.lng === coordinates.lng)
    );
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to remove recent search from localStorage', e);
  }
}
