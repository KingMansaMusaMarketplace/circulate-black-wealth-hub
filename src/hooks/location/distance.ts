
import { calculateDistance } from '@/components/MapView/utils';
import { LocationData } from './types';

// Calculate distance between user location and a point
export const getDistanceFromPoint = (
  location: LocationData | null, 
  pointLat: number, 
  pointLng: number
): number | null => {
  if (!location) return null;
  return calculateDistance(location.lat, location.lng, pointLat, pointLng);
};

// Get nearby points from an array
export const getNearbyPoints = <T extends { lat: number; lng: number }>(
  location: LocationData | null,
  points: T[],
  maxDistance?: number
): Array<T & { distance: number }> => {
  if (!location) return [];
  
  return points
    .map(point => {
      const distance = calculateDistance(
        location.lat, 
        location.lng, 
        point.lat, 
        point.lng
      );
      return { ...point, distance };
    })
    .filter(point => maxDistance === undefined || point.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};
