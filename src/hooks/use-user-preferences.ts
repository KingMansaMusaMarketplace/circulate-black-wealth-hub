
import { useState } from 'react';

interface UserPreferences {
  default_radius?: number;
  preferred_categories?: string[];
  notification_settings?: {
    email: boolean;
    push: boolean;
  };
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    default_radius: 5,
    preferred_categories: [],
    notification_settings: {
      email: true,
      push: false
    }
  });

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  return {
    preferences,
    updatePreferences
  };
}
