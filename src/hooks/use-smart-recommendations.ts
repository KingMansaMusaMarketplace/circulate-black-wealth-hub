
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Business } from '@/types/business';
import { LocationData } from '@/hooks/location/types';

export const useSmartRecommendations = (userLocation?: LocationData | null) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call to get personalized recommendations
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock recommendations data
        const mockRecommendations: Business[] = [
          {
            id: 1,
            name: "Soul Food Kitchen",
            description: "Authentic Southern cuisine served with love and tradition",
            category: "Restaurant",
            address: "123 Main St",
            city: "Atlanta",
            state: "GA",
            zipCode: "30303",
            phone: "(404) 555-0101",
            email: "info@soulfoodkitchen.com",
            website: "https://soulfoodkitchen.com",
            logoUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            bannerUrl: "",
            rating: 4.8,
            averageRating: 4.8,
            reviewCount: 120,
            discount: "10% off",
            discountValue: 10,
            distance: "1.2 miles",
            distanceValue: 1.2,
            lat: 33.7490,
            lng: -84.3880,
            imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            isFeatured: true,
            isVerified: true,
            ownerId: "sample-owner-1",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          },
          {
            id: 2,
            name: "Curl & Coil Hair Salon",
            description: "Expert hair care specializing in natural and textured hair",
            category: "Beauty & Wellness",
            address: "456 Peachtree St",
            city: "Atlanta",
            state: "GA",
            zipCode: "30308",
            phone: "(404) 555-0102",
            email: "info@curlandcoil.com",
            website: "https://curlandcoil.com",
            logoUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
            bannerUrl: "",
            rating: 4.9,
            averageRating: 4.9,
            reviewCount: 85,
            discount: "15% off",
            discountValue: 15,
            distance: "0.8 miles",
            distanceValue: 0.8,
            lat: 33.7590,
            lng: -84.3870,
            imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
            isFeatured: false,
            isVerified: true,
            ownerId: "sample-owner-2",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          },
          {
            id: 3,
            name: "Tech Innovators Inc",
            description: "Cutting-edge technology solutions for modern businesses",
            category: "Technology",
            address: "789 Tech Pkwy",
            city: "Atlanta",
            state: "GA",
            zipCode: "30309",
            phone: "(404) 555-0103",
            email: "info@techinnovators.com",
            website: "https://techinnovators.com",
            logoUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
            bannerUrl: "",
            rating: 4.7,
            averageRating: 4.7,
            reviewCount: 42,
            discount: "Free consultation",
            discountValue: 0,
            distance: "1.5 miles",
            distanceValue: 1.5,
            lat: 33.7690,
            lng: -84.3890,
            imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
            isFeatured: true,
            isVerified: true,
            ownerId: "sample-owner-3",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          }
        ];
        
        setRecommendations(mockRecommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user, userLocation]);

  return { recommendations, loading };
};
