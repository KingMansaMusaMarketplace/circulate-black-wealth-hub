import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProductImageAnalysis {
  title: string;
  category: string;
  description: string;
  suggestedPrice: string;
  tags: string[];
  altText: string;
  confidence: number;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // strip data: prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const useProductImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = async (
    fileOrUrl: File | string,
    businessContext?: Record<string, unknown>
  ): Promise<ProductImageAnalysis | null> => {
    setIsAnalyzing(true);
    try {
      const body: Record<string, unknown> = { businessContext };
      if (typeof fileOrUrl === 'string') {
        body.imageUrl = fileOrUrl;
      } else {
        body.imageBase64 = await fileToBase64(fileOrUrl);
      }

      const { data, error } = await supabase.functions.invoke('analyze-product-image', { body });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Analysis failed');

      toast.success(`Photo analyzed (${Math.round((data.confidence || 0) * 100)}% confidence)`);
      return data as ProductImageAnalysis;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to analyze photo';
      toast.error(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { isAnalyzing, analyze };
};
