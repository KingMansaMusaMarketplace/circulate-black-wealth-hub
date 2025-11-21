
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
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop",
    location: "Chicago, IL", 
    distance: "0.5 miles away",
    deals: ["Free appetizer with entrée purchase", "10% off first order"],
    tags: ["soul food", "fusion cuisine", "catering"]
  }
];

const PersonalizedRecommendations = () => {
  const businessGradients = [
    'from-mansablue via-blue-600 to-blue-700',
    'from-mansagold via-amber-500 to-yellow-500',
    'from-blue-600 via-blue-700 to-blue-800'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-mansablue-light/10 to-amber-50 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-mansablue/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-mansagold/15 to-amber-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            <span className="bg-gradient-to-r from-mansablue via-blue-600 to-blue-700 bg-clip-text text-transparent">Personalized </span>
            <span className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent">For You</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 mx-auto mb-6 rounded-full"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Star className="h-6 w-6 fill-mansagold text-mansagold animate-pulse" />
            <p className="text-xl font-bold bg-gradient-to-r from-mansablue via-blue-600 to-blue-700 bg-clip-text text-transparent">
              Tailored Business Recommendations
            </p>
          </div>
          <p className="text-lg text-gray-900 max-w-2xl mx-auto font-medium">
            Discover Black-owned businesses personalized to your interests, location, and previous interactions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {recommendedBusinesses.map((business, idx) => (
            <Card key={business.id} className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-${['violet', 'rose', 'amber'][idx]}-300 bg-white/80 backdrop-blur-sm hover:scale-105`}>
              <div className="relative h-52 bg-gray-200 overflow-hidden">
                <img 
                  src={business.image} 
                  alt={`${business.name} - ${business.category}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-amber-200">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-800">{business.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                  <div className={`text-white font-bold text-lg bg-gradient-to-r ${businessGradients[idx]} bg-clip-text text-transparent backdrop-blur-sm`} 
                       style={{ WebkitTextFillColor: 'white' }}>
                    {business.category}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-5">
                <h3 className={`font-bold text-xl mb-3 bg-gradient-to-r ${businessGradients[idx]} bg-clip-text text-transparent`}>
                  {business.name}
                </h3>
                
                <div className="flex items-center text-gray-600 text-sm mb-4 font-medium">
                  <MapPin className="h-5 w-5 mr-2 text-violet-600" />
                  <span>{business.location} • {business.distance}</span>
                </div>
                
                {business.deals.length > 0 && (
                  <div className="mb-4 bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
                    <div className="text-sm font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Current Deals:
                    </div>
                    <ul className="space-y-2">
                      {business.deals.map((deal, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start font-medium">
                          <Tag className="h-4 w-4 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{deal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {business.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r ${businessGradients[idx]} text-white shadow-md hover:scale-110 transition-transform cursor-pointer`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link to={`/business/${business.id}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full font-bold border-2 hover:bg-gradient-to-r ${businessGradients[idx]} hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-lg hover:scale-105`}
                  >
                    View Business <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/directory">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 rounded-xl">
              Explore All Businesses <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <p className="text-gray-700 font-medium mt-6 bg-white/60 backdrop-blur-sm inline-block px-6 py-3 rounded-full border border-violet-200">
            ✨ Our recommendation engine gets smarter the more you use the app
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;
