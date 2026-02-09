import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, Clock, TrendingUp, Star, MapPin,
  Home, LayoutDashboard, Store, Heart, Gift, QrCode, Users,
  Settings, HelpCircle, BookOpen, MessageCircle, Trophy, LogIn, LogOut
} from 'lucide-react';
import {
  CommandDialog,
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
import { useAuth } from '@/contexts/AuthContext';

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Navigation pages with icons
const navigationPages = [
  { path: '/', label: 'Home', icon: Home, keywords: ['home', 'main', 'start'] },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, keywords: ['dashboard', 'overview', 'stats'] },
  { path: '/directory', label: 'Business Directory', icon: Store, keywords: ['marketplace', 'directory', 'businesses', 'shops', 'stores'] },
  { path: '/impact', label: 'My Impact', icon: Heart, keywords: ['impact', 'contribution', 'community'] },
  { path: '/referrals', label: 'Earn Rewards', icon: Gift, keywords: ['rewards', 'referrals', 'earn', 'bonus'] },
  { path: '/scanner', label: 'QR Scanner', icon: QrCode, keywords: ['qr', 'scanner', 'scan', 'code'] },
  { path: '/loyalty', label: 'Rewards & Loyalty', icon: Trophy, keywords: ['loyalty', 'points', 'rewards'] },
  { path: '/community', label: 'Community', icon: Users, keywords: ['community', 'members', 'network'] },
  { path: '/challenges', label: 'Group Challenges', icon: Trophy, keywords: ['challenges', 'goals', 'group'] },
  { path: '/education', label: 'Education Center', icon: BookOpen, keywords: ['education', 'learn', 'courses', 'training'] },
  { path: '/support', label: 'Support', icon: MessageCircle, keywords: ['support', 'help', 'contact'] },
  { path: '/faq', label: 'FAQ', icon: HelpCircle, keywords: ['faq', 'questions', 'help'] },
  { path: '/settings', label: 'Settings', icon: Settings, keywords: ['settings', 'preferences', 'account'] },
];

// Auth actions
const authActions = {
  login: { path: '/login', label: 'Log In', icon: LogIn, keywords: ['login', 'log in', 'sign in', 'signin', 'authenticate'] },
  logout: { label: 'Log Out', icon: LogOut, keywords: ['logout', 'log out', 'sign out', 'signout', 'exit'] },
};

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  
  const { searchHistory, addToSearchHistory, getPopularSearches } = useSearchHistory();
  const popularSearches = getPopularSearches();
  
  // Check if query is complex enough for AI parsing (3+ words)
  const isAIQuery = query.trim().split(/\s+/).length >= 3;

  // Filter navigation pages based on query
  const filteredPages = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    return navigationPages.filter(page => 
      page.label.toLowerCase().includes(lowerQuery) ||
      page.keywords.some(kw => kw.includes(lowerQuery))
    ).slice(0, 5);
  }, [query]);

  // Filter auth actions based on query
  const filteredAuthActions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    const actions: Array<{ key: string; label: string; icon: typeof LogIn; path?: string }> = [];
    
    // Show login if user is NOT logged in and query matches
    if (!user && authActions.login.keywords.some(kw => kw.includes(lowerQuery))) {
      actions.push({ key: 'login', ...authActions.login });
    }
    
    // Show logout if user IS logged in and query matches
    if (user && authActions.logout.keywords.some(kw => kw.includes(lowerQuery))) {
      actions.push({ key: 'logout', ...authActions.logout });
    }
    
    return actions;
  }, [query, user]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    onOpenChange(false);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [signOut, navigate, onOpenChange]);

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
        setResults(searchResults.slice(0, 5));
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

  const handleSelectBusiness = useCallback((businessId: string, businessName: string) => {
    addToSearchHistory(businessName);
    onOpenChange(false);
    navigate(`/business/${businessId}`);
  }, [navigate, onOpenChange, addToSearchHistory]);

  const handleSelectPage = useCallback((path: string) => {
    onOpenChange(false);
    navigate(path);
  }, [navigate, onOpenChange]);

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

  const hasResults = results.length > 0 || filteredPages.length > 0 || filteredAuthActions.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          placeholder="Search pages, businesses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          autoFocus
        />
        {isAIQuery && (
          <Badge variant="secondary" className="ml-2 gap-1 shrink-0">
            <Sparkles className="h-3 w-3" />
            AI
          </Badge>
        )}
      </div>
      <CommandList>
        {isLoading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <div className="animate-pulse">Searching...</div>
          </div>
        )}
        
        {!isLoading && query.trim() && !hasResults && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        {/* Navigation Pages */}
        {filteredPages.length > 0 && (
          <CommandGroup heading="Pages">
            {filteredPages.map((page) => {
              const IconComponent = page.icon;
              return (
                <CommandItem
                  key={page.path}
                  value={page.label}
                  onSelect={() => handleSelectPage(page.path)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{page.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Auth Actions (Login/Logout) */}
        {filteredAuthActions.length > 0 && (
          <>
            {filteredPages.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Account">
              {filteredAuthActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <CommandItem
                    key={action.key}
                    value={action.label}
                    onSelect={() => {
                      if (action.key === 'logout') {
                        handleLogout();
                      } else if (action.path) {
                        handleSelectPage(action.path);
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {/* Business Results */}
        {results.length > 0 && (
          <>
            {filteredPages.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Businesses">
              {results.map((business) => (
                <CommandItem
                  key={business.id}
                  value={business.name}
                  onSelect={() => handleSelectBusiness(business.id, business.name)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Store className="h-4 w-4 text-primary" />
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
                View all business results →
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* Quick Navigation - shown when no query */}
        {!query.trim() && (
          <CommandGroup heading="Quick Navigation">
            {navigationPages.slice(0, 6).map((page) => {
              const IconComponent = page.icon;
              return (
                <CommandItem
                  key={page.path}
                  value={page.label}
                  onSelect={() => handleSelectPage(page.path)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span>{page.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Recent Searches */}
        {!query.trim() && searchHistory.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Searches">
              {searchHistory.slice(0, 4).map((item, index) => (
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
              {popularSearches.slice(0, 3).map((term, index) => (
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
      </CommandList>
      
      {/* Footer with keyboard hint */}
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
        <span>Search pages & businesses</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </CommandDialog>
  );
};

export default GlobalSearchModal;
