
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Health status types
export type HealthStatus = 'healthy' | 'degraded' | 'offline';

// System health check interface
export interface SystemHealth {
  database: {
    status: HealthStatus;
    responseTime: number;
    details?: string;
  };
  storage: {
    status: HealthStatus;
    responseTime: number;
    details?: string;
  };
  auth: {
    status: HealthStatus;
    responseTime: number;
    details?: string;
  };
  overall: HealthStatus;
  timestamp: string;
  environment: string;
}

// Type guard function to check if a status is offline
function isOffline(status: HealthStatus): boolean {
  return status === 'offline';
}

// Type guard function to check if a status is degraded
function isDegraded(status: HealthStatus): boolean {
  return status === 'degraded';
}

// Perform a complete health check
export const checkSystemHealth = async (): Promise<SystemHealth> => {
  const results: SystemHealth = {
    database: { status: 'offline', responseTime: 0 },
    storage: { status: 'offline', responseTime: 0 },
    auth: { status: 'offline', responseTime: 0 },
    overall: 'offline',
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE || 'development'
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
        results.database.details = `Error: ${error.message}`;
      } else {
        results.database.status = 'healthy';
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      results.database.status = 'degraded';
      results.database.details = `Exception: ${errMsg}`;
      console.error('Database health check failed:', error);
    }
    results.database.responseTime = Math.round(performance.now() - dbStart);

    // Check storage health
    const storageStart = performance.now();
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        results.storage.status = 'degraded';
        results.storage.details = `Error: ${error.message}`;
      } else {
        results.storage.status = 'healthy';
        results.storage.details = `Found ${buckets?.length || 0} buckets`;
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      results.storage.status = 'degraded';
      results.storage.details = `Exception: ${errMsg}`;
      console.error('Storage health check failed:', error);
    }
    results.storage.responseTime = Math.round(performance.now() - storageStart);

    // Check auth health
    const authStart = performance.now();
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        results.auth.status = 'degraded';
        results.auth.details = `Error: ${error.message}`;
      } else {
        results.auth.status = 'healthy';
        results.auth.details = data.session ? 'Active session found' : 'No active session';
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      results.auth.status = 'degraded';
      results.auth.details = `Exception: ${errMsg}`;
      console.error('Auth health check failed:', error);
    }
    results.auth.responseTime = Math.round(performance.now() - authStart);

    // Determine overall status
    let isAllHealthy = true;
    let hasOfflineService = false;
    let hasDegradedService = false;

    // Check if all services are healthy
    if (results.database.status !== 'healthy') isAllHealthy = false;
    if (results.storage.status !== 'healthy') isAllHealthy = false;
    if (results.auth.status !== 'healthy') isAllHealthy = false;

    // Check if any service is offline or degraded using the type guard functions
    hasOfflineService = isOffline(results.database.status) || 
                        isOffline(results.storage.status) || 
                        isOffline(results.auth.status);
                        
    hasDegradedService = isDegraded(results.database.status) || 
                         isDegraded(results.storage.status) || 
                         isDegraded(results.auth.status);
    
    // Set overall status based on checks
    if (isAllHealthy) {
      results.overall = 'healthy';
    } else if (hasOfflineService) {
      results.overall = 'offline';
    } else if (hasDegradedService) {
      results.overall = 'degraded';
    }

    return results;
  } catch (error) {
    console.error('Health check failed:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    toast.error(`Backend health check failed: ${errMsg}`);
    return {
      ...results,
      database: { ...results.database, details: 'System error occurred' },
      storage: { ...results.storage, details: 'System error occurred' },
      auth: { ...results.auth, details: 'System error occurred' },
      overall: 'offline',
    };
  }
};

// Create a monitor that periodically checks system health
export const createHealthMonitor = (
  onStatusChange?: (status: SystemHealth) => void,
  interval = 60000 // Default: check every minute
) => {
  let lastStatus: string | null = null;
  let checkCount = 0;
  let successCount = 0;
  let failureCount = 0;

  const checkHealth = async () => {
    checkCount++;
    try {
      const health = await checkSystemHealth();
      const statusKey = JSON.stringify(health);
      
      // Only trigger callback if status changed
      if (lastStatus !== statusKey && onStatusChange) {
        onStatusChange(health);
      }
      
      lastStatus = statusKey;
      successCount++;
      
      return health;
    } catch (error) {
      console.error('Health monitor check failed:', error);
      failureCount++;
      
      if (lastStatus !== 'error' && onStatusChange) {
        onStatusChange({
          database: { status: 'offline', responseTime: 0 },
          storage: { status: 'offline', responseTime: 0 },
          auth: { status: 'offline', responseTime: 0 },
          overall: 'offline',
          timestamp: new Date().toISOString(),
          environment: import.meta.env.MODE || 'development'
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

  // Return function to stop monitoring and get stats
  return {
    stop: () => clearInterval(timerId),
    check: checkHealth,
    getStats: () => ({
      checkCount,
      successCount,
      failureCount,
      uptime: successCount / checkCount * 100
    })
  };
};

// Run a database initialization check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const health = await checkSystemHealth();
    return health.database.status === 'healthy';
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};
