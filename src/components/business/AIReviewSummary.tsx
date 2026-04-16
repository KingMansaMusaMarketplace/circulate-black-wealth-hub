import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIReviewSummaryProps {
  businessId: string;
}

const AIReviewSummary: React.FC<AIReviewSummaryProps> = ({ businessId }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(false);
        const { data, error: fnError } = await supabase.functions.invoke('ai-review-summary', {
          body: { business_id: businessId },
        });

        if (fnError) {
          console.error('Review summary error:', fnError);
          setError(true);
          return;
        }

        if (data?.summary) {
          setSummary(data.summary);
          setReviewCount(data.review_count || 0);
        }
      } catch (e) {
        console.error('Failed to fetch review summary:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchSummary();
  }, [businessId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl bg-accent/50 mb-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Generating AI review summary...</span>
      </div>
    );
  }

  if (error || !summary) return null;

  return (
    <div className="p-4 rounded-xl border bg-gradient-to-r from-accent/60 to-accent/30 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">AI Summary</span>
        <span className="text-xs text-muted-foreground ml-auto">Based on {reviewCount} reviews</span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{summary}</p>
    </div>
  );
};

export default AIReviewSummary;
