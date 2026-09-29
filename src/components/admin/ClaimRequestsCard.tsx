import { externalUrl } from '@/lib/external-url';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Building2, Check, ExternalLink, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClaimRequest {
  id: string;
  lead_id: string;
  business_name: string;
  city: string | null;
  state: string | null;
  website_url: string | null;
  requester_email: string | null;
  requester_name: string | null;
  created_at: string;
}

/** Owners who asked to claim a discovered listing; reviewers approve or reject. */
const ClaimRequestsCard = () => {
  const [items, setItems] = useState<ClaimRequest[]>([]);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await (supabase as any).rpc('list_lead_claim_requests');
    if (error) { console.error(error); return; }
    setItems((data ?? []) as ClaimRequest[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const decide = async (req: ClaimRequest, approve: boolean) => {
    setActingId(req.id);
    try {
      const { data, error } = await (supabase as any).rpc('decide_lead_claim_request', { _request_id: req.id, _approve: approve });
      if (error) throw error;
      if (data && data.success === false) throw new Error(data.error || 'Could not complete');
      toast.success(approve ? `Claim approved: ${req.business_name}` : `Claim rejected: ${req.business_name}`);
      if (approve) {
        const { error: mailErr } = await supabase.functions.invoke('notify-claim-approved', { body: { requestId: req.id } });
        if (mailErr) toast.error('Approved, but the confirmation email to the owner failed to send.');
        else toast.success('Confirmation email sent to the owner.');
      }
      await load();
    } catch (e: any) {
      toast.error(e.message || 'Failed');
    } finally {
      setActingId(null);
    }
  };

  if (items.length === 0) return null;

  return (
    <Card className="bg-slate-900/60 border-mansagold/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-mansagold" /> Owner Claim Requests ({items.length})
        </CardTitle>
        <p className="text-sm text-white/95">
          Confirm the person really owns the business (check the website and email domain) before approving.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/30 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-semibold text-white">{r.business_name}</p>
              <p className="text-sm text-white/95">
                {[r.city, r.state].filter(Boolean).join(', ')}
                {r.website_url && (
                  <a href={externalUrl(r.website_url)} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-mansagold underline">
                    website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </p>
              <p className="text-sm text-white/95">
                Requested by {r.requester_name || 'unknown'} · {r.requester_email || 'no email'} · {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" disabled={actingId === r.id} onClick={() => decide(r, true)} className="bg-mansagold text-black hover:bg-mansagold/90">
                <Check className="mr-1 h-4 w-4" /> Approve
              </Button>
              <Button size="sm" variant="outline" disabled={actingId === r.id} onClick={() => decide(r, false)}>
                <X className="mr-1 h-4 w-4" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ClaimRequestsCard;
