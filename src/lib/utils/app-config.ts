
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
    // Use exec_sql to query the app_config table since it's not in the types
    const { data, error } = await supabase
      .rpc('exec_sql', {
        query: `SELECT * FROM app_config WHERE is_active = true ORDER BY created_at DESC LIMIT 1`
      }) as { data: AppConfigRow[] | null, error: any };
    
    if (error || !data || data.length === 0) {
      console.warn('Could not load app configuration from database, using defaults');
      configLoaded = true;
      return appConfig;
    }
    
    // Merge database configuration with defaults
    try {
      const configJson = data[0].config_json;
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
