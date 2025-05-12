
import { Business } from '@/types/business';

export const restaurantBusinesses: Business[] = [
  {
    id: 1,
    name: "Soul Food Kitchen",
    category: "Restaurants",
    rating: 4.8,
    reviewCount: 124,
    discount: "15% off",
    discountValue: 15,
    distance: "0.5",
    distanceValue: 0.5,
    address: "123 Auburn Ave NE, Atlanta, GA 30303",
    lat: 33.755,
    lng: -84.373,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop",
    imageAlt: "Soul Food Kitchen restaurant interior",
    isFeatured: true
  },
  {
    id: 13,
    name: "Diaspora Coffee House",
    category: "Restaurants",
    rating: 4.8,
    reviewCount: 107,
    discount: "Buy one, get one free",
    discountValue: 50,
    distance: "0.6",
    distanceValue: 0.6,
    address: "345 Peters St SW, Atlanta, GA 30313",
    lat: 33.748,
    lng: -84.399,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop",
    imageAlt: "Cozy coffee shop interior",
    isFeatured: true
  }
];
