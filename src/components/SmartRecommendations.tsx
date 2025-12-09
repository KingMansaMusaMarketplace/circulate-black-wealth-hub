import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Business {
  id: string;
  business_name: string;
  description: string;
  category: string;
  city: string;
  state: string;
  address: string;
  average_rating: number;
  logo_url: string;
  banner_url: string;
  recommendationReason: string;
}

export const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    
    const loadRecommendations = async () => {
      try {
        setIsLoading(true);

        // Get user's location (you can enhance this with actual geolocation)
        const userLocation = {
          city: 'New York', // Default, can be replaced with actual location
          state: 'NY'
        };

        // Get user preferences from localStorage or profile
        const savedPreferences = localStorage.getItem('user_preferences');
        const userPreferences = savedPreferences ? JSON.parse(savedPreferences) : {
          categories: ['Food & Beverage', 'Retail', 'Services']
        };

        // Get browsing history from localStorage
        const savedHistory = localStorage.getItem('browsing_history');
        const browsingHistory = savedHistory ? JSON.parse(savedHistory) : [];

        const { data, error } = await supabase.functions.invoke('ai-recommendations', {
          body: {
            userLocation,
            userPreferences,
            browsingHistory: browsingHistory.slice(0, 10), // Last 10 items
            limit: 5
          }
        });

        // Don't update state if component was unmounted
        if (abortController.signal.aborted) return;

        if (error) throw error;

        setRecommendations(data.recommendations || []);
      } catch (error: any) {
        // Ignore abort errors - they're expected during navigation
        if (error?.name === 'AbortError' || abortController.signal.aborted) return;
        console.error('Error loading recommendations:', error);
        // Don't show toast for abort errors
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadRecommendations();
    
    return () => {
      abortController.abort();
    };
  }, []);

  const refreshRecommendations = async () => {
    try {
      setIsLoading(true);
      const userLocation = { city: 'New York', state: 'NY' };
      const savedPreferences = localStorage.getItem('user_preferences');
      const userPreferences = savedPreferences ? JSON.parse(savedPreferences) : {
        categories: ['Food & Beverage', 'Retail', 'Services']
      };
      const savedHistory = localStorage.getItem('browsing_history');
      const browsingHistory = savedHistory ? JSON.parse(savedHistory) : [];

      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: { userLocation, userPreferences, browsingHistory: browsingHistory.slice(0, 10), limit: 5 }
      });

      if (error) throw error;
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Recommended For You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Recommended For You</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={refreshRecommendations}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((business) => (
          <Card 
            key={business.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden bg-muted">
              {business.banner_url ? (
                <img 
                  src={business.banner_url} 
                  alt={business.business_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  {business.logo_url ? (
                    <img 
                      src={business.logo_url} 
                      alt={business.business_name}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-primary/30">
                      {business.business_name.charAt(0)}
                    </span>
                  )}
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary/90 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Pick
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-1">{business.business_name}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  {business.average_rating > 0 && (
                    <>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{business.average_rating.toFixed(1)}</span>
                    </>
                  )}
                </span>
                {business.city && (
                  <span className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    {business.city}, {business.state}
                  </span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {business.category && (
                  <Badge variant="secondary">{business.category}</Badge>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {business.description || 'No description available'}
                </p>

                {business.recommendationReason && (
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                    <p className="text-xs text-primary font-medium flex items-start gap-2">
                      <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{business.recommendationReason}</span>
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full group/btn"
                  onClick={() => {
                    // Track the view in browsing history
                    const history = JSON.parse(localStorage.getItem('browsing_history') || '[]');
                    history.unshift({ 
                      id: business.id, 
                      category: business.category,
                      timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('browsing_history', JSON.stringify(history.slice(0, 50)));
                    
                    // Navigate to business page (you can customize this)
                    toast.success(`Opening ${business.business_name}`);
                  }}
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
