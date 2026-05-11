import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

type Job = {
  id: string;
  title: string;
  company_name: string;
  status: string;
  amount_cents: number;
  paid_at: string | null;
  expires_at: string | null;
  created_at: string;
  rejection_reason: string | null;
  description: string;
};

const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending_payment' | 'rejected'>('all');

  const load = async () => {
    setLoading(true);
    let q = supabase.from('job_postings').select('*').order('created_at', { ascending: false }).limit(200);
    if (filter !== 'all') q = q.eq('status', filter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setJobs((data ?? []) as Job[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const reject = async (id: string) => {
    const reason = prompt('Rejection reason?');
    if (!reason) return;
    const { error } = await supabase.from('job_postings').update({ status: 'rejected', rejection_reason: reason }).eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Rejected'); load(); }
  };

  const reactivate = async (id: string) => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from('job_postings').update({ status: 'active', expires_at: expires, rejection_reason: null }).eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Reactivated'); load(); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]">
      <Helmet>
        <title>Job Board Moderation – Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase className="h-7 w-7 text-mansagold" />
              Job Board Moderation
            </h1>
            <p className="text-muted-foreground mt-1">Review, reject, or reactivate job postings.</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'pending_payment', 'rejected'] as const).map((f) => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
                {f.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : jobs.length === 0 ? (
          <p className="text-muted-foreground">No job postings.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <Card key={j.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="text-lg">{j.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{j.company_name}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={j.status === 'active' ? 'default' : 'secondary'}>{j.status}</Badge>
                      <Badge variant="outline">${(j.amount_cents / 100).toFixed(2)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3 mb-3 whitespace-pre-wrap">{j.description}</p>
                  {j.rejection_reason && (
                    <p className="text-sm text-destructive mb-3">Rejected: {j.rejection_reason}</p>
                  )}
                  <div className="text-xs text-muted-foreground mb-3">
                    Created {new Date(j.created_at).toLocaleString()}
                    {j.paid_at && ` · Paid ${new Date(j.paid_at).toLocaleString()}`}
                    {j.expires_at && ` · Expires ${new Date(j.expires_at).toLocaleString()}`}
                  </div>
                  <div className="flex gap-2">
                    {j.status === 'active' && (
                      <Button size="sm" variant="destructive" onClick={() => reject(j.id)}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    )}
                    {j.status === 'rejected' && (
                      <Button size="sm" onClick={() => reactivate(j.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Reactivate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobsPage;
