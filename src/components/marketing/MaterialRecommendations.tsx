import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Download, TrendingUp, Loader2 } from 'lucide-react';
import { getMaterialRecommendations, MaterialRecommendation } from '@/lib/api/material-recommendations-api';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface MaterialRecommendationsProps {
  onDownload: (materialId: string) => void;
}

export const MaterialRecommendations: React.FC<MaterialRecommendationsProps> = ({ onDownload }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<MaterialRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = async () => {
    if (!user?.id) return;
    
    try {
      setRefreshing(true);
      const data = await getMaterialRecommendations(user.id);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [user?.id]);

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Recommended For You</CardTitle>
          </div>
          <Button
            onClick={loadRecommendations}
            disabled={refreshing}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>
        <CardDescription>
          Based on your tier, region, and download history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className="hover:shadow-md transition-all hover:border-primary/50"
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                {rec.thumbnail_url && (
                  <img
                    src={rec.thumbnail_url}
                    alt={rec.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base line-clamp-1">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" />
                        {rec.recommendation_reason}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {rec.type}
                    </Badge>
                  </div>
                  
                  {rec.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {rec.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {rec.categories.slice(0, 2).map((cat, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                    {rec.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => onDownload(rec.id)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
