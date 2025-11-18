import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContextualRecommendationsProps {
  currentCategory?: string;
  currentLocation?: string;
  recentlyViewed?: string[];
}

export const ContextualRecommendations: React.FC<ContextualRecommendationsProps> = ({
  currentCategory,
  currentLocation,
  recentlyViewed = []
}) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Generate contextual recommendations based on user behavior
    const suggestions = [];

    if (currentCategory) {
      suggestions.push(`Explore more ${currentCategory} businesses in your area`);
    }

    if (currentLocation) {
      suggestions.push(`Discover trending spots in ${currentLocation}`);
    }

    if (recentlyViewed.length > 0) {
      suggestions.push("Businesses similar to ones you've viewed");
    }

    suggestions.push("New businesses added this week");
    suggestions.push("Highly rated local favorites");

    setRecommendations(suggestions);
  }, [currentCategory, currentLocation, recentlyViewed.length]);

  if (recommendations.length === 0) return null;

  const icons = [TrendingUp, Heart, MapPin, Sparkles];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Personalized Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((suggestion, index) => {
          const Icon = icons[index % icons.length];
          return (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 hover:bg-primary/10"
              onClick={() => {
                // Navigate based on suggestion type
                if (suggestion.includes('category')) {
                  // Handle category navigation
                } else if (suggestion.includes('location')) {
                  // Handle location navigation
                } else {
                  // Default to directory
                  navigate('/directory');
                }
              }}
            >
              <Icon className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
              <span className="text-sm">{suggestion}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
