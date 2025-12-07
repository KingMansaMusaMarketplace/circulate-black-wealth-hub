
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import DirectoryFilter from '@/components/DirectoryFilter';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';

const MapView = React.lazy(() => import('@/components/MapView'));
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Grid3X3, List, Sparkles } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { businesses } from '@/data/businessData';
import { useDirectorySearch } from '@/hooks/use-directory-search';
import { BusinessLocation } from '@/components/MapView/types';

const BusinessDirectoryPage: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  
  const {
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    categories,
    filteredBusinesses,
    mapData
  } = useDirectorySearch(businesses);

  const mapViewBusinesses: BusinessLocation[] = mapData;

  const handleSelectBusiness = (id: string) => {
    console.log('Selected business:', id);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-b from-mansablue-dark via-mansablue to-mansablue-dark">
      {/* Premium ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      
      <Helmet>
        <title>Business Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Discover and support Black-owned businesses. Browse 2,500+ verified businesses in the Mansa Musa Marketplace directory." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-6">
              <Sparkles className="w-4 h-4 text-mansagold" />
              <span className="text-sm font-medium text-mansagold">2,500+ Verified Businesses</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-white">Discover </span>
            <span className="text-gradient-gold">Black-Owned</span>
            <br />
            <span className="text-white">Businesses</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Support economic circulation by shopping at verified Black-owned businesses in your community
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
            <Input
              type="text" 
              placeholder="Search for businesses, products, or services..."
              className="pl-12 h-14 bg-slate-900/60 backdrop-blur-xl rounded-xl w-full border border-white/20 text-white placeholder:text-blue-200/50 focus:border-mansagold/50 focus:ring-2 focus:ring-mansagold/20 shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="flex-grow relative z-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <motion.div 
              className="w-full lg:w-72 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sticky top-24">
                <DirectoryFilter 
                  categories={categories}
                  filterOptions={filterOptions}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </motion.div>
            
            {/* Results */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* View Toggle */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-blue-200/80">
                  <span className="font-semibold text-white">{filteredBusinesses.length}</span> businesses found
                </span>
                
                <div className="flex items-center gap-2">
                  {[
                    { id: 'grid', icon: Grid3X3, label: 'Grid' },
                    { id: 'list', icon: List, label: 'List' },
                    { id: 'map', icon: MapPin, label: 'Map' },
                  ].map((viewOption) => (
                    <Button 
                      key={viewOption.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setView(viewOption.id as 'grid' | 'list' | 'map')}
                      className={`${
                        view === viewOption.id 
                          ? 'bg-mansagold text-mansablue-dark hover:bg-mansagold-dark' 
                          : 'text-blue-200/70 hover:text-white hover:bg-white/10'
                      }`}
                      aria-label={`${viewOption.label} view`}
                      aria-pressed={view === viewOption.id}
                    >
                      <viewOption.icon className="h-4 w-4 mr-1.5" />
                      {viewOption.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Content Views */}
              <Tabs value={view} onValueChange={(val) => setView(val as 'grid' | 'list' | 'map')}>
                <TabsContent value="grid" className="mt-0">
                  <BusinessGridView businesses={filteredBusinesses} onSelectBusiness={handleSelectBusiness} />
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <BusinessListView businesses={filteredBusinesses} onSelectBusiness={handleSelectBusiness} />
                </TabsContent>
                <TabsContent value="map" className="mt-0">
                  <div className="h-[600px] rounded-2xl overflow-hidden border border-white/10">
                    <React.Suspense fallback={
                      <div className="flex items-center justify-center h-full bg-slate-900/60">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold mx-auto mb-2" />
                          <p className="text-sm text-blue-200/70">Loading map...</p>
                        </div>
                      </div>
                    }>
                      <MapView businesses={mapViewBusinesses} />
                    </React.Suspense>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDirectoryPage;
