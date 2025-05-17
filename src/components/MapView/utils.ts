
// Calculate distance between two points using Haversine formula
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

// Calculate distance ranges
export const getDistanceRanges = (nearbyBusinesses: Array<{ distanceValue?: number }>) => {
  if (!nearbyBusinesses.length) return null;
  
  const ranges = {
    under1: 0,
    under5: 0,
    under10: 0,
    over10: 0
  };
  
  nearbyBusinesses.forEach(business => {
    const distance = business.distanceValue || 0;
    if (distance < 1) ranges.under1++;
    else if (distance < 5) ranges.under5++;
    else if (distance < 10) ranges.under10++;
    else ranges.over10++;
  });
  
  return ranges;
};
