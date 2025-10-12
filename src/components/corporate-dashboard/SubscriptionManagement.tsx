import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, AlertTriangle, Download } from 'lucide-react';

interface SubscriptionManagementProps {
  subscription: {
    id: string;
    tier: string;
    status: string;
    cancel_at_period_end: boolean;
    stripe_subscription_id: string;
  };
  onUpdate: () => void;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ subscription, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('corporate_subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('id', subscription.id);

      if (error) throw error;

      toast.success('Subscription will be cancelled at the end of the billing period');
      onUpdate();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('corporate_subscriptions')
        .update({ cancel_at_period_end: false })
        .eq('id', subscription.id);

      if (error) throw error;

      toast.success('Subscription reactivated successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = () => {
    toast.info('Redirecting to Stripe billing portal...');
    // This would integrate with Stripe's customer portal
    window.open('https://billing.stripe.com/p/login/test_YOUR_PORTAL_LINK', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            Manage your billing and subscription settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Billing Portal</p>
                <p className="text-sm text-muted-foreground">
                  Update payment method, view invoices, and manage billing
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleManageBilling}>
              Manage Billing
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Download Invoices</p>
                <p className="text-sm text-muted-foreground">
                  Access all your payment receipts and invoices
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleManageBilling}>
              View Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle>Subscription Actions</CardTitle>
          </div>
          <CardDescription>
            Manage your subscription status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription.cancel_at_period_end ? (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  Your subscription is set to cancel at the end of the current billing period.
                  You can reactivate it at any time before then.
                </p>
              </div>
              <Button 
                onClick={handleReactivateSubscription}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Reactivating...' : 'Reactivate Subscription'}
              </Button>
            </div>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={loading}>
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your subscription will be cancelled at the end of the current billing period.
                    You'll continue to have access to all benefits until then. You can reactivate
                    at any time before the period ends.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelSubscription} className="bg-red-600 hover:bg-red-700">
                    Confirm Cancellation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Need help? Contact our support team for assistance with your sponsorship.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
