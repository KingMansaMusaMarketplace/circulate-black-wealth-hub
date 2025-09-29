import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface GenerateDescriptionParams {
  businessName: string;
  category: string;
  city?: string;
  state?: string;
  currentDescription?: string;
  businessType?: string;
}

interface GenerateDescriptionResult {
  success: boolean;
  description?: string;
  error?: string;
}

export const useAIBusinessDescription = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateDescription = async (params: GenerateDescriptionParams): Promise<GenerateDescriptionResult> => {
    if (!params.businessName.trim() || !params.category.trim()) {
      toast({
        title: "Missing Information",
        description: "Business name and category are required to generate a description.",
        variant: "destructive",
      });
      return { success: false, error: "Missing required fields" };
    }

    setIsGenerating(true);
    
    try {
      console.log('Calling AI description generation with:', params);
      
      const { data, error } = await supabase.functions.invoke('generate-business-description', {
        body: params
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to call AI service');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'AI service returned unsuccessful result');
      }

      toast({
        title: "Description Generated!",
        description: "AI has created a compelling business description for you.",
      });

      console.log('Successfully generated description:', data.description);
      
      return {
        success: true,
        description: data.description
      };

    } catch (error) {
      console.error('Error generating business description:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Generation Failed",
        description: `Failed to generate description: ${errorMessage}`,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateDescription,
    isGenerating
  };
};