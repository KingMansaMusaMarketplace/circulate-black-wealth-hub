import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, FileText, History } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogViewerProps {
  businessId: string;
}

interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: any;
  new_values: any;
  created_at: string;
  user_id: string;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    loadAuditLogs();
  }, [businessId]);

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_audit_log')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-600';
      case 'updated':
        return 'text-blue-600';
      case 'deleted':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return '✓';
      case 'updated':
        return '↻';
      case 'deleted':
        return '✗';
      default:
        return '•';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Audit Trail
        </CardTitle>
        <CardDescription>Track all financial changes</CardDescription>
      </CardHeader>
      <CardContent>
        {auditLogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No audit logs yet</p>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  log.action === 'created' ? 'bg-green-100' :
                  log.action === 'updated' ? 'bg-blue-100' :
                  log.action === 'deleted' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <span className={getActionColor(log.action)}>{getActionIcon(log.action)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium capitalize">
                      {log.entity_type.replace('_', ' ')} {log.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  {log.new_values && (
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(log.new_values).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="truncate">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
