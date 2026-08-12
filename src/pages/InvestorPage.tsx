import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, FileText, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string().trim().min(2, 'Full name required').max(120),
  email: z.string().trim().email('Valid email required').max(255),
  firm: z.string().trim().min(2, 'Firm name required').max(160),
  title: z.string().trim().max(120).optional(),
  aum: z.string().trim().max(80).optional(),
  linkedin_url: z.string().trim().url('Must be a valid URL').max(255).optional().or(z.literal('')),
  reason: z.string().trim().max(1000).optional(),
});

const InvestorPage: React.FC = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', firm: '', title: '', aum: '', linkedin_url: '', reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = requestSchema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
      toast({ title: 'Please fix the form', description: first ?? 'Invalid input', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('request-investor-access', {
        body: parsed.data,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Request received', description: 'We will review and reach out within 48 hours.' });
    } catch (err: any) {
      toast({
        title: 'Something went wrong',
        description: err?.message ?? 'Please email invest@1325.ai directly.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Investor Relations | 1325.AI</title>
        <meta name="description" content="Request access to the 1325.AI investor data room. NDA-gated. Serious institutional investors only." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <Badge className="bg-mansagold/15 text-mansagold border border-mansagold/40 mb-6">
            <Lock className="h-3.5 w-3.5 mr-1.5" /> NDA-Gated Data Room
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Investor Relations
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
            1325.AI is building the <span className="text-mansagold font-semibold">MCP infrastructure layer for the $12T global Black economy</span> — a discovery, commerce, and intelligence rail that AI agents (ChatGPT, Claude, Cursor, Gemini) already query in production.
          </p>
          <p className="text-base text-slate-400 max-w-3xl mt-4">
            Detailed metrics, financial model, patent claims, agent roster, cap table, and pitch materials are shared only with vetted investors under NDA. Request access below.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Shield, title: 'Category', body: 'AI infrastructure + vertical marketplace. Live MCP server in the official registry.' },
          { icon: FileText, title: 'Stage', body: 'Pre-revenue infrastructure play. Raising to accelerate distribution, not to prove the tech.' },
          { icon: Lock, title: 'Protection', body: 'U.S. Provisional Patent Application No. 63/969,202 — 45 claims pending.' },
        ].map(({ icon: Icon, title, body }) => (
          <Card key={title} className="bg-white/[0.03] border-white/10 p-6">
            <Icon className="h-6 w-6 text-mansagold mb-3" />
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
          </Card>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <Card className="bg-white/[0.03] border-white/10 p-6 md:p-10">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-14 w-14 text-mansagold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Request received</h2>
              <p className="text-slate-300 max-w-md mx-auto">
                Thank you. Our team will review your request and reach out within 48 hours with next steps and the NDA.
              </p>
              <Button asChild variant="outline" className="mt-8 border-white/20 text-white hover:bg-white/10">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Request Investor Access</h2>
              <p className="text-sm text-slate-400 mb-8">
                Every request is reviewed by hand. Please use your firm email. Approved investors receive an NDA and a passcode for the data room within 48 hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Full name *</Label>
                    <Input id="name" required value={form.name} onChange={upd('name')} className="bg-black/40 border-white/15 text-white mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Firm email *</Label>
                    <Input id="email" type="email" required value={form.email} onChange={upd('email')} className="bg-black/40 border-white/15 text-white mt-1.5" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firm" className="text-white">Firm / Fund *</Label>
                    <Input id="firm" required value={form.firm} onChange={upd('firm')} className="bg-black/40 border-white/15 text-white mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input id="title" value={form.title} onChange={upd('title')} className="bg-black/40 border-white/15 text-white mt-1.5" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aum" className="text-white">AUM / Fund size</Label>
                    <Input id="aum" placeholder="e.g. $250M Fund II" value={form.aum} onChange={upd('aum')} className="bg-black/40 border-white/15 text-white mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url" className="text-white">LinkedIn URL</Label>
                    <Input id="linkedin_url" placeholder="https://linkedin.com/in/…" value={form.linkedin_url} onChange={upd('linkedin_url')} className="bg-black/40 border-white/15 text-white mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason" className="text-white">Why 1325.AI? (optional)</Label>
                  <Textarea id="reason" rows={4} value={form.reason} onChange={upd('reason')} className="bg-black/40 border-white/15 text-white mt-1.5" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold rounded-xl h-12">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Request Access <ArrowRight className="h-4 w-4 ml-2" /></>)}
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  By requesting access you agree that materials shared under NDA are confidential and governed by Illinois law.
                </p>
              </form>
            </>
          )}
        </Card>
        <p className="text-center text-sm text-slate-500 mt-8">
          Prefer direct outreach? Email <a className="text-mansagold hover:underline" href="mailto:invest@1325.ai">invest@1325.ai</a>
        </p>
      </section>
    </div>
  );
};

export default InvestorPage;
