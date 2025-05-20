
import { BusinessLocation } from './types';

// Calculate distance between two points in miles using the Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Generate distance ranges information from businesses
export const getDistanceRanges = (businesses: BusinessLocation[]) => {
  if (!businesses || businesses.length === 0) return null;
  
  return {
    under1: businesses.filter(b => Number(b.distanceValue) < 1).length,
    under5: businesses.filter(b => Number(b.distanceValue) >= 1 && Number(b.distanceValue) < 5).length,
    under10: businesses.filter(b => Number(b.distanceValue) >= 5 && Number(b.distanceValue) < 10).length,
    over10: businesses.filter(b => Number(b.distanceValue) >= 10).length,
  };
};
