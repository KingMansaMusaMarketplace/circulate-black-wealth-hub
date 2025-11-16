
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Building2, Search, Filter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businesses } from '@/data/businessData';
import BusinessCard from '@/components/BusinessCard';

const BusinessesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 16; // Show 16 businesses per page
  
  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBusinesses = filteredBusinesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Debug logging to check if businesses data is available
  console.log(`Total businesses: ${businesses.length}`);
  console.log(`Current page: ${currentPage}, businesses shown: ${currentBusinesses.length}`);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      <Helmet>
        <title>All Businesses | Mansa Musa Marketplace</title>
        <meta name="description" content="Browse all Black-owned businesses in the Mansa Musa Marketplace" />
      </Helmet>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="flex-grow py-12 relative z-10">
        <div className="container mx-auto px-4">
          {/* Enhanced Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center md:justify-start drop-shadow-lg">
                  <Building2 className="mr-3 h-10 w-10 text-yellow-300" />
                  All <span className="text-yellow-300 ml-2">Businesses</span>
                </h1>
                <p className="text-white/95 mt-3 text-lg md:text-xl font-medium">
                  Discover and support Black-owned businesses in our community 🌟
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link to="/directory">
                  <Button variant="outline" className="flex items-center gap-2 bg-white/95 hover:bg-white border-2 border-white/20 shadow-lg backdrop-blur-sm">
                    <MapPin className="h-5 w-5 text-teal-600" /> 
                    <span className="text-teal-600 font-semibold">Map View</span>
                  </Button>
                </Link>
                <Button className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white flex items-center gap-2 shadow-xl border-0">
                  <Filter className="h-5 w-5" /> Filter
                </Button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="relative mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-cyan-400/30 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
              <div className="relative pt-2">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-teal-600" />
                <input 
                  type="text" 
                  placeholder="Search businesses by name, category, or location... 🔍"
                  className="pl-14 w-full h-16 rounded-3xl border-0 focus:ring-4 focus:ring-teal-500/50 outline-none text-gray-900 bg-white text-xl font-body shadow-lg"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentBusinesses.map((business) => (
              <BusinessCard 
                key={business.id}
                id={business.id}
                name={business.name}
                category={business.category}
                rating={business.rating}
                reviewCount={business.reviewCount}
                discount={business.discount}
                address={business.address}
                imageUrl={business.imageUrl}
                imageAlt={business.imageAlt || `${business.name} image`}
              />
            ))}
          </div>
          
          {filteredBusinesses.length === 0 && (
            <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 mb-4">
                <Building2 className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">No businesses found</h3>
              <p className="mt-2 text-lg text-gray-600 max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking for 🔍
              </p>
            </div>
          )}
          
          {filteredBusinesses.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-3 animate-fade-in">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-2 border-teal-200 disabled:opacity-50 text-teal-700 font-semibold"
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    className={currentPage === i + 1 
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-xl font-bold" 
                      : "bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-2 border-teal-200 text-teal-700 font-semibold"}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-2 border-teal-200 disabled:opacity-50 text-teal-700 font-semibold"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BusinessesPage;
