import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, FileText, Award } from 'lucide-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useCapacitor } from '@/hooks/use-capacitor';
import { toast } from 'sonner';

const NotificationDemo: React.FC = () => {
  const { isNative } = useCapacitor();
  const {
    sendPartnershipUpdateNotification,
    sendImpactReportNotification,
    sendMilestoneNotification,
  } = usePushNotifications();

  if (!isNative) {
    return null;
  }

  const testNotifications = [
    {
      title: 'Partnership Update',
      description: 'Welcome message for new partners',
      icon: Bell,
      action: () => {
        sendPartnershipUpdateNotification('Acme Corporation', 'Gold');
        toast.success('Test notification sent!');
      },
    },
    {
      title: 'Impact Report',
      description: 'Monthly impact metrics',
      icon: FileText,
      action: () => {
        sendImpactReportNotification('$25,000');
        toast.success('Test notification sent!');
      },
    },
    {
      title: 'Milestone Achieved',
      description: 'Celebrate sponsorship milestones',
      icon: Award,
      action: () => {
        sendMilestoneNotification('Your sponsorship has supported 100 Black-owned businesses!');
        toast.success('Test notification sent!');
      },
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Bell className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with <span className="text-primary">Push Notifications</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Receive real-time updates about your partnership impact and milestones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testNotifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{notification.title}</CardTitle>
                  <CardDescription>{notification.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={notification.action}
                    variant="outline"
                    className="w-full"
                  >
                    Try Demo
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Tap "Try Demo" to see how notifications work on your device
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotificationDemo;
