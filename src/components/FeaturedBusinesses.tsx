
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

// Mock data - in a real app, this would come from your backend
const businesses = [
  {
    id: '1',
    name: 'Green Leaf Cafe',
    category: 'Restaurant',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Organic, locally-sourced ingredients in every dish. Vegan options available.'
  },
  {
    id: '2',
    name: 'Urban Styles',
    category: 'Fashion',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Latest fashion trends at affordable prices. Sustainable clothing options.'
  },
  {
    id: '3',
    name: 'Tech Haven',
    category: 'Electronics',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1518997554305-5eea2f04e384?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Quality tech products, expert advice, and repair services.'
  },
];

const FeaturedBusinesses = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Businesses
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Discover great local businesses in our network
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id} className="overflow-hidden">
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={business.image} 
                  alt={business.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{business.name}</h3>
                    <p className="text-sm text-gray-500">{business.category}</p>
                  </div>
                  <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{business.rating}</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">{business.description}</p>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50">
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  View Business
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/directory')}
          >
            View All Businesses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
