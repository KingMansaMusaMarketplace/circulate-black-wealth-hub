
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BusinessCard from '@/components/BusinessCard';
import DirectoryFilter, { FilterOptions } from '@/components/DirectoryFilter';
import MapView from '@/components/MapView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MapPin, 
  Sliders,
  LayoutGrid, 
  List
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'all',
    distance: 0, // 0 means any distance
    rating: 0,   // 0 means any rating
    discount: 0  // 0 means any discount
  });
  
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a search parameter in the URL
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [location]);
  
  // Mock businesses data
  const businesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      discount: "15% off",
      discountValue: 15,
      rating: 4.8,
      reviewCount: 124,
      distance: "0.5",
      distanceValue: 0.5,
      address: "123 Main St, Atlanta, GA",
      lat: 33.748997,
      lng: -84.387985,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop",
      imageAlt: "Delicious soul food with chicken, cornbread, and vegetables"
    },
    {
      id: 2,
      name: "Prestigious Cuts",
      category: "Barber Shop",
      discount: "10% off",
      discountValue: 10,
      rating: 4.9,
      reviewCount: 207,
      distance: "0.7",
      distanceValue: 0.7,
      address: "456 Oak Ave, Atlanta, GA",
      lat: 33.749568,
      lng: -84.391256,
      imageUrl: "https://images.unsplash.com/photo-1599981526814-61649765e2f8?q=80&w=1887&auto=format&fit=crop",
      imageAlt: "Young Black boy getting a haircut at a barber shop"
    },
    {
      id: 3,
      name: "Heritage Bookstore",
      category: "Retail",
      discount: "20% off",
      discountValue: 20,
      rating: 4.7,
      reviewCount: 89,
      distance: "1.2",
      distanceValue: 1.2,
      address: "789 Elm St, Atlanta, GA",
      lat: 33.751234,
      lng: -84.384562,
      imageUrl: "https://images.unsplash.com/photo-1521056787327-965a34d83af7?q=80&w=2070&auto=format&fit=crop",
      imageAlt: "Bookstore with shelves full of diverse books"
    },
    {
      id: 4,
      name: "Prosperity Financial",
      category: "Services",
      discount: "Free Consultation",
      discountValue: 0,
      rating: 4.9,
      reviewCount: 56,
      distance: "1.5",
      distanceValue: 1.5,
      address: "321 Pine Rd, Atlanta, GA",
      lat: 33.753421,
      lng: -84.389754,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=5304&auto=format&fit=crop",
      imageAlt: "Black financial advisor in professional meeting setting"
    },
    {
      id: 5,
      name: "Ebony Crafts",
      category: "Retail",
      discount: "15% off",
      discountValue: 15,
      rating: 4.6,
      reviewCount: 42,
      distance: "1.8",
      distanceValue: 1.8,
      address: "567 Maple Dr, Atlanta, GA",
      lat: 33.746125,
      lng: -84.382369,
      imageUrl: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=2070&auto=format&fit=crop",
      imageAlt: "Handcrafted African-inspired art and crafts"
    },
    {
      id: 6,
      name: "Glorious Hair Salon",
      category: "Beauty",
      discount: "20% off first visit",
      discountValue: 20,
      rating: 4.8,
      reviewCount: 112,
      distance: "2.0",
      distanceValue: 2.0,
      address: "890 Cedar Ln, Atlanta, GA",
      lat: 33.742587,
      lng: -84.386541,
      imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop",
      imageAlt: "Hair stylist working on a client's natural hair"
    },
    {
      id: 7,
      name: "Royal Apparel",
      category: "Fashion",
      discount: "10% off",
      discountValue: 10,
      rating: 4.5,
      reviewCount: 78,
      distance: "2.2",
      distanceValue: 2.2,
      address: "432 Birch St, Atlanta, GA",
      lat: 33.759123,
      lng: -84.392587,
      imageUrl: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2013&auto=format&fit=crop",
      imageAlt: "African-inspired clothing and fashion accessories"
    },
    {
      id: 8,
      name: "Ancestral Art Gallery",
      category: "Arts",
      discount: "15% off",
      discountValue: 15,
      rating: 4.9,
      reviewCount: 35,
      distance: "2.5",
      distanceValue: 2.5,
      address: "654 Walnut Ave, Atlanta, GA",
      lat: 33.747851,
      lng: -84.397456,
      imageUrl: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?q=80&w=2070&auto=format&fit=crop",
      imageAlt: "Gallery displaying African and African-American artwork"
    }
  ];
  
  // Create map data for MapView
  const mapData = businesses.map(b => ({
    id: b.id,
    name: b.name,
    lat: b.lat,
    lng: b.lng,
    category: b.category
  }));
  
  const handleSelectBusiness = (id: number) => {
    const business = businesses.find(b => b.id === id);
    if (business) {
      // Scroll to the business card
      const element = document.getElementById(`business-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the card
        element.classList.add('ring-2', 'ring-mansablue');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-mansablue');
        }, 2000);
      }
    }
  };
  
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };
  
  // Get unique categories
  const categories = [...new Set(businesses.map(b => b.category))];
  
  // Filter businesses based on search term and filters
  const filteredBusinesses = businesses.filter(business => {
    // Search term filter
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filterOptions.category === 'all' || business.category === filterOptions.category;
    
    // Distance filter
    const matchesDistance = filterOptions.distance === 0 || business.distanceValue <= filterOptions.distance;
    
    // Rating filter
    const matchesRating = business.rating >= filterOptions.rating;
    
    // Discount filter
    const matchesDiscount = business.discountValue >= filterOptions.discount;
    
    return matchesSearch && matchesCategory && matchesDistance && matchesRating && matchesDiscount;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container-custom py-8">
        <div className="mb-10">
          <h1 className="heading-lg text-mansablue mb-4">Business Directory</h1>
          <p className="text-gray-600 max-w-2xl">
            Discover and support Black-owned businesses in your area. Each scan earns you loyalty points and helps
            circulate wealth within our community.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search businesses by name, category, or location" 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Sliders size={16} />
                Filters
                {showFilters && <Badge variant="outline" className="ml-1">On</Badge>}
              </Button>
              
              <div className="border rounded-md flex">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setViewMode('grid')} 
                  className="rounded-r-none border-r"
                >
                  <LayoutGrid size={16} />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="icon"
                  onClick={() => setViewMode('list')} 
                  className="rounded-l-none"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Map View */}
          <MapView 
            businesses={mapData}
            onSelectBusiness={handleSelectBusiness}
          />
          
          {/* Additional filters */}
          {showFilters && (
            <DirectoryFilter
              categories={categories}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredBusinesses.length} businesses
            </div>
            <div className="flex items-center gap-2 text-sm text-mansablue">
              <MapPin size={16} />
              <span>Atlanta, GA</span>
              <button className="text-xs underline">Change</button>
            </div>
          </div>
        </div>
        
        {/* Businesses Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBusinesses.map((business) => (
              <div key={business.id} id={`business-${business.id}`} className="transition-all duration-300">
                <BusinessCard {...business} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBusinesses.map((business) => (
              <div key={business.id} id={`business-${business.id}`} className="transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-4 border rounded-xl overflow-hidden bg-white">
                  <div className="md:w-1/4 h-40 md:h-auto bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {business.imageUrl ? (
                      <img 
                        src={business.imageUrl} 
                        alt={business.imageAlt || `${business.name} image`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image: ${business.imageUrl}`);
                          e.currentTarget.src = "https://placehold.co/400x300/e0e0e0/808080?text=" + business.name.charAt(0);
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-3xl font-bold">{business.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{business.name}</h3>
                        <p className="text-gray-500 text-sm">{business.category}</p>
                      </div>
                      <div className="bg-mansagold/10 text-mansagold text-xs font-medium px-2.5 py-1 rounded">
                        {business.discount}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-xs mb-3">
                      <MapPin size={14} className="mr-1" />
                      <span>{business.address}</span>
                      <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {business.distance} miles
                      </span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full border-mansablue text-mansablue hover:bg-mansablue hover:text-white">
                      View Business
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-2">No businesses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DirectoryPage;
