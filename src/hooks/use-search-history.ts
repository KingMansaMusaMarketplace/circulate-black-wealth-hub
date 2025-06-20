
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

  return {
    searchHistory,
    addToSearchHistory
  };
}
