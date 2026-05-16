import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, Plane, ShieldCheck, ClipboardList, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { submitHotelPartnerApplication } from '@/lib/api/noir-hotel-partners-api';

const benefits = [
  { icon: ShieldCheck, title: 'Vetted Black-owned drivers', text: 'Every driver passes a manual document review — license, insurance, vehicle photos — before they ever pick up a guest.' },
  { icon: Plane, title: 'Built for airport runs', text: 'Flight number on every booking. Meet-and-greet add-on at ORD and MDW. Reliable scheduled pickups, never on-demand chaos.' },
  { icon: ClipboardList, title: 'Concierge portal', text: 'Your front desk books rides for guests in 30 seconds, sees today\'s pickups, and gets one monthly invoice instead of per-ride charges.' },
];

const HotelPartnersPage: React.FC = () => {
  const [form, setForm] = useState({
    hotel_name: '', contact_name: '', contact_email: '', contact_phone: '',
    address_city: 'Chicago', address_state: 'IL', website_url: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await submitHotelPartnerApplication(form);
    setSubmitting(false);
    if (error) return toast.error('Submission failed: ' + error.message);
    setSubmitted(true);
    toast.success('Application received — we\'ll be in touch within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Hotel & Corporate Partners | Noire Rideshare</title>
        <meta name="description" content="Premium Black-owned airport and hotel transport for Chicago hotels. Vetted drivers, flight tracking, meet-and-greet, monthly invoicing." />
      </Helmet>

      <section className="pt-24 pb-16 border-b border-white/5">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-mansagold bg-mansagold/10 border border-mansagold/30 px-3 py-1 rounded-full mb-6">For Hotels & Corporate Travel</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            The premium <span className="text-mansagold">airport transport</span> your guests deserve.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Noire is Chicago's Black-owned, scheduled-only ride service for hotels and corporate travel managers.
            No surge pricing. No no-shows. One monthly invoice.
          </p>
          <Button asChild size="lg" className="bg-mansagold hover:bg-amber-500 text-black font-bold rounded-xl">
            <a href="#apply">Apply to Partner <ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
        </div>
      </section>

      <section className="py-20 border-b border-white/5">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why hotels choose Noire</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <Card key={b.title} className="bg-white/5 border-white/10">
                <CardHeader>
                  <b.icon className="h-8 w-8 text-mansagold mb-3" />
                  <CardTitle className="text-white">{b.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-white/60 text-sm leading-relaxed">{b.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-white/5 bg-gradient-to-b from-transparent via-mansagold/5 to-transparent">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">How the pilot works</h2>
          <ol className="space-y-4 text-white/70">
            {[
              'You submit the partner application below.',
              'We meet your front desk team (in person or Zoom) and walk through the concierge portal — takes 15 minutes.',
              'First 30 days are free. Your guests book through your concierge, we handle dispatch.',
              'After the pilot, you choose per-ride billing or monthly net-30 invoicing.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mansagold/20 border border-mansagold/40 text-mansagold font-bold flex items-center justify-center">{i + 1}</span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="py-20">
        <div className="container max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Apply to partner</h2>
          <p className="text-white/50 text-center mb-8">We respond within one business day.</p>

          {submitted ? (
            <Card className="bg-mansagold/10 border-mansagold/30">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-mansagold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Application received</h3>
                <p className="text-white/70">We'll email {form.contact_email} within 24 hours to schedule your concierge demo.</p>
                <Button asChild variant="outline" className="mt-6 border-mansagold/30 text-mansagold">
                  <Link to="/noir">Back to Noire</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-white">Hotel name *</Label>
                    <Input required value={form.hotel_name} onChange={(e) => setForm({ ...form, hotel_name: e.target.value })} className="bg-black/40 border-white/10 text-white mt-1" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-white">City</Label>
                      <Input value={form.address_city} onChange={(e) => setForm({ ...form, address_city: e.target.value })} className="bg-black/40 border-white/10 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-white">State</Label>
                      <Input value={form.address_state} onChange={(e) => setForm({ ...form, address_state: e.target.value })} className="bg-black/40 border-white/10 text-white mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Your name *</Label>
                    <Input required value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="bg-black/40 border-white/10 text-white mt-1" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-white">Email *</Label>
                      <Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="bg-black/40 border-white/10 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-white">Phone</Label>
                      <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="bg-black/40 border-white/10 text-white mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Hotel website</Label>
                    <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className="bg-black/40 border-white/10 text-white mt-1" />
                  </div>
                  <div>
                    <Label className="text-white">Tell us about your guests' transport needs</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} className="bg-black/40 border-white/10 text-white mt-1" />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full bg-mansagold hover:bg-amber-500 text-black font-bold rounded-xl h-12">
                    {submitting ? 'Submitting…' : 'Submit application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default HotelPartnersPage;
