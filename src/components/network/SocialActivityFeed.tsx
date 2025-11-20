import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Activity, ShoppingCart, Star, MapPin, Trophy, Heart, Loader2 } from 'lucide-react';
import { useSocialFeed } from '@/hooks/use-social-feed';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const SocialActivityFeed = () => {
  const { activities, loading } = useSocialFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return ShoppingCart;
      case 'review': return Star;
      case 'check_in': return MapPin;
      case 'achievement': return Trophy;
      case 'business_support': return Heart;
      default: return Activity;
    }
  };

  const getActivityText = (activity: typeof activities[0]) => {
    switch (activity.activity_type) {
      case 'purchase':
        return `made a purchase at ${activity.businesses?.business_name}`;
      case 'review':
        return `reviewed ${activity.businesses?.business_name}`;
      case 'check_in':
        return `checked in at ${activity.businesses?.business_name}`;
      case 'achievement':
        return `earned "${activity.metadata.achievement_name}"`;
      case 'business_support':
        return `supported ${activity.businesses?.business_name}`;
      default:
        return 'had activity';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-primary/10 text-primary';
      case 'review': return 'bg-accent/10 text-accent';
      case 'check_in': return 'bg-secondary/10 text-secondary';
      case 'achievement': return 'bg-yellow-500/10 text-yellow-600';
      case 'business_support': return 'bg-pink-500/10 text-pink-600';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Community Activity
          <Badge variant="outline" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm mt-2">Connect with friends to see their activity!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.activity_type);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.profiles?.avatar_url} />
                    <AvatarFallback>
                      {activity.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <p className="text-sm flex-1">
                        <span className="font-semibold">{activity.profiles?.full_name}</span>
                        {' '}
                        <span className="text-muted-foreground">{getActivityText(activity)}</span>
                      </p>
                    <div className={`p-1.5 rounded-full ${getActivityColor(activity.activity_type)}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  
                  {activity.metadata.description && (
                    <p className="text-xs text-white/50 mt-1">
                      {activity.metadata.description}
                    </p>
                  )}
                  
                  <p className="text-xs text-white/50 mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
);
};

export default SocialActivityFeed;
