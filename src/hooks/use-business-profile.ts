
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessProfile {
  id: string;
  owner_id: string;
  business_name: string;
  description?: string;
  category?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  logo_url?: string;
  banner_url?: string;
  is_verified: boolean;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export const useBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBusinessProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: profileError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(data || null);

    } catch (err: any) {
      console.error('Error fetching business profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateBusinessProfile = useCallback(async (updates: Partial<BusinessProfile>) => {
    if (!user || !profile) {
      throw new Error('No user or profile found');
    }

    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('owner_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;

    } catch (err: any) {
      console.error('Error updating business profile:', err);
      throw err;
    }
  }, [user, profile]);

  const createBusinessProfile = useCallback(async (profileData: Omit<BusinessProfile, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('No user found');
    }

    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...profileData,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;

    } catch (err: any) {
      console.error('Error creating business profile:', err);
      throw err;
    }
  }, [user]);

  useEffect(() => {
    fetchBusinessProfile();
  }, [fetchBusinessProfile]);

  return {
    profile,
    loading,
    error,
    updateBusinessProfile,
    createBusinessProfile,
    refreshProfile: fetchBusinessProfile,
    loadBusinessProfile: fetchBusinessProfile
  };
};
