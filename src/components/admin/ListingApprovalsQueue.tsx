import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2, Check, X, Search, ListChecks, Image as ImageIcon, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  owner_id: string | null;
  logo_url: string | null;
  listing_status: string | null;
  is_verified: boolean | null;
  created_at: string;
  category?: string | null;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  listing_rejection_reason?: string | null;
}

const ListingApprovalsQueue: React.FC = () => {
  const [tab, setTab] = useState<'new' | 'unverified' | 'rejected'>('new');
  const [items, setItems] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rejectFor, setRejectFor] = useState<Business | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setSelected(new Set());
    let q = supabase
      .from('businesses')
      .select('id, name, owner_id, logo_url, listing_status, is_verified, created_at, category, city, state, description, website, email, phone, listing_rejection_reason')
      .order('created_at', { ascending: false })
      .limit(100);
    if (tab === 'new') q = q.eq('listing_status', 'draft');
    else if (tab === 'unverified') q = q.eq('listing_status', 'live').eq('is_verified', false);
    else q = q.eq('listing_status', 'rejected');

    const { data, error } = await q;
    setLoading(false);
    if (error) return toast.error('Load failed: ' + error.message);
    setItems((data as any) || []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const filtered = items.filter(b => {
    if (!search) return true;
    const s = search.toLowerCase();
    return [b.name, b.city, b.state, b.email, b.category].some(v => v?.toLowerCase().includes(s));
  });

  const toggle = (id: string) =>
    setSelected(s => {
      const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
    });

  const approve = async (ids: string[]) => {
    if (ids.length === 0) return;
    if (!window.confirm(`Approve ${ids.length} listing(s)? They will go live in the directory.`)) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('businesses')
      .update({
        listing_status: 'live',
        is_verified: true,
        listing_reviewed_by: user?.id ?? null,
        listing_reviewed_at: new Date().toISOString(),
        listing_rejection_reason: null,
      })
      .in('id', ids);
    setBusy(false);
    if (error) return toast.error('Approve failed: ' + error.message);
    toast.success(`Approved ${ids.length} listing(s)`);
    load();
  };

  const reject = async () => {
    if (!rejectFor || !rejectReason.trim()) return toast.error('Reason required');
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('businesses')
      .update({
        listing_status: 'rejected',
        listing_rejection_reason: rejectReason,
        listing_reviewed_by: user?.id ?? null,
        listing_reviewed_at: new Date().toISOString(),
      })
      .eq('id', rejectFor.id);
    setBusy(false);
    if (error) return toast.error('Reject failed: ' + error.message);
    toast.success('Listing rejected');
    setRejectFor(null);
    setRejectReason('');
    load();
  };

  return (
    <div className="space-y-4 text-white">
      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-mansagold" /> Business Listing Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={v => setTab(v as any)}>
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="new">New (Draft)</TabsTrigger>
              <TabsTrigger value="unverified">Live · Unverified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Filter by name, city, email, category…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 bg-white/5 border-white/10"
                  />
                </div>
                {tab === 'new' && (
                  <Button onClick={() => approve(Array.from(selected))} disabled={busy || selected.size === 0}>
                    <Check className="h-4 w-4 mr-1" /> Bulk Approve ({selected.size})
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-mansagold" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-white/50 text-sm">Nothing in this queue.</div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(b => (
                    <div key={b.id} className="flex items-start gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                      {tab === 'new' && (
                        <Checkbox
                          checked={selected.has(b.id)}
                          onCheckedChange={() => toggle(b.id)}
                          className="mt-1"
                        />
                      )}
                      {b.logo_url ? (
                        <img src={b.logo_url} alt="" className="h-12 w-12 rounded object-cover bg-white/5" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-white/5 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-white/30" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{b.name}</span>
                          <Badge variant="secondary" className="text-xs">{b.listing_status}</Badge>
                          {b.is_verified && <Badge className="text-xs bg-green-600/20 text-green-300 border-green-600/30">verified</Badge>}
                          {b.category && <Badge variant="outline" className="text-xs">{b.category}</Badge>}
                        </div>
                        <div className="text-xs text-white/60 mt-0.5">
                          {[b.city, b.state].filter(Boolean).join(', ') || '—'} · {b.email || 'no email'} · {b.phone || 'no phone'}
                        </div>
                        {b.description && (
                          <p className="text-xs text-white/50 mt-1 line-clamp-2">{b.description}</p>
                        )}
                        {b.listing_rejection_reason && (
                          <p className="text-xs text-red-300 mt-1">Rejected: {b.listing_rejection_reason}</p>
                        )}
                        {b.website && (
                          <a href={b.website} target="_blank" rel="noreferrer" className="text-xs text-mansagold inline-flex items-center gap-1 mt-1">
                            {b.website} <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        {tab !== 'rejected' && (
                          <Button size="sm" onClick={() => approve([b.id])} disabled={busy}>
                            <Check className="h-3 w-3 mr-1" /> Approve
                          </Button>
                        )}
                        {tab !== 'rejected' && (
                          <Button size="sm" variant="destructive" onClick={() => setRejectFor(b)} disabled={busy}>
                            <X className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        )}
                        {tab === 'rejected' && (
                          <Button size="sm" variant="outline" onClick={() => approve([b.id])} disabled={busy}>
                            Reinstate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!rejectFor} onOpenChange={o => !o && setRejectFor(null)}>
        <DialogContent className="bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Reject {rejectFor?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-white/70">Reason (visible to owner)</Label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
              placeholder="e.g. Photos don't meet quality bar, missing business hours, suspected duplicate…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectFor(null)}>Cancel</Button>
            <Button variant="destructive" onClick={reject} disabled={busy || !rejectReason.trim()}>
              {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Reject Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingApprovalsQueue;
