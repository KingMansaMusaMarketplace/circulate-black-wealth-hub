import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Key } from 'lucide-react';

const TenantTermsPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white py-16 px-4">
    <Helmet>
      <title>Tenant & Guest Terms — Mansa Stays</title>
      <meta name="description" content="Mansa Stays Tenant & Guest Terms — booking, payment, and stay policies on 1325.AI." />
      <link rel="canonical" href="https://www.1325.ai/legal/tenant-terms" />
    </Helmet>
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Key className="w-7 h-7 text-mansagold" />
        <h1 className="text-3xl font-bold">Tenant & Guest Terms</h1>
      </div>
      <p className="text-sm text-slate-400 mb-6">Version 1.0 · Last updated May 18, 2026</p>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 space-y-6 text-slate-200 leading-relaxed">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4 text-sm text-amber-200">
            ⚠️ <strong>Placeholder copy — pending attorney review.</strong> Lease law varies by state; a licensed attorney must finalize this document before public launch.
          </div>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">1. Booking & Payment</h2>
            <p>By booking a stay or signing a lease through Mansa Stays, you agree to pay all disclosed amounts including rent, deposits, taxes, and service fees. Payments are processed via Stripe.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">2. House Rules</h2>
            <p>You agree to abide by the host's posted house rules, all building/HOA rules, and applicable laws. Smoking, illegal activity, unauthorized parties, and exceeding maximum occupancy are prohibited unless expressly permitted in writing.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">3. Cancellations</h2>
            <p>Vacation rental cancellations follow the host's posted cancellation policy. Long-term lease applications may be withdrawn at any time before signing; once signed, the lease becomes a legal contract between you and the host.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">4. Damages & Disputes</h2>
            <p>You are responsible for any damage caused during your stay beyond ordinary wear and tear. Disputes between guests and hosts should be reported through the Platform's in-app messaging and admin Reports system within 14 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">5. Platform Role</h2>
            <p>Mansa Musa Marketplace is a technology platform that connects hosts and guests/tenants. The Platform is not a party to the rental or lease agreement and is not liable for property condition, host conduct, or disputes between the parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">6. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of Illinois. Lease-specific obligations are governed by the law of the property's location.</p>
          </section>

          <p className="text-sm text-slate-400 pt-4 border-t border-slate-800">By booking or applying to lease, you acknowledge that you have read, understood, and agreed to these Tenant & Guest Terms.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default TenantTermsPage;
