import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { checkInAtBusiness } from '@/lib/api/social-activity-api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CheckInButtonProps {
  businessId: string;
  businessName: string;
}

const CheckInButton = ({ businessId, businessName }: CheckInButtonProps) => {
  const { user } = useAuth();
  const [checking, setChecking] = useState(false);

  const handleCheckIn = async () => {
    if (!user) {
      toast.error('Please log in to check in');
      return;
    }

    try {
      setChecking(true);
      const success = await checkInAtBusiness(
        user.id,
        businessId,
        `Checked in at ${businessName}`
      );

      if (success) {
        toast.success(`Checked in at ${businessName}!`);
      } else {
        toast.error('Failed to check in');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error('Failed to check in');
    } finally {
      setChecking(false);
    }
  };

  return (
    <Button
      onClick={handleCheckIn}
      disabled={checking || !user}
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
    >
      {checking ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MapPin className="w-4 h-4" />
      )}
      Check In
    </Button>
  );
};

export default CheckInButton;
