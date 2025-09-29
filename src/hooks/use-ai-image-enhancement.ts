import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QualityAssessment {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  technicalIssues: string[];
}

export interface PricingContext {
  suggestedRange: string;
  reasoning: string;
  competitiveFactors: string[];
}

export interface ImageEnhancement {
  seoAltText: string;
  suggestedTitle: string;
  enhancedDescription: string;
  qualityAssessment: QualityAssessment;
  suggestedTags: string[];
  keywordSuggestions: string[];
  pricingContext: PricingContext;
  marketingAngles: string[];
}

export interface ImageEnhancementResponse {
  success: boolean;
  enhancement: ImageEnhancement | null;
  timestamp: string;
  error?: string;
}

export const useAIImageEnhancement = () => {
  const [enhancement, setEnhancement] = useState<ImageEnhancement | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhanceImage = async (
    imageUrl: string, 
    businessContext: any,
    currentTitle?: string,
    currentDescription?: string
  ) => {
    if (!imageUrl) {
      toast.error('Image URL is required');
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('enhance-image', {
        body: { 
          imageUrl, 
          businessContext,
          currentTitle,
          currentDescription
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to enhance image');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.success || !data.enhancement) {
        throw new Error('No enhancement data received');
      }

      setEnhancement(data.enhancement);
      toast.success('AI image enhancement completed!');
      return data.enhancement;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to enhance image with AI';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error enhancing image:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const clearEnhancement = () => {
    setEnhancement(null);
    setError(null);
  };

  const applyEnhancement = (enhancement: ImageEnhancement) => {
    return {
      title: enhancement.suggestedTitle,
      description: enhancement.enhancedDescription,
      alt_text: enhancement.seoAltText,
      tags: enhancement.suggestedTags.join(', '),
      meta_description: enhancement.enhancedDescription.slice(0, 160),
    };
  };

  return {
    enhancement,
    isEnhancing,
    error,
    enhanceImage,
    clearEnhancement,
    applyEnhancement
  };
};