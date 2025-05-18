
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import { SystemHealth, checkSystemHealth } from "@/lib/utils/health-check";

const getStatusColor = (status: 'healthy' | 'degraded' | 'offline') => {
  switch (status) {
    case 'healthy':
      return 'bg-green-500';
    case 'degraded':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const SystemHealthWidget = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setLoading(true);
      try {
        const result = await checkSystemHealth();
        setHealth(result);
      } catch (error) {
        console.error("Error checking system health:", error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    
    // Refresh every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          System Health
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Backend services status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        ) : health ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Overall:</span>
              <Badge className={`${getStatusColor(health.overall)} text-white`}>
                {health.overall.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-1 bg-secondary/20 rounded-md">
                <span className="text-[10px] text-muted-foreground">Database</span>
                <Badge variant="outline" className={`w-full mt-1 flex justify-center ${getStatusColor(health.database.status)} text-white text-[10px]`}>
                  {health.database.status.toUpperCase()}
                </Badge>
                <span className="text-[10px] mt-1">{health.database.responseTime}ms</span>
              </div>
              <div className="flex flex-col items-center p-1 bg-secondary/20 rounded-md">
                <span className="text-[10px] text-muted-foreground">Storage</span>
                <Badge variant="outline" className={`w-full mt-1 flex justify-center ${getStatusColor(health.storage.status)} text-white text-[10px]`}>
                  {health.storage.status.toUpperCase()}
                </Badge>
                <span className="text-[10px] mt-1">{health.storage.responseTime}ms</span>
              </div>
              <div className="flex flex-col items-center p-1 bg-secondary/20 rounded-md">
                <span className="text-[10px] text-muted-foreground">Auth</span>
                <Badge variant="outline" className={`w-full mt-1 flex justify-center ${getStatusColor(health.auth.status)} text-white text-[10px]`}>
                  {health.auth.status.toUpperCase()}
                </Badge>
                <span className="text-[10px] mt-1">{health.auth.responseTime}ms</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Unable to fetch system health
          </div>
        )}
      </CardContent>
    </Card>
  );
};
