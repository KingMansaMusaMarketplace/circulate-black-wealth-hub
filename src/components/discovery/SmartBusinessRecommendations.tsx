
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Star, TrendingUp, Heart, Eye, Share2, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Business {
  id: string;
  business_name: string;
  category: string;
  description: string;
  city: string;
  state: string;
  logo_url?: string;
  banner_url?: string;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
}

interface UserPreferences {
  preferred_categories: string[];
  max_distance: number;
  price_range_min: number;
  price_range_max: number;
  interests: string[];
}

const SmartBusinessRecommendations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [recommendations, setRecommendations] = useState<Business[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_categories: [],
    max_distance: 25,
    price_range_min: 0,
    price_range_max: 1000,
    interests: []
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Restaurant', 'Retail', 'Beauty & Wellness', 'Professional Services',
    'Technology', 'Arts & Entertainment', 'Health Services', 'Education',
    'Fitness', 'Real Estate', 'Financial Services', 'Construction'
  ];

  const interests = [
    'Healthy Living', 'Technology', 'Fashion', 'Food & Dining',
    'Fitness', 'Arts & Culture', 'Education', 'Finance',
    'Home & Garden', 'Beauty', 'Professional Development', 'Community Events'
  ];

  useEffect(() => {
    fetchBusinesses();
    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  useEffect(() => {
    if (businesses.length > 0) {
      generateRecommendations();
    }
  }, [businesses, preferences]);

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching businesses:', error);
      return;
    }

    setBusinesses(data || []);
    setLoading(false);
  };

  const fetchUserPreferences = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_discovery_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching preferences:', error);
      return;
    }

    if (data) {
      setPreferences({
        preferred_categories: data.preferred_categories || [],
        max_distance: data.max_distance || 25,
        price_range_min: data.price_range_min || 0,
        price_range_max: data.price_range_max || 1000,
        interests: data.interests || []
      });
    }
  };

  const saveUserPreferences = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_discovery_preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      });

    if (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
      return;
    }

    toast.success('Preferences saved!');
    generateRecommendations();
  };

  const generateRecommendations = () => {
    let scored = businesses.map(business => {
      let score = 0;

      // Category preference scoring
      if (preferences.preferred_categories.includes(business.category || '')) {
        score += 30;
      }

      // Rating scoring
      score += (business.average_rating || 0) * 5;

      // Verification bonus
      if (business.is_verified) {
        score += 10;
      }

      // Review count influence
      score += Math.min((business.review_count || 0) * 0.5, 15);

      // Random factor to prevent stagnation
      score += Math.random() * 10;

      return { ...business, score };
    });

    // Sort by score and take top recommendations
    scored.sort((a, b) => b.score - a.score);
    setRecommendations(scored.slice(0, 12));
  };

  const trackInteraction = async (businessId: string, interactionType: string) => {
    if (!user) return;

    await supabase
      .from('business_interactions')
      .insert({
        user_id: user.id,
        business_id: businessId,
        interaction_type: interactionType
      });
  };

  const handleBusinessClick = async (business: Business) => {
    await trackInteraction(business.id, 'view');
    navigate(`/business/${business.id}`);
  };

  const handleFavorite = async (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to favorite businesses');
      return;
    }
    
    await trackInteraction(businessId, 'favorite');
    toast.success('Added to favorites!');
  };

  const handleShare = async (business: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.business_name,
          text: business.description,
          url: `${window.location.origin}/business/${business.id}`
        });
        
        if (user) {
          await trackInteraction(business.id, 'share');
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/business/${business.id}`);
      toast.success('Link copied to clipboard!');
      
      if (user) {
        await trackInteraction(business.id, 'share');
      }
    }
  };

  const toggleCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_categories: prev.preferred_categories.includes(category)
        ? prev.preferred_categories.filter(c => c !== category)
        : [...prev.preferred_categories, category]
    }));
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Black-Owned Businesses</h1>
          <p className="text-gray-600 mt-2">Personalized recommendations just for you</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Customize</span>
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personalize Your Discovery</CardTitle>
            <CardDescription>
              Help us recommend the perfect businesses for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preferred Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Preferred Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={preferences.preferred_categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label htmlFor={category} className="text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Your Interests</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {interests.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={preferences.interests.includes(interest)}
                      onCheckedChange={() => toggleInterest(interest)}
                    />
                    <label htmlFor={interest} className="text-sm text-gray-700">
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Maximum Distance: {preferences.max_distance} miles
              </h3>
              <Slider
                value={[preferences.max_distance]}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, max_distance: value[0] }))}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            {user && (
              <div className="flex justify-end">
                <Button onClick={saveUserPreferences}>
                  Save Preferences
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendations.map((business) => (
          <Card 
            key={business.id} 
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => handleBusinessClick(business)}
          >
            {/* Business Image */}
            <div className="relative h-48 bg-gradient-to-br from-mansablue to-mansablue-dark overflow-hidden">
              {business.banner_url ? (
                <img
                  src={business.banner_url}
                  alt={business.business_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white text-lg font-semibold text-center p-4">
                    {business.business_name}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => handleFavorite(business.id, e)}
                  className="h-8 w-8 p-0"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => handleShare(business, e)}
                  className="h-8 w-8 p-0"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Verification Badge */}
              {business.is_verified && (
                <Badge className="absolute top-3 left-3 bg-green-600">
                  Verified
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-mansablue transition-colors">
                  {business.business_name}
                </h3>
                {business.logo_url && (
                  <img
                    src={business.logo_url}
                    alt="Logo"
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {business.category}
                </Badge>
                {business.average_rating > 0 && (
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600 ml-1">
                      {business.average_rating.toFixed(1)} ({business.review_count})
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {business.description}
              </p>
              
              <div className="flex items-center text-gray-500 text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{business.city}, {business.state}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-4">
              Adjust your preferences to discover amazing Black-owned businesses!
            </p>
            <Button onClick={() => setShowFilters(true)}>
              Set Your Preferences
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartBusinessRecommendations;
