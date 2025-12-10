import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  story_type: 'user' | 'business' | 'community';
  metrics: {
    before?: string;
    after?: string;
    impact?: string;
  };
  image_url?: string;
  is_featured: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  content: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  businesses?: {
    business_name: string;
  };
}

export interface CommunityMetrics {
  total_users: number;
  total_businesses: number;
  total_wealth_circulated: number;
  jobs_supported: number;
  active_this_week: number;
}

export const useSocialProof = () => {
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialProofData();
  }, []);

  const fetchSocialProofData = async () => {
    try {
      setLoading(true);

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch community metrics using RPC to bypass RLS
      const [platformStats, transactionsSum, activeUsersData] = await Promise.all([
        supabase.rpc('get_platform_stats'),
        supabase.from('transactions').select('amount').gte('transaction_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('activity_log').select('user_id').gte('created_at', oneWeekAgo)
      ]);

      const totalWealth = transactionsSum.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      const uniqueActiveUsers = new Set(activeUsersData.data?.map(a => a.user_id) || []).size;

      const totalUsers = platformStats.data?.total_members || 0;
      const totalBusinesses = platformStats.data?.total_businesses || 0;

      setMetrics({
        total_users: totalUsers,
        total_businesses: totalBusinesses,
        total_wealth_circulated: totalWealth,
        jobs_supported: Math.floor(totalBusinesses * 2.5),
        active_this_week: uniqueActiveUsers
      });

      // Fetch success stories
      const { data: stories } = await supabase
        .from('success_stories')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      setSuccessStories(stories || []);

      // Fetch testimonials
      const { data: testimonialData } = await supabase
        .from('testimonials')
        .select(`
          *,
          profiles!testimonials_user_id_fkey(full_name, avatar_url),
          businesses(business_name)
        `)
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(12);

      setTestimonials(testimonialData || []);

    } catch (error) {
      console.error('Error fetching social proof data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    successStories,
    testimonials,
    loading,
    refetch: fetchSocialProofData
  };
};
