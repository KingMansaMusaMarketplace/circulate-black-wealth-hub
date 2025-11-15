import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductDescriptionResult {
  description: string;
  suggestedTags: string[];
  keyFeatures: string[];
  targetAudience: string;
  seoKeywords: string[];
}

export const useProductDescription = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDescription = async (params: {
    productName: string;
    category?: string;
    price?: string;
    businessContext?: any;
    imageUrl?: string;
  }): Promise<ProductDescriptionResult | null> => {
    if (!params.productName) {
      toast.error('Product name is required');
      return null;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-description', {
        body: params
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate description');
      }

      toast.success('AI description generated!');
      return {
        description: data.description,
        suggestedTags: data.suggestedTags,
        keyFeatures: data.keyFeatures,
        targetAudience: data.targetAudience,
        seoKeywords: data.seoKeywords
      };
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateDescription
  };
};
