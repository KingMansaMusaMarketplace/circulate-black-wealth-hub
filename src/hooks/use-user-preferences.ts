
import { useState } from 'react';

export interface UserPreferences {
  default_radius?: number;
  preferred_categories?: string[];
  preferred_price_range?: 'budget' | 'moderate' | 'premium' | 'all';
  notifications_enabled?: boolean;
  location_sharing_enabled?: boolean;
  notification_settings?: {
    email: boolean;
    push: boolean;
  };
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    default_radius: 5,
    preferred_categories: [],
    preferred_price_range: 'all',
    notifications_enabled: true,
    location_sharing_enabled: true,
    notification_settings: {
      email: true,
      push: false
    }
  });
  const [loading, setLoading] = useState(false);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    setLoading(true);
    try {
      setPreferences(prev => ({ ...prev, ...newPreferences }));
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    updatePreferences,
    loading
  };
}
