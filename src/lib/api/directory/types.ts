
export interface BusinessFilters {
  category?: string;
  minRating?: number;
  minDiscount?: number;
  featured?: boolean;
  distance?: number;
  searchTerm?: string;
  userLat?: number;
  userLng?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface BusinessQueryResult {
  businesses: Business[];
  totalCount: number;
  totalPages: number;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: string;
  discountValue: number;
  distance?: string;
  distanceValue?: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  website?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured?: boolean;
  logoUrl?: string;
  bannerUrl?: string;
  averageRating?: number;
  isVerified?: boolean;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}
