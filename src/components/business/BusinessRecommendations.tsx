import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, TrendingUp, Heart, Clock, Star } from 'lucide-react';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { supabase } from '@/integrations/supabase/client';

const RecommendationTypeIcon = ({ type }: { type: string }) => {
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

const RecommendationTypeColor = (type: string) => {
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
  const { recommendations, isLoading, generating, generateRecommendations } = useAIRecommendations();

  useEffect(() => {
    if (recommendations.length === 0 && !isLoading) {
      generateRecommendations();
    }
  }, []);

  if (!recommendations.length && !generating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => generateRecommendations()} disabled={generating}>
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
              onClick={() => generateRecommendations()} 
              disabled={generating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        {generating && (
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Generating personalized recommendations...</span>
            </div>
          </CardContent>
        )}

        {recommendations.length > 0 && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec: any, index: number) => (
                <Card key={rec.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {rec.businesses?.logo_url && (
                        <img src={rec.businesses.logo_url} alt="" className="w-12 h-12 rounded-lg" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{rec.businesses?.business_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{rec.businesses?.category}</p>
                        <Badge variant="outline" className="mt-1">
                          {Math.round(rec.recommendation_score * 100)}% Match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{rec.recommendation_reason}</p>
                    <Button className="w-full mt-4" size="sm">
                      View Business
                    </Button>
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