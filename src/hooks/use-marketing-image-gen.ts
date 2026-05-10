import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MarketingPreset = 'banner' | 'social' | 'flyer' | 'logo';

export const useMarketingImageGen = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generate = async (prompt: string, preset: MarketingPreset, brandHint?: string) => {
    setIsGenerating(true);
    setImageUrl(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-marketing-image', {
        body: { prompt, preset, brandHint }
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Generation failed');
      setImageUrl(data.imageUrl);
      toast.success('Image generated');
      return data.imageUrl as string;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to generate image';
      toast.error(msg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const download = (filename = 'marketing-image.png') => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return { isGenerating, imageUrl, generate, download, reset: () => setImageUrl(null) };
};
