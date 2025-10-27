// Utilities for assessing data availability for a given city/region

export type DataAvailability = 'high' | 'medium' | 'low';

export function getDataAvailability(city: string): DataAvailability {
  const highDataCities = ['Barcelona', 'Rome', 'Lisbon', 'Amsterdam', 'Milan', 'Florence'];
  const mediumDataCities = ['Porto', 'Valencia', 'Bologna', 'Turin'];

  if (highDataCities.some(c => city.includes(c))) return 'high';
  if (mediumDataCities.some(c => city.includes(c))) return 'medium';
  return 'low';
}
