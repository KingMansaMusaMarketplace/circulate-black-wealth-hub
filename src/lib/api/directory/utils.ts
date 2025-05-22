
import { toast } from 'sonner';

// Function to calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Image utility function to get appropriate image URL based on business data
export function getBusinessImageUrl(business: any): string {
  // Set up proper image URL with fallbacks
  const logoUrl = business.logo_url || null;
  
  // Image URL options (in order of priority):
  // 1. business.logo_url if available
  // 2. Category-based placeholder images from Unsplash
  // 3. Default placeholder based on business name
  
  if (logoUrl) {
    return logoUrl;
  }
  
  // Select placeholder image based on category
  const categoryImageMap: Record<string, string> = {
    'Restaurant': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=500',
    'Beauty & Wellness': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500',
    'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500',
    'Fashion & Clothing': 'https://images.unsplash.com/photo-1595665593673-bf1ad72905c1?q=80&w=500',
    'Financial Services': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500',
    'Health Services': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500',
    'Retail': 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=500'
  };
  
  return categoryImageMap[business.category] || 
        `https://placehold.co/500x300/e0e0e0/808080?text=${business.business_name?.charAt(0).toUpperCase() || 'B'}`;
}
