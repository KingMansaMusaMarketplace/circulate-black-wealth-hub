import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, CheckCircle2, Clock, Monitor, Smartphone, MapPin, Calendar } from 'lucide-react';
import { getRecentQRScans, QRCodeScan } from '@/lib/api/qr-analytics-api';
import { formatDate } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface QRCodeScanHistoryProps {
  salesAgentId: string;
  limit?: number;
}

const QRCodeScanHistory: React.FC<QRCodeScanHistoryProps> = ({ salesAgentId, limit = 50 }) => {
  const [scans, setScans] = useState<QRCodeScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      const data = await getRecentQRScans(salesAgentId, limit);
      setScans(data);
      setLoading(false);
    };

    if (salesAgentId) {
      fetchScans();
    }
  }, [salesAgentId, limit]);

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return { type: 'Unknown', name: 'Unknown Device' };
    
    const ua = userAgent.toLowerCase();
    let type = 'desktop';
    let name = 'Unknown';

    // Detect device type
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      type = 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      type = 'tablet';
    }

    // Detect OS/Device
    if (ua.includes('iphone')) name = 'iPhone';
    else if (ua.includes('ipad')) name = 'iPad';
    else if (ua.includes('android')) name = 'Android Device';
    else if (ua.includes('windows')) name = 'Windows PC';
    else if (ua.includes('mac')) name = 'Mac';
    else if (ua.includes('linux')) name = 'Linux';
    else name = 'Desktop';

    return { type, name };
  };

  const getBrowserInfo = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
    return 'Other';
  };

  const formatScanDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No QR code scans yet</p>
            <p className="text-sm mt-1">Share your QR code to start tracking scans</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Scan History
          </CardTitle>
          <Badge variant="secondary">
            {scans.length} Recent Scan{scans.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {scans.map((scan) => {
              const device = getDeviceInfo(scan.user_agent);
              const browser = getBrowserInfo(scan.user_agent);
              const DeviceIcon = device.type === 'mobile' || device.type === 'tablet' ? Smartphone : Monitor;

              return (
                <div
                  key={scan.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${scan.converted ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {scan.converted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={scan.converted ? 'default' : 'secondary'} className={scan.converted ? 'bg-green-600' : ''}>
                            {scan.converted ? 'Converted' : 'Scanned'}
                          </Badge>
                          <span className="text-sm text-muted-foreground" title={formatFullDate(scan.scanned_at)}>
                            {formatScanDate(scan.scanned_at)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{formatFullDate(scan.scanned_at)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DeviceIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{device.name} • {browser}</span>
                        </div>

                        {scan.ip_address && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">IP: {scan.ip_address}</span>
                          </div>
                        )}

                        {scan.converted && scan.converted_at && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate text-sm">
                              Converted {formatScanDate(scan.converted_at)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Showing last {scans.length} scan{scans.length !== 1 ? 's' : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeScanHistory;
