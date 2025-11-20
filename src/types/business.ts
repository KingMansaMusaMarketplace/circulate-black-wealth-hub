
export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  averageRating: number;
  reviewCount: number;
  rating: number;
  discount: string;
  discountValue: number;
  distance: string;
  distanceValue: number;
  lat: number;
  lng: number;
  imageUrl: string;
  imageAlt?: string;
  isFeatured?: boolean;
  isVerified: boolean;
  isSample?: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
