import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Clock, Zap } from 'lucide-react';

interface TrendingBusiness {
  id: string;
  name: string;
  category: string;
  trend: 'rising' | 'hot' | 'new';
  metric: string;
}

interface SmartDiscoveryWidgetProps {
  businesses: any[];
}

export const SmartDiscoveryWidget: React.FC<SmartDiscoveryWidgetProps> = ({ businesses }) => {
  // Calculate trending businesses based on ratings, recency, etc.
  const getTrendingBusinesses = (): TrendingBusiness[] => {
    if (!businesses || businesses.length === 0) return [];

    return businesses
      .slice(0, 5)
      .map(b => ({
        id: b.id,
        name: b.business_name || b.name,
        category: b.category || 'General',
        trend: b.average_rating > 4.5 ? 'hot' : 
               new Date(b.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 ? 'new' : 
               'rising',
        metric: b.average_rating ? `${b.average_rating} ⭐` : 'New'
      }));
  };

  const trendingBusinesses = getTrendingBusinesses();

  if (trendingBusinesses.length === 0) return null;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot': return <Star className="h-3 w-3" />;
      case 'new': return <Clock className="h-3 w-3" />;
      default: return <TrendingUp className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'hot': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'new': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default: return 'bg-green-500/10 text-green-700 border-green-500/20';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4 text-primary" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {trendingBusinesses.map((business) => (
          <div
            key={business.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => window.location.href = `/business/${business.id}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{business.name}</p>
              <p className="text-xs text-muted-foreground truncate">{business.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{business.metric}</span>
              <Badge 
                variant="outline" 
                className={`${getTrendColor(business.trend)} text-xs px-2 py-0.5`}
              >
                {getTrendIcon(business.trend)}
                <span className="ml-1 capitalize">{business.trend}</span>
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
