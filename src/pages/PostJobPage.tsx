import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const PostJobPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company_name: '',
    location: '',
    remote_ok: false,
    employment_type: 'full_time',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    description: '',
    apply_url: '',
    apply_email: '',
  });

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to post a job.');
      navigate('/login?redirect=/jobs/post');
      return;
    }
    if (!form.apply_url && !form.apply_email) {
      toast.error('Provide an apply URL or apply email.');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-job-post-checkout', {
        body: {
          ...form,
          salary_min: form.salary_min ? parseInt(form.salary_min, 10) : null,
          salary_max: form.salary_max ? parseInt(form.salary_max, 10) : null,
        },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else throw new Error('No checkout URL returned');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to start checkout');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Post a Job – 1325.AI</title>
        <meta name="description" content="Post a job to the 1325.AI community for $99 (30 days)." />
      </Helmet>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-mansagold" />
            Post a Job
          </h1>
          <p className="text-muted-foreground mt-2">
            $99 flat — your listing stays live for 30 days.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
            <CardDescription>You'll be sent to Stripe to complete payment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job title *</Label>
                <Input id="title" required value={form.title} onChange={(e) => update('title', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="company_name">Company *</Label>
                <Input id="company_name" required value={form.company_name} onChange={(e) => update('company_name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Chicago, IL" value={form.location} onChange={(e) => update('location', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="employment_type">Type</Label>
                  <Select value={form.employment_type} onValueChange={(v) => update('employment_type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remote_ok" checked={form.remote_ok} onCheckedChange={(v) => update('remote_ok', !!v)} />
                <Label htmlFor="remote_ok" className="font-normal cursor-pointer">Remote OK</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="salary_min">Salary min (optional)</Label>
                  <Input id="salary_min" type="number" value={form.salary_min} onChange={(e) => update('salary_min', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="salary_max">Salary max (optional)</Label>
                  <Input id="salary_max" type="number" value={form.salary_max} onChange={(e) => update('salary_max', e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" required rows={8} value={form.description} onChange={(e) => update('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="apply_url">Apply URL</Label>
                  <Input id="apply_url" type="url" placeholder="https://…" value={form.apply_url} onChange={(e) => update('apply_url', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="apply_email">Apply email</Label>
                  <Input id="apply_email" type="email" placeholder="jobs@…" value={form.apply_email} onChange={(e) => update('apply_email', e.target.value)} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Provide at least one application method.</p>

              <Button type="submit" disabled={submitting} size="lg" className="w-full bg-mansagold text-mansablue hover:bg-mansagold/90">
                <CreditCard className="h-4 w-4 mr-2" />
                {submitting ? 'Redirecting to checkout…' : 'Pay $99 & Publish'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
