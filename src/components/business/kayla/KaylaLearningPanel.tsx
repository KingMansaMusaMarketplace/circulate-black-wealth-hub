import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Brain, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AgentStat {
  agent_name: string;
  total: number;
  thumbs_up: number;
  thumbs_down: number;
  score: number; // -100..100
}

interface Props { businessId: string }

export const KaylaLearningPanel: React.FC<Props> = ({ businessId }) => {
  const [stats, setStats] = useState<AgentStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeedback(); }, [businessId]);

  const fetchFeedback = async () => {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('ai_agent_feedback')
      .select('agent_name, rating')
      .eq('business_id', businessId)
      .gte('created_at', since);

    const byAgent = new Map<string, AgentStat>();
    (data || []).forEach((row: any) => {
      const a = row.agent_name as string;
      const s = byAgent.get(a) || { agent_name: a, total: 0, thumbs_up: 0, thumbs_down: 0, score: 0 };
      s.total += 1;
      if (row.rating > 0) s.thumbs_up += 1;
      else if (row.rating < 0) s.thumbs_down += 1;
      byAgent.set(a, s);
    });
    const arr = Array.from(byAgent.values()).map(s => ({
      ...s,
      score: s.total ? Math.round(((s.thumbs_up - s.thumbs_down) / s.total) * 100) : 0,
    })).sort((a, b) => b.total - a.total);

    setStats(arr);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-mansagold" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-mansagold" />
        <h3 className="text-base font-semibold text-white">Kayla Learning — Last 30 Days</h3>
      </div>

      {stats.length === 0 ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-white/60">
              No feedback yet. As you rate Kayla's outputs across the dashboard, this view shows which agents you trust most so prompts can be refined.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {stats.map(s => (
            <Card key={s.agent_name} className="bg-slate-800/40 border-white/10">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{s.agent_name}</p>
                  <p className="text-xs text-white/40">{s.total} rating{s.total === 1 ? '' : 's'}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ThumbsUp className="h-3 w-3" /> {s.thumbs_up}
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <ThumbsDown className="h-3 w-3" /> {s.thumbs_down}
                  </span>
                  <span className={`font-semibold ${s.score >= 50 ? 'text-emerald-400' : s.score >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {s.score >= 0 ? '+' : ''}{s.score}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
