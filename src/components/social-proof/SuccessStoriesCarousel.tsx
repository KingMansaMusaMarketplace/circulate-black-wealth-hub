import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Star } from 'lucide-react';
import { SuccessStory } from '@/hooks/use-social-proof';

interface SuccessStoriesCarouselProps {
  stories: SuccessStory[];
}

const SuccessStoriesCarousel: React.FC<SuccessStoriesCarouselProps> = ({ stories }) => {
  const getStoryIcon = (type: string) => {
    switch (type) {
      case 'business': return Building2;
      case 'community': return Users;
      default: return Trophy;
    }
  };

  const getStoryColor = (type: string) => {
    switch (type) {
      case 'business': return 'bg-secondary/10 border-secondary';
      case 'community': return 'bg-accent/10 border-accent';
      default: return 'bg-primary/10 border-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Success Stories</h2>
          <p className="text-white/70 mt-2">Real impact from our community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, index) => {
          const Icon = getStoryIcon(story.story_type);
          
          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-slate-900/40 backdrop-blur-xl border-white/10">
                {story.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="w-6 h-6 text-blue-400" />
                    {story.is_featured && (
                      <Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Star className="w-3 h-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-white">{story.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/70">{story.description}</p>
                  
                  {story.metrics && (
                    <div className="space-y-2 p-4 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-white/10">
                      {story.metrics.before && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">Before:</span>
                          <span className="font-medium text-white">{story.metrics.before}</span>
                        </div>
                      )}
                      {story.metrics.after && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <span className="text-white/60">After:</span>
                          <span className="font-medium text-blue-400">{story.metrics.after}</span>
                        </div>
                      )}
                      {story.metrics.impact && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="font-semibold text-yellow-400">{story.metrics.impact}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Missing imports
import { Building2, Users } from 'lucide-react';

export default SuccessStoriesCarousel;
