import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSponsorBenefits = (subscriptionId?: string) => {
  return useQuery({
    queryKey: ['sponsor-benefits', subscriptionId],
    queryFn: async () => {
      if (!subscriptionId) throw new Error('No subscription ID');

      const { data, error } = await supabase
        .from('sponsor_benefits')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!subscriptionId,
  });
};

export const getLogoPlacementsByTier = (tier: string) => {
  const placements = {
    bronze: ['footer'],
    silver: ['footer', 'directory'],
    gold: ['footer', 'directory', 'sidebar'],
    platinum: ['footer', 'directory', 'sidebar', 'homepage', 'banner'],
  };

  return placements[tier as keyof typeof placements] || [];
};
