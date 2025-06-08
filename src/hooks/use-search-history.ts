
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SearchHistoryItem {
  id?: string;
  user_id: string;
  search_term: string;
  category?: string;
  location?: string;
  results_count: number;
  searched_at: string;
}

export const useSearchHistory = () => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const loadSearchHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('searched_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      setSearchHistory(data || []);
    } catch (error) {
      console.error('Error loading search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToSearchHistory = async (
    searchTerm: string,
    category?: string,
    location?: string,
    resultsCount: number = 0
  ) => {
    if (!user || !searchTerm.trim()) return;

    try {
      const searchItem: Omit<SearchHistoryItem, 'id'> = {
        user_id: user.id,
        search_term: searchTerm.trim(),
        category,
        location,
        results_count: resultsCount,
        searched_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('search_history')
        .insert(searchItem);

      if (error) throw error;

      // Add to local state
      setSearchHistory(prev => [
        { ...searchItem, searched_at: new Date().toISOString() },
        ...prev.slice(0, 19) // Keep only 20 items
      ]);
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const getPopularSearches = () => {
    const searchCounts = searchHistory.reduce((acc, item) => {
      acc[item.search_term] = (acc[item.search_term] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([term]) => term);
  };

  return {
    searchHistory,
    loading,
    addToSearchHistory,
    clearSearchHistory,
    loadSearchHistory,
    getPopularSearches
  };
};
