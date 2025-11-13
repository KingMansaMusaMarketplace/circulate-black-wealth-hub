import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ParsedSearchQuery {
  searchTerm: string;
  category?: string | null;
  distance?: number | null;
  priceRange?: '$' | '$$' | '$$$' | '$$$$' | null;
  features?: string[];
  rating?: number | null;
  discount?: boolean;
}

export interface SemanticSearchResult {
  originalQuery: string;
  parsed: ParsedSearchQuery;
}

export const useSemanticSearch = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [lastParsedQuery, setLastParsedQuery] = useState<SemanticSearchResult | null>(null);

  const parseSearchQuery = async (
    query: string,
    userLocation?: { city?: string; state?: string } | null
  ): Promise<ParsedSearchQuery | null> => {
    if (!query || query.trim().length === 0) {
      return null;
    }

    setIsParsing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('parse-search-query', {
        body: { 
          query: query.trim(),
          userLocation 
        }
      });

      if (error) {
        console.error('Semantic search error:', error);
        toast.error('Search parsing failed, using basic search');
        return null;
      }

      if (!data || !data.parsed) {
        console.error('Invalid response from parse-search-query');
        return null;
      }

      setLastParsedQuery(data);
      return data.parsed;

    } catch (error) {
      console.error('Error parsing search query:', error);
      toast.error('Search parsing failed, using basic search');
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  const clearLastParsed = () => {
    setLastParsedQuery(null);
  };

  return {
    parseSearchQuery,
    isParsing,
    lastParsedQuery,
    clearLastParsed
  };
};
