/**
 * Business Banner Fallback Mapping
 * 
 * This utility provides fallback banner images for specific businesses
 * that may not have uploaded their own banners yet.
 */

// Map of business IDs to their fallback banner images
const businessBannerFallbacks: Record<string, string> = {
  // Timeless Tunez - DJ and event services in Buffalo
  '58a964e8-1e5e-4fa6-a075-76525eb6e617': '/images/businesses/timeless-tunez-banner.jpg',
  // VECRA INC - Consulting services, veteran-owned small business
  '97f59bb4-dba9-48f0-87d8-d8ea35748e46': '/images/businesses/vecra-inc-banner.png',
  // Durham Memorial Outreach Center, Inc. - Community outreach services
  'f3776cb0-6f2c-45bf-95cb-b5b11a095875': '/images/businesses/durham-memorial-banner.png',
  // Infinite Seeds Academy - Edible landscaping and green education
  '8abf4585-5d75-450e-b54c-6417c3b5b259': '/images/businesses/infinite-seeds-banner.png',
};

/**
 * Get banner URL for a business, with fallback support
 * @param businessId - The business UUID
 * @param bannerUrl - The stored banner URL (may be null)
 * @returns The banner URL to use, or undefined if no fallback exists
 */
export function getBusinessBanner(businessId: string, bannerUrl: string | null | undefined): string | undefined {
  // If the business has an uploaded banner, use it
  if (bannerUrl) {
    return bannerUrl;
  }
  
  // Check for a fallback banner
  return businessBannerFallbacks[businessId];
}
