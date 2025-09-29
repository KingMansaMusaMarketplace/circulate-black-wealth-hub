import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';
import { ProductImageFormValues } from '../../../business-form/models';
import SeoFields from '../SeoFields';
import SubmitButton from '../SubmitButton';
import { Sparkles, Wand2, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAIImageEnhancement } from '@/hooks/use-ai-image-enhancement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SeoTabProps {
  businessId: string;
  isUploading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
}

const SeoTab: React.FC<SeoTabProps> = ({ businessId, isUploading, isEditing, onCancel }) => {
  const form = useFormContext<ProductImageFormValues>();
  const [showEnhancementDetails, setShowEnhancementDetails] = useState(false);
  const { enhancement, isEnhancing, enhanceImage, applyEnhancement } = useAIImageEnhancement();

  // Get business context for AI enhancement
  const { data: businessData } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleAIEnhancement = async () => {
    const currentValues = form.getValues();
    // For demonstration purposes, we'll use a placeholder URL
    // In real implementation, this would come from the image upload state
    const previewUrl = 'https://example.com/placeholder-image.jpg';
    
    await enhanceImage(
      previewUrl,
      businessData,
      currentValues.title,
      currentValues.description
    );
  };

  const handleApplyEnhancement = () => {
    if (!enhancement) return;
    
    const appliedValues = applyEnhancement(enhancement);
    
    form.setValue('title', appliedValues.title);
    form.setValue('description', appliedValues.description);
    form.setValue('altText', appliedValues.alt_text);
    form.setValue('tags', appliedValues.tags);
    form.setValue('metaDescription', appliedValues.meta_description);
    
    setShowEnhancementDetails(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search Engine Optimization</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Improve how your product appears in search results
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIEnhancement}
                disabled={isEnhancing || !businessData}
                className="flex items-center gap-2"
              >
                {isEnhancing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI Enhance
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <SeoFields businessId={businessId} />
            
            {enhancement && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">AI Enhancement Results</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Quality Score: {enhancement.qualityAssessment.overallScore}/10
                    </Badge>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowEnhancementDetails(!showEnhancementDetails)}
                      variant="ghost"
                    >
                      {showEnhancementDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Suggested Title:</p>
                    <p className="text-sm">{enhancement.suggestedTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enhanced Description:</p>
                    <p className="text-sm">{enhancement.enhancedDescription.slice(0, 100)}...</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SEO Keywords:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {enhancement.keywordSuggestions.slice(0, 4).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {showEnhancementDetails && (
                  <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Quality Assessment</h5>
                      <div className="grid gap-2 text-xs">
                        <div>
                          <span className="font-medium text-green-600">Strengths:</span>
                          <ul className="list-disc list-inside ml-2">
                            {enhancement.qualityAssessment.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        {enhancement.qualityAssessment.improvements.length > 0 && (
                          <div>
                            <span className="font-medium text-orange-600">Improvements:</span>
                            <ul className="list-disc list-inside ml-2">
                              {enhancement.qualityAssessment.improvements.map((improvement, i) => (
                                <li key={i}>{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Marketing Angles</h5>
                      <div className="flex flex-wrap gap-1">
                        {enhancement.marketingAngles.map((angle, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {angle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Pricing Context</h5>
                      <p className="text-xs text-muted-foreground">
                        {enhancement.pricingContext.reasoning}
                      </p>
                      <p className="text-sm font-medium">
                        Suggested Range: {enhancement.pricingContext.suggestedRange}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleApplyEnhancement}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <Wand2 className="h-4 w-4" />
                    Apply AI Suggestions
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <SubmitButton 
          isUploading={isUploading} 
          isEditing={isEditing} 
          onCancel={onCancel}
          isValid={form.formState.isValid}
          isOptimized={true}
        />
      </form>
    </Form>
  );
};

export default SeoTab;