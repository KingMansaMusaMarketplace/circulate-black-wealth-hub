import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIRecommendations = () => {
  const queryClient = useQueryClient();

  // Get current user
  const { data: { user } } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await supabase.auth.getUser(),
  }).data || { data: { user: null } };

  // Fetch cached recommendations from database
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['ai-recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('ai_recommendations')
        .select(`
          *,
          businesses (
            id,
            business_name,
            description,
            category,
            city,
            state,
            logo_url,
            average_rating,
            review_count
          )
        `)
        .eq('user_id', user.id)
        .gte('expires_at', new Date().toISOString())
        .order('recommendation_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Generate new recommendations
  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        toast.error('Please log in to get recommendations');
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('generate-ai-recommendations', {
        body: { userId: user.id }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations'] });
      toast.success('Personalized recommendations generated!');
    },
    onError: (error) => {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    },
  });

  // Mark recommendation as clicked
  const trackClick = async (recommendationId: string) => {
    if (!user?.id) return;

    await supabase
      .from('ai_recommendations')
      .update({
        clicked: true,
        clicked_at: new Date().toISOString(),
        shown_at: new Date().toISOString()
      })
      .eq('id', recommendationId);
  };

  return {
    recommendations: recommendations || [],
    isLoading,
    generating: generateMutation.isPending,
    generateRecommendations: () => generateMutation.mutate(),
    trackClick,
  };
};