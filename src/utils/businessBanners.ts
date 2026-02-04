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
  // Great Chicken & Hoagies - Chicago fried chicken & hoagies restaurant
  '06d8b3b5-7c6d-4e5e-af02-881ee991a98d': '/businesses/great-chicken-hoagies.png',
  // Big Daddy Garden Company - Garden products and equipment
  'efbabe0f-6b46-450e-b363-e017937134af': '/businesses/big-daddy-garden-banner.png',
  // Ivory Dental Specialists - Family dental care
  '34274f7f-4530-4981-a5c2-6bdca5cb715b': '/businesses/ivory-dental-banner.png',
  // CookWilliams Enterprises LLLP - Professional services enterprise
  '80c221f5-b104-4ad1-a50c-94627e88344d': '/businesses/cookwilliams-enterprises-banner.png',
  // 1325.AI (Mansa Musa Marketplace, Inc.) - AI platform and marketplace
  '01aee255-5b15-4a2d-be76-0a8b3a3b102f': '/businesses/1325-ai-banner.jpeg',
  // Arthur Wylie Entrepreneurship and Leadership Fund
  'd5afdc83-55b3-41bc-8b26-3aa1027b5d91': '/businesses/arthur-wylie-banner.png',
};

// Map of business IDs to card-specific images (used in directory cards only, not detail pages)
const businessCardImages: Record<string, string> = {
  // WOGBE Leadership Empowerment - Group photo for card display
  '8282e123-584a-4dfb-961c-ea79bce730b5': '/businesses/wogbe-card-image.png',
  // Petal Jolie Salon - Beauty salon card image
  'bfe46fbb-87e5-4449-a9ec-99f1c30ea9fb': '/businesses/petal-jolie-card.png',
  // Next Level Coaching - Credit building workbook image for card display
  'deaa774b-88e7-4855-a858-167a646c8ace': '/businesses/next-level-coaching-card.png',
  // Taste of Tara - Upscale Southern brunch restaurant
  '0138c15f-c41a-4b93-a382-f527ca67a6f6': '/businesses/taste-of-tara-card.jpg',
  // Alabama A&M University - HBCU campus view
  '2cff0945-95dc-4cb3-8dfe-c2b95d67b8f8': '/businesses/aamu-card.jpg',
  // Alabama State University - "Where History Is Made" campus landmark
  '9da5f112-fd8d-4f28-9222-d2b71dd7b260': '/businesses/alabama-state-card.png',
  // Bishop State Community College - Students in learning environment
  '6f0622b3-b228-4281-832e-dfa65ae5a3f0': '/businesses/bishop-state-card.webp',
  // Gadsden State Community College - Health sciences student
  '4d4f373a-7bbc-4c5c-b452-19a5d209cc3a': '/businesses/gadsden-state-card.jpg',
  // Trenholm State Community College - Technical training student
  '7df9fc56-2b29-4df9-a993-49a58bf01a38': '/businesses/trenholm-state-card.jpg',
  // Selma University - Basketball team in action
  'c2b81768-e95e-4113-978e-a21e14ffdc20': '/businesses/selma-university-card.jpg',
  // Oakwood University - Iconic silos with golden domes
  '0b6a8b92-4864-4786-9789-48453f0cb0da': '/businesses/oakwood-university-card.jpg',
  // Miles College - Student on campus
  'b3d42f27-e0d0-4975-b253-bce409e1e67f': '/businesses/miles-college-card.jpg',
  // Lawson State Community College - Bessemer campus aerial view
  'e2407df6-9f1e-44f6-9458-e23cfe2c39f4': '/businesses/lawson-state-card.jpg',
  // Drake State Community & Technical College - Campus entrance sign
  '5886e373-31ec-4df8-afc7-254df8b36d98': '/businesses/drake-state-card.png',
  // Shelton State Community College - Aerial campus view
  '3935430a-30b6-4372-a07a-9f42f358e9d1': '/businesses/shelton-state-card.png',
  // Liberty Bank & Trust - Black-owned community bank professionals
  'b6a0e5ee-38ff-4991-8e14-1113d97d8201': '/businesses/liberty-bank-card.jpg',
  // To the Nines Partners - Organizational transformation consultants
  '04b9d571-1b90-4e58-96d2-c45218b7ba36': '/businesses/to-the-nines-card.png',
  // Deep South Center for Environmental Justice - HBCU Climate Change Consortium
  '0610eda7-50be-47e8-a5ad-a1ace8606fae': '/businesses/dscej-card.png',
  // Unique Creations by Dee LLC - Handmade custom jewelry
  '7361a585-d567-499b-9559-aa184faa5e1f': '/businesses/unique-creations-dee-card.jpg',
  // STEM NOLA - Youth STEM education and engagement
  'edc51d8e-e009-494e-9e13-303b9c942ae6': '/businesses/stem-nola-card.png',
  // Rural Beacon Initiative - Climate and community resilience
  'e9eeb050-895f-4b9d-af90-66f84a8b0a45': '/businesses/rural-beacon-card.png',
  // LMI East Africa - Leadership development and coaching
  'a94b9ad3-8813-456a-a453-4fae508541b6': '/businesses/lmi-east-africa-card.jpg',
  // Fruitee Water - Fruit-infused water beverages
  'a7f8ccd0-fd8d-476b-b596-f79a87d1cfd7': '/businesses/fruitee-water-card.jpg',
  // The Green Fund (HBCU Green Fund) - Sustainability and climate resilience
  '9f3bd430-d01f-41ce-988d-c2b7255811d5': '/businesses/hbcu-green-fund-card.jpg',
  // City First Bank - Black-owned community development financial institution
  '94cb662d-ff2f-4893-9e34-047b2aa3ecb8': '/businesses/city-first-bank-card.jpg',
  // Slutty Vegan - Plant-based vegan restaurant in Atlanta
  'd877b403-b582-48ec-95ff-e05c6da9123b': '/businesses/slutty-vegan-card.jpg',
  // Citizens Trust Bank - Historic Black-owned community bank
  'b3454666-ff6a-41e1-97e7-92a06b69ec9f': '/businesses/citizens-trust-bank-card.jpg',
  // Black Digital - DC-based marketing agency
  'a560a8a8-7a14-44ee-b0dc-a1b13417c191': '/businesses/black-digital-card.jpg',
  // Carver Federal Savings Bank - Historic Harlem community bank
  'f090f21c-0228-4111-b026-f1d3f5dfc73e': '/businesses/carver-bank-card.jpg',
  // The Harbor Bank of Maryland - Baltimore community bank
  '951e24f5-4a7a-4b32-87a3-5c02f9c0c9f9': '/businesses/harbor-bank-card.jpg',
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

/**
 * Get card-specific image for a business (for directory cards only)
 * @param businessId - The business UUID
 * @param bannerUrl - The stored banner URL (may be null)
 * @returns The card image URL to use, falling back to banner logic
 */
export function getBusinessCardImage(businessId: string, bannerUrl: string | null | undefined): string | undefined {
  // Check for a card-specific image first
  if (businessCardImages[businessId]) {
    return businessCardImages[businessId];
  }
  
  // Fall back to banner logic
  return getBusinessBanner(businessId, bannerUrl);
}
