
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LeaderboardUser {
  id: string;
  username: string;
  avatarUrl?: string;
  totalPoints: number;
  rank: number;
  isCurrentUser: boolean;
}

export const useLoyaltyLeaderboard = (limit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch transactions to calculate points per user
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('customer_id, points_earned, points_redeemed');
          
        if (transactionsError) throw transactionsError;
        
        // Get user profiles for display names
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url');
          
        if (profilesError) throw profilesError;
        
        // Calculate total points per user
        const pointsMap = new Map();
        transactions.forEach(tx => {
          const userId = tx.customer_id;
          const points = tx.points_earned - tx.points_redeemed;
          
          if (!pointsMap.has(userId)) {
            pointsMap.set(userId, 0);
          }
          
          pointsMap.set(userId, pointsMap.get(userId) + points);
        });
        
        // Create leaderboard array
        const leaderboardData: LeaderboardUser[] = Array.from(pointsMap.entries())
          .map(([userId, points]) => {
            const profile = profiles.find(p => p.id === userId) || { full_name: 'Anonymous User' };
            return {
              id: userId,
              username: profile.full_name || 'Anonymous User',
              avatarUrl: profile.avatar_url,
              totalPoints: points as number,
              rank: 0, // Will set this after sorting
              isCurrentUser: user && userId === user.id
            };
          })
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, limit);
        
        // Set ranks
        leaderboardData.forEach((user, index) => {
          user.rank = index + 1;
          if (user.isCurrentUser) {
            setUserRank(index + 1);
          }
        });
        
        setLeaderboard(leaderboardData);
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        toast.error('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [limit]);
  
  return { leaderboard, loading, userRank, error };
};
