import { supabase } from '@/integrations/supabase/client';

export interface MaterialRecommendation {
  id: string;
  title: string;
  type: string;
  file_url: string;
  thumbnail_url: string | null;
  description: string | null;
  download_count: number;
  categories: string[];
  tags: string[];
  recommendation_reason: string;
}

export interface RecommendationsResponse {
  recommendations: MaterialRecommendation[];
}

export const getMaterialRecommendations = async (userId: string): Promise<MaterialRecommendation[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-material-recommendations', {
      body: { userId }
    });

    if (error) {
      console.error('Error fetching material recommendations:', error);
      throw error;
    }

    return data?.recommendations || [];
  } catch (error) {
    console.error('Failed to get material recommendations:', error);
    return [];
  }
};
