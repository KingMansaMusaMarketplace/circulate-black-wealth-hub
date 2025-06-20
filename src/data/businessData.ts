
import { Business } from '@/types/business';

export const businesses: Business[] = [
  {
    id: 1,
    name: "Soul Food Kitchen",
    category: "Restaurant",
    rating: 4.8,
    reviewCount: 124,
    discount: "15% off first order",
    discountValue: 15,
    distance: "0.3 mi",
    distanceValue: 0.3,
    address: "123 Main St, Atlanta, GA",
    lat: 33.7490,
    lng: -84.3880,
    imageUrl: "/lovable-uploads/150432cc-c354-44c5-8b52-771f74dfc018.png",
    imageAlt: "Soul Food Kitchen storefront",
    isFeatured: true
  },
  {
    id: 2,
    name: "Natural Hair Salon",
    category: "Beauty",
    rating: 4.9,
    reviewCount: 89,
    discount: "20% off new clients",
    discountValue: 20,
    distance: "0.7 mi",
    distanceValue: 0.7,
    address: "456 Oak Ave, Atlanta, GA",
    lat: 33.7550,
    lng: -84.3900,
    imageUrl: "/lovable-uploads/1dd9f7bc-bb83-4c92-b250-e11f63790f8c.png",
    imageAlt: "Natural Hair Salon interior",
    isFeatured: true
  },
  {
    id: 3,
    name: "Fresh Market",
    category: "Grocery",
    rating: 4.6,
    reviewCount: 67,
    discount: "10% off produce",
    discountValue: 10,
    distance: "1.2 mi",
    distanceValue: 1.2,
    address: "789 Pine St, Atlanta, GA",
    lat: 33.7600,
    lng: -84.3950,
    imageUrl: "/lovable-uploads/20f584ba-b02b-4b47-a402-708831771379.png",
    imageAlt: "Fresh Market produce section",
    isFeatured: false
  },
  {
    id: 4,
    name: "Tech Solutions LLC",
    category: "Technology",
    rating: 4.7,
    reviewCount: 45,
    discount: "Free consultation",
    discountValue: 0,
    distance: "2.1 mi",
    distanceValue: 2.1,
    address: "321 Tech Blvd, Atlanta, GA",
    lat: 33.7650,
    lng: -84.4000,
    imageUrl: "/lovable-uploads/30f608bd-596a-4257-8272-19ad1bd552f7.png",
    imageAlt: "Tech Solutions office",
    isFeatured: false
  }
];
