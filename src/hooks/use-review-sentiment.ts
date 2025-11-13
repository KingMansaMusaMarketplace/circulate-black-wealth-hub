import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ReviewSentiment {
  id: string;
  review_id: string;
  business_id: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentiment_score: number;
  confidence_score: number;
  key_themes: string[];
  extracted_topics: Array<{
    topic: string;
    sentiment: string;
    mention: string;
  }>;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  ai_summary: string;
  emotions: Record<string, number>;
  created_at: string;
}

export interface SentimentTrends {
  id: string;
  business_id: string;
  period_start: string;
  period_end: string;
  total_reviews: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  average_sentiment_score: number;
  top_positive_themes: string[];
  top_negative_themes: string[];
  recurring_complaints: string[];
  urgent_issues_count: number;
  ai_insights: string;
}

export const useReviewSentiment = (businessId?: string) => {
  const queryClient = useQueryClient();

  // Fetch sentiment analyses
  const { data: sentiments, isLoading: sentimentsLoading } = useQuery({
    queryKey: ['review-sentiments', businessId],
    queryFn: async () => {
      let query = supabase
        .from('review_sentiment_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as ReviewSentiment[];
    },
    enabled: !!businessId,
  });

  // Fetch sentiment trends
  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['sentiment-trends', businessId],
    queryFn: async () => {
      if (!businessId) return null;

      const { data, error } = await supabase
        .from('business_sentiment_trends')
        .select('*')
        .eq('business_id', businessId)
        .order('period_start', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as SentimentTrends[];
    },
    enabled: !!businessId,
  });

  // Manually trigger sentiment analysis for reviews
  const analyzeSentiment = useMutation({
    mutationFn: async (reviewIds: string[]) => {
      const { data, error } = await supabase.functions.invoke('analyze-review-sentiment', {
        body: { reviewIds }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['review-sentiments'] });
      toast.success(`Analyzed ${data.analyzedCount} review(s)`);
    },
    onError: (error) => {
      console.error('Error analyzing sentiment:', error);
      toast.error('Failed to analyze review sentiment');
    },
  });

  // Update sentiment trends
  const updateTrends = useMutation({
    mutationFn: async ({ businessId, periodDays = 7 }: { businessId: string; periodDays?: number }) => {
      const { data, error } = await supabase.rpc('update_sentiment_trends', {
        p_business_id: businessId,
        p_period_days: periodDays
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentiment-trends'] });
      toast.success('Sentiment trends updated');
    },
    onError: (error) => {
      console.error('Error updating trends:', error);
      toast.error('Failed to update sentiment trends');
    },
  });

  // Calculate sentiment statistics
  const sentimentStats = {
    total: sentiments?.length || 0,
    positive: sentiments?.filter(s => s.sentiment === 'positive').length || 0,
    negative: sentiments?.filter(s => s.sentiment === 'negative').length || 0,
    neutral: sentiments?.filter(s => s.sentiment === 'neutral').length || 0,
    mixed: sentiments?.filter(s => s.sentiment === 'mixed').length || 0,
    urgent: sentiments?.filter(s => s.urgency_level === 'high' || s.urgency_level === 'critical').length || 0,
    averageScore: sentiments?.reduce((sum, s) => sum + s.sentiment_score, 0) / (sentiments?.length || 1),
    positivePercentage: ((sentiments?.filter(s => s.sentiment === 'positive').length || 0) / (sentiments?.length || 1)) * 100,
  };

  return {
    sentiments: sentiments || [],
    trends: trends || [],
    sentimentStats,
    isLoading: sentimentsLoading || trendsLoading,
    analyzeSentiment: analyzeSentiment.mutate,
    isAnalyzing: analyzeSentiment.isPending,
    updateTrends: updateTrends.mutate,
    isUpdatingTrends: updateTrends.isPending,
  };
};
