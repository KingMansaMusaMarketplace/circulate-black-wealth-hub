import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ShieldQuestion, ThumbsUp, ThumbsDown, ExternalLink, Loader2, RefreshCw, CheckCircle2,
} from 'lucide-react';

const MIN = 0.85;
const SAMPLE_SIZE = 50;

type SampleLead = {
  id: string;
  business_name: string;
  category: string | null;
  city: string | null;
  state: string | null;
  website_url: string | null;
  business_description: string | null;
  confidence_score: number | null;
  black_owned_confidence: number | null;
  black_owned_evidence: string | null;
};

const pct = (n: number | null) => (n == null ? '—' : `${Math.round(n * 100)}%`);

/**
 * Spot-check tool: pull a random sample of leads that clear both 85% bars and
 * let an admin confirm or reject each one, so we can measure how trustworthy the
 * 85% gate is before considering any auto-approval.
 */
const OwnershipSpotCheckCard: React.FC = () => {
  const [qualifying, setQualifying] = useState<number | null>(null);
  const [sample, setSample] = useState<SampleLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const baseFilter = useCallback(
    (q: any) =>
      q
        .gte('confidence_score', MIN)
        .gte('black_owned_confidence', MIN)
        .eq('is_converted', false)
        .in('verification_status', ['needs_review', 'pending']),
    []
  );

  const fetchCount = useCallback(async () => {
    const { count, error } = await baseFilter(
      supabase.from('b2b_external_leads').select('id', { count: 'exact', head: true })
    );
    if (error) {
      toast.error(error.message);
      return;
    }
    setQualifying(count ?? 0);
  }, [baseFilter]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  const drawSample = async () => {
    setLoading(true);
    try {
      const { count } = await baseFilter(
        supabase.from('b2b_external_leads').select('id', { count: 'exact', head: true })
      );
      const total = count ?? 0;
      setQualifying(total);
      if (total === 0) {
        setSample([]);
        toast.info('No leads currently clear both 85% bars.');
        return;
      }
      const maxOffset = Math.max(0, total - SAMPLE_SIZE);
      const offset = Math.floor(Math.random() * (maxOffset + 1));
      const { data, error } = await baseFilter(
        supabase
          .from('b2b_external_leads')
          .select(
            'id,business_name,category,city,state,website_url,business_description,confidence_score,black_owned_confidence,black_owned_evidence'
          )
      )
        .order('created_at', { ascending: false })
        .range(offset, offset + SAMPLE_SIZE - 1);
      if (error) throw error;
      setSample((data ?? []) as SampleLead[]);
      setCorrect(0);
      setWrong(0);
    } catch (e: any) {
      toast.error(e.message || 'Could not draw a sample');
    } finally {
      setLoading(false);
    }
  };

  const confirmGood = async (lead: SampleLead) => {
    setActingId(lead.id);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const ownerId = authData?.user?.id;
      if (!ownerId) throw new Error('You must be signed in as an admin.');

      const { error: insErr } = await supabase.from('businesses').insert({
        owner_id: ownerId,
        name: lead.business_name,
        business_name: lead.business_name,
        category: lead.category,
        city: lead.city,
        state: lead.state,
        website: lead.website_url,
        description: lead.business_description,
        is_verified: true,
        listing_status: 'live',
      } as any);
      if (insErr) throw insErr;

      const { error: updErr } = await supabase
        .from('b2b_external_leads')
        .update({ verification_status: 'promoted', verified_at: new Date().toISOString() } as any)
        .eq('id', lead.id);
      if (updErr) throw updErr;

      setCorrect((c) => c + 1);
      setSample((s) => s.filter((l) => l.id !== lead.id));
      toast.success(`Confirmed & published: ${lead.business_name}`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to confirm');
    } finally {
      setActingId(null);
    }
  };

  const markWrong = async (lead: SampleLead) => {
    setActingId(lead.id);
    try {
      const { error } = await supabase
        .from('b2b_external_leads')
        .update({ verification_status: 'rejected' } as any)
        .eq('id', lead.id);
      if (error) throw error;
      setWrong((w) => w + 1);
      setSample((s) => s.filter((l) => l.id !== lead.id));
      toast.success(`Marked as not Black-owned: ${lead.business_name}`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to reject');
    } finally {
      setActingId(null);
    }
  };

  const judged = correct + wrong;
  const accuracy = judged ? Math.round((correct / judged) * 100) : null;

  let verdict: { tone: string; text: string } | null = null;
  if (judged >= 20) {
    if (wrong === 0) verdict = { tone: 'text-emerald-400', text: 'Excellent so far — the 85% gate looks trustworthy.' };
    else if (wrong <= 2) verdict = { tone: 'text-emerald-400', text: 'Looking good — a small error rate at this level is acceptable.' };
    else if (wrong <= 4) verdict = { tone: 'text-amber-400', text: 'Borderline — consider raising the bar to 90% before automating.' };
    else verdict = { tone: 'text-red-400', text: 'Too many misses — do NOT auto-approve at 85%. Raise the bar and retest.' };
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ShieldQuestion className="h-5 w-5 text-mansagold" />
          Ownership Spot Check (85%+ / 85%+)
        </CardTitle>
        <p className="text-sm text-white/60">
          Draw a random sample of leads that score 85%+ on both "real business" and "Black-owned".
          Judge them quickly to find out whether the 85% line is safe enough to auto-approve.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60">Qualifying leads</div>
            <div className="text-2xl font-semibold text-white">{qualifying ?? '—'}</div>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60">In this sample</div>
            <div className="text-2xl font-semibold text-white">{sample.length}</div>
          </div>
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
            <div className="text-xs text-emerald-300">Confirmed correct</div>
            <div className="text-2xl font-semibold text-emerald-300">{correct}</div>
          </div>
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <div className="text-xs text-red-300">Wrong</div>
            <div className="text-2xl font-semibold text-red-300">{wrong}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={drawSample} disabled={loading} className="bg-mansagold text-mansablue hover:bg-mansagold/90">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Draw {SAMPLE_SIZE} random leads
          </Button>
          {accuracy !== null && (
            <span className="text-sm text-white/70">
              Accuracy so far: <strong className="text-white">{accuracy}%</strong> ({judged} judged)
            </span>
          )}
        </div>

        {verdict && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-start gap-2">
            <CheckCircle2 className={`h-4 w-4 mt-0.5 ${verdict.tone}`} />
            <span className={`text-sm ${verdict.tone}`}>{verdict.text}</span>
          </div>
        )}

        <div className="space-y-3">
          {sample.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-white">{lead.business_name}</div>
                  <div className="text-xs text-white/60">
                    {[lead.category, [lead.city, lead.state].filter(Boolean).join(', ')].filter(Boolean).join(' • ')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/10 text-white border-white/20">
                    Real business {pct(lead.confidence_score)}
                  </Badge>
                  <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                    Black-owned {pct(lead.black_owned_confidence)}
                  </Badge>
                </div>
              </div>

              {lead.black_owned_evidence && (
                <p className="mt-3 text-sm text-white/80">
                  <span className="text-white/50">Evidence: </span>
                  {lead.black_owned_evidence}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {lead.website_url && (
                  <a
                    href={lead.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-mansagold hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open website
                  </a>
                )}
                <div className="flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                  disabled={actingId === lead.id}
                  onClick={() => confirmGood(lead)}
                >
                  {actingId === lead.id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ThumbsUp className="h-4 w-4 mr-1" />}
                  Correct — publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                  disabled={actingId === lead.id}
                  onClick={() => markWrong(lead)}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Wrong — reject
                </Button>
              </div>
            </div>
          ))}

          {!loading && sample.length === 0 && (
            <p className="text-sm text-white/50">
              No sample drawn yet. Click "Draw {SAMPLE_SIZE} random leads" to begin.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnershipSpotCheckCard;
