import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

const PhotoConsentPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white py-16 px-4">
    <Helmet>
      <title>Photo Upload Consent — Mansa Stays</title>
      <meta name="description" content="Photo Upload Consent and content license terms for Mansa Stays hosts on 1325.AI." />
      <link rel="canonical" href="https://www.1325.ai/legal/photo-consent" />
    </Helmet>
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Camera className="w-7 h-7 text-mansagold" />
        <h1 className="text-3xl font-bold">Photo Upload Consent</h1>
      </div>
      <p className="text-sm text-slate-400 mb-6">Version 1.0 · Last updated May 18, 2026</p>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-8 space-y-6 text-slate-200 leading-relaxed">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4 text-sm text-amber-200">
            ⚠️ <strong>Placeholder copy — pending attorney review.</strong>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">1. Ownership & Rights</h2>
            <p>By uploading photos to Mansa Stays, you confirm that you own the photos or have permission from the rights holder, that the photos accurately represent the listed property, and that they do not contain identifiable persons who have not consented to being photographed.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">2. License Granted</h2>
            <p>You grant Mansa Musa Marketplace a non-exclusive, worldwide, royalty-free license to use, display, reproduce, resize, and distribute your photos for the purpose of operating, promoting, and marketing Mansa Stays — including on the website, app, search results, email campaigns, and social media.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">3. AI Content Moderation</h2>
            <p>All uploaded photos are automatically reviewed by an AI moderation system (powered by Google Gemini Vision) for safety, accuracy, and compliance. Photos flagged as inappropriate, watermarked, low quality, or off-topic will be rejected and not published.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mansagold mb-2">4. Removal</h2>
            <p>You may remove your photos at any time by deleting them from your listing or by contacting support. The Platform reserves the right to remove any photo at its discretion for violations of these terms.</p>
          </section>

          <p className="text-sm text-slate-400 pt-4 border-t border-slate-800">By uploading photos, you acknowledge and agree to this Photo Upload Consent.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default PhotoConsentPage;
