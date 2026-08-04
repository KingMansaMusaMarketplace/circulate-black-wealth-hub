import React, { useCallback, useEffect, useState } from 'react';
import { Link2Off, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type DeadBiz = {
  id: string;
  business_name: string | null;
  name: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  website_status_code: number | null;
};

type Stats = {
  total: number;
  unchecked: number;
  live: number;
  dead: number;
};

/**
 * Dead Link Audit — visits each live listing's website and reports whether it
 * loads. A site is only marked "dead" after it fails twice on separate runs,
 * so a short outage can't wipe out a real business. Removal is manual and
 * reversible (the listing goes back to draft, it is not deleted).
 */
const DeadLinkAuditCard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, unchecked: 0, live: 0, dead: 0 });
  const [deadList, setDeadList] = useState<DeadBiz[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bulkRemoving, setBulkRemoving] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const base = () =>
      supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('listing_status', 'live');

    const [t, u, l, d] = await Promise.all([
      base().not('website', 'is', null).neq('website', ''),
      base().not('website', 'is', null).neq('website', '').eq('website_status', 'unknown'),
      base().eq('website_status', 'live'),
      base().eq('website_status', 'dead'),
    ]);

    setStats({
      total: t.count ?? 0,
      unchecked: u.count ?? 0,
      live: l.count ?? 0,
      dead: d.count ?? 0,
    });

    const { data } = await supabase
      .from('businesses')
      .select('id,business_name,name,city,state,website,website_status_code')
      .eq('listing_status', 'live')
      .eq('website_status', 'dead')
      .order('website_checked_at', { ascending: false })
      .limit(25);
    setDeadList((data as DeadBiz[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const runCheck = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-check-websites', {
        body: { limit: 50 },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const d = data as any;
      toast.success(
        `Checked ${d.checked}. Working: ${d.live}. Can't be reached: ${d.dead}. Needs another look: ${d.blocked}.`
      );
      await fetchStats();
    } catch (e: any) {
      toast.error(e.message || 'Website check failed');
    } finally {
      setRunning(false);
    }
  };

  const unlist = async (biz: DeadBiz) => {
    const label = biz.business_name || biz.name || 'this business';
    if (!window.confirm(`Remove "${label}" from the public directory? It goes back to draft, it is not deleted.`)) return;
    const { error } = await supabase
      .from('businesses')
      .update({ listing_status: 'draft' } as any)
      .eq('id', biz.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Removed from directory: ${label}`);
    await fetchStats();
  };

  const keep = async (biz: DeadBiz) => {
    const label = biz.business_name || biz.name || 'this business';
    const { error } = await supabase
      .from('businesses')
      .update({ website_status: 'live', website_fail_count: 0 } as any)
      .eq('id', biz.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Keeping: ${label}`);
    await fetchStats();
  };

  const removeAllDead = async () => {
    if (stats.dead === 0) return;
    if (!window.confirm(
      `Remove all ${stats.dead.toLocaleString()} listings whose website can't be reached? They go back to draft and can be restored.`
    )) return;
    setBulkRemoving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ listing_status: 'draft' } as any)
        .eq('listing_status', 'live')
        .eq('website_status', 'dead');
      if (error) throw error;
      toast.success('Removed every listing with an unreachable website.');
      await fetchStats();
    } catch (e: any) {
      toast.error(e.message || 'Bulk removal failed');
    } finally {
      setBulkRemoving(false);
      await fetchStats();
    }
  };

  return (
    <Card className="bg-slate-900/40 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <Link2Off className="h-4 w-4 text-mansagold" />
          Dead Link Audit — listings whose website won't load
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={fetchStats} disabled={loading} className="text-white/70">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={runCheck} disabled={running} className="bg-mansagold text-black hover:bg-mansagold/90">
            {running ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Link2Off className="h-4 w-4 mr-1" />}
            Check next 50
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Listings with a website</div>
            <div className="text-xl font-bold text-white">{stats.total.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Not yet checked</div>
            <div className="text-xl font-bold text-mansagold">{stats.unchecked.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Website works</div>
            <div className="text-xl font-bold text-green-400">{stats.live.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Can't be reached</div>
            <div className="text-xl font-bold text-red-400">{stats.dead.toLocaleString()}</div>
          </div>
        </div>

        <p className="text-xs text-white/50 mt-3">
          Each website is visited for real. A listing is only marked "can't be reached" after it fails twice on
          separate runs, so a short outage won't knock out a real business. Removing a listing sets it back to
          draft — nothing is permanently deleted.
        </p>

        {stats.dead > 0 && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={removeAllDead}
              disabled={bulkRemoving}
              className="border-red-400/40 text-red-200 hover:bg-red-500/10"
            >
              {bulkRemoving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Remove all {stats.dead.toLocaleString()} unreachable listings
            </Button>
          </div>
        )}

        {deadList.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs uppercase text-white/40">Most recently found</div>
            {deadList.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-red-500/10 border border-red-500/30 rounded p-2"
              >
                <div className="min-w-0">
                  <div className="text-sm text-white flex items-center gap-2">
                    <Link2Off className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{b.business_name || b.name}</span>
                  </div>
                  <div className="text-xs text-white/50 flex items-center gap-2 flex-wrap">
                    <span>{[b.city, b.state].filter(Boolean).join(', ') || 'Unknown location'}</span>
                    {b.website && (
                      <a
                        href={b.website.startsWith('http') ? b.website : `https://${b.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-mansagold hover:underline"
                      >
                        {b.website} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {b.website_status_code ? <span>• error {b.website_status_code}</span> : <span>• no response</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => keep(b)}
                    className="border-green-400/40 text-green-200 hover:bg-green-500/10">
                    Keep it
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => unlist(b)}
                    className="border-red-400/40 text-red-200 hover:bg-red-500/10">
                    Remove from directory
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeadLinkAuditCard;
