
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Building2, Search, Filter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businesses } from '@/data/businessData';

const BusinessesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>All Businesses | Mansa Musa Marketplace</title>
        <meta name="description" content="Browse all Black-owned businesses in the Mansa Musa Marketplace" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Building2 className="mr-2 h-6 w-6 text-mansablue" />
                All Businesses
              </h1>
              <p className="text-gray-600 mt-2">
                Discover and support Black-owned businesses in our community
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <Link to="/directory">
                <Button variant="outline" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Map View
                </Button>
              </Link>
              <Button className="bg-mansablue hover:bg-mansablue-dark flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search businesses by name, category, or location..."
                className="pl-10 w-full h-12 rounded-lg border border-gray-200 focus:border-mansablue focus:ring-1 focus:ring-mansablue outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <Link 
                to={`/business/${business.id}`} 
                key={business.id}
                className="block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-36 bg-gray-100 flex items-center justify-center">
                  {business.imageUrl ? (
                    <img 
                      src={business.imageUrl} 
                      alt={business.imageAlt || business.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-300 text-5xl font-bold">{business.name.charAt(0)}</span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{business.name}</h3>
                  <p className="text-sm text-gray-600">{business.category}</p>
                  
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <MapPin size={12} className="mr-1" />
                    <span>{business.address || 'Location not specified'}</span>
                  </div>
                  
                  {business.discount && (
                    <div className="mt-3">
                      <span className="bg-mansagold/10 text-mansagold text-xs font-medium px-2 py-1 rounded">
                        {business.discount} off
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          {businesses.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No businesses found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="mr-2">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BusinessesPage;
