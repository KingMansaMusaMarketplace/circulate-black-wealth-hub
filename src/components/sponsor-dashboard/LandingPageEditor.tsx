import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Globe, Eye, Save, Loader2, ExternalLink } from 'lucide-react';

interface LandingPageEditorProps {
  subscriptionId: string;
  tier: string;
  initialData: {
    landing_page_slug: string | null;
    landing_page_headline: string | null;
    landing_page_description: string | null;
    landing_page_cta_text: string | null;
    landing_page_cta_url: string | null;
    landing_page_hero_image_url: string | null;
    landing_page_enabled: boolean | null;
  };
  onUpdate: () => void;
  className?: string;
}

export const LandingPageEditor: React.FC<LandingPageEditorProps> = ({
  subscriptionId,
  tier,
  initialData,
  onUpdate,
  className = '',
}) => {
  const isPlatinum = tier === 'platinum';
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState(initialData.landing_page_slug || '');
  const [headline, setHeadline] = useState(initialData.landing_page_headline || '');
  const [description, setDescription] = useState(initialData.landing_page_description || '');
  const [ctaText, setCtaText] = useState(initialData.landing_page_cta_text || 'Learn More');
  const [ctaUrl, setCtaUrl] = useState(initialData.landing_page_cta_url || '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialData.landing_page_hero_image_url || '');
  const [enabled, setEnabled] = useState(initialData.landing_page_enabled ?? false);

  const handleSave = async () => {
    if (!slug.trim()) {
      toast.error('Please enter a URL slug for your landing page');
      return;
    }

    const sanitizedSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    setSaving(true);
    try {
      const { error } = await supabase
        .from('corporate_subscriptions')
        .update({
          landing_page_slug: sanitizedSlug,
          landing_page_headline: headline || null,
          landing_page_description: description || null,
          landing_page_cta_text: ctaText || 'Learn More',
          landing_page_cta_url: ctaUrl || null,
          landing_page_hero_image_url: heroImageUrl || null,
          landing_page_enabled: enabled,
        })
        .eq('id', subscriptionId);

      if (error) throw error;
      setSlug(sanitizedSlug);
      toast.success('Landing page saved successfully');
      onUpdate();
    } catch (err: any) {
      if (err.message?.includes('duplicate')) {
        toast.error('This URL slug is already taken. Please choose a different one.');
      } else {
        toast.error('Failed to save landing page');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isPlatinum) {
    return (
      <Card className={`${className} opacity-60`}>
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-400" />
            Custom Landing Page
          </CardTitle>
          <CardDescription className="text-blue-200/70">
            Upgrade to Platinum tier to get a custom branded landing page
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const previewUrl = slug ? `/sponsor/${slug}` : null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Globe className="h-5 w-5 text-amber-400" />
          Custom Landing Page
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Create a branded landing page for your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <Label htmlFor="landing-enabled" className="text-blue-100">
            Enable Landing Page
          </Label>
          <Switch
            id="landing-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-blue-100">URL Slug</Label>
          <div className="flex items-center gap-2">
            <span className="text-blue-300/60 text-sm whitespace-nowrap">/sponsor/</span>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="your-company"
              className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-300/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="headline" className="text-blue-100">Headline</Label>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Empowering Economic Growth Together"
            className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-300/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-blue-100">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell visitors about your company's commitment to economic empowerment..."
            rows={4}
            className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-300/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-image" className="text-blue-100">Hero Image URL</Label>
          <Input
            id="hero-image"
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
            placeholder="https://example.com/hero-image.jpg"
            className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-300/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cta-text" className="text-blue-100">CTA Button Text</Label>
            <Input
              id="cta-text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Learn More"
              className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-300/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-url" className="text-blue-100">CTA Button URL</Label>
            <Input
              id="cta-url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="https://your-company.com"
              className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-300/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Landing Page
          </Button>
          {previewUrl && enabled && (
            <Button
              variant="outline"
              asChild
              className="border-white/20 text-blue-100 hover:bg-white/10 gap-2"
            >
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4" />
                Preview
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
