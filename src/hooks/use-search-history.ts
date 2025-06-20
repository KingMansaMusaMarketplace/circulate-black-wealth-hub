
import { useState } from 'react';

interface SearchHistoryItem {
  term: string;
  category?: string;
  location?: string;
  resultsCount: number;
  timestamp: Date;
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const addToSearchHistory = (
    term: string,
    category?: string,
    location?: string,
    resultsCount = 0
  ) => {
    const newItem: SearchHistoryItem = {
      term,
      category,
      location,
      resultsCount,
      timestamp: new Date()
    };

    setSearchHistory(prev => [newItem, ...prev.slice(0, 9)]); // Keep last 10 searches
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const getPopularSearches = () => {
    // Get most frequent search terms
    const termCounts = searchHistory.reduce((acc, item) => {
      acc[item.term] = (acc[item.term] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(termCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([term]) => term);
  };

  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    getPopularSearches
  };
}
