import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FilterOptions } from './use-directory-search';

interface ParsedQuery {
  searchTerm: string;
  category?: string;
  distance?: number;
  priceRange?: string;
  features?: string[];
  rating?: number;
  discount?: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

export const useNaturalLanguageSearch = () => {
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseQuery = async (
    query: string, 
    userLocation?: LocationData | null
  ): Promise<{ searchTerm: string; filters: FilterOptions } | null> => {
    // If query is very short (1-2 words), skip NL parsing
    if (query.trim().split(/\s+/).length <= 2) {
      return {
        searchTerm: query,
        filters: {}
      };
    }

    try {
      setParsing(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('parse-search-query', {
        body: { 
          query,
          userLocation: userLocation ? {
            city: userLocation.city,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          } : null
        }
      });

      if (functionError) {
        console.error('Error parsing query:', functionError);
        setError('Failed to parse search query');
        return {
          searchTerm: query,
          filters: {}
        };
      }

      const parsed: ParsedQuery = data.parsed;

      // Convert parsed data to FilterOptions
      const filters: FilterOptions = {};
      
      if (parsed.category) {
        filters.category = parsed.category;
      }
      
      if (parsed.distance) {
        filters.distance = parsed.distance;
      }
      
      if (parsed.rating) {
        filters.minRating = parsed.rating;
      }
      
      if (parsed.discount) {
        filters.minDiscount = 1; // Any discount
      }

      return {
        searchTerm: parsed.searchTerm,
        filters
      };

    } catch (err) {
      console.error('Unexpected error parsing query:', err);
      setError('An error occurred while parsing your search');
      return {
        searchTerm: query,
        filters: {}
      };
    } finally {
      setParsing(false);
    }
  };

  return {
    parseQuery,
    parsing,
    error
  };
};
