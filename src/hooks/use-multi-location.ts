import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BusinessLocation {
  id: string;
  business_name: string;
  location_name: string | null;
  city: string | null;
  state: string | null;
  location_manager_id: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface ParentBusinessAnalytics {
  total_locations: number;
  total_transactions: number;
  total_revenue: number;
  total_customers: number;
  total_qr_scans: number;
  locations_breakdown: Array<{
    location_id: string;
    location_name: string;
    city: string;
    transaction_count: number;
    revenue: number;
  }>;
}

export function useMultiLocation(businessId: string) {
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [analytics, setAnalytics] = useState<ParentBusinessAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!businessId) return;
    
    fetchLocations();
    fetchAnalytics();
  }, [businessId]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_business_locations', { p_parent_business_id: businessId });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_parent_business_analytics', { p_parent_business_id: businessId });

      if (error) throw error;
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (locationData: {
    business_name: string;
    location_name: string;
    city?: string;
    state?: string;
    address?: string;
    phone?: string;
  }) => {
    try {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('businesses')
        .insert({
          ...locationData,
          parent_business_id: businessId,
          location_type: 'location',
          owner_id: profile.user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Location added successfully',
      });

      await fetchLocations();
      await fetchAnalytics();
    } catch (error: any) {
      console.error('Error adding location:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add location',
        variant: 'destructive',
      });
    }
  };

  const updateLocation = async (locationId: string, updates: Partial<BusinessLocation>) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', locationId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Location updated successfully',
      });

      await fetchLocations();
    } catch (error: any) {
      console.error('Error updating location:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update location',
        variant: 'destructive',
      });
    }
  };

  const convertToParent = async () => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ location_type: 'parent' })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Business converted to parent account',
      });
    } catch (error: any) {
      console.error('Error converting to parent:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to convert to parent account',
        variant: 'destructive',
      });
    }
  };

  return {
    locations,
    analytics,
    loading,
    createLocation,
    updateLocation,
    convertToParent,
    refetch: () => {
      fetchLocations();
      fetchAnalytics();
    },
  };
}
