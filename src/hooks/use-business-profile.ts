
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

// Define the business profile type
export interface BusinessProfile {
  id?: string;
  owner_id: string;
  business_name: string;
  description?: string;
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  created_at?: string;
  updated_at?: string;
  review_count?: number;
  average_rating?: number;
  is_verified?: boolean;
  qr_code_url?: string;
  qr_code_id?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
}

export const useBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  // Load business profile
  const loadBusinessProfile = useCallback(async () => {
    if (!user) {
      console.log('useBusinessProfile: No user found, setting loading to false');
      setLoading(false);
      return;
    }
    
    console.log('useBusinessProfile: Starting to load profile for user:', user.id);
    setLoading(true);
    setError(null);
    
    try {
      console.log('useBusinessProfile: Making Supabase query...');
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      
      console.log('useBusinessProfile: Supabase response:', { data, error });
      
      if (error) {
        console.error('useBusinessProfile: Supabase error:', error);
        throw error;
      }
      
      console.log('useBusinessProfile: Profile loaded successfully:', data);
      setProfile(data);
    } catch (err: any) {
      console.error('useBusinessProfile: Error in catch block:', err);
      setError(err.message || 'Error loading business profile');
      toast.error('Failed to load business profile');
    } finally {
      console.log('useBusinessProfile: Setting loading to false');
      setLoading(false);
    }
  }, [user]);

  // Update business profile
  const updateBusinessProfile = async (updates: Partial<BusinessProfile>) => {
    if (!profile?.id || !user) {
      toast.error('You must be logged in and have a business profile to update');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      toast.success('Business profile updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating business profile:', err);
      setError(err.message || 'Error updating business profile');
      toast.error('Failed to update business profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create business profile
  const createBusinessProfile = async (profileData: BusinessProfile) => {
    if (!user) {
      toast.error('You must be logged in to create a business profile');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert({ ...profileData, owner_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      toast.success('Business profile created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating business profile:', err);
      setError(err.message || 'Error creating business profile');
      toast.error('Failed to create business profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load profile when user changes
  useEffect(() => {
    console.log('useBusinessProfile: Effect triggered - authLoading:', authLoading, 'user:', user);
    
    // Wait for auth to finish loading before proceeding
    if (authLoading) {
      console.log('useBusinessProfile: Auth still loading, waiting...');
      return;
    }
    
    if (user) {
      console.log('useBusinessProfile: User found, loading profile...');
      loadBusinessProfile();
    } else {
      console.log('useBusinessProfile: No user, setting loading to false');
      setProfile(null);
      setLoading(false);
    }
  }, [user, authLoading, loadBusinessProfile]);

  return {
    profile,
    loading,
    error,
    updateBusinessProfile,
    createBusinessProfile,
    loadBusinessProfile
  };
};
