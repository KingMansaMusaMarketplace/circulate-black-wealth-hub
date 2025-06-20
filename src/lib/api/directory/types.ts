
import { Business } from '@/types/business';

export interface BusinessResponse {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: string;
  discountValue: number;
  address: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured?: boolean;
}

export interface BusinessFilters {
  category?: string;
  minRating?: number;
  minDiscount?: number;
  searchTerm?: string;
  featured?: boolean;
  distance?: number; // Distance filter property
  userLat?: number;  // User latitude for distance calculation
  userLng?: number;  // User longitude for distance calculation
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
