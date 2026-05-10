import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles, Download, RefreshCw, ImageIcon } from 'lucide-react';
import { useMarketingImageGen, type MarketingPreset } from '@/hooks/use-marketing-image-gen';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard';
import { cn } from '@/lib/utils';

const PRESETS: { value: MarketingPreset; label: string; hint: string }[] = [
  { value: 'banner', label: 'Web Banner', hint: '1200×400 hero' },
  { value: 'social', label: 'Social Post', hint: '1:1 feed' },
  { value: 'flyer', label: 'Promo Flyer', hint: '1080×1350' },
  { value: 'logo', label: 'Logo Mark', hint: 'White bg' },
];

const MarketingStudio: React.FC = () => {
  const { user, userType, loading, authInitialized } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [brandHint, setBrandHint] = useState('');
  const [preset, setPreset] = useState<MarketingPreset>('social');
  const { isGenerating, imageUrl, generate, download, reset } = useMarketingImageGen();

  const handleGenerate = () => {
    if (prompt.trim().length < 4) return;
    generate(prompt.trim(), preset, brandHint.trim() || undefined);
  };

  const studioContent = (
    <div className="container mx-auto max-w-5xl">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPreset(p.value)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-colors',
                    preset === p.value
                      ? 'border-mansagold bg-mansagold/10'
                      : 'border-border hover:border-mansagold/50'
                  )}
                >
                  <div className="font-medium">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Describe what you want</Label>
            <Textarea
              id="prompt"
              rows={4}
              placeholder="e.g. A warm, vibrant photo of fresh-pressed juice bottles on a marble counter with morning light"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand vibe (optional)</Label>
            <Input
              id="brand"
              placeholder="e.g. earthy, premium, Afro-futurist"
              value={brandHint}
              onChange={(e) => setBrandHint(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || prompt.trim().length < 4}
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate</>
            )}
          </Button>
        </Card>

        <Card className="p-6 flex flex-col">
          <Label className="mb-3">Preview</Label>
          <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden min-h-[320px]">
            {imageUrl ? (
              <img src={imageUrl} alt="Generated marketing visual" className="max-w-full max-h-[480px] object-contain" />
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Your generated image will appear here</p>
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => download(`${preset}-${Date.now()}.png`)}>
                <Download className="h-4 w-4" /> Download
              </Button>
              <Button variant="ghost" className="gap-2" onClick={reset}>
                <RefreshCw className="h-4 w-4" /> Clear
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  // If business user (once auth is ready), wrap in DashboardLayout
  const isBusinessUser = authInitialized && !loading && user && userType === 'business';

  if (isBusinessUser) {
    return (
      <>
        <Helmet>
          <title>Marketing Studio | 1325.AI</title>
          <meta name="description" content="Generate on-brand marketing images for your business with AI — banners, social posts, flyers, and logos." />
        </Helmet>
        <DashboardLayout title="Marketing Studio" icon={<ImageIcon className="h-6 w-6" />}>
          {studioContent}
        </DashboardLayout>
      </>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]">
      <Helmet>
        <title>Marketing Studio | 1325.AI</title>
        <meta name="description" content="Generate on-brand marketing images for your business with AI — banners, social posts, flyers, and logos." />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl p-6 relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Marketing Studio</span>
          </h1>
          <p className="text-white/70">AI-generated banners, social posts, and flyers for your business.</p>
        </header>

        {studioContent}
      </div>
    </div>
  );
};

export default MarketingStudio;
