import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Proposal {
  id: string;
  question: string;
  weak_answer: string | null;
  score: number | null;
  diagnosis: string | null;
  proposed_rule: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

/** Weekly self-improvement: admins approve or reject Kayla's proposed fixes. */
export const KaylaImprovementApprovals: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Proposal[]>([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    const db = supabase as any;
    const [{ data }, { count }] = await Promise.all([
      db.from('kayla_improvement_proposals').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(30),
      db.from('kayla_improvement_proposals').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    ]);
    setItems((data as Proposal[]) || []);
    setApprovedCount(count ?? 0);
  }, []);

  useEffect(() => { load(); }, [load]);

  const decide = async (id: string, status: 'approved' | 'rejected') => {
    setBusy(id);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await (supabase as any)
      .from('kayla_improvement_proposals')
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: u?.user?.id ?? null })
      .eq('id', id);
    setBusy(null);
    if (error) {
      toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
      return;
    }
    toast({
      title: status === 'approved' ? 'Fix approved' : 'Fix rejected',
      description: status === 'approved'
        ? 'Kayla will follow this in chat, voice and the app within about 5 minutes.'
        : 'Kayla will not use this suggestion.',
    });
    load();
  };

  const generate = async () => {
    setGenerating(true);
    const { data, error } = await supabase.functions.invoke('kayla-weekly-improvement', { body: {} });
    setGenerating(false);
    if (error) {
      toast({ title: 'Could not create suggestions', description: error.message, variant: 'destructive' });
      return;
    }
    toast({
      title: 'Suggestions ready',
      description: data?.created ? `${data.created} new fix(es) to review.` : (data?.reason || 'No new weak answers to fix.'),
    });
    load();
  };

  return (
    <Card className="bg-white/10 border-white/20 p-5 mt-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-mansagold" /> Weekly fixes waiting for your approval
          </h2>
          <p className="text-base text-white/80 mt-1 max-w-2xl">
            Every Monday Kayla studies her weakest test answers and suggests a fix. Nothing changes until you approve it.
            {approvedCount > 0 && ` ${approvedCount} approved fix(es) are active.`}
          </p>
        </div>
        <Button variant="outline" onClick={generate} disabled={generating} className="border-white/30 text-white bg-transparent hover:bg-white/10">
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Studying…' : 'Suggest fixes now'}
        </Button>
      </div>

      {!items.length && <p className="text-white/70 text-base">No fixes waiting. Run the test, then press “Suggest fixes now”.</p>}

      <div className="space-y-4">
        {items.map((p) => (
          <div key={p.id} className="border border-white/20 rounded-lg p-4 bg-black/30">
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold text-base text-white">{p.question}</p>
              <Badge className="shrink-0 bg-white/15 text-white">Score {p.score ?? '—'}</Badge>
            </div>
            {p.diagnosis && <p className="text-sm text-white/80 mt-2"><span className="font-semibold">What went wrong:</span> {p.diagnosis}</p>}
            <p className="text-base text-mansagold mt-3"><span className="font-semibold">Suggested fix:</span> {p.proposed_rule}</p>
            {p.weak_answer && (
              <details className="mt-2">
                <summary className="text-sm text-white/60 cursor-pointer">See Kayla's weak answer</summary>
                <p className="text-sm text-white/80 mt-2 whitespace-pre-wrap">{p.weak_answer}</p>
              </details>
            )}
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => decide(p.id, 'approved')} disabled={busy === p.id} className="bg-mansagold text-black hover:bg-mansagold/90">
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => decide(p.id, 'rejected')} disabled={busy === p.id} className="border-white/30 text-white bg-transparent hover:bg-white/10">
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default KaylaImprovementApprovals;
