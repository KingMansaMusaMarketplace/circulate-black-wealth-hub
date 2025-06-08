
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserPreferences {
  id?: string;
  user_id: string;
  preferred_categories: string[];
  default_radius: number;
  preferred_price_range: 'budget' | 'moderate' | 'premium' | 'all';
  notifications_enabled: boolean;
  location_sharing_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

const defaultPreferences: Omit<UserPreferences, 'user_id'> = {
  preferred_categories: [],
  default_radius: 10,
  preferred_price_range: 'all',
  notifications_enabled: true,
  location_sharing_enabled: true
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences(null);
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        const newPreferences = {
          ...defaultPreferences,
          user_id: user.id
        };
        setPreferences(newPreferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) {
      toast.error('Please sign in to save preferences');
      return false;
    }

    try {
      const updatedPreferences = { ...preferences, ...updates };
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPreferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setPreferences(updatedPreferences as UserPreferences);
      toast.success('Preferences updated');
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      return false;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    loadPreferences
  };
};
