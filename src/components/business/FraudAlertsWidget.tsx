import { useFraudDetection } from '@/hooks/use-fraud-detection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FraudAlertsWidgetProps {
  businessId: string;
}

export const FraudAlertsWidget = ({ businessId }: FraudAlertsWidgetProps) => {
  const { alerts, isLoading, alertStats } = useFraudDetection(businessId);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Only show unresolved alerts
  const unresolvedAlerts = alerts.filter(a => a.status !== 'resolved' && a.status !== 'false_positive');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security Alerts</CardTitle>
          </div>
          {unresolvedAlerts.length > 0 && (
            <Badge variant="destructive">{unresolvedAlerts.length} Active</Badge>
          )}
        </div>
        <CardDescription>
          AI-powered fraud detection monitoring your business activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {unresolvedAlerts.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All Clear</AlertTitle>
            <AlertDescription>
              No suspicious activity detected. Your business is protected by AI fraud monitoring.
            </AlertDescription>
          </Alert>
        ) : (
          unresolvedAlerts.slice(0, 5).map((alert) => (
            <Alert 
              key={alert.id}
              variant={alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'default'}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {alert.description}
                <Badge variant={getSeverityColor(alert.severity)} className="ml-auto">
                  {alert.severity}
                </Badge>
              </AlertTitle>
              <AlertDescription className="text-xs mt-2">
                Detected {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })} • 
                AI Confidence: {(alert.ai_confidence_score * 100).toFixed(0)}%
                {alert.status === 'investigating' && ' • Under investigation by support team'}
              </AlertDescription>
            </Alert>
          ))
        )}

        {unresolvedAlerts.length > 5 && (
          <p className="text-sm text-muted-foreground text-center">
            +{unresolvedAlerts.length - 5} more alerts
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{alertStats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{alertStats.critical + alertStats.high}</div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.status === 'resolved').length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
