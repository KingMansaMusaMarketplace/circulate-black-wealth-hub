
import { supabase } from '@/integrations/supabase/client';

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Configuration interface
export interface AppConfig {
  environment: Environment;
  apiRateLimits: {
    default: number;
    highPriority: number;
    lowPriority: number;
  };
  featureFlags: {
    enableSocialSharing: boolean;
    enableRealtimeUpdates: boolean;
    enableAnalytics: boolean;
    enableAdvancedSearch: boolean;
  };
  security: {
    maxSharesPerMinute: number;
    maxLoginAttempts: number;
    sessionTimeoutMinutes: number;
  };
  contactInfo: {
    supportEmail: string;
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  environment: 'production',
  apiRateLimits: {
    default: 60,
    highPriority: 120,
    lowPriority: 30,
  },
  featureFlags: {
    enableSocialSharing: true,
    enableRealtimeUpdates: true,
    enableAnalytics: true,
    enableAdvancedSearch: true,
  },
  security: {
    maxSharesPerMinute: 5,
    maxLoginAttempts: 5,
    sessionTimeoutMinutes: 60,
  },
  contactInfo: {
    supportEmail: 'contact@mansamusamarketplace.com',
    privacyPolicyUrl: '/privacy-policy',
    termsOfServiceUrl: '/terms-of-service',
  },
};

// Configuration variables
let appConfig: AppConfig = { ...defaultConfig };
let configLoaded = false;

// Create a type for app_config table row
interface AppConfigRow {
  id: string;
  is_active: boolean;
  config_json: string;
  created_at: string;
}

// Load configuration from database if available
export const loadAppConfig = async (): Promise<AppConfig> => {
  if (configLoaded) return appConfig;
  
  try {
    // Try to query app_config table directly since it may not exist
    const { data, error } = await supabase
      .from('app_config')
      .select('config_json, is_active, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error || !data) {
      console.warn('Could not load app configuration from database, using defaults');
      configLoaded = true;
      return appConfig;
    }
    
    // Merge database configuration with defaults
    try {
      const configJson = data.config_json;
      appConfig = {
        ...defaultConfig,
        ...JSON.parse(configJson || '{}'),
      };
    } catch (parseError) {
      console.error('Error parsing app configuration:', parseError);
    }
    
    configLoaded = true;
    console.log('App configuration loaded successfully');
    return appConfig;
  } catch (error) {
    console.error('Error loading app configuration:', error);
    configLoaded = true;
    return appConfig;
  }
};

// Get current configuration (loads if not already loaded)
export const getAppConfig = async (): Promise<AppConfig> => {
  if (!configLoaded) {
    return loadAppConfig();
  }
  return appConfig;
};

// Get configuration synchronously (uses cached values)
export const getAppConfigSync = (): AppConfig => {
  return appConfig;
};

// Check if feature is enabled
export const isFeatureEnabled = async (featureName: keyof AppConfig['featureFlags']): Promise<boolean> => {
  const config = await getAppConfig();
  return config.featureFlags[featureName] || false;
};

// Get environment
export const getEnvironment = async (): Promise<Environment> => {
  const config = await getAppConfig();
  return config.environment;
};

// Check if in production environment
export const isProduction = async (): Promise<boolean> => {
  const environment = await getEnvironment();
  return environment === 'production';
};

// Initialize configuration on app startup
export const initAppConfig = async (): Promise<() => void> => {
  await loadAppConfig();
  
  // Listen for realtime updates to configuration
  const channel = supabase
    .channel('app_config_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'app_config',
        filter: 'is_active=eq.true',
      },
      (payload) => {
        if (payload.new) {
          try {
            const newData = payload.new as any;
            if (newData.config_json) {
              appConfig = {
                ...defaultConfig,
                ...JSON.parse(newData.config_json || '{}'),
              };
              console.log('App configuration updated in realtime');
            }
          } catch (error) {
            console.error('Error updating app configuration:', error);
          }
        }
      }
    )
    .subscribe();
    
  // Clean up function
  return () => {
    supabase.removeChannel(channel);
  };
};
