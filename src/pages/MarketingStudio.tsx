import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles, Download, RefreshCw, ImageIcon } from 'lucide-react';
import { useMarketingImageGen, type MarketingPreset } from '@/hooks/use-marketing-image-gen';
import { cn } from '@/lib/utils';

const PRESETS: { value: MarketingPreset; label: string; hint: string }[] = [
  { value: 'banner', label: 'Web Banner', hint: '1200×400 hero' },
  { value: 'social', label: 'Social Post', hint: '1:1 feed' },
  { value: 'flyer', label: 'Promo Flyer', hint: '1080×1350' },
  { value: 'logo', label: 'Logo Mark', hint: 'White bg' },
];

const MarketingStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [brandHint, setBrandHint] = useState('');
  const [preset, setPreset] = useState<MarketingPreset>('social');
  const { isGenerating, imageUrl, generate, download, reset } = useMarketingImageGen();

  const handleGenerate = () => {
    if (prompt.trim().length < 4) return;
    generate(prompt.trim(), preset, brandHint.trim() || undefined);
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <Helmet>
        <title>Marketing Studio | 1325.AI</title>
        <meta name="description" content="Generate on-brand marketing images for your business with AI — banners, social posts, flyers, and logos." />
      </Helmet>

      <div className="container mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Marketing Studio</span>
          </h1>
          <p className="text-muted-foreground">AI-generated banners, social posts, and flyers for your business.</p>
        </header>

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
    </div>
  );
};

export default MarketingStudio;
