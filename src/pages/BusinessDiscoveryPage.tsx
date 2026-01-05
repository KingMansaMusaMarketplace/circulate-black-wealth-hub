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
import { businessCategories } from '@/data/categories';
import { WebSearchSection } from '@/components/business/discovery/WebSearchSection';

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

  // Use comprehensive business categories
  const categories = ['all', ...businessCategories.map(cat => cat.name).sort()];

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

      <div className="min-h-screen relative overflow-hidden">
        {/* Modern dark gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-tr from-blue-700/25 to-mansablue/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue via-blue-800 to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mansablue via-mansagold to-mansablue bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]"></div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Discover Amazing <span className="text-transparent bg-gradient-to-r from-mansagold via-amber-300 to-mansagold bg-clip-text">Black-Owned</span> Businesses
              </h1>
              <p className="text-2xl text-slate-200 max-w-2xl mx-auto font-medium">
                Support your community while finding incredible services, products, and experiences 🌟
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-mansablue via-mansagold to-mansablue rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-7 w-7" />
                      <Input
                        placeholder="Search businesses, categories, or locations... 🔍"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-14 h-16 rounded-2xl text-xl bg-slate-700/50 border-white/10 text-white placeholder:text-slate-400 focus:border-mansablue/50 focus:ring-2 focus:ring-mansablue/20 font-medium"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-56 h-16 rounded-2xl bg-slate-700/50 border-white/10 text-white text-xl font-semibold hover:bg-slate-700/70 transition-colors">
                        <SelectValue>
                          {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10 text-white z-50 max-h-96">
                        {categories.map(category => (
                          <SelectItem key={category} value={category} className="text-lg hover:bg-slate-700 focus:bg-slate-700 text-white">
                            {category === 'all' ? 'All Categories' : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="h-16 px-10 bg-gradient-to-r from-mansablue via-blue-600 to-mansagold hover:from-mansablue hover:via-blue-700 hover:to-mansagold text-white rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] border-0 text-xl font-bold transition-all duration-500 overflow-hidden group/btn relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700">
                      <Search className="h-6 w-6 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="border-b border-white/10 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-mansagold to-mansablue bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]"></div>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-blue-400" />
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-36 bg-slate-700/50 border-white/10 text-white font-medium hover:bg-slate-700/70 transition-colors">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10 text-white">
                      <SelectItem value="all" className="hover:bg-slate-700 focus:bg-slate-700 text-white">All Ratings</SelectItem>
                      <SelectItem value="4" className="hover:bg-slate-700 focus:bg-slate-700 text-white">4+ Stars</SelectItem>
                      <SelectItem value="3" className="hover:bg-slate-700 focus:bg-slate-700 text-white">3+ Stars</SelectItem>
                      <SelectItem value="2" className="hover:bg-slate-700 focus:bg-slate-700 text-white">2+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-300">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-slate-700/50 border-white/10 text-white font-medium hover:bg-slate-700/70 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10 text-white">
                      <SelectItem value="newest" className="hover:bg-slate-700 focus:bg-slate-700 text-white">Newest</SelectItem>
                      <SelectItem value="rating" className="hover:bg-slate-700 focus:bg-slate-700 text-white">Highest Rating</SelectItem>
                      <SelectItem value="reviews" className="hover:bg-slate-700 focus:bg-slate-700 text-white">Most Reviews</SelectItem>
                      <SelectItem value="verified" className="hover:bg-slate-700 focus:bg-slate-700 text-white">Verified First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-300 to-amber-300 bg-clip-text">
                  {filteredBusinesses.length} businesses found 🎯
                </span>
                <div className="flex items-center border border-white/10 rounded-xl p-1 bg-slate-700/30">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-10 w-10 p-0 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansablue hover:to-blue-700 shadow-lg shadow-mansablue/30' : 'hover:bg-slate-700/50 text-slate-400'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-10 w-10 p-0 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-mansagold to-amber-600 hover:from-mansagold hover:to-amber-700 shadow-lg shadow-mansagold/30' : 'hover:bg-slate-700/50 text-slate-400'}`}
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
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-mansablue via-mansagold to-mansablue rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <Alert className="max-w-md mx-auto bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/10 relative shadow-2xl">
                  <AlertDescription className="text-lg text-slate-200">
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
          
          {/* Web Search Section - Find businesses not on platform */}
          <div className="mt-16">
            <WebSearchSection initialQuery={searchQuery} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDiscoveryPage;