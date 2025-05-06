
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BusinessCard from '@/components/BusinessCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, MapPin, Sliders } from 'lucide-react';

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock businesses data
  const businesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      discount: "15% off",
      rating: 4.8,
      reviewCount: 124,
      distance: "0.5",
      address: "123 Main St, Atlanta, GA",
      isFeatured: true
    },
    {
      id: 2,
      name: "Prestigious Cuts",
      category: "Barber Shop",
      discount: "10% off",
      rating: 4.9,
      reviewCount: 207,
      distance: "0.7",
      address: "456 Oak Ave, Atlanta, GA"
    },
    {
      id: 3,
      name: "Heritage Bookstore",
      category: "Retail",
      discount: "20% off",
      rating: 4.7,
      reviewCount: 89,
      distance: "1.2",
      address: "789 Elm St, Atlanta, GA"
    },
    {
      id: 4,
      name: "Prosperity Financial",
      category: "Services",
      discount: "Free Consultation",
      rating: 4.9,
      reviewCount: 56,
      distance: "1.5",
      address: "321 Pine Rd, Atlanta, GA",
      isFeatured: true
    },
    {
      id: 5,
      name: "Ebony Crafts",
      category: "Retail",
      discount: "15% off",
      rating: 4.6,
      reviewCount: 42,
      distance: "1.8",
      address: "567 Maple Dr, Atlanta, GA"
    },
    {
      id: 6,
      name: "Glorious Hair Salon",
      category: "Beauty",
      discount: "20% off first visit",
      rating: 4.8,
      reviewCount: 112,
      distance: "2.0",
      address: "890 Cedar Ln, Atlanta, GA"
    },
    {
      id: 7,
      name: "Royal Apparel",
      category: "Fashion",
      discount: "10% off",
      rating: 4.5,
      reviewCount: 78,
      distance: "2.2",
      address: "432 Birch St, Atlanta, GA"
    },
    {
      id: 8,
      name: "Ancestral Art Gallery",
      category: "Arts",
      discount: "15% off",
      rating: 4.9,
      reviewCount: 35,
      distance: "2.5",
      address: "654 Walnut Ave, Atlanta, GA"
    }
  ];
  
  // Filter businesses based on search term and category
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || business.category === category;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = [...new Set(businesses.map(b => b.category))];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-custom py-8">
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
              <div className="w-40">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Sliders size={16} />
                Filters
              </Button>
            </div>
          </div>
          
          {/* Additional filters (hidden by default) */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Distance</label>
                <Select defaultValue="any">
                  <SelectTrigger>
                    <SelectValue placeholder="Any Distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Distance</SelectItem>
                    <SelectItem value="0.5">Within 0.5 miles</SelectItem>
                    <SelectItem value="1">Within 1 mile</SelectItem>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                    <SelectItem value="10">Within 10 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Rating</label>
                <Select defaultValue="any">
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Discount</label>
                <Select defaultValue="any">
                  <SelectTrigger>
                    <SelectValue placeholder="Any Discount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Discount</SelectItem>
                    <SelectItem value="10">10%+ Off</SelectItem>
                    <SelectItem value="15">15%+ Off</SelectItem>
                    <SelectItem value="20">20%+ Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
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
        
        {/* Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} {...business} />
          ))}
        </div>
        
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
