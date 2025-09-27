import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
} from "@/components/ui/alert-dialog";

const AccountDeletion: React.FC = () => {
  const [reason, setReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleRequestDeletion = async () => {
    try {
      setIsDeleting(true);
      
      const { data, error } = await supabase.rpc('request_account_deletion', {
        deletion_reason: reason || null
      });

      if (error) {
        throw error;
      }

      const result = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: 'Account Deletion Requested',
        description: 'Your account deletion request has been submitted. You will receive an email confirmation shortly.'
      });

      setReason('');
      setShowConfirmDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to request account deletion',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImmediateDeletion = async () => {
    try {
      setIsDeleting(true);
      
      const { data, error } = await supabase.rpc('delete_user_account_immediate');

      if (error) {
        throw error;
      }

      const result = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted. You will now be signed out.'
      });

      // Sign out after successful deletion
      setTimeout(() => {
        signOut();
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* What Gets Deleted */}
        <div>
          <h4 className="font-medium mb-2">What will be deleted:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Your profile and account information</li>
            <li>• Transaction history and loyalty points</li>
            <li>• Reviews and ratings you've submitted</li>
            <li>• Business listings (if you're a business owner)</li>
            <li>• All uploaded images and documents</li>
            <li>• Notification preferences and settings</li>
          </ul>
        </div>

        <Separator />

        {/* Deletion Options */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="deletion-reason" className="text-sm font-medium">
              Reason for leaving (optional)
            </Label>
            <Textarea
              id="deletion-reason"
              placeholder="Help us improve by sharing why you're leaving..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2"
              maxLength={500}
            />
            {reason.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {reason.length}/500 characters
              </p>
            )}
          </div>

          <div className="space-y-3">
            {/* Request Deletion (24-hour delay) */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Option 1: Request Account Deletion</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Submit a deletion request. Your account will be deleted within 24-48 hours after review. 
                You'll receive an email confirmation.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleRequestDeletion}
                disabled={isDeleting}
                className="w-full"
              >
                {isDeleting ? 'Submitting Request...' : 'Request Account Deletion'}
              </Button>
            </div>

            {/* Immediate Deletion */}
            <div className="p-4 border border-destructive/20 rounded-lg">
              <h4 className="font-medium mb-2 text-destructive">Option 2: Delete Immediately</h4>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Warning:</strong> This will immediately and permanently delete your account. 
                This action cannot be undone or recovered.
              </p>
              
              <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account Immediately
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Confirm Account Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you absolutely sure you want to delete your account? This will permanently 
                      remove all your data including:
                      <br /><br />
                      • Profile and personal information
                      <br />
                      • All transaction history and loyalty points
                      <br />
                      • Business listings and reviews
                      <br />
                      • All uploaded content
                      <br /><br />
                      <strong>This action cannot be undone.</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleImmediateDeletion}
                      disabled={isDeleting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Need Help?</h4>
          <p className="text-sm text-muted-foreground">
            If you're having issues with your account or have questions about deletion, 
            please contact our support team at{' '}
            <a href="mailto:support@mansamusamarketplace.com" className="text-primary hover:underline">
              support@mansamusamarketplace.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDeletion;