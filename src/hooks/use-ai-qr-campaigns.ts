import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QRCodeSettings {
  codeType: 'discount' | 'loyalty' | 'points' | 'special_offer' | 'seasonal';
  discountPercentage?: number;
  pointsValue?: number;
  expirationDays?: number;
  scanLimit?: number;
  isActive: boolean;
}

export interface MarketingCopy {
  headline: string;
  subheadline?: string;
  callToAction: string;
  shortDescription: string;
  socialMediaCopy?: string;
  emailSubject?: string;
}

export interface StrategicInsights {
  targetAudience: string;
  bestTimeToLaunch: string;
  expectedPerformance: string;
  competitiveAdvantage: string;
  optimizationTips: string[];
}

export interface CampaignVariation {
  name: string;
  description: string;
  discountPercentage?: number;
  pointsValue?: number;
  rationale: string;
}

export interface PromotionStrategy {
  placementSuggestions: string[];
  distributionChannels: string[];
  trackingMetrics: string[];
  followUpActions: string[];
}

export interface QRCampaign {
  campaignName: string;
  campaignDescription: string;
  qrCodeSettings: QRCodeSettings;
  marketingCopy: MarketingCopy;
  strategicInsights: StrategicInsights;
  campaignVariations?: CampaignVariation[];
  promotionStrategy: PromotionStrategy;
}

export interface QRCampaignResponse {
  success: boolean;
  campaign: QRCampaign | null;
  timestamp: string;
  error?: string;
}

export const useAIQRCampaigns = () => {
  const [campaign, setCampaign] = useState<QRCampaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQRCampaign = async (
    businessId: string,
    campaignType: string = 'general',
    currentQRData?: any
  ) => {
    if (!businessId) {
      toast.error('Business ID is required');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-qr-campaign', {
        body: { 
          businessId,
          campaignType,
          currentQRData
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to generate QR campaign');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.success || !data.campaign) {
        throw new Error('No QR campaign data received');
      }

      setCampaign(data.campaign);
      toast.success('AI QR campaign generated successfully!');
      return data.campaign;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate QR campaign';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error generating QR campaign:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearCampaign = () => {
    setCampaign(null);
    setError(null);
  };

  const applyCampaignToQR = (campaign: QRCampaign) => {
    return {
      code_type: campaign.qrCodeSettings.codeType,
      discount_percentage: campaign.qrCodeSettings.discountPercentage || null,
      points_value: campaign.qrCodeSettings.pointsValue || null,
      expiration_date: campaign.qrCodeSettings.expirationDays 
        ? new Date(Date.now() + campaign.qrCodeSettings.expirationDays * 24 * 60 * 60 * 1000).toISOString()
        : null,
      scan_limit: campaign.qrCodeSettings.scanLimit || null,
      is_active: campaign.qrCodeSettings.isActive,
    };
  };

  return {
    campaign,
    isGenerating,
    error,
    generateQRCampaign,
    clearCampaign,
    applyCampaignToQR
  };
};