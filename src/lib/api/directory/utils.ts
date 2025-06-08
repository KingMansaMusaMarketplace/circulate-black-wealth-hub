
// Calculate distance between two coordinates using Haversine formula
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

// Generate business image URL with fallbacks
export const getBusinessImageUrl = (business: any): string => {
  // If we have a logo_url, use it
  if (business.logo_url) {
    return business.logo_url;
  }
  
  // If we have a banner_url, use it
  if (business.banner_url) {
    return business.banner_url;
  }
  
  // Fallback to a placeholder based on business name
  const businessName = business.business_name || 'Business';
  const firstLetter = businessName.charAt(0).toUpperCase();
  return `https://placehold.co/400x300/e0e0e0/808080?text=${firstLetter}`;
};

// Format business address
export const formatAddress = (business: any): string => {
  const parts = [];
  if (business.address) parts.push(business.address);
  if (business.city) parts.push(business.city);
  if (business.state) parts.push(business.state);
  if (business.zip_code) parts.push(business.zip_code);
  
  return parts.join(', ') || 'Address not available';
};

// Generate discount text
export const generateDiscountText = (business: any): string => {
  // You could enhance this to use actual discount data from QR codes
  const discountValues = ['10% Off', '15% Off', '20% Off', '$5 Off', 'Buy 1 Get 1'];
  const randomDiscount = discountValues[Math.floor(Math.random() * discountValues.length)];
  return randomDiscount;
};

// Calculate discount value for filtering
export const calculateDiscountValue = (discountText: string): number => {
  const match = discountText.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};
