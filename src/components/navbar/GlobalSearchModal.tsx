import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Clock, TrendingUp, Star, MapPin } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { searchBusinesses } from '@/lib/api/directory/search-businesses';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useDebounce } from '@/hooks/use-debounce';
import { Business } from '@/types/business';

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  
  const { searchHistory, addToSearchHistory, getPopularSearches } = useSearchHistory();
  const popularSearches = getPopularSearches();
  
  // Check if query is complex enough for AI parsing (3+ words)
  const isAIQuery = query.trim().split(/\s+/).length >= 3;

  // Search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchBusinesses(debouncedQuery);
        setResults(searchResults.slice(0, 6)); // Limit to 6 results in modal
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Reset query when modal closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  const handleSelect = useCallback((businessId: string, businessName: string) => {
    addToSearchHistory(businessName);
    onOpenChange(false);
    navigate(`/business/${businessId}`);
  }, [navigate, onOpenChange, addToSearchHistory]);

  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      addToSearchHistory(query.trim());
    }
    onOpenChange(false);
    navigate(`/directory${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ''}`);
  }, [navigate, onOpenChange, query, addToSearchHistory]);

  const handleRecentSearch = useCallback((term: string) => {
    setQuery(term);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          placeholder="Search businesses, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isAIQuery && (
          <Badge variant="secondary" className="ml-2 gap-1 shrink-0">
            <Sparkles className="h-3 w-3" />
            AI
          </Badge>
        )}
      </div>
      <CommandList>
        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <div className="animate-pulse">Searching...</div>
          </div>
        ) : query.trim() && results.length === 0 ? (
          <CommandEmpty>No businesses found.</CommandEmpty>
        ) : null}

        {/* Search Results */}
        {results.length > 0 && (
          <CommandGroup heading="Businesses">
            {results.map((business) => (
              <CommandItem
                key={business.id}
                value={business.name}
                onSelect={() => handleSelect(business.id, business.name)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{business.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {business.category && (
                      <span className="truncate">{business.category}</span>
                    )}
                    {business.rating && (
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {business.rating.toFixed(1)}
                      </span>
                    )}
                    {business.city && (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {business.city}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
            <CommandItem
              onSelect={handleViewAll}
              className="justify-center text-primary cursor-pointer"
            >
              View all results →
            </CommandItem>
          </CommandGroup>
        )}

        {/* Recent Searches */}
        {!query.trim() && searchHistory.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Searches">
              {searchHistory.slice(0, 5).map((item, index) => (
                <CommandItem
                  key={`${item.search_term}-${index}`}
                  value={item.search_term}
                  onSelect={() => handleRecentSearch(item.search_term)}
                  className="cursor-pointer"
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {item.search_term}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Popular Searches */}
        {!query.trim() && popularSearches.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Popular">
              {popularSearches.map((term, index) => (
                <CommandItem
                  key={`popular-${index}`}
                  value={term}
                  onSelect={() => handleRecentSearch(term)}
                  className="cursor-pointer"
                >
                  <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  {term}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Quick Actions */}
        {!query.trim() && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              <CommandItem
                onSelect={handleViewAll}
                className="cursor-pointer"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse all businesses
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
      
      {/* Footer with keyboard hint */}
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
        <span>Search businesses in your community</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </CommandDialog>
  );
};

export default GlobalSearchModal;
