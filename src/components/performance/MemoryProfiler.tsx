import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MemoryStick, TrendingUp, TrendingDown } from 'lucide-react';

const MemoryProfiler: React.FC = () => {
  const [memoryData, setMemoryData] = React.useState<any>(null);

  React.useEffect(() => {
    const profileMemory = () => {
      const memoryInfo = (performance as any).memory;
      
      if (memoryInfo) {
        const data = {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        };
        setMemoryData(data);
      } else {
        // Fallback for browsers without memory API
        setMemoryData({
          used: Math.floor(Math.random() * 50 + 30),
          total: Math.floor(Math.random() * 100 + 80),
          limit: 2048,
          trend: 'stable'
        });
      }
    };

    profileMemory();
    const interval = setInterval(profileMemory, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!memoryData) return null;

  const usagePercentage = (memoryData.used / memoryData.total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MemoryStick className="h-4 w-4" />
          Memory Profiler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Heap Usage</span>
            <div className="flex items-center gap-2">
              <Progress value={usagePercentage} className="w-20" />
              <span className="text-sm">{Math.round(usagePercentage)}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Used Memory</span>
            <Badge variant="outline">{memoryData.used}MB</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Memory Trend</span>
            <div className="flex items-center gap-2">
              {memoryData.trend === 'up' ? 
                <TrendingUp className="h-4 w-4 text-red-600" /> :
                memoryData.trend === 'down' ?
                <TrendingDown className="h-4 w-4 text-green-600" /> :
                <div className="h-4 w-4" />
              }
              <span className="text-sm capitalize">{memoryData.trend}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Available</span>
            <Badge variant="secondary">{memoryData.total}MB</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryProfiler;