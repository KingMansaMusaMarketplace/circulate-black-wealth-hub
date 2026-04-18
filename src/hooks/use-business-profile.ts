
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { isValidUUID } from '@/lib/validation/uuid-guard';
// Note: removed showDatabaseError import — this hook now fails silently
// because many users legitimately have no business profile.

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
      setProfile(null);
      setError(null);
      return;
    }

    // Validate user ID before query to prevent UUID errors
    if (!isValidUUID(user.id)) {
      console.error('Invalid user ID format:', user.id);
      setError('Invalid session. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Use order + limit instead of single/maybeSingle to handle multiple businesses per owner
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      // Get the first (most recent) business
      setProfile(data && data.length > 0 ? data[0] : null);
    } catch (err: any) {
      // Silently log: many users (consumers, visitors, agents) have no business profile.
      // Showing a toast on every page load is wrong — only consumers of this hook that
      // actually need a profile should surface that to the user.
      console.warn('[useBusinessProfile] could not load profile:', err?.message || err);
      setError(err?.message || 'Failed to load business profile');
      setProfile(null);
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
        .eq('id', profile.id)  // Use specific ID instead of owner_id
        .select();

      if (updateError) throw updateError;

      setProfile(data && data.length > 0 ? data[0] : profile);
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
