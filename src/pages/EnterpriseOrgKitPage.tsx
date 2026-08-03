import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Download, Loader2, Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useEnterpriseOrg } from '@/hooks/use-enterprise-org';
import aamesLogo from '@/assets/aames-logo.png.asset.json';

const DEFAULT_SLUG = 'aames';

const EnterpriseOrgKitPage: React.FC = () => {
  const { slug = DEFAULT_SLUG } = useParams<{ slug: string }>();
  const { data: org, isLoading } = useEnterpriseOrg(slug);
  const [qr, setQr] = useState<string>('');

  const landingUrl = `https://1325.ai/${slug === DEFAULT_SLUG ? 'aames' : `enterprise/${slug}`}`;

  useEffect(() => {
    QRCode.toDataURL(landingUrl, { width: 640, margin: 1 })
      .then(setQr)
      .catch(() => setQr(''));
  }, [landingUrl]);

  const downloadQr = () => {
    if (!qr) return;
    const a = document.createElement('a');
    a.href = qr;
    a.download = `${slug}-1325ai-qr.png`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  const shortName = org?.short_name || org?.name || 'Partner';
  const isAames = slug === 'aames';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>{shortName} × 1325.AI — Launch Kit</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-3xl px-6 py-10 print:py-0">
        <div className="mb-6 flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={downloadQr} disabled={!qr}>
            <Download className="mr-2 h-4 w-4" /> Download QR code
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 p-8 print:border-0 print:p-0">
          <div className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              {isAames && (
                <img src={aamesLogo.url} alt={`${shortName} logo`} className="h-16 w-16 object-contain" />
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Official Partner
                </p>
                <h1 className="text-2xl font-bold">{shortName} × 1325.AI</h1>
              </div>
            </div>
            {qr && <img src={qr} alt="QR code to join" className="h-28 w-28" />}
          </div>

          <div className="grid gap-8 py-8 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold">What this is</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                1325.AI is the AI infrastructure layer for the Black economy. {shortName} members
                get free access to the directory, and member-owned businesses get a full back
                office run by 42 Agentic AI Employees — bookkeeping, marketing, customer follow-up,
                bookings, and payments.
              </p>
              <h2 className="mt-6 text-lg font-bold">What {shortName} earns</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {org?.revenue_share_pct ?? 20}% of the revenue from every member business that
                upgrades to a paid plan — reported transparently in the {shortName} leadership
                dashboard.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold">How members join</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                <li>Scan the QR code or visit <strong>{landingUrl}</strong></li>
                <li>Tap “Join as a member” or “List my business”</li>
                <li>Create a free account — no card required</li>
                <li>Business owners finish their listing in about 5 minutes</li>
              </ol>
              <h2 className="mt-6 text-lg font-bold">Questions</h2>
              <p className="mt-2 text-sm text-slate-700">
                Partner@1325.AI · 1325.ai
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 text-center text-sm font-medium text-slate-800 print:bg-transparent print:border print:border-slate-300">
            Share this page with every chapter leader: {landingUrl}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseOrgKitPage;
