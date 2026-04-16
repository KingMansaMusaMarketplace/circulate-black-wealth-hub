
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageSquare, Phone, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnsweringServiceLogsProps {
  businessId: string;
}

const ACTION_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  answered_faq: { label: 'FAQ Answered', variant: 'default' },
  took_message: { label: 'Message Taken', variant: 'secondary' },
  forwarded: { label: 'Forwarded', variant: 'outline' },
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'text-green-600',
  neutral: 'text-muted-foreground',
  negative: 'text-red-500',
};

export function AnsweringServiceLogs({ businessId }: AnsweringServiceLogsProps) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['answering-logs', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('answering_call_logs')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(50);

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

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No messages yet</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Messages will appear here once customers start texting your business number.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const action = ACTION_LABELS[log.action_taken] || ACTION_LABELS.answered_faq;
        return (
          <Card key={log.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {log.channel === 'sms' ? (
                      <MessageSquare className="h-4 w-4 text-mansablue" />
                    ) : (
                      <Phone className="h-4 w-4 text-mansablue" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.caller_number}</span>
                      <Badge variant={action.variant} className="text-xs">{action.label}</Badge>
                      {log.sentiment && (
                        <span className={`text-xs capitalize ${SENTIMENT_COLORS[log.sentiment] || ''}`}>
                          {log.sentiment}
                        </span>
                      )}
                    </div>
                    {log.summary && (
                      <p className="text-sm text-muted-foreground">{log.summary}</p>
                    )}
                    {log.transcript && (
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground">View transcript</summary>
                        <pre className="mt-2 whitespace-pre-wrap bg-muted p-3 rounded-md">{log.transcript}</pre>
                      </details>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
