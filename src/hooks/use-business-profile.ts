
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { BusinessProfile as ApiBusinessProfile } from '@/lib/api/business-api';

// Modify the interface to match the requirements in business-api.ts
export interface BusinessProfile {
  id?: string;
  owner_id: string;
  business_name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  is_verified?: boolean;
  average_rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
}

export const useBusinessProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load business profile
  const loadBusinessProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
    } catch (err: any) {
      console.error('Error loading business profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update business profile
  const updateBusinessProfile = async (updates: Partial<BusinessProfile>) => {
    if (!profile?.id) {
      toast.error('No business profile to update');
      return false;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      // Refresh profile
      await loadBusinessProfile();
      toast.success('Business profile updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error updating business profile:', err);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load profile when user changes
  useEffect(() => {
    if (user?.id) {
      loadBusinessProfile();
    } else {
      setProfile(null);
    }
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    loadBusinessProfile,
    updateBusinessProfile
  };
};
