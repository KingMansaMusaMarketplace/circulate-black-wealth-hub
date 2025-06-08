
import { useState, useEffect } from 'react';
import { CommunityActivity } from '../types/activity';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export const useCommunityActivity = (limit: number = 10) => {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll create mock data based on recent transactions
      // In a real implementation, you'd have a dedicated activities table
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select(`
          *,
          businesses (
            business_name
          ),
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (transactionError) throw transactionError;

      // Transform transactions into activity feed items
      const activityItems: CommunityActivity[] = (transactions || []).map(transaction => {
        let activityType: CommunityActivity['type'] = 'qr_scan';
        let description = '';

        switch (transaction.transaction_type) {
          case 'scan':
            activityType = 'qr_scan';
            break;
          case 'redemption':
            activityType = 'reward_redemption';
            break;
          case 'review':
            activityType = 'review';
            break;
          default:
            activityType = 'qr_scan';
        }

        return {
          id: transaction.id,
          type: activityType,
          user_id: transaction.customer_id,
          user_name: transaction.profiles?.full_name || 'Community Member',
          business_id: transaction.business_id,
          business_name: transaction.businesses?.business_name || 'Local Business',
          points_earned: transaction.points_earned,
          amount: transaction.amount,
          created_at: transaction.created_at,
          description
        };
      });

      // Add some mock community milestones for demonstration
      const now = new Date();
      const mockMilestones: CommunityActivity[] = [
        {
          id: 'milestone-1',
          type: 'community_goal',
          user_id: 'community',
          user_name: 'Mansa Musa Community',
          description: '$50,000 circulated in Black-owned businesses this month!',
          created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
        {
          id: 'milestone-2',
          type: 'milestone',
          user_id: 'user-example',
          user_name: 'Sarah Johnson',
          description: '100 QR code scans completed',
          points_earned: 500,
          created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        }
      ];

      // Combine and sort all activities
      const allActivities = [...activityItems, ...mockMilestones]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);

      setActivities(allActivities);
    } catch (err: any) {
      console.error('Error fetching community activity:', err);
      setError(err.message || 'Failed to load community activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  // Set up real-time subscription for new activities
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('community-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, limit]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
};
