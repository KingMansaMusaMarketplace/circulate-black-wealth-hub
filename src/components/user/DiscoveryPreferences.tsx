import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Heart, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiscoveryPrefs {
  max_distance: number;
  price_range_min: number;
  price_range_max: number;
  preferred_categories: string[];
  interests: string[];
}

const BUSINESS_CATEGORIES = [
  'Restaurant', 'Retail', 'Health & Beauty', 'Professional Services',
  'Entertainment', 'Fitness', 'Technology', 'Automotive', 'Home Services',
  'Education', 'Travel', 'Finance', 'Real Estate', 'Non-Profit'
];

const INTEREST_OPTIONS = [
  'Local Events', 'Special Offers', 'New Businesses', 'HBCU Businesses',
  'Eco-Friendly', 'Family-Owned', 'Women-Owned', 'Minority-Owned',
  'Community Events', 'Loyalty Programs', 'Seasonal Deals', 'Premium Services'
];

export const DiscoveryPreferences: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<DiscoveryPrefs>({
    max_distance: 25,
    price_range_min: 0,
    price_range_max: 1000,
    preferred_categories: [],
    interests: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_discovery_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          max_distance: data.max_distance || 25,
          price_range_min: data.price_range_min || 0,
          price_range_max: data.price_range_max || 1000,
          preferred_categories: data.preferred_categories || [],
          interests: data.interests || []
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_discovery_preferences')
        .upsert({
          user_id: user?.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Discovery preferences updated successfully'
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Distance Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location Preferences</span>
          </CardTitle>
          <CardDescription>
            Set your preferred search radius for discovering businesses nearby.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Maximum Distance: {preferences.max_distance} miles</Label>
            <Slider
              value={[preferences.max_distance]}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, max_distance: value[0] }))}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 mile</span>
              <span>100 miles</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Price Range</span>
          </CardTitle>
          <CardDescription>
            Set your preferred price range for products and services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_min">Minimum Price ($)</Label>
              <Input
                id="price_min"
                type="number"
                value={preferences.price_range_min}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  price_range_min: parseInt(e.target.value) || 0 
                }))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_max">Maximum Price ($)</Label>
              <Input
                id="price_max"
                type="number"
                value={preferences.price_range_max}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  price_range_max: parseInt(e.target.value) || 1000 
                }))}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Preferred Business Categories</CardTitle>
          <CardDescription>
            Select the types of businesses you're most interested in discovering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BUSINESS_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={preferences.preferred_categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
          {preferences.preferred_categories.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium">Selected Categories:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.preferred_categories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center space-x-1">
                    <span>{category}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => toggleCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Interests & Values</span>
          </CardTitle>
          <CardDescription>
            Choose what matters most to you when discovering businesses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTEREST_OPTIONS.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={preferences.interests.includes(interest)}
                  onCheckedChange={() => toggleInterest(interest)}
                />
                <Label htmlFor={interest} className="text-sm cursor-pointer">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
          {preferences.interests.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium">Selected Interests:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="flex items-center space-x-1">
                    <span>{interest}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => toggleInterest(interest)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};