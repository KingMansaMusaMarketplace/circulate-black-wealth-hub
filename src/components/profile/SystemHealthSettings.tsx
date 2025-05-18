
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemHealth, checkSystemHealth, createHealthMonitor } from "@/lib/utils/health-check";
import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const SystemHealthSettings = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [monitorActive, setMonitorActive] = useState(false);
  const [monitorStats, setMonitorStats] = useState<{
    checkCount: number;
    successCount: number;
    failureCount: number;
    uptime: number;
  } | null>(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    try {
      const result = await checkSystemHealth();
      setHealth(result);
      toast.success("Health check completed");
    } catch (error) {
      console.error("Error checking system health:", error);
      toast.error("Failed to check system health");
    } finally {
      setLoading(false);
    }
  };

  const startMonitoring = () => {
    if (monitorActive) return;
    
    const monitor = createHealthMonitor((status) => {
      setHealth(status);
      console.log("Health status updated:", status);
    }, 30000); // Check every 30 seconds
    
    setMonitorActive(true);
    
    // Update stats every minute
    const statsInterval = setInterval(() => {
      setMonitorStats(monitor.getStats());
    }, 60000);
    
    // Store the monitor in window for debugging
    (window as any).__healthMonitor = monitor;
    (window as any).__healthMonitorStatsInterval = statsInterval;
    
    toast.success("Health monitoring started");
    
    // Clean up on component unmount
    return () => {
      monitor.stop();
      clearInterval(statsInterval);
      delete (window as any).__healthMonitor;
      delete (window as any).__healthMonitorStatsInterval;
      setMonitorActive(false);
    };
  };

  const stopMonitoring = () => {
    if ((window as any).__healthMonitor) {
      (window as any).__healthMonitor.stop();
      clearInterval((window as any).__healthMonitorStatsInterval);
      delete (window as any).__healthMonitor;
      delete (window as any).__healthMonitorStatsInterval;
      setMonitorActive(false);
      toast.info("Health monitoring stopped");
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    
    return () => {
      stopMonitoring();
    };
  }, []);

  const renderStatusBadge = (status: 'healthy' | 'degraded' | 'offline') => {
    const colorMap = {
      'healthy': 'bg-green-500',
      'degraded': 'bg-yellow-500',
      'offline': 'bg-red-500'
    };
    
    return (
      <Badge className={`${colorMap[status]} text-white`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const renderServiceStatus = (name: string, service: { status: 'healthy' | 'degraded' | 'offline', responseTime: number, details?: string }) => {
    return (
      <div className="border rounded-md p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">{name}</h3>
          {renderStatusBadge(service.status)}
        </div>
        <p className="text-sm text-muted-foreground mb-2">Response time: {service.responseTime}ms</p>
        {service.details && (
          <p className="text-sm">{service.details}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>
          Check and monitor system health status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={fetchHealthStatus} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Run Health Check
            </Button>
            
            {monitorActive ? (
              <Button onClick={stopMonitoring} variant="destructive" size="sm">
                Stop Monitoring
              </Button>
            ) : (
              <Button onClick={startMonitoring} variant="default" size="sm">
                Start Monitoring
              </Button>
            )}
          </div>
          
          {monitorStats && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs text-muted-foreground">Checks</div>
                <div className="font-medium">{monitorStats.checkCount}</div>
              </div>
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs text-muted-foreground">Success</div>
                <div className="font-medium">{monitorStats.successCount}</div>
              </div>
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs text-muted-foreground">Failures</div>
                <div className="font-medium">{monitorStats.failureCount}</div>
              </div>
              <div className="bg-muted p-2 rounded-md text-center">
                <div className="text-xs text-muted-foreground">Uptime</div>
                <div className="font-medium">{monitorStats.uptime.toFixed(1)}%</div>
              </div>
            </div>
          )}
        </div>
        
        {health ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Overall Status</h3>
              {renderStatusBadge(health.overall)}
            </div>
            
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-2">
                  <Alert className={`${health.overall === 'healthy' ? 'bg-green-50' : health.overall === 'degraded' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-2">
                      {health.overall === 'healthy' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className={`h-5 w-5 ${health.overall === 'degraded' ? 'text-yellow-600' : 'text-red-600'}`} />
                      )}
                      <AlertTitle>{health.overall === 'healthy' ? 'System is healthy' : health.overall === 'degraded' ? 'System is degraded' : 'System is offline'}</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      Health check performed at {new Date(health.timestamp).toLocaleTimeString()} in {health.environment} environment.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              
              <TabsContent value="database">
                {renderServiceStatus('Database', health.database)}
              </TabsContent>
              
              <TabsContent value="storage">
                {renderServiceStatus('Storage', health.storage)}
              </TabsContent>
              
              <TabsContent value="auth">
                {renderServiceStatus('Authentication', health.auth)}
              </TabsContent>
            </Tabs>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="text-center p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No health data available</AlertTitle>
              <AlertDescription>
                Run a health check to view system status.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthSettings;
