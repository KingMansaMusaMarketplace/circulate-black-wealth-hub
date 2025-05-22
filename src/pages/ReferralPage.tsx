
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Users } from 'lucide-react';
import { toast } from 'sonner';
import SocialShareDialog from '@/components/loyalty/SocialShareDialog';

const ReferralPage = () => {
  const { user } = useAuth();
  const { referralCode, isAgent, loading } = useSalesAgent();

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
      <div className="container py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Referral Program</h1>
        <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Referral Program</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" /> 
              Your Referral Code
            </CardTitle>
            <CardDescription>
              Share your code with friends and earn rewards for every signup
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAgent && referralCode ? (
              <>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Your Referral Code</p>
                  <p className="text-3xl font-bold tracking-wider text-mansablue my-3">{referralCode}</p>
                  <div className="flex justify-center mt-4 space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={handleCopyReferral}
                      className="flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy Code
                    </Button>
                    <SocialShareDialog 
                      {...shareContent}
                      triggerContent={
                        <Button className="flex items-center">
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </Button>
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Become a sales agent to get your referral code and start earning commissions
                </p>
                <Button asChild>
                  <a href="/become-agent">Apply Now</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Three simple steps to start earning through referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <div>
                  <h3 className="font-medium">Get your referral code</h3>
                  <p className="text-sm text-gray-500">Apply to become a sales agent and receive your unique code</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <div>
                  <h3 className="font-medium">Share with potential users</h3>
                  <p className="text-sm text-gray-500">Share your code with friends, family, and businesses</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <div>
                  <h3 className="font-medium">Earn rewards</h3>
                  <p className="text-sm text-gray-500">Earn commission for every successful signup using your code</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
