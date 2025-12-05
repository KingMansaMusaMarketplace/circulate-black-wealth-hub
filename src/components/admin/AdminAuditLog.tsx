import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Search, Download, Filter, User, Shield, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogEntry {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  user_id: string | null;
  user_agent: string | null;
  timestamp: string;
}

const AdminAuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', actionFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('security_audit_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(500);

      if (actionFilter !== 'all') {
        query = query.ilike('action', `%${actionFilter}%`);
      }

      const daysMap: Record<string, number> = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 };
      const days = daysMap[dateRange] || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      query = query.gte('timestamp', startDate.toISOString());

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLogEntry[];
    }
  });

  const { data: roleChanges } = useQuery({
    queryKey: ['role-change-audit'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_change_audit')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    }
  });

  const filteredLogs = auditLogs?.filter(log => 
    searchTerm === '' || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionIcon = (action: string) => {
    if (action.includes('admin')) return <Shield className="h-4 w-4 text-mansagold" />;
    if (action.includes('fail') || action.includes('denied')) return <AlertTriangle className="h-4 w-4 text-red-400" />;
    if (action.includes('role')) return <User className="h-4 w-4 text-blue-400" />;
    return <Clock className="h-4 w-4 text-white/60" />;
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('admin')) return 'default';
    if (action.includes('fail') || action.includes('denied')) return 'destructive';
    if (action.includes('create') || action.includes('insert')) return 'secondary';
    return 'outline';
  };

  const exportToCSV = () => {
    if (!filteredLogs) return;
    const headers = ['Timestamp', 'Action', 'Table', 'Record ID', 'User ID', 'Details'];
    const rows = filteredLogs.map(log => [
      log.timestamp,
      log.action,
      log.table_name,
      log.record_id || '',
      log.user_id || '',
      log.user_agent || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <History className="h-5 w-5 text-mansagold" />
              Admin Audit Log
            </CardTitle>
            <Button onClick={exportToCSV} variant="outline" size="sm" className="border-mansagold/30 text-mansagold">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search actions or tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="admin">Admin Actions</SelectItem>
                <SelectItem value="role">Role Changes</SelectItem>
                <SelectItem value="personal_data">Data Access</SelectItem>
                <SelectItem value="fail">Failed Attempts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-white">{filteredLogs?.length || 0}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Admin Actions</p>
              <p className="text-2xl font-bold text-mansagold">
                {filteredLogs?.filter(l => l.action.includes('admin')).length || 0}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Failed Attempts</p>
              <p className="text-2xl font-bold text-red-400">
                {filteredLogs?.filter(l => l.action.includes('fail')).length || 0}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Role Changes</p>
              <p className="text-2xl font-bold text-blue-400">{roleChanges?.length || 0}</p>
            </div>
          </div>

          {/* Log Timeline */}
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs?.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="mt-1">{getActionIcon(log.action)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                          {log.action}
                        </Badge>
                        <span className="text-white/60 text-xs">on</span>
                        <span className="text-white/80 text-sm font-mono">{log.table_name}</span>
                      </div>
                      {log.record_id && (
                        <p className="text-white/50 text-xs mt-1 font-mono truncate">
                          Record: {log.record_id}
                        </p>
                      )}
                      {log.user_agent && (
                        <p className="text-white/40 text-xs mt-1 truncate">{log.user_agent}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white/60 text-xs">
                        {format(new Date(log.timestamp), 'MMM d, HH:mm')}
                      </p>
                      {log.user_id && (
                        <p className="text-white/40 text-xs truncate max-w-[100px]">
                          {log.user_id.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {filteredLogs?.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    No audit logs found for the selected filters
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLog;
