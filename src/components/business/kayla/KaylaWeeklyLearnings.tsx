import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Learning {
  id: string;
  agent_name: string;
  learning: string;
  source: string;
  confidence: number;
  applied: boolean;
  created_at: string;
}

interface Props { businessId: string; limit?: number }

/**
 * "What Kayla learned this week" — surfaces recent rule-of-thumb
 * adjustments the team made based on user feedback. Makes the
 * learning loop visible.
 */
export const KaylaWeeklyLearnings: React.FC<Props> = ({ businessId, limit = 5 }) => {
  const [items, setItems] = useState<Learning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('kayla_learnings' as any)
        .select('*')
        .eq('business_id', businessId)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (active) {
        setItems((data as any[]) || []);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [businessId, limit]);

  return (
    <Card className="bg-slate-900/60 border-mansagold/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-mansagold" />
          <h3 className="text-sm font-semibold text-white">What Kayla learned this week</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-mansagold" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-xs text-white/50">
            Rate Kayla's outputs across the dashboard and her team will adapt.
            New learnings will appear here within a week.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((l) => (
              <li
                key={l.id}
                className="flex items-start gap-2 p-2 rounded-md bg-slate-800/40 border border-white/5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80 leading-snug">{l.learning}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-mansagold/30 text-mansagold">
                      {l.agent_name}
                    </Badge>
                    {l.applied && (
                      <span className="text-[10px] text-emerald-400">Applied</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default KaylaWeeklyLearnings;
