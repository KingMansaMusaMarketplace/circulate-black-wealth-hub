import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComparisonFeatures {
  services: string;
  pricing: string;
  experience: string;
  location: string;
}

interface BestFor {
  businessName: string;
  useCase: string;
  reason: string;
}

interface BusinessComparison {
  summary: string;
  comparison: ComparisonFeatures;
  bestFor: BestFor[];
  valueAnalysis: string;
  recommendation: string;
}

interface ComparisonResult {
  businesses: any[];
  comparison: BusinessComparison;
}

export const useBusinessComparison = () => {
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  const compareBusinesses = async (businessIds: string[]) => {
    if (businessIds.length < 2) {
      toast.error('Select at least 2 businesses to compare');
      return;
    }

    if (businessIds.length > 4) {
      toast.error('You can compare up to 4 businesses at a time');
      return;
    }

    setIsComparing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('compare-businesses', {
        body: { businessIds }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate comparison');
      }

      setComparisonResult(data);
      toast.success('Business comparison generated!');
      return data;
    } catch (error) {
      console.error('Error comparing businesses:', error);
      toast.error('Failed to generate comparison');
      return null;
    } finally {
      setIsComparing(false);
    }
  };

  const clearComparison = () => {
    setComparisonResult(null);
  };

  return {
    isComparing,
    comparisonResult,
    compareBusinesses,
    clearComparison
  };
};
