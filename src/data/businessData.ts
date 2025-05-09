
export interface Business {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: string;
  discountValue: number;
  distance: string;
  distanceValue: number;
  address: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured?: boolean;
}

// Expanded list of business categories (23 categories)
export const businessCategories = [
  "Restaurants",
  "Retail",
  "Beauty & Wellness",
  "Professional Services",
  "Health Services",
  "Education",
  "Art & Entertainment",
  "Technology",
  "Fashion & Clothing",
  "Financial Services",
  "Real Estate",
  "Automotive",
  "Home Services",
  "Hospitality",
  "Fitness",
  "Media & Marketing",
  "Construction",
  "Agriculture",
  "Childcare Services",
  "Event Planning",
  "Legal Services",
  "Transportation",
  "Non-profit"
];

export const businesses: Business[] = [
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
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Soul+Food",
    isFeatured: true
  },
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
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Beauty"
  },
  {
    id: 3,
    name: "Urban Threads Clothing",
    category: "Fashion & Clothing",
    rating: 4.2,
    reviewCount: 65,
    discount: "20% off",
    discountValue: 20,
    distance: "1.2",
    distanceValue: 1.2,
    address: "789 Marietta St NW, Atlanta, GA 30318",
    lat: 33.775,
    lng: -84.410,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Fashion"
  },
  {
    id: 4,
    name: "Tech Innovators Inc",
    category: "Technology",
    rating: 4.7,
    reviewCount: 42,
    discount: "5% off",
    discountValue: 5,
    distance: "1.5",
    distanceValue: 1.5,
    address: "101 Peachtree St NE, Atlanta, GA 30303",
    lat: 33.759,
    lng: -84.387,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Tech"
  },
  {
    id: 5,
    name: "Black Bean Bookstore",
    category: "Retail",
    rating: 4.9,
    reviewCount: 112,
    discount: "Buy one, get one 50% off",
    discountValue: 25,
    distance: "0.3",
    distanceValue: 0.3,
    address: "234 Decatur St SE, Atlanta, GA 30312",
    lat: 33.751,
    lng: -84.376,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Books",
    isFeatured: true
  },
  {
    id: 6,
    name: "Heritage Financial Advisors",
    category: "Financial Services",
    rating: 4.6,
    reviewCount: 37,
    discount: "Free consultation",
    discountValue: 0,
    distance: "2.1",
    distanceValue: 2.1,
    address: "567 Ponce de Leon Ave NE, Atlanta, GA 30308",
    lat: 33.772,
    lng: -84.366,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Finance"
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
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Hair"
  },
  {
    id: 8,
    name: "Community Health Clinic",
    category: "Health Services",
    rating: 4.8,
    reviewCount: 76,
    discount: "20% off first visit",
    discountValue: 20,
    distance: "0.9",
    distanceValue: 0.9,
    address: "321 Courtland St NE, Atlanta, GA 30303",
    lat: 33.757,
    lng: -84.385,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Health"
  },
  {
    id: 9,
    name: "Urban Gardening Center",
    category: "Agriculture",
    rating: 4.4,
    reviewCount: 52,
    discount: "10% off plants",
    discountValue: 10,
    distance: "2.4",
    distanceValue: 2.4,
    address: "432 DeKalb Ave NE, Atlanta, GA 30312",
    lat: 33.756,
    lng: -84.351,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Garden"
  },
  {
    id: 10,
    name: "Cultural Arts Studio",
    category: "Art & Entertainment",
    rating: 4.5,
    reviewCount: 68,
    discount: "Free class with membership",
    discountValue: 0,
    distance: "1.3",
    distanceValue: 1.3,
    address: "654 Memorial Dr SE, Atlanta, GA 30312",
    lat: 33.746,
    lng: -84.372,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Arts"
  },
  {
    id: 11,
    name: "Sankofa Legal Group",
    category: "Legal Services",
    rating: 4.9,
    reviewCount: 31,
    discount: "Free consultation",
    discountValue: 0,
    distance: "1.1",
    distanceValue: 1.1,
    address: "789 Spring St NW, Atlanta, GA 30308",
    lat: 33.776,
    lng: -84.390,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Legal"
  },
  {
    id: 12,
    name: "Unity Construction LLC",
    category: "Construction",
    rating: 4.7,
    reviewCount: 45,
    discount: "5% off services",
    discountValue: 5,
    distance: "3.2",
    distanceValue: 3.2,
    address: "901 Metropolitan Pkwy SW, Atlanta, GA 30310",
    lat: 33.731,
    lng: -84.407,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Construction"
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
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Coffee",
    isFeatured: true
  },
  {
    id: 14,
    name: "Legacy Real Estate Group",
    category: "Real Estate",
    rating: 4.6,
    reviewCount: 29,
    discount: "Reduced commission",
    discountValue: 15,
    distance: "1.9",
    distanceValue: 1.9,
    address: "567 Northside Dr NW, Atlanta, GA 30318",
    lat: 33.771,
    lng: -84.406,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=RealEstate"
  },
  {
    id: 15,
    name: "Afrocentric Fitness Center",
    category: "Fitness",
    rating: 4.7,
    reviewCount: 83,
    discount: "First month free",
    discountValue: 30,
    distance: "1.5",
    distanceValue: 1.5,
    address: "876 Euclid Ave NE, Atlanta, GA 30307",
    lat: 33.765,
    lng: -84.351,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Fitness"
  },
  {
    id: 16,
    name: "Empowerment Learning Center",
    category: "Education",
    rating: 4.9,
    reviewCount: 61,
    discount: "10% off tutoring",
    discountValue: 10,
    distance: "1.7",
    distanceValue: 1.7,
    address: "543 Boulevard SE, Atlanta, GA 30312",
    lat: 33.747,
    lng: -84.372,
    imageUrl: "https://placehold.co/300x200/e0e0e0/808080?text=Education"
  }
];
