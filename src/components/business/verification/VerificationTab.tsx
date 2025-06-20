
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import VerificationForm from './VerificationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const VerificationTab: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useBusinessProfile();

  if (profileLoading) {
    return (
      <div className="w-full p-8">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Business Verification</CardTitle>
          <CardDescription>Verify your business to build trust with customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Business Profile</AlertTitle>
            <AlertDescription>
              Please complete your business profile information before submitting verification documents.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Business Verification</h2>
          <p className="text-muted-foreground">
            Complete the verification process to show customers that your business has been verified
          </p>
        </div>

        {user && profile && (
          <VerificationForm businessId={profile.id} userId={user.id} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Why Get Verified?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-mansablue text-white p-2 rounded-full h-8 w-8 flex items-center justify-center">1</div>
                <div>
                  <h3 className="font-medium">Build Customer Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified businesses receive a badge that signals trustworthiness to potential customers.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-mansablue text-white p-2 rounded-full h-8 w-8 flex items-center justify-center">2</div>
                <div>
                  <h3 className="font-medium">Enhanced Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified businesses appear higher in search results and are featured more prominently.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-mansablue text-white p-2 rounded-full h-8 w-8 flex items-center justify-center">3</div>
                <div>
                  <h3 className="font-medium">Access to Premium Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock additional platform features available only to verified businesses.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationTab;
