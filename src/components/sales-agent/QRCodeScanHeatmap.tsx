import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';
import { getQRScanHeatmap, ScanHeatmapData } from '@/lib/api/qr-analytics-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QRCodeScanHeatmapProps {
  salesAgentId: string;
  days?: number;
}

const QRCodeScanHeatmap: React.FC<QRCodeScanHeatmapProps> = ({ salesAgentId, days = 30 }) => {
  const [heatmapData, setHeatmapData] = useState<ScanHeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(0);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setLoading(true);
      const data = await getQRScanHeatmap(salesAgentId, days);
      setHeatmapData(data);
      
      // Find max count for color scaling
      const max = data.reduce((acc, curr) => Math.max(acc, curr.count), 0);
      setMaxCount(max);
      
      setLoading(false);
    };

    if (salesAgentId) {
      fetchHeatmapData();
    }
  }, [salesAgentId, days]);

  const getCountForCell = (day: number, hour: number): number => {
    const cell = heatmapData.find(d => d.day === day && d.hour === hour);
    return cell ? cell.count : 0;
  };

  const getColorIntensity = (count: number): string => {
    if (count === 0) return 'bg-muted/30';
    
    const intensity = maxCount > 0 ? count / maxCount : 0;
    
    if (intensity >= 0.8) return 'bg-blue-600';
    if (intensity >= 0.6) return 'bg-blue-500';
    if (intensity >= 0.4) return 'bg-blue-400';
    if (intensity >= 0.2) return 'bg-blue-300';
    return 'bg-blue-200';
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
  };

  const getBusiestTime = (): { day: string; hour: string; count: number } | null => {
    if (heatmapData.length === 0) return null;
    
    const busiest = heatmapData.reduce((max, curr) => 
      curr.count > max.count ? curr : max
    );
    
    return {
      day: dayNames[busiest.day],
      hour: formatHour(busiest.hour),
      count: busiest.count
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Scan Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const busiestTime = getBusiestTime();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Scan Activity Heatmap
          </CardTitle>
          {busiestTime && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">
                Peak: <strong className="text-foreground">{busiestTime.day} at {busiestTime.hour}</strong>
                <span className="text-xs ml-1">({busiestTime.count} scans)</span>
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Last {days} days - Shows when your QR code is scanned most frequently
        </p>
      </CardHeader>
      <CardContent>
        {heatmapData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Not enough scan data yet</p>
            <p className="text-sm mt-1">Share your QR code more to see activity patterns</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Heatmap */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <TooltipProvider>
                  <div className="flex gap-1">
                    {/* Day labels */}
                    <div className="flex flex-col gap-1 pr-2 pt-6">
                      {dayNames.map(day => (
                        <div
                          key={day}
                          className="h-7 flex items-center justify-end text-xs text-muted-foreground font-medium"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Heatmap grid */}
                    <div className="flex-1">
                      {/* Hour labels */}
                      <div className="flex gap-1 mb-1">
                        {hours.map(hour => (
                          <div
                            key={hour}
                            className="flex-1 min-w-[28px] text-center text-xs text-muted-foreground"
                          >
                            {hour % 3 === 0 ? formatHour(hour) : ''}
                          </div>
                        ))}
                      </div>

                      {/* Heatmap cells */}
                      {dayNames.map((_, dayIndex) => (
                        <div key={dayIndex} className="flex gap-1 mb-1">
                          {hours.map(hour => {
                            const count = getCountForCell(dayIndex, hour);
                            const colorClass = getColorIntensity(count);

                            return (
                              <Tooltip key={hour}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`flex-1 min-w-[28px] h-7 rounded-sm ${colorClass} transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1 cursor-pointer`}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs">
                                    <p className="font-semibold">{dayNames[dayIndex]} at {formatHour(hour)}</p>
                                    <p className="text-muted-foreground">
                                      {count} scan{count !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipProvider>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-sm bg-muted/30" />
                  <div className="w-4 h-4 rounded-sm bg-blue-200" />
                  <div className="w-4 h-4 rounded-sm bg-blue-300" />
                  <div className="w-4 h-4 rounded-sm bg-blue-400" />
                  <div className="w-4 h-4 rounded-sm bg-blue-500" />
                  <div className="w-4 h-4 rounded-sm bg-blue-600" />
                </div>
                <span className="text-xs text-muted-foreground">More</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Total: <strong className="text-foreground">{heatmapData.reduce((sum, d) => sum + d.count, 0)}</strong> scans
              </div>
            </div>

            {/* Insights */}
            {busiestTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>💡 Insight:</strong> Your QR code is most active on <strong>{busiestTime.day}s at {busiestTime.hour}</strong>. 
                  Consider promoting your QR code more during similar times for better results.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeScanHeatmap;
