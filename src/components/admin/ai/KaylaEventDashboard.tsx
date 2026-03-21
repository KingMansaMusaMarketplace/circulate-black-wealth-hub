import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Zap, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface KaylaEvent {
  id: string;
  event_type: string;
  status: string;
  target_service: string;
  record_id: string | null;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
  retry_count: number;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
  processing: { color: 'bg-blue-100 text-blue-800', icon: <RefreshCw className="h-3 w-3 animate-spin" /> },
  completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
  failed: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
};

const serviceEmoji: Record<string, string> = {
  reviews: '✍️',
  onboarding: '👋',
  content: '📱',
  scorer: '📊',
  matchmaker: '🤝',
  churn: '📬',
};

const KaylaEventDashboard: React.FC = () => {
  const [events, setEvents] = useState<KaylaEvent[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, failed: 0, pending: 0, avgMs: 0 });
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kayla_event_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEvents((data as KaylaEvent[]) || []);

      // Calculate stats
      const all = (data as KaylaEvent[]) || [];
      const completed = all.filter(e => e.status === 'completed');
      const avgMs = completed.length > 0
        ? completed.reduce((sum, e) => {
            if (e.processed_at && e.created_at) {
              return sum + (new Date(e.processed_at).getTime() - new Date(e.created_at).getTime());
            }
            return sum;
          }, 0) / completed.length
        : 0;

      setStats({
        total: all.length,
        completed: completed.length,
        failed: all.filter(e => e.status === 'failed').length,
        pending: all.filter(e => e.status === 'pending').length,
        avgMs: Math.round(avgMs),
      });
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('kayla-events-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kayla_event_queue' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const handleRetryFailed = async () => {
    try {
      const { error } = await supabase
        .from('kayla_event_queue')
        .update({ status: 'pending', retry_count: 0, error_message: null })
        .eq('status', 'failed');

      if (error) throw error;
      toast.success('Failed events reset for retry');
      fetchEvents();
    } catch {
      toast.error('Failed to retry events');
    }
  };

  const handleTriggerSweep = async () => {
    try {
      const { error } = await supabase.functions.invoke('kayla-event-processor', {
        body: {},
      });
      if (error) throw error;
      toast.success('Sweep triggered');
      setTimeout(fetchEvents, 2000);
    } catch {
      toast.error('Failed to trigger sweep');
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.avgMs}ms</p>
            <p className="text-xs text-muted-foreground">Avg Response</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={fetchEvents} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={handleTriggerSweep}>
          <Zap className="h-4 w-4 mr-1" />
          Trigger Sweep
        </Button>
        {stats.failed > 0 && (
          <Button variant="outline" size="sm" onClick={handleRetryFailed}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Retry Failed ({stats.failed})
          </Button>
        )}
      </div>

      {/* Event Stream */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Live Event Stream
          </CardTitle>
          <CardDescription className="text-xs">Real-time Kayla event processing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No events yet. Events will appear here as Kayla processes them in real time.
                </p>
              ) : (
                events.map((event) => {
                  const config = statusConfig[event.status] || statusConfig.pending;
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{serviceEmoji[event.target_service] || '🤖'}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{event.event_type}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.target_service} · {formatTime(event.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.retry_count > 0 && (
                          <span className="text-xs text-muted-foreground">retry {event.retry_count}</span>
                        )}
                        <Badge variant="secondary" className={`${config.color} text-xs flex items-center gap-1`}>
                          {config.icon}
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaylaEventDashboard;
