
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageSquare, HelpCircle, ArrowRight, SmilePlus } from 'lucide-react';

interface AnsweringServiceAnalyticsProps {
  businessId: string;
}

export function AnsweringServiceAnalytics({ businessId }: AnsweringServiceAnalyticsProps) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['answering-analytics', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('answering_call_logs')
        .select('action_taken, sentiment, created_at, summary')
        .eq('business_id', businessId);

      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const total = logs?.length || 0;
  const faqAnswered = logs?.filter(l => l.action_taken === 'answered_faq').length || 0;
  const messagesTaken = logs?.filter(l => l.action_taken === 'took_message').length || 0;
  const forwarded = logs?.filter(l => l.action_taken === 'forwarded').length || 0;

  const positive = logs?.filter(l => l.sentiment === 'positive').length || 0;
  const neutral = logs?.filter(l => l.sentiment === 'neutral').length || 0;
  const negative = logs?.filter(l => l.sentiment === 'negative').length || 0;

  const stats = [
    { label: 'Total Messages', value: total, icon: MessageSquare, color: 'text-mansablue' },
    { label: 'FAQs Answered', value: faqAnswered, icon: HelpCircle, color: 'text-green-500' },
    { label: 'Messages Taken', value: messagesTaken, icon: MessageSquare, color: 'text-mansagold' },
    { label: 'Forwarded', value: forwarded, icon: ArrowRight, color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sentiment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SmilePlus className="h-5 w-5" />
            Sentiment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {total === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              <SentimentBar label="Positive" count={positive} total={total} color="bg-green-500" />
              <SentimentBar label="Neutral" count={neutral} total={total} color="bg-gray-400" />
              <SentimentBar label="Negative" count={negative} total={total} color="bg-red-500" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SentimentBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-20">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-muted-foreground w-16 text-right">{count} ({pct}%)</span>
    </div>
  );
}
