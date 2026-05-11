import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MarketingPreset = 'banner' | 'social' | 'flyer' | 'logo';

export interface GenerateResult {
  imageUrl: string | null;
  insufficientCredits?: boolean;
  planRemaining?: number;
  topupRemaining?: number;
}

export const useMarketingImageGen = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generate = async (prompt: string, preset: MarketingPreset, brandHint?: string): Promise<GenerateResult> => {
    setIsGenerating(true);
    setImageUrl(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-marketing-image', {
        body: { prompt, preset, brandHint }
      });

      // Edge function 402 surfaces as error from supabase-js but data is still available
      const payload = (data ?? (error as any)?.context?.body) as any;

      if (payload?.error === 'insufficient_credits') {
        return {
          imageUrl: null,
          insufficientCredits: true,
          planRemaining: payload.plan_remaining ?? 0,
          topupRemaining: payload.topup_remaining ?? 0,
        };
      }

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Generation failed');
      setImageUrl(data.imageUrl);
      toast.success('Image generated');
      return {
        imageUrl: data.imageUrl as string,
        planRemaining: data.plan_remaining,
        topupRemaining: data.topup_remaining,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to generate image';
      toast.error(msg);
      return { imageUrl: null };
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
