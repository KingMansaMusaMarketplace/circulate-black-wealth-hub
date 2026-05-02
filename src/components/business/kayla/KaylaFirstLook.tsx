import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, DollarSign, ShieldAlert, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AgentFeedbackButtons } from '@/components/ai/AgentFeedbackButtons';

interface Baseline {
  id: string;
  business_id: string;
  industry: string | null;
  welcome_message: string | null;
  top_grants: Array<{ grant_name: string; grant_provider?: string; match_score?: number; amount_max?: number | null }>;
  compliance_gaps: Array<{ title?: string; summary?: string }>;
  certifications: any;
  status: string;
}

interface Props {
  businessId: string;
}

export const KaylaFirstLook: React.FC<Props> = ({ businessId }) => {
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => { fetch(); }, [businessId]);

  const fetch = async () => {
    const { data } = await supabase
      .from('kayla_business_baseline' as any)
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle();
    setBaseline(data as Baseline | null);
    setLoading(false);
  };

  const runFirstTouch = async () => {
    setRunning(true);
    try {
      const { error } = await supabase.functions.invoke('kayla-first-touch', {
        body: { businessId, force: true },
      });
      if (error) throw error;
      toast.success("Kayla's First Look ready");
      await fetch();
    } catch (e: any) {
      toast.error(e.message || 'Could not run first look');
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-mansagold" /></div>;
  }

  if (!baseline || baseline.status !== 'complete') {
    return (
      <Card className="bg-gradient-to-br from-mansablue/40 to-slate-900/40 border-mansagold/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-5 w-5 text-mansagold" />
            <h3 className="text-base font-semibold text-white">Kayla's First Look</h3>
          </div>
          <p className="text-sm text-white/60 mb-4">
            Let Kayla run a personalized first-touch enrichment on your business. She'll surface starter grants, compliance gaps, and certification opportunities in under a minute.
          </p>
          <Button onClick={runFirstTouch} disabled={running} className="bg-mansagold text-mansablue hover:bg-mansagold/90">
            {running ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {running ? 'Kayla is looking...' : 'Run First Look'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-mansablue/40 to-slate-900/40 border-mansagold/30">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-mansagold" />
            <h3 className="text-base font-semibold text-white">Kayla's First Look</h3>
            <Badge variant="outline" className="text-xs border-mansagold/30 text-mansagold">Personalized</Badge>
          </div>
          <Button size="sm" variant="ghost" onClick={runFirstTouch} disabled={running} className="text-white/50 text-xs">
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Refresh'}
          </Button>
        </div>

        {baseline.welcome_message && (
          <p className="text-sm text-white/80 italic border-l-2 border-mansagold/40 pl-3">
            {baseline.welcome_message}
          </p>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-emerald-400/10">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Top Grants</span>
            </div>
            <ul className="space-y-1">
              {baseline.top_grants?.length ? baseline.top_grants.slice(0, 3).map((g, i) => (
                <li key={i} className="text-xs text-white/70 truncate">• {g.grant_name}</li>
              )) : <li className="text-xs text-white/40">None found yet</li>}
            </ul>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-3 border border-red-400/10">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-xs font-medium">Compliance Gaps</span>
            </div>
            <ul className="space-y-1">
              {baseline.compliance_gaps?.length ? baseline.compliance_gaps.slice(0, 3).map((c, i) => (
                <li key={i} className="text-xs text-white/70 truncate">• {c.title || c.summary || 'Gap detected'}</li>
              )) : <li className="text-xs text-white/40">No gaps detected</li>}
            </ul>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-3 border border-mansagold/10">
            <div className="flex items-center gap-2 mb-2 text-mansagold">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Certifications</span>
            </div>
            <p className="text-xs text-white/60">Supplier diversity opportunities surfaced — open the Diversity tab to review.</p>
          </div>
        </div>

        <AgentFeedbackButtons
          agentName="kayla-first-touch"
          decisionType="business_baseline"
          businessId={businessId}
          decisionPayload={{ baseline_id: baseline.id }}
          compact
        />
      </CardContent>
    </Card>
  );
};
