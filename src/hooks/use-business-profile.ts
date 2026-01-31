
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { isValidUUID } from '@/lib/validation/uuid-guard';
import { showDatabaseError } from '@/lib/error-toast';

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

    // Validate user ID before query to prevent UUID errors
    if (!isValidUUID(user.id)) {
      console.error('Invalid user ID format:', user.id);
      setError('Invalid session. Please log in again.');
      showDatabaseError('Invalid user ID', 'business profile');
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
      console.error('Error loading business profile:', err);
      const message = err.message || 'Failed to load business profile';
      setError(message);
      showDatabaseError(message, 'business profile');
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
