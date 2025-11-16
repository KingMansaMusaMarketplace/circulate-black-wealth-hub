import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, MapPin, Star, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCard } from '@/components/business/discovery/BusinessCard';
import { BusinessFilters } from '@/components/business/discovery/BusinessFilters';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Business {
  id: string;
  business_name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  banner_url: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
}

const BusinessDiscoveryPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'all',
    'Restaurant', 
    'Retail', 
    'Services', 
    'Beauty', 
    'Technology', 
    'Healthcare', 
    'Education',
    'Other'
  ];

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
      setFilteredBusinesses(data || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    let filtered = businesses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(business => 
        business.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    // Rating filter
    if (selectedRating !== 'all') {
      const minRating = parseInt(selectedRating);
      filtered = filtered.filter(business => business.average_rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.review_count - a.review_count);
        break;
      case 'verified':
        filtered.sort((a, b) => Number(b.is_verified) - Number(a.is_verified));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchQuery, selectedCategory, selectedRating, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Discover Black-Owned Businesses | Mansa Musa Marketplace</title>
        <meta name="description" content="Find and support amazing Black-owned businesses in your community. Browse restaurants, services, retail stores and more." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[32rem] h-[32rem] bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-rose-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Discover Amazing <span className="text-yellow-300">Black-Owned</span> Businesses
              </h1>
              <p className="text-2xl text-white/95 max-w-2xl mx-auto font-medium">
                Support your community while finding incredible services, products, and experiences 🌟
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-pink-400/30 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 h-6 w-6" />
                      <Input
                        placeholder="Search businesses, categories, or locations... 🔍"
                        style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-14 h-14 rounded-2xl text-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-52 h-14 rounded-2xl border-2 border-purple-200 text-lg font-medium">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="h-14 px-8 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white rounded-2xl shadow-xl border-0 text-lg font-semibold">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="border-b bg-white/95 backdrop-blur sticky top-0 z-40 shadow-lg relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-purple-600" />
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-36 border-2 border-purple-200 font-medium">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="2">2+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 border-2 border-purple-200 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="verified">Verified First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-900">
                  {filteredBusinesses.length} businesses found 🎯
                </span>
                <div className="flex items-center border-2 border-purple-200 rounded-xl p-1 bg-purple-50">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-10 w-10 p-0 rounded-lg ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : ''}`}
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-10 w-10 p-0 rounded-lg ${viewMode === 'list' ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' : ''}`}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Listings */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-rose-400/30 rounded-3xl blur-xl"></div>
                <Alert className="max-w-md mx-auto bg-white/95 backdrop-blur-sm border-2 border-purple-200 relative shadow-xl">
                  <AlertDescription className="text-lg text-gray-700">
                    {businesses.length === 0 
                      ? "No businesses have joined yet. Be the first to list your business! 🚀"
                      : "No businesses match your search criteria. Try adjusting your filters. 🔍"
                    }
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in' 
              : 'space-y-4 animate-fade-in'
            }>
              {filteredBusinesses.map((business) => (
                <BusinessCard 
                  key={business.id} 
                  business={business} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessDiscoveryPage;