import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const HostingAgreementPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white py-16 px-4">
    <Helmet>
      <title>Hosting Agreement — Mansa Stays</title>
      <meta name="description" content="Mansa Stays Hosting Agreement — terms for hosts listing properties on 1325.AI." />
      <link rel="canonical" href="https://www.1325.ai/legal/hosting-agreement" />
    </Helmet>
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-7 h-7 text-mansagold" />
        <h1 className="text-3xl font-bold">Mansa Stays Hosting Agreement</h1>
      </div>
      <p className="text-sm text-slate-400 mb-6">Version 1.0 · Last updated May 18, 2026</p>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 space-y-6 text-slate-200 leading-relaxed">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4 text-sm text-amber-200">
            ⚠️ <strong>Placeholder copy — pending attorney review.</strong> This document should be reviewed by a licensed attorney in the host's jurisdiction before public launch.
          </div>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">1. Eligibility</h2>
            <p>Hosts must be at least 18 years old, legally own or have the right to rent the listed property, and comply with all local laws, zoning rules, HOA bylaws, and tax obligations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">2. Listing Accuracy</h2>
            <p>You agree that all property descriptions, photos, amenities, and availability information you submit are accurate, current, and not misleading. Mansa Musa Marketplace ("the Platform") reserves the right to remove or reject any listing at its sole discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">3. Fees & Payouts</h2>
            <p>The Platform charges a service fee disclosed at the time of booking. Long-term lease listings carry a $99 listing fee, refundable within 7 days if cancelled. Payouts to hosts are processed via Stripe Connect and follow Stripe's standard payout schedule.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">4. Host Responsibilities</h2>
            <p>You are solely responsible for the safety, cleanliness, and legal compliance of your property; for accurate tax reporting; for resolving guest disputes in good faith; and for maintaining adequate insurance coverage. The Platform does not act as your insurer.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">5. Cancellations & Refunds</h2>
            <p>You agree to honor confirmed bookings except in cases of emergency. Repeated host-initiated cancellations may result in account suspension and/or removal from the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">6. Termination</h2>
            <p>Either party may terminate this Agreement at any time with written notice. The Platform may suspend or remove your account immediately for violations of these terms, applicable law, or community standards.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">7. Governing Law</h2>
            <p>This Agreement is governed by the laws of the State of Illinois. Any disputes shall be resolved in the state or federal courts located in Cook County, Illinois.</p>
          </section>

          <p className="text-sm text-slate-400 pt-4 border-t border-slate-800">By submitting a property listing, you acknowledge that you have read, understood, and agreed to this Hosting Agreement.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default HostingAgreementPage;
