import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BusinessRecommendation {
  businessId: string;
  businessName: string;
  category: string;
  matchScore: number;
  reason: string;
  expectedExperience: string;
  recommendationType: 'trending' | 'personalized' | 'nearby' | 'similar' | 'new' | 'seasonal';
}

export interface AIRecommendations {
  recommendations: BusinessRecommendation[];
  summary: string;
  confidence: number;
}

export const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async (userId?: string) => {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to get personalized recommendations');
        return;
      }
      userId = user.id;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-recommendations', {
        body: { userId }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to generate recommendations');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendations(data);
      toast.success('AI recommendations generated successfully!');
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI recommendations';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error generating AI recommendations:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearRecommendations = () => {
    setRecommendations(null);
    setError(null);
  };

  return {
    recommendations,
    isGenerating,
    error,
    generateRecommendations,
    clearRecommendations
  };
};