import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Component that detects business users without a business profile
 * and prompts them to complete their registration
 */
const BusinessProfilePrompt: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useBusinessProfile();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const isBusinessUser = user?.user_metadata?.user_type === 'business' || 
                        user?.user_metadata?.userType === 'business';
  
  // Show prompt if:
  // 1. User is logged in
  // 2. User type is business
  // 3. Profile hasn't loaded yet or profile doesn't exist
  // 4. User hasn't dismissed the prompt
  const shouldShow = !profileLoading && 
                     isBusinessUser && 
                     !profile && 
                     !dismissed;

  // Don't render on business form page
  const currentPath = window.location.pathname;
  if (currentPath === '/business-form' || currentPath === '/signup/business') {
    return null;
  }

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-fade-in">
      <Alert className="border-orange-500 bg-white shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Building2 className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1 space-y-2">
            <AlertTitle className="text-lg font-semibold text-gray-900">
              Complete Your Business Profile
            </AlertTitle>
            <AlertDescription className="text-gray-700">
              We noticed you signed up as a business owner but haven't completed your business profile yet. 
              Complete it now to start accepting customers!
            </AlertDescription>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => navigate('/business-form')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                size="sm"
              >
                Complete Profile
              </Button>
              <Button
                onClick={() => setDismissed(true)}
                variant="outline"
                size="sm"
              >
                Remind Me Later
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default BusinessProfilePrompt;
