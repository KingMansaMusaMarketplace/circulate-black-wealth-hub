import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, HardDrive, Activity, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TableStats {
  table_name: string;
  row_count: number;
  size_bytes: number;
  last_vacuum: string | null;
  last_analyze: string | null;
}

const DatabasePerformanceMonitor: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch table row counts
  const { data: tableStats, refetch: refetchStats } = useQuery({
    queryKey: ['db-table-stats'],
    queryFn: async () => {
      const tables = [
        'profiles', 'businesses', 'transactions', 'reviews', 
        'sales_agents', 'activity_log', 'bookings', 'support_tickets',
        'security_audit_log', 'notifications', 'qr_codes'
      ];
      
      const stats: TableStats[] = [];
      
      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          if (!error) {
            stats.push({
              table_name: table,
              row_count: count || 0,
              size_bytes: (count || 0) * 500, // Rough estimate
              last_vacuum: null,
              last_analyze: null
            });
          }
        } catch {
          // Table might not exist or no access
        }
      }
      
      return stats.sort((a, b) => b.row_count - a.row_count);
    }
  });

  // Calculate totals
  const totals = React.useMemo(() => {
    if (!tableStats) return { rows: 0, size: 0 };
    return {
      rows: tableStats.reduce((acc, t) => acc + t.row_count, 0),
      size: tableStats.reduce((acc, t) => acc + t.size_bytes, 0)
    };
  }, [tableStats]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchStats();
    setIsRefreshing(false);
  };

  // Health indicators
  const getHealthStatus = () => {
    const issues: string[] = [];
    
    if (tableStats) {
      const largeTable = tableStats.find(t => t.row_count > 100000);
      if (largeTable) {
        issues.push(`Large table detected: ${largeTable.table_name} (${largeTable.row_count.toLocaleString()} rows)`);
      }
      
      const auditLog = tableStats.find(t => t.table_name === 'security_audit_log');
      if (auditLog && auditLog.row_count > 50000) {
        issues.push('Consider archiving old audit logs');
      }
    }
    
    return issues;
  };

  const healthIssues = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-mansagold/10 border-mansagold/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-white/60 text-sm">Total Rows</p>
                <p className="text-2xl font-bold text-mansagold">{totals.rows.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Est. Size</p>
                <p className="text-2xl font-bold text-blue-400">{formatSize(totals.size)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Tables</p>
                <p className="text-2xl font-bold text-green-400">{tableStats?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`${healthIssues.length > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {healthIssues.length > 0 ? (
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-400" />
              )}
              <div>
                <p className="text-white/60 text-sm">Health</p>
                <p className={`text-2xl font-bold ${healthIssues.length > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {healthIssues.length > 0 ? `${healthIssues.length} Issue${healthIssues.length > 1 ? 's' : ''}` : 'Good'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Issues */}
      {healthIssues.length > 0 && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Performance Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {healthIssues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-white/80">
                  <span className="text-yellow-400">•</span>
                  {issue}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Table Statistics */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-mansagold" />
              Table Statistics
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-mansagold/30 text-mansagold"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {tableStats?.map((table) => {
                const maxRows = Math.max(...(tableStats?.map(t => t.row_count) || [1]));
                const percentage = (table.row_count / maxRows) * 100;
                
                return (
                  <div
                    key={table.table_name}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="text-mansagold font-mono">{table.table_name}</code>
                        {table.row_count > 50000 && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Large</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{table.row_count.toLocaleString()} rows</p>
                        <p className="text-white/40 text-xs">{formatSize(table.size_bytes)}</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-mansagold" />
            Maintenance Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-2">Archive Old Audit Logs</h4>
              <p className="text-white/60 text-sm mb-3">
                Export and delete audit logs older than 90 days to improve performance.
              </p>
              <Button variant="outline" size="sm" className="border-white/20 text-white/70">
                <Clock className="h-4 w-4 mr-2" />
                Run Archive
              </Button>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-2">Clean Up Activity Logs</h4>
              <p className="text-white/60 text-sm mb-3">
                Remove activity logs older than 180 days to free up space.
              </p>
              <Button variant="outline" size="sm" className="border-white/20 text-white/70">
                <Clock className="h-4 w-4 mr-2" />
                Run Cleanup
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Database Health Note</p>
                <p className="text-white/60 text-sm mt-1">
                  For advanced database maintenance (VACUUM, ANALYZE, index optimization), 
                  access the Supabase dashboard directly. These operations require elevated privileges.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabasePerformanceMonitor;
