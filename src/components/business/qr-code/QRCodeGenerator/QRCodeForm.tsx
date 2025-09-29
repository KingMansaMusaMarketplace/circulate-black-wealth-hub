import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, TrendingUp, Calendar, Target } from 'lucide-react';
import { QRCodeTypeField } from './form/QRCodeTypeField';
import { DiscountField } from './form/DiscountField';
import { PointsField } from './form/PointsField';
import { ScanLimitField } from './form/ScanLimitField';
import { ExpirationDateField } from './form/ExpirationDateField';
import { ActiveStatusField } from './form/ActiveStatusField';
import { SubmitButton } from './form/SubmitButton';
import { useAIQRCampaigns, QRCampaign } from '@/hooks/use-ai-qr-campaigns';
import { FormValues } from './form/types';

const qrCodeSchema = z.object({
  codeType: z.enum(['discount', 'loyalty', 'checkin']),
  discountPercentage: z.number().min(1).max(100).optional(),
  pointsValue: z.number().min(1).max(1000).optional(),
  scanLimit: z.number().min(1).optional(),
  expirationDate: z.string().optional(),
  isActive: z.boolean().default(true)
});

interface QRCodeFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<FormValues>;
  businessId?: string;
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  initialValues,
  businessId
}) => {
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const { campaign, isGenerating, generateQRCampaign, applyCampaignToQR } = useAIQRCampaigns();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      codeType: 'discount',
      discountPercentage: 10,
      pointsValue: 10,
      scanLimit: 100,
      isActive: true,
      ...initialValues
    },
    mode: 'onChange'
  });

  const codeType = form.watch('codeType');

  const handleAIGenerate = async () => {
    if (!businessId) return;
    
    const currentValues = form.getValues();
    await generateQRCampaign(businessId, 'optimization', currentValues);
  };

  const handleApplyCampaign = () => {
    if (!campaign) return;
    
    const qrSettings = applyCampaignToQR(campaign);
    
    // Map AI campaign types to form schema types
    let mappedCodeType: 'discount' | 'loyalty' | 'checkin' = 'discount';
    const codeType = qrSettings.code_type;
    
    if (codeType === 'loyalty' || codeType === 'points') {
      mappedCodeType = 'loyalty';
    } else if (codeType === 'discount' || codeType === 'special_offer' || codeType === 'seasonal') {
      mappedCodeType = 'discount';
    } else {
      // Default to discount for any other types
      mappedCodeType = 'discount';
    }
    
    form.setValue('codeType', mappedCodeType);
    if (qrSettings.discount_percentage) {
      form.setValue('discountPercentage', qrSettings.discount_percentage);
    }
    if (qrSettings.points_value) {
      form.setValue('pointsValue', qrSettings.points_value);
    }
    if (qrSettings.scan_limit) {
      form.setValue('scanLimit', qrSettings.scan_limit);
    }
    form.setValue('isActive', qrSettings.is_active);
    
    setShowCampaignDetails(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>QR Code Configuration</CardTitle>
            {businessId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI Generate Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <QRCodeTypeField control={form.control} />
              
              {codeType === 'discount' && <DiscountField control={form.control} />}
              {codeType === 'loyalty' && <PointsField control={form.control} />}
              
              <ScanLimitField control={form.control} />
              <ExpirationDateField control={form.control} />
              <ActiveStatusField control={form.control} />
              <SubmitButton isLoading={isLoading} />
            </form>
          </Form>
        </CardContent>
      </Card>

      {campaign && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI Campaign: {campaign.campaignName}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowCampaignDetails(!showCampaignDetails)}
                  variant="ghost"
                >
                  {showCampaignDetails ? 'Hide Details' : 'Show Details'}
                </Button>
                <Button
                  type="button"
                  onClick={handleApplyCampaign}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Wand2 className="h-4 w-4" />
                  Apply Campaign
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Campaign Overview:</p>
              <p className="text-sm">{campaign.campaignDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 mb-1">Marketing Copy</h5>
                <p className="text-xs text-blue-700">"{campaign.marketingCopy.headline}"</p>
                <p className="text-xs text-blue-600 mt-1">{campaign.marketingCopy.callToAction}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="text-sm font-medium text-green-800 mb-1">Target Audience</h5>
                <p className="text-xs text-green-700">{campaign.strategicInsights.targetAudience}</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <h5 className="text-sm font-medium text-purple-800 mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Best Launch Time
                </h5>
                <p className="text-xs text-purple-700">{campaign.strategicInsights.bestTimeToLaunch}</p>
              </div>
            </div>

            {showCampaignDetails && (
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <h5 className="text-sm font-medium mb-2">Strategic Insights</h5>
                  <div className="grid gap-2 text-xs">
                    <p><span className="font-medium">Expected Performance:</span> {campaign.strategicInsights.expectedPerformance}</p>
                    <p><span className="font-medium">Competitive Advantage:</span> {campaign.strategicInsights.competitiveAdvantage}</p>
                    <div className="mt-2">
                      <span className="font-medium">Optimization Tips:</span>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        {campaign.strategicInsights.optimizationTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Promotion Strategy</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium text-orange-600">Placement Ideas:</span>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        {campaign.promotionStrategy.placementSuggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium text-blue-600">Distribution Channels:</span>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        {campaign.promotionStrategy.distributionChannels.map((channel, i) => (
                          <li key={i}>{channel}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {campaign.campaignVariations && campaign.campaignVariations.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Campaign Variations</h5>
                    <div className="space-y-2">
                      {campaign.campaignVariations.map((variation, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{variation.name}</span>
                            <div className="flex gap-1">
                              {variation.discountPercentage && (
                                <Badge variant="secondary">{variation.discountPercentage}% off</Badge>
                              )}
                              {variation.pointsValue && (
                                <Badge variant="outline">{variation.pointsValue} pts</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{variation.description}</p>
                          <p className="text-xs text-blue-600 mt-1">{variation.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRCodeForm;