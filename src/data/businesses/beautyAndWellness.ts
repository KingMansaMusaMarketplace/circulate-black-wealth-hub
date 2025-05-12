
import { Business } from '@/types/business';

export const beautyAndWellnessBusinesses: Business[] = [
  {
    id: 2,
    name: "Melanin Beauty Supply",
    category: "Beauty & Wellness",
    rating: 4.5,
    reviewCount: 86,
    discount: "10% off",
    discountValue: 10,
    distance: "0.8",
    distanceValue: 0.8,
    address: "456 Edgewood Ave SE, Atlanta, GA 30312",
    lat: 33.754,
    lng: -84.371,
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop",
    imageAlt: "Beauty supply store display"
  },
  {
    id: 7,
    name: "Natural Roots Hair Salon",
    category: "Beauty & Wellness",
    rating: 4.7,
    reviewCount: 93,
    discount: "15% off first visit",
    discountValue: 15,
    distance: "1.7",
    distanceValue: 1.7,
    address: "890 Ralph McGill Blvd NE, Atlanta, GA 30312",
    lat: 33.765,
    lng: -84.364,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop",
    imageAlt: "Modern hair salon interior"
  }
];
