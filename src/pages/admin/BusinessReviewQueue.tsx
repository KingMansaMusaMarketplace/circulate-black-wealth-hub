import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, ExternalLink, RefreshCw, AlertTriangle, Loader2, Search, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import OwnershipAuditCard from '@/components/admin/OwnershipAuditCard';
import DeadLinkAuditCard from '@/components/admin/DeadLinkAuditCard';
import OwnershipSpotCheckCard from '@/components/admin/OwnershipSpotCheckCard';

type Lead = {
  id: string;
  business_name: string;
  category: string | null;
  city: string | null;
  state: string | null;
  website_url: string | null;
  phone_number: string | null;
  business_description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  confidence_score: number | null;
  black_owned_confidence: number | null;
  black_owned_evidence: string | null;
  verification_status: string | null;
  verification_notes: any;
  verified_phone: string | null;
  verified_address: string | null;
  created_at: string;
};

type StatusFilter = 'needs_review' | 'pending' | 'promoted' | 'rejected';

const STATUS_COUNT_KEYS: StatusFilter[] = ['needs_review', 'pending', 'promoted', 'rejected'];

const STATUS_LABEL: Record<StatusFilter, string> = {
  needs_review: 'needs review',
  pending: 'pending',
  promoted: 'live in directory',
  rejected: 'rejected',
};

type EnrichmentStats = {
  total_missing_email: number;
  total_enriched: number;
  enriched_24h: number;
  run_today: number;
};

