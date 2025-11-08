import { supabase } from '@/integrations/supabase/client';

export interface MaterialPerformanceData {
  id: string;
  title: string;
  type: string;
  total_downloads: number;
  unique_agents: number;
  conversions: number;
  conversion_rate: number;
  tier_distribution: Record<string, number>;
  categories: string[];
  tags: string[];
  downloads_per_day: number;
  created_days_ago: number;
}

export interface PerformanceAnalysis {
  summary: {
    total_materials: number;
    total_downloads: number;
    total_conversions: number;
    avg_conversion_rate: string;
  };
  top_performers: MaterialPerformanceData[];
  underperformers: MaterialPerformanceData[];
  ai_insights: string;
  performance_data: MaterialPerformanceData[];
}

export const getMaterialPerformanceAnalysis = async (dateRange: number = 30): Promise<PerformanceAnalysis> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-material-performance', {
      body: { dateRange }
    });

    if (error) {
      console.error('Error fetching material performance analysis:', error);
      throw error;
    }

    return data as PerformanceAnalysis;
  } catch (error) {
    console.error('Failed to get material performance analysis:', error);
    throw error;
  }
};
