
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface BusinessProfile {
  id: string;
  business_name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  logo_url?: string;
  banner_url?: string;
  is_verified?: boolean;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export const useBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadBusinessProfile = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error loading business profile:', err);
      setError(err.message || 'Failed to load business profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateBusinessProfile = async (updates: Partial<BusinessProfile>) => {
    if (!user || !profile) {
      toast.error('Cannot update profile: user or profile not found');
      return;
    }

    setLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from('businesses')
        .update(updates)
        .eq('owner_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data);
      toast.success('Business profile updated successfully');
    } catch (err: any) {
      console.error('Error updating business profile:', err);
      toast.error('Failed to update business profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinessProfile();
  }, [loadBusinessProfile]);

  return {
    profile,
    loading,
    error,
    loadBusinessProfile,
    updateBusinessProfile
  };
};
