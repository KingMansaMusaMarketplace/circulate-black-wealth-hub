
import { Business } from '@/types/business';

export const businessCategories = [
  "Food & Dining",
  "Beauty & Wellness",
  "Health & Fitness",
  "Professional Services",
  "Retail & Shopping",
  "Art & Entertainment",
  "Education",
  "Technology",
  "Transportation",
  "Finance"
];

// Sample businesses data
export const businesses: Business[] = [
  {
    id: 1,
    name: "Soulful Kitchen",
    category: "Food & Dining",
    rating: 4.8,
    reviewCount: 125,
    discount: "10% off",
    discountValue: 10,
    distance: "1.2 mi",
    distanceValue: 1.2,
    address: "123 Main St, Atlanta, GA",
    lat: 33.748997,
    lng: -84.387985,
    imageUrl: "/placeholder.svg",
    isFeatured: true
  },
  {
    id: 2,
    name: "Natural Beauty Spa",
    category: "Beauty & Wellness",
    rating: 4.6,
    reviewCount: 89,
    discount: "15% off",
    discountValue: 15,
    distance: "0.8 mi",
    distanceValue: 0.8,
    address: "456 Oak Ave, Atlanta, GA",
    lat: 33.749568,
    lng: -84.388427,
    imageUrl: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Tech Innovations",
    category: "Technology",
    rating: 4.9,
    reviewCount: 45,
    discount: "5% off",
    discountValue: 5,
    distance: "2.1 mi",
    distanceValue: 2.1,
    address: "789 Tech Blvd, Atlanta, GA",
    lat: 33.751234,
    lng: -84.394321,
    imageUrl: "/placeholder.svg",
    isFeatured: true
  }
];
