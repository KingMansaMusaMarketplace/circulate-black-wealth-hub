import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Star, TrendingUp } from 'lucide-react';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const AIRecommendations: React.FC = () => {
  const { recommendations, isLoading, generating, generateRecommendations, trackClick } = useAIRecommendations();
  const navigate = useNavigate();

  const handleBusinessClick = (businessId: string, recommendationId: string) => {
    trackClick(recommendationId);
    navigate(`/business/${businessId}`);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-slate-700" />
          <Skeleton className="h-4 w-64 mt-2 bg-slate-700" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full bg-slate-700" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/30 transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-mansagold" />
            <CardTitle className="text-white">Personalized For You</CardTitle>
          </div>
          <Button
            onClick={() => generateRecommendations()}
            disabled={generating}
            size="sm"
            variant="outline"
            className="gap-2 bg-slate-700/50 border-white/10 text-white hover:bg-mansablue hover:border-mansagold"
          >
            <TrendingUp className="w-4 h-4" />
            {generating ? 'Generating...' : 'Refresh'}
          </Button>
        </div>
        <CardDescription className="text-blue-200/70">
          AI-powered recommendations based on your preferences and activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec: any) => (
            <Card
              key={rec.id}
              className="cursor-pointer bg-slate-900/60 border-white/10 hover:border-mansagold/50 hover:shadow-lg hover:shadow-mansagold/20 transition-all"
              onClick={() => handleBusinessClick(rec.business_id, rec.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {rec.businesses?.logo_url && (
                    <img
                      src={rec.businesses.logo_url}
                      alt={rec.businesses.business_name}
                      className="w-16 h-16 rounded-lg object-cover border border-white/10"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base line-clamp-1 text-white">
                        {rec.businesses?.business_name}
                      </h3>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-mansagold/20 to-amber-500/20 border border-mansagold/30 px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 text-mansagold" />
                        <span className="text-xs font-medium text-mansagold">
                          {Math.round(rec.recommendation_score * 100)}% Match
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-blue-300/70">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {rec.businesses?.city}, {rec.businesses?.state}
                      </span>
                      {rec.businesses?.average_rating && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3 h-3 fill-mansagold text-mansagold" />
                          {rec.businesses.average_rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-300/60 mt-2 line-clamp-2">
                      {rec.recommendation_reason}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-mansagold/50 mx-auto mb-4" />
            <p className="text-blue-200/70 mb-4">
              No recommendations yet. Generate your personalized recommendations!
            </p>
            <Button onClick={() => generateRecommendations()} disabled={generating} className="bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansablue/90 hover:to-blue-600/90 text-white">
              {generating ? 'Generating...' : 'Generate Recommendations'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
