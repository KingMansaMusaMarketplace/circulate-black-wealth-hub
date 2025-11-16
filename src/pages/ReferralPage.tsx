
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container py-12 max-w-4xl mx-auto relative z-10">
          <div className="animate-pulse h-64 bg-white/50 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container py-12 max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 animate-fade-in">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-blue-400/30 to-indigo-400/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent pt-2">
                Referral <span className="text-yellow-500">Program</span> 🎁
              </h1>
              <p className="text-gray-700 text-xl font-medium">
                Share your code with friends and earn rewards for every signup 🚀
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
    </div>
  );
};

export default ReferralPage;
