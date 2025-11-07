// Utility script to convert business IDs from numbers to strings
// This script is used to update all mock data files

import { Business } from '@/types/business';

export function convertBusinessIdToString(business: Business & { id: number | string }): Business {
  return {
    ...business,
    id: String(business.id)
  };
}

export function convertBusinessArrayIdsToStrings(businesses: (Business & { id: number | string })[]): Business[] {
  return businesses.map(convertBusinessIdToString);
}
