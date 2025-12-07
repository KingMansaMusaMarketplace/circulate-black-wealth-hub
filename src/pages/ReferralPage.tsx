
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Users, Gift, TrendingUp } from 'lucide-react';
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
      <div className="min-h-screen relative overflow-hidden">
        <Helmet>
          <title>Referral Program | Mansa Musa Marketplace</title>
        </Helmet>
        
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        
        <div className="container py-12 max-w-4xl mx-auto relative z-10">
          <div className="animate-pulse h-64 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Referral Program | Mansa Musa Marketplace</title>
        <meta name="description" content="Share your referral code and earn rewards" />
      </Helmet>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container py-12 max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 animate-fade-in">
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-yellow-500/20" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-mansagold"></div>
            <div className="absolute top-4 right-10 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-4 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="relative flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white font-display">
                  Referral <span className="text-mansagold">Program</span>
                </h1>
                <p className="text-blue-200/80 text-lg mt-1">
                  Share your code with friends and earn rewards for every signup
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="backdrop-blur-xl bg-slate-900/40 border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="h-5 w-5 mr-2 text-purple-400" /> 
                Your Referral Code
              </CardTitle>
              <CardDescription className="text-white/60">
                Share your code with friends and earn rewards for every signup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAgent && referralCode ? (
                <>
                  <div className="bg-slate-800/60 border border-white/10 rounded-lg p-6 mb-4 text-center">
                    <p className="text-xs text-white/50 mb-1">Your Referral Code</p>
                    <p className="text-3xl font-bold tracking-wider text-mansagold my-3">{referralCode}</p>
                    <div className="flex justify-center mt-4 space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={handleCopyReferral}
                        className="flex items-center border-white/20 text-white hover:bg-white/10"
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy Code
                      </Button>
                      <SocialShareDialog 
                        {...shareContent}
                        triggerContent={
                          <Button className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                            <Share2 className="h-4 w-4 mr-2" /> Share
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60 mb-4">
                    Become a sales agent to get your referral code and start earning commissions
                  </p>
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600"
                  >
                    <a href="/become-agent">Apply Now</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-xl bg-slate-900/40 border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                How It Works
              </CardTitle>
              <CardDescription className="text-white/60">
                Three simple steps to start earning through referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 shadow-lg">1</span>
                  <div>
                    <h3 className="font-medium text-white">Get your referral code</h3>
                    <p className="text-sm text-white/60">Apply to become a sales agent and receive your unique code</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 shadow-lg">2</span>
                  <div>
                    <h3 className="font-medium text-white">Share with potential users</h3>
                    <p className="text-sm text-white/60">Share your code with friends, family, and businesses</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-gradient-to-br from-mansagold to-amber-500 text-slate-900 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 shadow-lg">3</span>
                  <div>
                    <h3 className="font-medium text-white">Earn rewards</h3>
                    <p className="text-sm text-white/60">Earn commission for every successful signup using your code</p>
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
