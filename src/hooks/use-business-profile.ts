
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description?: string;
  business_category?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  business_website?: string;
  business_hours?: string;
  logo_url?: string;
  banner_url?: string;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export const useBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadBusinessProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading business profile:', error);
        toast.error('Failed to load business profile');
        return;
      }

      if (data) {
        setProfile(data as BusinessProfile);
      }
    } catch (error) {
      console.error('Error loading business profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateBusinessProfile = async (updates: Partial<BusinessProfile>) => {
    if (!user || !profile) return false;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating business profile:', error);
        toast.error('Failed to update business profile');
        return false;
      }

      if (data) {
        setProfile(data as BusinessProfile);
        toast.success('Business profile updated successfully');
        return true;
      }
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast.error('Failed to update business profile');
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  return {
    profile,
    loading,
    loadBusinessProfile,
    updateBusinessProfile
  };
};
