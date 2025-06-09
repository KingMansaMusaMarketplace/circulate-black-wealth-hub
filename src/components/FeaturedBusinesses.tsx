
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const FeaturedBusinesses = () => {
  const featuredBusinesses = [
    {
      id: 1,
      name: "Harmony Soul Food",
      category: "Restaurant",
      description: "Authentic Southern cuisine with modern twists",
      rating: 4.8,
      reviews: 124,
      distance: "0.8 miles",
      image: "/placeholder.svg",
      discount: "10% Off First Visit"
    },
    {
      id: 2,
      name: "Black Bean Coffee Co.",
      category: "Coffee Shop",
      description: "Ethically sourced coffee and pastries",
      rating: 4.6,
      reviews: 87,
      distance: "1.2 miles",
      image: "/placeholder.svg",
      discount: "Free Pastry with Drink"
    },
    {
      id: 3,
      name: "Culture Clothing",
      category: "Retail",
      description: "Urban fashion and cultural expression",
      rating: 4.7,
      reviews: 93,
      distance: "2.5 miles",
      image: "/placeholder.svg",
      discount: "15% Off Purchase"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Black-Owned Businesses
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing businesses in your community and start earning loyalty points today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featuredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                  <img 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {business.category}
                    </Badge>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {business.discount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {business.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{business.rating} ({business.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{business.distance}</span>
                  </div>
                </div>
                
                <Link to={`/business/${business.id}`}>
                  <Button className="w-full">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/directory">
            <Button size="lg" variant="outline">
              View All Businesses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