const BusinessReviewQueue: React.FC = () => {
  const [status, setStatus] = useState<StatusFilter>('needs_review');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<StatusFilter, number>>({
    needs_review: 0, pending: 0, promoted: 0, rejected: 0,
  });
  const [actingId, setActingId] = useState<string | null>(null);
  const [enrichment, setEnrichment] = useState<EnrichmentStats>({
    total_missing_email: 0,
    total_enriched: 0,
    enriched_24h: 0,
    run_today: 0,
  });
  const [enriching, setEnriching] = useState(false);

  const fetchCounts = useCallback(async () => {
    const results = await Promise.all(STATUS_COUNT_KEYS.map(async (s) => {
      const { count } = await supabase
        .from('b2b_external_leads')
        .select('id', { count: 'exact', head: true })
        .eq('verification_status', s);
      return [s, count ?? 0] as const;
    }));
    setCounts(Object.fromEntries(results) as Record<StatusFilter, number>);
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from('b2b_external_leads')
      .select('id,business_name,category,city,state,website_url,phone_number,business_description,logo_url,banner_url,confidence_score,black_owned_confidence,black_owned_evidence,verification_status,verification_notes,verified_phone,verified_address,created_at')
      .eq('verification_status', status)
      .order('created_at', { ascending: false })
      .limit(50);
    if (search.trim()) q = q.ilike('business_name', `%${search.trim()}%`);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setLeads((data ?? []) as Lead[]);
    setLoading(false);
  }, [status, search]);

  const fetchEnrichmentStats = useCallback(async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const startOfDay = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

    const [missing, enriched, lastDay, today] = await Promise.all([
      supabase.from('b2b_external_leads').select('id', { count: 'exact', head: true })
        .not('website_url', 'is', null)
        .or('owner_email.is.null,owner_email.eq.'),
      supabase.from('b2b_external_leads').select('id', { count: 'exact', head: true })
        .not('owner_email', 'is', null)
        .neq('owner_email', ''),
      supabase.from('b2b_external_leads').select('id', { count: 'exact', head: true })
        .not('owner_email', 'is', null)
        .neq('owner_email', '')
        .gte('last_enriched_at', oneDayAgo),
      supabase.from('kayla_enrichment_log').select('id', { count: 'exact', head: true })
        .gte('created_at', startOfDay),
    ]);

    setEnrichment({
      total_missing_email: missing.count ?? 0,
      total_enriched: enriched.count ?? 0,
      enriched_24h: lastDay.count ?? 0,
      run_today: today.count ?? 0,
    });
  }, []);

  useEffect(() => { fetchLeads(); fetchCounts(); fetchEnrichmentStats(); }, [fetchLeads, fetchCounts, fetchEnrichmentStats]);

  const approve = async (lead: Lead) => {
    setActingId(lead.id);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const ownerId = authData?.user?.id;
      if (!ownerId) throw new Error('You must be signed in as an admin to approve.');

      const { data: inserted, error: insErr } = await supabase.from('businesses').insert({
        owner_id: ownerId,
        name: lead.business_name,
        business_name: lead.business_name,
        category: lead.category,
        city: lead.city,
        state: lead.state,
        website: lead.website_url,
        phone: lead.verified_phone || lead.phone_number,
        description: lead.business_description,
        logo_url: lead.logo_url,
        banner_url: lead.banner_url,
        address: lead.verified_address,
        is_verified: true,
        listing_status: 'live',
      } as any).select('id').single();
      if (insErr) throw insErr;

      // Try to replace stock/placeholder art with the business's own website imagery
      if (inserted?.id && lead.website_url) {
        try {
          const { data: branding } = await supabase.functions.invoke('bulk-refresh-business-branding', {
            body: { ids: [inserted.id] },
          });
          const result = branding?.results?.[0];
          if (result?.status === 'updated') {
            toast.success(`Pulled real photos from ${lead.business_name}'s website`);
          }
        } catch (brandErr) {
          console.warn('Branding refresh failed', brandErr);
        }
      }

      const { error: updErr } = await supabase
        .from('b2b_external_leads')
        .update({ verification_status: 'promoted', verified_at: new Date().toISOString() } as any)
        .eq('id', lead.id);
      if (updErr) throw updErr;

      toast.success(`Approved & published: ${lead.business_name}`);
      await Promise.all([fetchLeads(), fetchCounts()]);
    } catch (e: any) {
      toast.error(e.message || 'Failed to approve');
    } finally {
      setActingId(null);
    }
  };

  const reject = async (lead: Lead) => {
    setActingId(lead.id);
    try {
      const { error } = await supabase
        .from('b2b_external_leads')
        .update({ verification_status: 'rejected' } as any)
        .eq('id', lead.id);
      if (error) throw error;
      toast.success(`Rejected: ${lead.business_name}`);
      await Promise.all([fetchLeads(), fetchCounts()]);
    } catch (e: any) {
      toast.error(e.message || 'Failed to reject');
    } finally {
      setActingId(null);
    }
  };

  // Admin manual verification of Black ownership (click the "Black-owned" badge)
  const markBlackOwned = async (lead: Lead) => {
    setActingId(lead.id);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const email = authData?.user?.email || 'admin';
      const { error } = await supabase
        .from('b2b_external_leads')
        .update({
          black_owned_confidence: 1.0,
          black_owned_evidence: `Manually verified by ${email} on ${new Date().toLocaleDateString()}.`,
        } as any)
        .eq('id', lead.id);
      if (error) throw error;
      toast.success(`Marked as verified Black-owned: ${lead.business_name}`);
      await Promise.all([fetchLeads(), fetchCounts()]);
    } catch (e: any) {
      toast.error(e.message || 'Failed to mark as Black-owned');
    } finally {
      setActingId(null);
    }
  };

  const requeue = async (lead: Lead) => {

    setActingId(lead.id);
    try {
      const { error } = await supabase
        .from('b2b_external_leads')
        .update({ verification_status: 'pending' } as any)
        .eq('id', lead.id);
      if (error) throw error;
      toast.success(`Re-queued: ${lead.business_name}`);
      await Promise.all([fetchLeads(), fetchCounts()]);
    } catch (e: any) {
      toast.error(e.message || 'Failed to re-queue');
    } finally {
      setActingId(null);
    }
  };

  // Bulk-dismiss every lead in the current tab that has no cited proof of Black ownership.
  const [bulkRejecting, setBulkRejecting] = useState(false);
  const bulkRejectUnverifiedOwnership = async () => {
    if (!window.confirm(
      `Reject ALL "${STATUS_LABEL[status]}" leads that have no cited evidence of Black ownership? This cannot be undone in bulk.`
    )) return;
    setBulkRejecting(true);
    try {
      const { error, count } = await supabase
        .from('b2b_external_leads')
        .update({ verification_status: 'rejected' } as any, { count: 'exact' })
        .eq('verification_status', status)
        .is('black_owned_evidence', null);
      if (error) throw error;
      toast.success(`Rejected ${count ?? 0} leads with no ownership evidence.`);
      await Promise.all([fetchLeads(), fetchCounts()]);
    } catch (e: any) {
      toast.error(e.message || 'Bulk reject failed');
    } finally {
      setBulkRejecting(false);
    }
  };

  const runEnrichment = async () => {
    setEnriching(true);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead-emails', {
        body: { limit: 50 },
      });
      if (error) {
        const details = error instanceof Error && (error as any).context
          ? await (error as any).context.text()
          : error.message;
        throw new Error(details || error.message);
      }
      toast.success(`Kayla enriched ${data?.emails_found ?? 0} emails / ${data?.phones_found ?? 0} phones`);
      await fetchEnrichmentStats();
    } catch (e: any) {
      toast.error(e.message || 'Enrichment failed');
    } finally {
      setEnriching(false);
    }
  };

  const summary = useMemo(() => {
    const total = counts.needs_review + counts.pending + counts.promoted + counts.rejected;
    return { total };
  }, [counts]);

  return (
    <>
      <Helmet>
        <title>Business Review Queue | 1325.AI Admin</title>
        <meta name="description" content="Review, approve, or reject Kayla's discovered businesses before they go live in the directory." />
      </Helmet>

      <div className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <Link to="/admin"><ArrowLeft className="h-4 w-4 mr-1" /> Admin</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => { fetchLeads(); fetchCounts(); }}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>

          <header className="space-y-1">
            <h1 className="text-3xl font-bold">Business Review Queue</h1>
            <p className="text-white/60">
              {summary.total.toLocaleString()} leads in pipeline · Kayla's discoveries are staged here before going live.
            </p>
          </header>

          <Card className="bg-slate-900/60 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-mansagold" /> Kayla Contact Enrichment Pass
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={runEnrichment}
                disabled={enriching}
                className="border-white/10 text-white hover:bg-white/10"
              >
                {enriching ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                Enrich 50 now
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-black/30 rounded p-3">
                  <div className="text-white/40 text-xs uppercase">Missing emails</div>
                  <div className="text-xl font-bold text-mansagold">{enrichment.total_missing_email.toLocaleString()}</div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-white/40 text-xs uppercase">Total enriched</div>
                  <div className="text-xl font-bold text-white">{enrichment.total_enriched.toLocaleString()}</div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-white/40 text-xs uppercase">Enriched 24h</div>
                  <div className="text-xl font-bold text-green-400">{enrichment.enriched_24h.toLocaleString()}</div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-white/40 text-xs uppercase">Runs today</div>
                  <div className="text-xl font-bold text-white/80">{enrichment.run_today.toLocaleString()}</div>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-3">
                Kayla scrapes public business websites and uses AI to extract owner/operator emails with confidence scores.
                Auto-runs daily at ~500 leads/day. Manual runs process 50 leads.
              </p>
            </CardContent>
          </Card>

          <Tabs value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <TabsList className="bg-slate-900/60 border border-white/10">
              {STATUS_COUNT_KEYS.map(s => (
                <TabsTrigger key={s} value={s} className="capitalize text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">
                  {STATUS_LABEL[s]} <Badge variant="secondary" className="ml-2 bg-white/10 text-white border-white/10">{counts[s]}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <OwnershipSpotCheckCard />

          <OwnershipAuditCard />

          <DeadLinkAuditCard />




          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-sm flex-1 min-w-[220px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
                className="pl-9 bg-slate-900/60 border-white/10"
              />
            </div>
            {(status === 'needs_review' || status === 'pending') && (
              <Button
                variant="outline"
                size="sm"
                disabled={bulkRejecting}
                onClick={bulkRejectUnverifiedOwnership}
                className="border-red-400/40 text-red-200 hover:bg-red-500/10"
              >
                {bulkRejecting
                  ? <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  : <AlertTriangle className="h-4 w-4 mr-1" />}
                Reject all with no ownership evidence
              </Button>
            )}
          </div>


          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/60">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
            </div>
          ) : leads.length === 0 ? (
            <Card className="bg-slate-900/60 border-white/10">
              <CardContent className="p-10 text-center text-white/60">
                Nothing in “{STATUS_LABEL[status]}”. 🎉
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {leads.map(lead => {
                const notes = (lead.verification_notes && typeof lead.verification_notes === 'object')
                  ? (lead.verification_notes as Record<string, unknown>) : {};
                const reasons = Array.isArray((notes as any).reasons) ? (notes as any).reasons as string[] : [];
                const ownershipOk = lead.black_owned_confidence !== null
                  && Number(lead.black_owned_confidence) >= 0.7
                  && !!lead.black_owned_evidence;
                return (
                  <Card key={lead.id} className="bg-slate-900/60 border-white/10">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {lead.logo_url ? (
                          <img src={lead.logo_url} alt="" className="h-12 w-12 rounded object-contain bg-white/5" />
                        ) : (
                          <div className="h-12 w-12 rounded bg-white/10 flex items-center justify-center text-mansagold font-bold">
                            {lead.business_name?.[0] ?? '?'}
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{lead.business_name}</CardTitle>
                          <p className="text-sm text-white/60">
                            {lead.category} · {lead.city}{lead.state ? `, ${lead.state}` : ''}
                          </p>
                          {lead.website_url && (
                            <a href={lead.website_url} target="_blank" rel="noreferrer"
                               className="text-xs text-mansagold inline-flex items-center gap-1 mt-1">
                              {lead.website_url} <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-1 shrink-0">
                        {lead.confidence_score !== null && (
                          <Badge variant="outline" className="text-xs text-white border-white/30 block">
                            real business {(Number(lead.confidence_score) * 100).toFixed(0)}%
                          </Badge>
                        )}
                        <button
                          type="button"
                          onClick={() => markBlackOwned(lead)}
                          disabled={actingId === lead.id}
                          title={ownershipOk ? 'Ownership verified' : 'Click to mark as verified Black-owned'}
                          className="block w-full disabled:opacity-50"
                        >
                          <Badge
                            variant="outline"
                            className={
                              ownershipOk
                                ? 'text-xs text-emerald-200 border-emerald-400/50 bg-emerald-500/10 block cursor-pointer hover:bg-emerald-500/20'
                                : 'text-xs text-red-200 border-red-400/50 bg-red-500/10 block cursor-pointer hover:bg-red-500/20'
                            }
                          >
                            {lead.black_owned_confidence !== null
                              ? `Black-owned ${(Number(lead.black_owned_confidence) * 100).toFixed(0)}%`
                              : 'Black-owned: unverified'}
                          </Badge>
                        </button>

                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {lead.business_description && (
                        <p className="text-sm text-white/70">{lead.business_description}</p>
                      )}
                      {ownershipOk ? (
                        <p className="text-xs text-emerald-200/90 bg-emerald-500/10 border border-emerald-500/30 rounded p-2">
                          <span className="text-white/50">Ownership evidence:</span> {lead.black_owned_evidence}
                        </p>
                      ) : (
                        <div className="flex items-start gap-2 text-sm bg-red-500/10 border border-red-500/30 rounded p-2">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                          <p className="text-red-200/90">
                            No cited evidence that this business is Black-owned. The score on the left only means
                            the business is real and open. Verify manually before publishing, or reject.
                          </p>
                        </div>
                      )}
                      {reasons.length > 0 && (
                        <div className="flex items-start gap-2 text-sm bg-amber-500/10 border border-amber-500/30 rounded p-2">
                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                          <ul className="space-y-0.5">
                            {reasons.map((r, i) => <li key={i} className="text-amber-200/90">• {r}</li>)}
                          </ul>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/60">
                        <div><span className="text-white/40">Perplexity phone:</span> {lead.phone_number || '—'}</div>
                        <div><span className="text-white/40">Site phone:</span> {lead.verified_phone || '—'}</div>
                        <div className="md:col-span-2"><span className="text-white/40">Site address:</span> {lead.verified_address || '—'}</div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          size="sm"
                          className="bg-mansagold text-black hover:bg-mansagold/90"
                          disabled={actingId === lead.id}
                          onClick={() => approve(lead)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approve & Publish
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          disabled={actingId === lead.id}
                          onClick={() => requeue(lead)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" /> Re-verify
                        </Button>
                        <Button
                          size="sm" variant="destructive"
                          disabled={actingId === lead.id}
                          onClick={() => reject(lead)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessReviewQueue;
