import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Heart, Clock, TrendingUp } from 'lucide-react';
import { Business } from '@/types/business';
import { LocationData } from '@/hooks/location/types';

interface SmartBusinessRecommendationsProps {
  userLocation?: LocationData | null;
}

const SmartBusinessRecommendations: React.FC<SmartBusinessRecommendationsProps> = ({ userLocation }) => {
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
            description: "Authentic soul food with a modern twist",
            category: "Restaurant",
            address: "123 Main St, Atlanta, GA",
            phone: "(404) 555-1234",
            website: "https://soulfoodkitchen.com",
            email: "info@soulfoodkitchen.com",
            hours: "Mon-Sat: 11am-10pm, Sun: 12pm-8pm",
            rating: 4.8,
            reviewCount: 120,
            lat: 33.7490,
            lng: -84.3880,
            distance: "1.2 miles",
            distanceValue: 1.2,
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            featured: true,
            discount: 10,
            tags: ["Soul Food", "Southern", "Comfort Food"]
          },
          {
            id: 2,
            name: "Curl & Coil Hair Salon",
            description: "Specialized in natural hair care and styling",
            category: "Beauty & Wellness",
            address: "456 Peachtree St, Atlanta, GA",
            phone: "(404) 555-5678",
            website: "https://curlandcoil.com",
            email: "appointments@curlandcoil.com",
            hours: "Tue-Sat: 9am-7pm",
            rating: 4.9,
            reviewCount: 85,
            lat: 33.7590,
            lng: -84.3870,
            distance: "0.8 miles",
            distanceValue: 0.8,
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
            featured: false,
            discount: 15,
            tags: ["Hair Salon", "Natural Hair", "Black-owned"]
          },
          {
            id: 3,
            name: "Tech Innovators Inc",
            description: "Software development and IT consulting",
            category: "Technology",
            address: "789 Tech Pkwy, Atlanta, GA",
            phone: "(404) 555-9012",
            website: "https://techinnovators.com",
            email: "info@techinnovators.com",
            hours: "Mon-Fri: 9am-6pm",
            rating: 4.7,
            reviewCount: 42,
            lat: 33.7690,
            lng: -84.3890,
            distance: "1.5 miles",
            distanceValue: 1.5,
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
            featured: true,
            discount: 0,
            tags: ["Tech", "Software", "Consulting"]
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

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-mansablue">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-mansablue">Recommended For You</h2>
        <Button variant="link" className="text-mansablue">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((business) => (
          <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img 
                src={business.image} 
                alt={business.name} 
                className="w-full h-full object-cover"
              />
              {business.featured && (
                <Badge className="absolute top-2 right-2 bg-mansagold text-black">
                  Featured
                </Badge>
              )}
              {business.discount > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500">
                  {business.discount}% OFF
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{business.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{business.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{business.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{business.distance}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Open Now</span>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1">
                {business.tags.slice(0, 2).map((tag, i) => (
                  <Badge key={i} variant="outline" className="bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          More Recommendations
        </Button>
      </div>
    </div>
  );
};

export default SmartBusinessRecommendations;
