import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MarketingMaterial {
  id: string;
  title: string;
  description: string | null;
  material_type: 'flyer' | 'business_card' | 'social_media' | 'email_template' | 'presentation' | 'other';
  file_url: string;
  file_name: string;
  file_size: number | null;
  thumbnail_url: string | null;
  download_count: number;
  created_at: string;
}

export interface TrainingContent {
  id: string;
  title: string;
  description: string | null;
  content_type: 'video' | 'webinar' | 'document' | 'quiz' | 'course';
  content_url: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
  category: string;
  is_required: boolean;
  view_count: number;
  sort_order: number;
  created_at: string;
}

export interface TrainingProgress {
  id: string;
  training_content_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percent: number;
  started_at: string | null;
  completed_at: string | null;
}

export const useAmbassadorResources = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [trainingContent, setTrainingContent] = useState<TrainingContent[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('ambassador_marketing_materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error('Error fetching marketing materials:', err);
      setError('Failed to load marketing materials');
    }
  };

  const fetchTrainingContent = async () => {
    try {
      const { data, error } = await supabase
        .from('ambassador_training_content')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTrainingContent(data || []);
    } catch (err) {
      console.error('Error fetching training content:', err);
      setError('Failed to load training content');
    }
  };

  const fetchTrainingProgress = async (agentId: string) => {
    try {
      const { data, error } = await supabase
        .from('ambassador_training_progress')
        .select('*')
        .eq('sales_agent_id', agentId);

      if (error) throw error;
      setTrainingProgress(data || []);
    } catch (err) {
      console.error('Error fetching training progress:', err);
    }
  };

  const trackDownload = async (materialId: string) => {
    try {
      const { error } = await supabase.rpc('increment_download_count', { material_id: materialId });
      if (error) {
        // Fallback: just update directly if RPC doesn't exist
        await supabase
          .from('ambassador_marketing_materials')
          .update({ download_count: materials.find(m => m.id === materialId)?.download_count ?? 0 + 1 })
          .eq('id', materialId);
      }
    } catch (err) {
      console.error('Error tracking download:', err);
    }
  };

  const updateTrainingProgress = async (
    agentId: string,
    contentId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    progressPercent: number = 0
  ) => {
    try {
      const existingProgress = trainingProgress.find(p => p.training_content_id === contentId);
      
      const updateData: any = {
        status,
        progress_percent: progressPercent,
        updated_at: new Date().toISOString(),
      };

      if (status === 'in_progress' && !existingProgress?.started_at) {
        updateData.started_at = new Date().toISOString();
      }
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.progress_percent = 100;
      }

      if (existingProgress) {
        const { error } = await supabase
          .from('ambassador_training_progress')
          .update(updateData)
          .eq('id', existingProgress.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ambassador_training_progress')
          .insert({
            sales_agent_id: agentId,
            training_content_id: contentId,
            ...updateData,
          });
        if (error) throw error;
      }

      await fetchTrainingProgress(agentId);
    } catch (err) {
      console.error('Error updating training progress:', err);
    }
  };

  const getContentProgress = (contentId: string): TrainingProgress | undefined => {
    return trainingProgress.find(p => p.training_content_id === contentId);
  };

  const getCompletedCount = (): number => {
    return trainingProgress.filter(p => p.status === 'completed').length;
  };

  const getTotalRequiredCount = (): number => {
    return trainingContent.filter(c => c.is_required).length;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMaterials(), fetchTrainingContent()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    materials,
    trainingContent,
    trainingProgress,
    loading,
    error,
    trackDownload,
    updateTrainingProgress,
    getContentProgress,
    getCompletedCount,
    getTotalRequiredCount,
    fetchTrainingProgress,
    refetch: async () => {
      await Promise.all([fetchMaterials(), fetchTrainingContent()]);
    },
  };
};
