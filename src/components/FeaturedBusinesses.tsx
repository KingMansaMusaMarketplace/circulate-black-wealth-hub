
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { businesses } from '@/data/businessData';
import OptimizedImage from '@/components/ui/optimized-image';
import { generatePlaceholder } from '@/utils/imageOptimizer';

const FeaturedBusinesses = ({ limit = 3 }: { limit?: number }) => {
  // Get the first N featured businesses from our business data
  const featuredBusinesses = businesses
    .filter(business => business.isFeatured)
    .slice(0, limit)
    .map(business => ({
      id: business.id,
      name: business.name,
      category: business.category,
      description: `Discover amazing ${business.category.toLowerCase()} services and earn loyalty points`,
      rating: business.rating,
      reviews: business.reviewCount,
      distance: business.distance,
      image: business.imageUrl,
      discount: business.discount
    }));

  // If we don't have enough featured businesses, fill with regular ones
  const allDisplayBusinesses = featuredBusinesses.length >= limit 
    ? featuredBusinesses 
    : [
        ...featuredBusinesses,
        ...businesses.slice(0, limit - featuredBusinesses.length).map(business => ({
          id: business.id,
          name: business.name,
          category: business.category,
          description: `Discover amazing ${business.category.toLowerCase()} services and earn loyalty points`,
          rating: business.rating,
          reviews: business.reviewCount,
          distance: business.distance,
          image: business.imageUrl,
          discount: business.discount
        }))
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

        <div className={`grid gap-6 mb-10 ${allDisplayBusinesses.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {allDisplayBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <OptimizedImage 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    fallbackSrc={generatePlaceholder(400, 250, business.name)}
                    quality="medium"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            <Button size="lg" variant="outline" className="border-mansablue text-mansablue hover:bg-mansablue hover:text-white">
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
