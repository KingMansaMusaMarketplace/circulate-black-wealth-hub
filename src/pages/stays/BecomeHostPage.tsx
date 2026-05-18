import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Home, DollarSign, Shield, Users, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BecomeHostPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    property_type: '',
    notes: '',
    agreed: false,
  });

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) {
      toast.error('Please accept the Hosting Agreement to continue.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('host_applications').insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        property_type: form.property_type,
        notes: form.notes,
        status: 'pending',
      } as any);
      if (error) throw error;
      setSubmitted(true);
      toast.success("Application received! We'll be in touch within 24 hours.");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Could not submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050a18] to-[#030712] text-white">
      <Helmet>
        <title>List Your Property — Become a Mansa Stays Host | 1325.AI</title>
        <meta
          name="description"
          content="Earn more with lower fees. Join Mansa Stays as a Black-owned hospitality host. Vacation rentals + monthly leases, AI-powered tools, community-backed bookings."
        />
        <meta property="og:title" content="Become a Mansa Stays Host" />
        <meta property="og:description" content="Lower fees. Verified guests. Real community impact." />
        <link rel="canonical" href="https://www.1325.ai/stays/become-a-host" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Become a Mansa Stays Host',
            description: 'Apply to list your property on Mansa Stays.',
            url: 'https://www.1325.ai/stays/become-a-host',
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-mansagold/10 border border-mansagold/30 text-mansagold text-xs font-semibold mb-4">
          MANSA STAYS · HOST PROGRAM
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          List your property. <span className="text-mansagold">Keep more.</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Join the largest network of Black-owned hospitality. Vacation rentals and long-term
          leases, both supported. We review applications within 24 hours.
        </p>
      </section>

      {/* Value props */}
      <section className="px-4 max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: DollarSign, title: 'Lower Fees', body: '7.5% guest service fee — well below the major platforms. More money in your pocket per booking.' },
          { icon: Shield, title: 'Verified Trust', body: 'AI photo moderation, host approval, reporting tools, and community-backed reviews. Bad actors are filtered out.' },
          { icon: Users, title: 'Real Community', body: 'Guests come here specifically to support Black hosts. Higher booking intent. Less price-shopping.' },
        ].map((v) => (
          <Card key={v.title} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <v.icon className="w-8 h-8 text-mansagold mb-3" />
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-slate-400">{v.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Application form */}
      <section className="px-4 max-w-2xl mx-auto pb-24">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-mansagold mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Application received!</h2>
                <p className="text-slate-400 mb-6">
                  We'll review your details and reach out within 24 hours.
                </p>
                <Button onClick={() => navigate('/stays')} className="bg-mansagold text-black hover:bg-mansagold/90">
                  Browse Mansa Stays
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  <Home className="w-6 h-6 text-mansagold" />
                  Apply to Host
                </h2>
                <p className="text-sm text-slate-400 mb-4">Takes 60 seconds. No commitment.</p>

                <div>
                  <Label className="text-white">Full Name *</Label>
                  <Input required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Email *</Label>
                    <Input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-white">Phone</Label>
                    <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">City / Market *</Label>
                    <Input required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="e.g. Chicago, IL" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-white">Property Type *</Label>
                    <select
                      required
                      value={form.property_type}
                      onChange={(e) => set('property_type', e.target.value)}
                      className="w-full h-10 rounded-md bg-slate-800 border border-slate-700 text-white px-3"
                    >
                      <option value="">Select...</option>
                      <option value="vacation_rental">Vacation Rental (short-term)</option>
                      <option value="lease">Apartment / House (long-term lease)</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Tell us about your property</Label>
                  <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className="bg-slate-800 border-slate-700 text-white" placeholder="Size, location highlights, when you'd like to launch..." />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Checkbox id="agree" checked={form.agreed} onCheckedChange={(c) => set('agreed', !!c)} />
                  <Label htmlFor="agree" className="text-sm text-slate-300 leading-snug">
                    I have read and accept the{' '}
                    <a href="/legal/hosting-agreement" target="_blank" className="text-mansagold underline">Hosting Agreement</a>{' '}
                    and{' '}
                    <a href="/legal/photo-consent" target="_blank" className="text-mansagold underline">Photo Upload Consent</a>.
                  </Label>
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-mansagold text-black hover:bg-mansagold/90 mt-2">
                  {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Application'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default BecomeHostPage;
