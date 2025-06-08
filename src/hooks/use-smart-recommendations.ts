
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
            category: "Restaurant",
            address: "123 Main St, Atlanta, GA",
            rating: 4.8,
            reviewCount: 120,
            discount: "10% off",
            discountValue: 10,
            distance: "1.2 miles",
            distanceValue: 1.2,
            lat: 33.7490,
            lng: -84.3880,
            imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            isFeatured: true
          },
          {
            id: 2,
            name: "Curl & Coil Hair Salon",
            category: "Beauty & Wellness",
            address: "456 Peachtree St, Atlanta, GA",
            rating: 4.9,
            reviewCount: 85,
            discount: "15% off",
            discountValue: 15,
            distance: "0.8 miles",
            distanceValue: 0.8,
            lat: 33.7590,
            lng: -84.3870,
            imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
            isFeatured: false
          },
          {
            id: 3,
            name: "Tech Innovators Inc",
            category: "Technology",
            address: "789 Tech Pkwy, Atlanta, GA",
            rating: 4.7,
            reviewCount: 42,
            discount: "Free consultation",
            discountValue: 0,
            distance: "1.5 miles",
            distanceValue: 1.5,
            lat: 33.7690,
            lng: -84.3890,
            imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
            isFeatured: true
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
