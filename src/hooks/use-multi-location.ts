import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { BusinessLocation, ParentBusinessAnalytics } from '@/types/multi-location';

export function useMultiLocation(businessId: string | null) {
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [analytics, setAnalytics] = useState<ParentBusinessAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLocations = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_business_locations', { p_parent_business_id: businessId });

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      console.error('Error fetching locations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load business locations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParentAnalytics = async () => {
    if (!businessId) return;
    
    try {
      const { data, error } = await supabase
        .rpc('get_parent_business_analytics', { p_parent_business_id: businessId });

      if (error) throw error;
      setAnalytics(data);
    } catch (error: any) {
      console.error('Error fetching parent analytics:', error);
    }
  };

  const createLocation = async (locationData: {
    business_name: string;
    location_name: string;
    city?: string;
    state?: string;
    address?: string;
    email?: string;
    phone?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...locationData,
          parent_business_id: businessId,
          location_type: 'location',
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Location created successfully',
      });

      fetchLocations();
      return data;
    } catch (error: any) {
      console.error('Error creating location:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create location',
        variant: 'destructive',
      });
      throw error;
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

      fetchLocations();
    } catch (error: any) {
      console.error('Error updating location:', error);
      toast({
        title: 'Error',
        description: 'Failed to update location',
        variant: 'destructive',
      });
    }
  };

  const convertToParent = async () => {
    if (!businessId) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .update({ location_type: 'parent' })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Business converted to parent location',
      });
    } catch (error: any) {
      console.error('Error converting to parent:', error);
      toast({
        title: 'Error',
        description: 'Failed to convert business',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchLocations();
      fetchParentAnalytics();
    }
  }, [businessId]);

  return {
    locations,
    analytics,
    loading,
    createLocation,
    updateLocation,
    convertToParent,
    refetch: fetchLocations,
  };
}
