import React, { useState, useEffect, useCallback } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Search, User, Building2, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  type: 'user' | 'business' | 'transaction';
  title: string;
  subtitle: string;
}

interface GlobalSearchProps {
  onTabChange: (tab: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onTabChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setOpen(true);
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    searchAll(debouncedQuery);
  }, [debouncedQuery]);

  const searchAll = async (searchQuery: string) => {
    setLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .limit(5);

      users?.forEach(user => {
        searchResults.push({
          id: user.id,
          type: 'user',
          title: user.full_name || user.email || 'Unknown User',
          subtitle: user.email || '',
        });
      });

      // Search businesses
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, business_name, category')
        .or(`business_name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(5);

      businesses?.forEach(business => {
        searchResults.push({
          id: business.id,
          type: 'business',
          title: business.business_name,
          subtitle: business.category || 'Business',
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    
    switch (result.type) {
      case 'user':
        onTabChange('users');
        break;
      case 'business':
        onTabChange('businesses');
        break;
      case 'transaction':
        onTabChange('financials');
        break;
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4 text-blue-400" />;
      case 'business': return <Building2 className="h-4 w-4 text-green-400" />;
      case 'transaction': return <FileText className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="text-blue-200 hover:text-white hover:bg-white/10 gap-2"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline text-sm">Search all...</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center rounded border border-white/20 bg-white/10 px-1.5 text-[10px] font-medium text-blue-200">
          /
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search users, businesses, transactions..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          )}
          
          {!loading && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          )}
          
          {!loading && query.length < 2 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search...
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.filter(r => r.type === 'user').length > 0 && (
                <CommandGroup heading="Users">
                  {results.filter(r => r.type === 'user').map(result => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      {getIcon(result.type)}
                      <div className="ml-2 flex-1">
                        <p className="text-sm font-medium">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.filter(r => r.type === 'business').length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Businesses">
                    {results.filter(r => r.type === 'business').map(result => (
                      <CommandItem
                        key={result.id}
                        onSelect={() => handleSelect(result)}
                        className="cursor-pointer"
                      >
                        {getIcon(result.type)}
                        <div className="ml-2 flex-1">
                          <p className="text-sm font-medium">{result.title}</p>
                          <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
