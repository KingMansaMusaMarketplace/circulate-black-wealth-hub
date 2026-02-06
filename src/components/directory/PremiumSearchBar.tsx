import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X, Loader2, Grid3X3, List, SlidersHorizontal, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { Business } from '@/types/business';
import { useNavigate } from 'react-router-dom';
import { searchBusinesses } from '@/lib/api/directory-api';
import { useDebounce } from '@/hooks/use-debounce';

interface PremiumSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list' | 'split';
  setViewMode: (mode: 'grid' | 'list' | 'split') => void;
  showFilters: boolean;
  toggleFilters: () => void;
}

const PremiumSearchBar: React.FC<PremiumSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  setViewMode,
  showFilters,
  toggleFilters
}) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const isNaturalLanguage = debouncedSearchTerm.trim().split(/\s+/).length > 2;

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchBusinesses(debouncedSearchTerm);
          setSearchResults(results.slice(0, 5));
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowResults(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchTerm]);

  const handleClearSearch = () => {
    onSearchChange('');
    setShowResults(false);
  };

  const handleSelectBusiness = (business: Business) => {
    navigate(`/business/${business.id}`);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative max-w-3xl mx-auto mb-12"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Animated glow effect */}
      <div 
        className={`absolute -inset-2 rounded-2xl blur-xl transition-all duration-500 ${
          isFocused 
            ? 'bg-gradient-to-r from-mansagold/40 via-amber-500/30 to-mansagold/40 opacity-100' 
            : 'bg-gradient-to-r from-mansagold/20 via-transparent to-mansagold/20 opacity-50'
        }`}
      />
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 transition-all duration-300 hover:border-mansagold/30">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-mansagold' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder="Search businesses, categories, or try 'best restaurants near me'..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="pl-12 pr-24 h-12 text-base bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            
            {/* AI Badge */}
            <AnimatePresence>
              {isNaturalLanguage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-16 top-1/2 -translate-y-1/2"
                >
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Clear button */}
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {/* Loading indicator */}
            {isSearching && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-mansagold" />
              </div>
            )}
          </div>
        </div>
        
        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
              {searchResults.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectBusiness(business)}
                  className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex items-center gap-3 group"
                >
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                    {business.imageUrl ? (
                      <img 
                        src={business.imageUrl} 
                        alt={business.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-mansagold font-bold">
                        {business.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white group-hover:text-mansagold transition-colors truncate">
                      {business.name}
                    </div>
                    <div className="text-sm text-gray-400">{business.category}</div>
                  </div>
                  {business.isFeatured && (
                    <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30 text-xs">
                      Featured
                    </Badge>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PremiumSearchBar;
