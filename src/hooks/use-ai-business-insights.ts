import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BusinessInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface BusinessRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface QuickWin {
  action: string;
  description: string;
  timeframe: string;
}

export interface BusinessTrend {
  description: string;
  direction: 'positive' | 'negative' | 'stable';
  keyMetrics: string[];
}

export interface NextStep {
  step: string;
  description: string;
  timeline: string;
}

export interface AIBusinessInsights {
  summary: string;
  keyInsights: BusinessInsight[];
  recommendations: BusinessRecommendation[];
  quickWins: QuickWin[];
  trends: BusinessTrend;
  nextSteps: NextStep[];
  metadata: {
    businessId: string;
    generatedAt: string;
    dataPoints: {
      scansPeriod: number;
      reviewsPeriod: number;
      qrCodesActive: number;
    };
  };
}

export const useAIBusinessInsights = () => {
  const [insights, setInsights] = useState<AIBusinessInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async (businessId: string) => {
    if (!businessId) {
      toast.error('Business ID is required');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-business-insights', {
        body: { businessId }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to generate insights');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setInsights(data);
      toast.success('AI insights generated successfully!');
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI insights';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error generating AI insights:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearInsights = () => {
    setInsights(null);
    setError(null);
  };

  return {
    insights,
    isGenerating,
    error,
    generateInsights,
    clearInsights
  };
};