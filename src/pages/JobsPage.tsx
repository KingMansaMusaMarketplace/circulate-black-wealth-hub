import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, ExternalLink, Plus, Mail } from 'lucide-react';
import { toast } from 'sonner';

type Job = {
  id: string;
  title: string;
  company_name: string;
  location: string | null;
  remote_ok: boolean;
  employment_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  description: string;
  apply_url: string | null;
  apply_email: string | null;
  created_at: string;
  expires_at: string | null;
};

const formatSalary = (j: Job) => {
  if (!j.salary_min && !j.salary_max) return null;
  const fmt = (n: number) => `${j.salary_currency} ${n.toLocaleString()}`;
  if (j.salary_min && j.salary_max) return `${fmt(j.salary_min)} – ${fmt(j.salary_max)}`;
  return fmt((j.salary_min ?? j.salary_max)!);
};

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get('posted') === 'success') {
      toast.success('Job posted! It may take a moment to appear.');
    }
  }, [params]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'active')
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) toast.error(error.message);
      setJobs((data ?? []) as Job[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]">
      <Helmet>
        <title>Job Board – 1325.AI</title>
        <meta name="description" content="Find jobs at Black-owned and mission-aligned businesses on the 1325.AI job board." />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <div className="container mx-auto px-4 py-10 max-w-5xl relative z-10">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-mansagold" />
              Job Board
            </h1>
            <p className="text-muted-foreground mt-2">
              Open roles across the 1325.AI community.
            </p>
          </div>
          <Button asChild size="lg" className="bg-mansagold text-mansablue hover:bg-mansagold/90">
            <Link to="/jobs/post"><Plus className="h-4 w-4 mr-2" />Post a Job — $99</Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No active job postings yet.</p>
              <Button asChild><Link to="/jobs/post">Be the first to post</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((j) => {
              const salary = formatSalary(j);
              return (
                <Card key={j.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <CardTitle className="text-xl">{j.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{j.company_name}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{j.employment_type.replace('_', ' ')}</Badge>
                        {j.remote_ok && <Badge variant="outline">Remote OK</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      {j.location && (
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{j.location}</span>
                      )}
                      {salary && (
                        <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{salary}</span>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap line-clamp-4 mb-4">{j.description}</p>
                    <Button asChild size="sm">
                      <a
                        href={j.apply_url || `mailto:${j.apply_email}`}
                        target={j.apply_url ? '_blank' : undefined}
                        rel="noopener noreferrer"
                      >
                        Apply <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
