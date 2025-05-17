
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface LoyaltyHistoryEntry {
  id: string;
  date: string;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
  businessId?: string;
  businessName?: string;
}

interface LoyaltyTier {
  name: string;
  minimumPoints: number;
  maximumPoints: number | null;
  benefits: string[];
}

export const useLoyalty = () => {
  const { user } = useAuth();
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [pointsHistory, setPointsHistory] = useState<LoyaltyHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableRewards, setAvailableRewards] = useState<any[]>([]);
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [nextRewardThreshold, setNextRewardThreshold] = useState<number>(0);
  
  // Define loyalty tiers
  const loyaltyTiers: LoyaltyTier[] = [
    { name: 'Bronze', minimumPoints: 0, maximumPoints: 999, benefits: ['Basic rewards access'] },
    { name: 'Silver', minimumPoints: 1000, maximumPoints: 4999, benefits: ['5% bonus points', 'Early access to promotions'] },
    { name: 'Gold', minimumPoints: 5000, maximumPoints: 14999, benefits: ['10% bonus points', 'Priority customer support'] },
    { name: 'Platinum', minimumPoints: 15000, maximumPoints: null, benefits: ['15% bonus points', 'VIP events', 'Exclusive rewards'] }
  ];
  
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchLoyaltyData = async () => {
      setIsLoading(true);
      try {
        // Fetch loyalty points
        const { data: pointsData, error: pointsError } = await supabase
          .from('loyalty_points')
          .select('total_points')
          .eq('user_id', user.id)
          .single();
        
        if (pointsError && pointsError.code !== 'PGRST116') {
          console.error('Error fetching loyalty points:', pointsError);
        }
        
        const totalPoints = pointsData?.total_points || 0;
        setLoyaltyPoints(totalPoints);
        
        // Determine current tier
        const tier = loyaltyTiers.find(
          t => totalPoints >= t.minimumPoints && 
               (t.maximumPoints === null || totalPoints <= t.maximumPoints)
        );
        setCurrentTier(tier?.name || 'Bronze');
        
        // Determine next reward threshold
        const currentTierIndex = loyaltyTiers.findIndex(t => t.name === tier?.name);
        if (currentTierIndex < loyaltyTiers.length - 1) {
          setNextRewardThreshold(loyaltyTiers[currentTierIndex + 1].minimumPoints);
        } else {
          // If at highest tier, set next milestone at 5000 point increments
          setNextRewardThreshold(Math.ceil(totalPoints / 5000) * 5000);
        }
        
        // Fetch loyalty history
        const { data: historyData, error: historyError } = await supabase
          .from('loyalty_transactions')
          .select(`
            id,
            points,
            transaction_date,
            transaction_type,
            description,
            business_id,
            businesses(name)
          `)
          .eq('user_id', user.id)
          .order('transaction_date', { ascending: false })
          .limit(20);
        
        if (historyError) {
          console.error('Error fetching loyalty history:', historyError);
        }
        
        if (historyData) {
          const formattedHistory: LoyaltyHistoryEntry[] = historyData.map((item: any) => ({
            id: item.id,
            points: item.points,
            date: item.transaction_date,
            type: item.transaction_type === 'credit' ? 'earned' : 'redeemed',
            description: item.description,
            businessId: item.business_id,
            businessName: item.businesses?.name
          }));
          
          setPointsHistory(formattedHistory);
        }
        
        // Fetch available rewards
        const { data: rewardsData, error: rewardsError } = await supabase
          .from('rewards')
          .select('*')
          .lte('points_required', totalPoints)
          .eq('active', true)
          .order('points_required', { ascending: true });
        
        if (rewardsError) {
          console.error('Error fetching rewards:', rewardsError);
        }
        
        setAvailableRewards(rewardsData || []);
      } catch (error) {
        console.error('Error in loyalty hook:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoyaltyData();
  }, [user]);
  
  return {
    loyaltyPoints,
    pointsHistory,
    isLoading,
    availableRewards,
    currentTier,
    nextRewardThreshold,
    loyaltyTiers
  };
};
