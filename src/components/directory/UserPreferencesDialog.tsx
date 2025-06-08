
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, X } from 'lucide-react';
import { useUserPreferences, UserPreferences } from '@/hooks/use-user-preferences';

interface UserPreferencesDialogProps {
  children?: React.ReactNode;
  categories: string[];
}

const UserPreferencesDialog: React.FC<UserPreferencesDialogProps> = ({
  children,
  categories
}) => {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const [localPreferences, setLocalPreferences] = useState<Partial<UserPreferences>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    const success = await updatePreferences(localPreferences);
    if (success) {
      setIsOpen(false);
    }
  };

  const toggleCategory = (category: string) => {
    const currentCategories = localPreferences.preferred_categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    setLocalPreferences(prev => ({
      ...prev,
      preferred_categories: newCategories
    }));
  };

  if (loading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Preferences</DialogTitle>
          <DialogDescription>
            Customize your business discovery experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preferred Categories */}
          <div>
            <h3 className="font-medium mb-3">Preferred Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    localPreferences.preferred_categories?.includes(category) 
                      ? "default" 
                      : "outline"
                  }
                  className={`cursor-pointer transition-colors ${
                    localPreferences.preferred_categories?.includes(category)
                      ? 'bg-mansablue'
                      : ''
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  {localPreferences.preferred_categories?.includes(category) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Default Search Radius */}
          <div>
            <h3 className="font-medium mb-3">Default Search Radius</h3>
            <div className="space-y-3">
              <Slider
                value={[localPreferences.default_radius || 10]}
                onValueChange={(value) => setLocalPreferences(prev => ({
                  ...prev,
                  default_radius: value[0]
                }))}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 mile</span>
                <span>{localPreferences.default_radius || 10} miles</span>
              </div>
            </div>
          </div>

          {/* Price Preference */}
          <div>
            <h3 className="font-medium mb-3">Price Preference</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'budget', label: 'Budget-Friendly' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'premium', label: 'Premium' },
                { value: 'all', label: 'All Prices' }
              ].map((option) => (
                <Badge
                  key={option.value}
                  variant={
                    localPreferences.preferred_price_range === option.value
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer transition-colors ${
                    localPreferences.preferred_price_range === option.value
                      ? 'bg-mansablue'
                      : ''
                  }`}
                  onClick={() => setLocalPreferences(prev => ({
                    ...prev,
                    preferred_price_range: option.value as any
                  }))}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable Notifications</h3>
                <p className="text-sm text-gray-600">Get updates about new businesses</p>
              </div>
              <Switch
                checked={localPreferences.notifications_enabled ?? true}
                onCheckedChange={(checked) => setLocalPreferences(prev => ({
                  ...prev,
                  notifications_enabled: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Location Sharing</h3>
                <p className="text-sm text-gray-600">Help us find businesses near you</p>
              </div>
              <Switch
                checked={localPreferences.location_sharing_enabled ?? true}
                onCheckedChange={(checked) => setLocalPreferences(prev => ({
                  ...prev,
                  location_sharing_enabled: checked
                }))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-mansablue hover:bg-mansablue-dark">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserPreferencesDialog;
