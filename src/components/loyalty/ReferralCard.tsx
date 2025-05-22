
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import SocialShareDialog from './SocialShareDialog';

interface ReferralCardProps {
  className?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ className }) => {
  const { user } = useAuth();
  const { referralCode, isAgent, loading } = useSalesAgent();
  const [referrals, setReferrals] = useState<number>(0);
  
  const handleCopyReferral = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied to clipboard');
    } else {
      toast.error('No referral code available');
    }
  };
  
  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralCode}`;
  };
  
  const shareContent = {
    title: 'Join me on Mansa Musa!',
    text: `Use my referral code ${referralCode} to sign up on Mansa Musa and we'll both earn rewards!`,
    customPath: `/signup?ref=${referralCode}`
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-24">
            <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Refer & Earn</h3>
          <p className="text-sm text-gray-500 mb-4">Sign in to get your referral code and start earning rewards</p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-purple-600" /> 
          Refer & Earn
        </CardTitle>
        <CardDescription>
          Share your code with friends and both earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAgent && referralCode ? (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Your Referral Code</p>
              <p className="text-xl font-bold tracking-wider text-mansablue">{referralCode}</p>
              <div className="flex justify-center mt-2 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={handleCopyReferral}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <SocialShareDialog 
                  {...shareContent}
                  triggerContent={
                    <Button variant="outline" size="sm" className="text-xs">
                      <Share2 className="h-3 w-3 mr-1" /> Share
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p>{referrals} successful referrals so far</p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-3">
              Become a sales agent to get your referral code and start earning commissions
            </p>
            <Button asChild size="sm">
              <a href="/become-agent">Apply Now</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
