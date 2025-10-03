import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TenantConfig {
  id: string;
  business_id: string;
  subdomain: string | null;
  custom_domain: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  favicon_url: string | null;
  custom_css: string | null;
  branding_enabled: boolean;
  webhook_url: string | null;
}

export function useWhiteLabel(businessId: string) {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!businessId) return;
    fetchConfig();
  }, [businessId]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenant_configurations')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setConfig(data);
    } catch (error) {
      console.error('Error fetching white-label config:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch white-label configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<TenantConfig>) => {
    try {
      const { error } = await supabase
        .from('tenant_configurations')
        .upsert({
          business_id: businessId,
          ...updates,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'White-label configuration updated',
      });

      await fetchConfig();
    } catch (error: any) {
      console.error('Error updating white-label config:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update configuration',
        variant: 'destructive',
      });
    }
  };

  const generateApiKey = async () => {
    try {
      const { data, error } = await supabase
        .rpc('generate_white_label_api_key', { p_business_id: businessId });

      if (error) throw error;
      
      setApiKey(data);
      toast({
        title: 'Success',
        description: 'API key generated successfully. Make sure to copy it now!',
      });
    } catch (error: any) {
      console.error('Error generating API key:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate API key',
        variant: 'destructive',
      });
    }
  };

  const applyTheme = (colors: Pick<TenantConfig, 'primary_color' | 'secondary_color' | 'accent_color'>) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary_color);
    root.style.setProperty('--secondary', colors.secondary_color);
    root.style.setProperty('--accent', colors.accent_color);
  };

  return {
    config,
    apiKey,
    loading,
    updateConfig,
    generateApiKey,
    applyTheme,
    refetch: fetchConfig,
  };
}
