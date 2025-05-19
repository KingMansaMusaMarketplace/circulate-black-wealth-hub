
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag, ArrowRight } from 'lucide-react';

const recommendedBusinesses = [
  {
    id: 1,
    name: "Elite Tech Solutions",
    category: "Technology",
    rating: 4.8,
    image: "/placeholder.svg",
    location: "Atlanta, GA",
    distance: "0.8 miles away",
    deals: ["20% off first consultation", "Free system health check"],
    tags: ["web development", "IT support", "cloud services"]
  },
  {
    id: 2,
    name: "Harmony Wellness Spa",
    category: "Health & Wellness",
    rating: 4.9,
    image: "/placeholder.svg",
    location: "Oakland, CA",
    distance: "1.2 miles away",
    deals: ["Buy one service, get second 50% off", "New client special"],
    tags: ["massage", "skincare", "holistic healing"]
  },
  {
    id: 3,
    name: "Flavor Fusion Kitchen",
    category: "Food & Beverage",
    rating: 4.7,
    image: "/placeholder.svg",
    location: "Chicago, IL", 
    distance: "0.5 miles away",
    deals: ["Free appetizer with entrée purchase", "10% off first order"],
    tags: ["soul food", "fusion cuisine", "catering"]
  }
];

const PersonalizedRecommendations = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Personalized For You</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-mansagold" />
            <p className="text-lg font-medium text-mansablue-dark">Tailored Business Recommendations</p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover Black-owned businesses personalized to your interests, location, and previous interactions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {recommendedBusinesses.map((business) => (
            <Card key={business.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={business.image} 
                  alt={business.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {business.rating}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="text-white font-medium">{business.category}</div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-mansablue-dark">{business.name}</h3>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{business.location} • {business.distance}</span>
                </div>
                
                {business.deals.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Current Deals:</div>
                    <ul className="space-y-1">
                      {business.deals.map((deal, i) => (
                        <li key={i} className="text-sm flex items-start">
                          <div className="h-4 w-4 rounded-full bg-mansagold/20 text-mansagold flex items-center justify-center text-xs shrink-0 mt-0.5 mr-2">✓</div>
                          {deal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {business.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/business/${business.id}`}>View Business</Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-6 py-2 rounded-md" asChild>
            <Link to="/directory" className="inline-flex items-center">
              Explore All Businesses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 text-sm text-gray-500">
            Our recommendation engine gets smarter the more you use the app
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;
