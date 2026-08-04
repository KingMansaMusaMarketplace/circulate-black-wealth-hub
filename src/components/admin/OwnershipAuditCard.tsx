import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type FlaggedBiz = {
  id: string;
  business_name: string | null;
  name: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  black_owned_confidence: number | null;
};

type Stats = {
  total_live: number;
  unreviewed: number;
  confirmed: number;
  flagged: number;
};

/**
 * Ownership Audit — re-checks businesses that are ALREADY live in the directory
 * for real, cited evidence of Black ownership. Being "verified" only ever meant
 * "this is a real business", so this is a separate, stricter pass.
 */
const OwnershipAuditCard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ total_live: 0, unreviewed: 0, confirmed: 0, flagged: 0 });
  const [flaggedList, setFlaggedList] = useState<FlaggedBiz[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const live = supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('listing_status', 'live');
    const unreviewed = supabase.from('businesses').select('id', { count: 'exact', head: true })
      .eq('listing_status', 'live').is('ownership_reviewed_at', null);
    const flagged = supabase.from('businesses').select('id', { count: 'exact', head: true })
      .eq('listing_status', 'live').eq('ownership_flagged', true);
    const confirmed = supabase.from('businesses').select('id', { count: 'exact', head: true })
      .eq('listing_status', 'live').eq('ownership_flagged', false).not('ownership_reviewed_at', 'is', null);

    const [l, u, f, c] = await Promise.all([live, unreviewed, flagged, confirmed]);

    setStats({
      total_live: l.count ?? 0,
      unreviewed: u.count ?? 0,
      flagged: f.count ?? 0,
      confirmed: c.count ?? 0,
    });

    const { data } = await supabase
      .from('businesses')
      .select('id,business_name,name,city,state,website,black_owned_confidence')
      .eq('listing_status', 'live')
      .eq('ownership_flagged', true)
      .order('ownership_reviewed_at', { ascending: false })
      .limit(25);
    setFlaggedList((data as FlaggedBiz[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const runAudit = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-verify-ownership', {
        body: { limit: 25 },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const d = data as any;
      toast.success(
        `Checked ${d.checked}. Confirmed Black-owned: ${d.confirmed}. Flagged for review: ${d.flagged}.`
      );
      await fetchStats();
    } catch (e: any) {
      toast.error(e.message || 'Ownership audit failed');
    } finally {
      setRunning(false);
    }
  };

  const unlist = async (biz: FlaggedBiz) => {
    const label = biz.business_name || biz.name || 'this business';
    if (!window.confirm(`Remove "${label}" from the public directory? It will be set back to draft, not deleted.`)) return;
    const { error } = await supabase
      .from('businesses')
      .update({ listing_status: 'draft' } as any)
      .eq('id', biz.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Removed from directory: ${label}`);
    await fetchStats();
  };

  const markOk = async (biz: FlaggedBiz) => {
    const label = biz.business_name || biz.name || 'this business';
    const evidence = window.prompt(
      `Confirm "${label}" is Black-owned. Enter the proof you have (e.g. "Owner confirmed by phone on 8/4/26"):`
    );
    if (!evidence || evidence.trim().length < 10) {
      if (evidence !== null) toast.error('Please enter at least a short sentence of proof.');
      return;
    }
    const { error } = await supabase
      .from('businesses')
      .update({
        ownership_flagged: false,
        black_owned_confidence: 1,
        black_owned_evidence: `Admin-confirmed: ${evidence.trim()}`,
        ownership_reviewed_at: new Date().toISOString(),
      } as any)
      .eq('id', biz.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Confirmed Black-owned: ${label}`);
    await fetchStats();
  };

  return (
    <Card className="bg-slate-900/40 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-mansagold" />
          Ownership Audit — businesses already live in the directory
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={fetchStats} disabled={loading} className="text-white/70">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={runAudit} disabled={running} className="bg-mansagold text-black hover:bg-mansagold/90">
            {running ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-1" />}
            Check next 25
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Live listings</div>
            <div className="text-xl font-bold text-white">{stats.total_live.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Not yet checked</div>
            <div className="text-xl font-bold text-mansagold">{stats.unreviewed.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Confirmed Black-owned</div>
            <div className="text-xl font-bold text-green-400">{stats.confirmed.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-white/40 text-xs uppercase">Flagged for review</div>
            <div className="text-xl font-bold text-red-400">{stats.flagged.toLocaleString()}</div>
          </div>
        </div>

        <p className="text-xs text-white/50 mt-3">
          Kayla re-researches each live listing and must cite a real source (a Black-owned directory, an owner bio,
          an MBE certification, or press coverage). No cited source means the listing gets flagged for you — it is
          never auto-removed.
        </p>

        {flaggedList.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs uppercase text-white/40">Most recently flagged</div>
            {flaggedList.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-red-500/10 border border-red-500/30 rounded p-2"
              >
                <div className="min-w-0">
                  <div className="text-sm text-white flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{b.business_name || b.name}</span>
                  </div>
                  <div className="text-xs text-white/50">
                    {[b.city, b.state].filter(Boolean).join(', ') || 'Unknown location'}
                    {b.black_owned_confidence !== null &&
                      ` • ownership ${(Number(b.black_owned_confidence) * 100).toFixed(0)}%`}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => markOk(b)}
                    className="border-green-400/40 text-green-200 hover:bg-green-500/10">
                    It is Black-owned
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

export default OwnershipAuditCard;
