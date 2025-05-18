
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
    supportEmail: 'support@mansamusa.app',
    privacyPolicyUrl: '/privacy-policy',
    termsOfServiceUrl: '/terms-of-service',
  },
};

// Configuration variables
let appConfig: AppConfig = { ...defaultConfig };
let configLoaded = false;

// Load configuration from database if available
export const loadAppConfig = async (): Promise<AppConfig> => {
  if (configLoaded) return appConfig;
  
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.warn('Could not load app configuration from database, using defaults');
      configLoaded = true;
      return appConfig;
    }
    
    // Merge database configuration with defaults
    appConfig = {
      ...defaultConfig,
      ...JSON.parse(data.config_json || '{}'),
    };
    
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
export const initAppConfig = async (): Promise<void> => {
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
            appConfig = {
              ...defaultConfig,
              ...JSON.parse(payload.new.config_json || '{}'),
            };
            console.log('App configuration updated in realtime');
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
