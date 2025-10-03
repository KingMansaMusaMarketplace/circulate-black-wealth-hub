import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TenantConfiguration } from '@/types/multi-location';

export function useWhiteLabel(businessId: string | null) {
  const [config, setConfig] = useState<TenantConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchConfiguration = async () => {
    if (!businessId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenant_configurations')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setConfig(data);
    } catch (error: any) {
      console.error('Error fetching white-label config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguration = async (updates: Partial<TenantConfiguration>) => {
    if (!businessId) return;

    try {
      const { data, error } = await supabase
        .from('tenant_configurations')
        .upsert({
          business_id: businessId,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setConfig(data);
      toast({
        title: 'Success',
        description: 'White-label configuration updated',
      });

      return data;
    } catch (error: any) {
      console.error('Error updating config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update configuration',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const generateApiKey = async () => {
    if (!businessId) return;

    try {
      const { data, error } = await supabase
        .rpc('generate_white_label_api_key', { p_business_id: businessId });

      if (error) throw error;

      toast({
        title: 'API Key Generated',
        description: 'Save this key securely - it will not be shown again',
      });

      return data;
    } catch (error: any) {
      console.error('Error generating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate API key',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const checkSubdomainAvailability = async (subdomain: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_configurations')
        .select('id')
        .eq('subdomain', subdomain)
        .neq('business_id', businessId || '');

      if (error) throw error;
      return data.length === 0;
    } catch (error: any) {
      console.error('Error checking subdomain:', error);
      return false;
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchConfiguration();
    }
  }, [businessId]);

  return {
    config,
    loading,
    updateConfiguration,
    generateApiKey,
    checkSubdomainAvailability,
    refetch: fetchConfiguration,
  };
}
