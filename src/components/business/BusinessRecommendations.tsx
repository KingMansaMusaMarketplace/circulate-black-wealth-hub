import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, TrendingUp, Heart, Clock, Star } from 'lucide-react';
import { useAIRecommendations, BusinessRecommendation } from '@/hooks/use-ai-recommendations';
import { supabase } from '@/integrations/supabase/client';

const RecommendationTypeIcon = ({ type }: { type: BusinessRecommendation['recommendationType'] }) => {
  const icons = {
    trending: TrendingUp,
    personalized: Heart,
    nearby: MapPin,
    similar: Star,
    new: Sparkles,
    seasonal: Clock
  };
  
  const Icon = icons[type];
  return <Icon className="h-4 w-4" />;
};

const RecommendationTypeColor = (type: BusinessRecommendation['recommendationType']) => {
  const colors = {
    trending: 'bg-orange-100 text-orange-800',
    personalized: 'bg-pink-100 text-pink-800',
    nearby: 'bg-blue-100 text-blue-800',
    similar: 'bg-purple-100 text-purple-800',
    new: 'bg-green-100 text-green-800',
    seasonal: 'bg-yellow-100 text-yellow-800'
  };
  
  return colors[type];
};

const BusinessRecommendations: React.FC = () => {
  const { recommendations, isGenerating, generateRecommendations } = useAIRecommendations();

  useEffect(() => {
    // Auto-generate recommendations when component mounts
    const checkUserAndGenerate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await generateRecommendations(user.id);
      }
    };
    
    checkUserAndGenerate();
  }, []);

  const handleRefresh = () => {
    generateRecommendations();
  };

  if (!recommendations && !isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            Get Personalized Recommendations
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Recommendations
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        {isGenerating && (
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Generating personalized recommendations...</span>
            </div>
          </CardContent>
        )}

        {recommendations && (
          <CardContent className="space-y-4">
            {recommendations.summary && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{recommendations.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {Math.round(recommendations.confidence * 100)}% confidence
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.recommendations.map((rec, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{rec.businessName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{rec.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={RecommendationTypeColor(rec.recommendationType)}>
                          <RecommendationTypeIcon type={rec.recommendationType} />
                          <span className="ml-1 capitalize">{rec.recommendationType}</span>
                        </Badge>
                        <Badge variant="outline">
                          {rec.matchScore}/10
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Why we recommend this:</p>
                        <p className="text-sm">{rec.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">What to expect:</p>
                        <p className="text-sm">{rec.expectedExperience}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default BusinessRecommendations;