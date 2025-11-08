import { supabase } from '@/integrations/supabase/client';

export interface MaterialAnalytics {
  material_id: string;
  material_title: string;
  material_type: string;
  total_downloads: number;
  unique_agents: number;
  bronze_downloads: number;
  silver_downloads: number;
  gold_downloads: number;
  platinum_downloads: number;
}

export interface DownloadTrend {
  download_date: string;
  download_count: number;
  banner_count: number;
  social_count: number;
  email_count: number;
  document_count: number;
}

export const getMaterialAnalytics = async (
  startDate?: string,
  endDate?: string
): Promise<MaterialAnalytics[]> => {
  const { data, error } = await supabase.rpc('get_material_analytics', {
    p_start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    p_end_date: endDate || new Date().toISOString().split('T')[0]
  });

  if (error) throw error;
  return data || [];
};

export const getDownloadTrends = async (
  startDate?: string,
  endDate?: string
): Promise<DownloadTrend[]> => {
  const { data, error } = await supabase.rpc('get_download_trends', {
    p_start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    p_end_date: endDate || new Date().toISOString().split('T')[0]
  });

  if (error) throw error;
  return data || [];
};

export const trackMaterialDownload = async (materialId: string, userId: string): Promise<void> => {
  const { error } = await supabase.rpc('track_material_download', {
    p_material_id: materialId,
    p_user_id: userId
  });

  if (error) throw error;
};
