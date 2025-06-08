
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, TrendingUp } from 'lucide-react';
import { useSearchHistory } from '@/hooks/use-search-history';

interface SearchSuggestionsProps {
  onSearchSelect: (term: string) => void;
  onClose?: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSearchSelect,
  onClose
}) => {
  const { searchHistory, clearSearchHistory, getPopularSearches } = useSearchHistory();
  
  const recentSearches = searchHistory.slice(0, 5);
  const popularSearches = getPopularSearches();

  const handleSearchClick = (term: string) => {
    onSearchSelect(term);
    onClose?.();
  };

  if (searchHistory.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No search history yet</p>
        <p className="text-xs mt-1">Start searching to see suggestions here</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Recent Searches
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearchHistory}
              className="h-6 px-2 text-xs"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <button
                key={`${search.search_term}-${index}`}
                onClick={() => handleSearchClick(search.search_term)}
                className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm">{search.search_term}</div>
                {search.category && (
                  <div className="text-xs text-gray-500 mt-1">
                    in {search.category}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {popularSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Popular
          </h3>
          <div className="flex flex-wrap gap-1">
            {popularSearches.map((term) => (
              <Badge
                key={term}
                variant="outline"
                className="cursor-pointer hover:bg-mansablue hover:text-white transition-colors"
                onClick={() => handleSearchClick(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
