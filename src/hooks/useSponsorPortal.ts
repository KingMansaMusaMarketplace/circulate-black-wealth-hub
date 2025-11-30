import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSponsorPortal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const openPortal = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-sponsor-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        // Open in new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error: any) {
      console.error('Error opening portal:', error);
      toast.error('Failed to open subscription portal', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { openPortal, isLoading };
};
