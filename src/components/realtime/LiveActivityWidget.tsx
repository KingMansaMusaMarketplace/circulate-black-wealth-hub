import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QrCode, Zap, Clock } from 'lucide-react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { formatDistanceToNow } from 'date-fns';

interface LiveActivityWidgetProps {
  className?: string;
  maxItems?: number;
}

const LiveActivityWidget: React.FC<LiveActivityWidgetProps> = ({ 
  className = '', 
  maxItems = 5 
}) => {
  const { activityFeed } = useRealtimeNotifications();

  const recentActivity = activityFeed.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Zap className="h-4 w-4 text-primary" />
          <span>Live Activity</span>
          {recentActivity.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {recentActivity.length} recent
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for activity...</p>
          </div>
        ) : (
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                    index === 0 ? 'bg-green-50 animate-pulse' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <QrCode className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={activity.business?.logo_url} />
                        <AvatarFallback className="text-xs">
                          {activity.business?.business_name?.charAt(0) || 'B'}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium truncate">
                        {activity.business?.business_name || 'Unknown Business'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        +{activity.points_earned || 0} pts
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveActivityWidget;