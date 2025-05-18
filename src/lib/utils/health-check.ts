
import { supabase } from '@/integrations/supabase/client';

// System health check interface
export interface SystemHealth {
  database: {
    status: 'healthy' | 'degraded' | 'offline';
    responseTime: number;
  };
  storage: {
    status: 'healthy' | 'degraded' | 'offline';
    responseTime: number;
  };
  auth: {
    status: 'healthy' | 'degraded' | 'offline';
    responseTime: number;
  };
  overall: 'healthy' | 'degraded' | 'offline';
}

// Perform a complete health check
export const checkSystemHealth = async (): Promise<SystemHealth> => {
  const results: SystemHealth = {
    database: { status: 'offline', responseTime: 0 },
    storage: { status: 'offline', responseTime: 0 },
    auth: { status: 'offline', responseTime: 0 },
    overall: 'offline'
  };

  try {
    // Check database health
    const dbStart = performance.now();
    try {
      // Use a known table instead of health_check which might not exist
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        results.database.status = 'degraded';
      } else {
        results.database.status = 'healthy';
      }
    } catch (error) {
      results.database.status = 'degraded';
      console.error('Database health check failed:', error);
    }
    results.database.responseTime = Math.round(performance.now() - dbStart);

    // Check storage health
    const storageStart = performance.now();
    try {
      await supabase.storage.listBuckets();
      results.storage.status = 'healthy';
    } catch (error) {
      results.storage.status = 'degraded';
      console.error('Storage health check failed:', error);
    }
    results.storage.responseTime = Math.round(performance.now() - storageStart);

    // Check auth health
    const authStart = performance.now();
    try {
      await supabase.auth.getSession();
      results.auth.status = 'healthy';
    } catch (error) {
      results.auth.status = 'degraded';
      console.error('Auth health check failed:', error);
    }
    results.auth.responseTime = Math.round(performance.now() - authStart);

    // Determine overall status
    const allHealthy = 
      results.database.status === 'healthy' &&
      results.storage.status === 'healthy' &&
      results.auth.status === 'healthy';
      
    const anyOffline = 
      results.database.status === 'offline' ||
      results.storage.status === 'offline' ||
      results.auth.status === 'offline';
    
    if (allHealthy) {
      results.overall = 'healthy';
    } else if (anyOffline) {
      results.overall = 'offline';
    } else {
      results.overall = 'degraded';
    }

    return results;
  } catch (error) {
    console.error('Health check failed:', error);
    return results;
  }
};

// Create a monitor that periodically checks system health
export const createHealthMonitor = (
  onStatusChange?: (status: SystemHealth) => void,
  interval = 60000 // Default: check every minute
) => {
  let lastStatus: string | null = null;

  const checkHealth = async () => {
    try {
      const health = await checkSystemHealth();
      const statusKey = JSON.stringify(health);
      
      // Only trigger callback if status changed
      if (lastStatus !== statusKey && onStatusChange) {
        onStatusChange(health);
      }
      
      lastStatus = statusKey;
      
      return health;
    } catch (error) {
      console.error('Health monitor check failed:', error);
      
      if (lastStatus !== 'error' && onStatusChange) {
        onStatusChange({
          database: { status: 'offline', responseTime: 0 },
          storage: { status: 'offline', responseTime: 0 },
          auth: { status: 'offline', responseTime: 0 },
          overall: 'offline'
        });
      }
      
      lastStatus = 'error';
      
      return null;
    }
  };

  // Start monitoring
  const timerId = setInterval(checkHealth, interval);

  // Initial check
  checkHealth();

  // Return function to stop monitoring
  return {
    stop: () => clearInterval(timerId),
    check: checkHealth
  };
};
