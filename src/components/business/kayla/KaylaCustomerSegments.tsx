import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AgentFeedbackButtons } from '@/components/ai/AgentFeedbackButtons';

interface Segment {
  name: string;
  description: string;
  count: number;
  characteristics: string[];
}

interface Props {
  businessId: string;
}

export const KaylaCustomerSegments: React.FC<Props> = ({ businessId }) => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-segment-analyzer', {
        body: { businessId },
      });
      if (error) throw error;
      setSegments(data?.segments || []);
      toast.success('Customer segments analyzed!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to analyze segments');
    } finally {
      setLoading(false);
    }
  };

  const colors = ['text-emerald-400 bg-emerald-400/10', 'text-blue-400 bg-blue-400/10', 'text-purple-400 bg-purple-400/10', 'text-amber-400 bg-amber-400/10', 'text-pink-400 bg-pink-400/10'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            Customer Segments
          </h3>
          <p className="text-sm text-white/50">AI-identified customer groups</p>
        </div>
        <Button
          onClick={analyze}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {segments.length === 0 ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-indigo-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No segments yet</h3>
            <p className="text-sm text-white/50">Click "Analyze" to have Kayla identify customer segments.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {segments.map((seg, i) => (
            <Card key={i} className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${colors[i % colors.length]} border-0`}>{seg.name}</Badge>
                  <span className="text-xs text-white/40">{seg.count} customers</span>
                </div>
                <p className="text-sm text-white/60 mb-2">{seg.description}</p>
                <div className="flex flex-wrap gap-1">
                  {seg.characteristics?.map((c, j) => (
                    <Badge key={j} variant="outline" className="text-xs border-white/10 text-white/40">{c}</Badge>
                  ))}
                </div>
                <div className="mt-3">
                  <AgentFeedbackButtons
                    agentName="kayla-segment-analyzer"
                    decisionType="customer_segment"
                    businessId={businessId}
                    decisionPayload={{ segment_name: seg.name, count: seg.count }}
                    compact
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
