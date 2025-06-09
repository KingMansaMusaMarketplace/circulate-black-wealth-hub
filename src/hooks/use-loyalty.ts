
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LoyaltySummary {
  totalPoints: number;
  pointsThisMonth: number;
  businessesSupported: number;
  level: string;
}

export const useLoyalty = () => {
  const [summary, setSummary] = useState<LoyaltySummary>({
    totalPoints: 0,
    pointsThisMonth: 0,
    businessesSupported: 0,
    level: 'Bronze'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get total points
      const { data: loyaltyData } = await supabase
        .from('loyalty_points')
        .select('points, business_id')
        .eq('customer_id', user.id);

      if (loyaltyData) {
        const totalPoints = loyaltyData.reduce((sum, item) => sum + item.points, 0);
        const businessesSupported = new Set(loyaltyData.map(item => item.business_id)).size;
        
        // Calculate level based on points
        let level = 'Bronze';
        if (totalPoints >= 1000) level = 'Gold';
        else if (totalPoints >= 500) level = 'Silver';

        setSummary({
          totalPoints,
          pointsThisMonth: Math.floor(totalPoints * 0.3), // Simulate monthly points
          businessesSupported,
          level
        });
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      toast.error('Failed to load loyalty information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  return {
    summary,
    loading,
    refreshData
  };
};
