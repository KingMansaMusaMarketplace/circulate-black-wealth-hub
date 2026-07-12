import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2, XCircle, AlertCircle, ExternalLink, Loader2, RefreshCw,
} from 'lucide-react';

type Submission = {
  id: string;
  business_name: string;
  website: string;
  email: string;
  phone: string;
  owner_name: string;
  city: string;
  state: string;
  category: string;
  status: string;
  kayla_report: any;
  confidence_score: number | null;
  admin_notes: string | null;
  created_at: string;
  approved_business_id: string | null;
};

const statusColor = (status: string) => {
  switch (status) {
    case 'pending_review': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    case 'pending_verification': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/40';
    case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/40';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
  }
};

const scoreColor = (score: number | null) => {
  if (score === null) return 'text-gray-400';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

const checkIcon = (status: string) => {
  if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />;
  if (status === 'warn') return <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
};

const SubmissionsQueue: React.FC = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('business_submissions')
      .select('*')
      .in('status', ['pending_review', 'pending_verification', 'needs_more_info'])
      .order('confidence_score', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
    } else {
      setSubmissions((data ?? []) as Submission[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const runAction = async (
    id: string,
    action: 'approve' | 'reject' | 'needs_more_info',
  ) => {
    setBusy(id);
    try {
      const { data, error } = await supabase.functions.invoke('approve-business-submission', {
        body: { submission_id: id, action, admin_notes: notes[id] ?? null },
      });
      if (error) throw error;
      toast({
        title: `Submission ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged'}`,
        description: (data as any)?.listing_url ? `Listing live at ${(data as any).listing_url}` : undefined,
      });
      await load();
    } catch (err: any) {
      toast({ title: 'Action failed', description: err?.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const rerunKayla = async (id: string) => {
    setBusy(id);
    try {
      const { error } = await supabase.functions.invoke('verify-business-submission', {
        body: { submission_id: id },
      });
      if (error) throw error;
      toast({ title: 'Kayla verification re-run' });
      await load();
    } catch (err: any) {
      toast({ title: 'Re-run failed', description: err?.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Business Submissions</h1>
            <p className="text-white/60 mt-1">
              Review businesses submitted from the homepage. Kayla has already run initial verification.
            </p>
          </div>
          <Button onClick={load} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/60">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
            Loading submissions…
          </div>
        ) : submissions.length === 0 ? (
          <Card className="p-12 text-center bg-white/5 border-white/10">
            <p className="text-white/60">No pending submissions. 🎉</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {submissions.map((s) => (
              <Card key={s.id} className="p-6 bg-white/5 border-white/10">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold">{s.business_name}</h2>
                      <Badge className={statusColor(s.status)}>{s.status}</Badge>
                    </div>
                    <p className="text-white/60 text-sm">
                      {s.category} · {s.city}, {s.state}
                    </p>
                  </div>
                  <div className={`text-right ${scoreColor(s.confidence_score)}`}>
                    <div className="text-3xl font-bold">
                      {s.confidence_score ?? '—'}
                    </div>
                    <div className="text-xs uppercase tracking-wider">Kayla score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-white/50">Website: </span>
                    <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-mansagold hover:underline inline-flex items-center gap-1">
                      {s.website} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div><span className="text-white/50">Owner: </span>{s.owner_name}</div>
                  <div><span className="text-white/50">Email: </span>{s.email}</div>
                  <div><span className="text-white/50">Phone: </span>{s.phone}</div>
                </div>

                {s.kayla_report?.checks && (
                  <div className="bg-black/40 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-mansagold mb-3">
                      Kayla's verification report
                    </h3>
                    <div className="space-y-2 mb-3">
                      {s.kayla_report.checks.map((c: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          {checkIcon(c.status)}
                          <div>
                            <span className="text-white/90 font-medium">{c.name}: </span>
                            <span className="text-white/70">{c.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {s.kayla_report.llm_summary && (
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <p className="text-xs text-mansagold uppercase tracking-wider mb-1">Kayla's verdict</p>
                        <p className="text-sm text-white/80 italic">{s.kayla_report.llm_summary}</p>
                      </div>
                    )}
                  </div>
                )}

                <Textarea
                  placeholder="Admin notes (optional — visible to your team only)"
                  value={notes[s.id] ?? ''}
                  onChange={(e) => setNotes((n) => ({ ...n, [s.id]: e.target.value }))}
                  className="bg-white/5 border-white/10 mb-4"
                  rows={2}
                />

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => runAction(s.id, 'approve')}
                    disabled={busy === s.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {busy === s.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Approve & Publish
                  </Button>
                  <Button
                    onClick={() => runAction(s.id, 'reject')}
                    disabled={busy === s.id}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => runAction(s.id, 'needs_more_info')}
                    disabled={busy === s.id}
                    variant="outline"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Needs more info
                  </Button>
                  <Button
                    onClick={() => rerunKayla(s.id)}
                    disabled={busy === s.id}
                    variant="ghost"
                    className="ml-auto"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-run Kayla
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsQueue;
