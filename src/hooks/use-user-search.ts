import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SearchedUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export const useUserSearch = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query: string) => {
    if (!user || !query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .neq('id', user.id) // Exclude current user
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    loading,
    searchUsers,
    clearSearch
  };
};
