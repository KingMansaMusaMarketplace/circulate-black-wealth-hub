import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface CancelSubscriptionDialogProps {
  subscriptionId: string;
  tierName: string;
}

export const CancelSubscriptionDialog = ({ subscriptionId, tierName }: CancelSubscriptionDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleCancel = async () => {
    try {
      // TODO: Implement Stripe cancellation via edge function
      toast.info('Subscription cancellation will be available soon');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Cancel Subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <AlertDialogTitle>Cancel {tierName} Subscription?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <p>Are you sure you want to cancel your sponsorship? This will:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Remove your company from public sponsor displays</li>
              <li>End your access to sponsorship benefits</li>
              <li>Stop future billing at the end of your current period</li>
            </ul>
            <p className="font-medium">
              Your subscription will remain active until the end of your current billing period.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
            Cancel Subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
