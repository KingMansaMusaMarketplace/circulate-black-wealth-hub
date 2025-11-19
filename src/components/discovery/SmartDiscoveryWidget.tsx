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
      case 'hot': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'new': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-transparent bg-clip-text bg-gradient-to-r from-mansagold to-yellow-400">
          <Zap className="h-4 w-4 text-mansagold" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {trendingBusinesses.map((business) => (
          <div
            key={business.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/40 transition-colors cursor-pointer"
            onClick={() => window.location.href = `/business/${business.id}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{business.name}</p>
              <p className="text-xs text-slate-400 truncate">{business.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">{business.metric}</span>
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
