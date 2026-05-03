
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
      <div className="min-h-screen relative overflow-hidden bg-black">
        <Helmet>
          <title>Referral Program | 1325.AI</title>
        </Helmet>
        <div className="container py-12 max-w-4xl mx-auto relative z-10">
          <div className="animate-pulse h-64 bg-white/5 rounded-2xl border border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <Helmet>
        <title>Referral Program | 1325.AI</title>
        <meta name="description" content="Share your referral code and earn rewards" />
      </Helmet>

      {/* Subtle ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--mansagold) / 0.05), transparent 70%)',
        }}
      />

      <div className="container py-12 max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-mansagold/10 ring-1 ring-mansagold/30">
                <Gift className="h-8 w-8 text-mansagold" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold tracking-tight text-white">
                  Referral <span className="text-mansagold">Program</span>
                </h1>
                <p className="text-slate-400 text-lg mt-1">
                  Share your code with friends and earn rewards for every signup
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="bg-slate-900/40 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white font-display tracking-tight">
                <Users className="h-5 w-5 mr-2 text-mansagold" /> 
                Your Referral Code
              </CardTitle>
              <CardDescription className="text-slate-400">
                Share your code with friends and earn rewards for every signup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAgent && referralCode ? (
                <>
                  <div className="bg-black/40 border border-white/10 rounded-lg p-6 mb-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">Your Referral Code</p>
                    <p className="text-3xl font-bold tracking-wider text-mansagold my-3">{referralCode}</p>
                    <div className="flex justify-center mt-4 space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={handleCopyReferral}
                        className="flex items-center border-white/15 bg-transparent text-slate-200 hover:bg-white/5 hover:text-white"
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy Code
                      </Button>
                      <SocialShareDialog 
                        {...shareContent}
                        triggerContent={
                          <Button className="flex items-center bg-mansagold text-black hover:bg-mansagold/90 font-medium">
                            <Share2 className="h-4 w-4 mr-2" /> Share
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">
                    Become a Mansa Ambassador to get your referral code and start earning commissions
                  </p>
                  <Button 
                    asChild
                    className="bg-mansagold text-black hover:bg-mansagold/90 font-medium"
                  >
                    <a href="/become-agent">Apply Now</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/40 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white font-display tracking-tight">
                <TrendingUp className="h-5 w-5 mr-2 text-mansagold" />
                How It Works
              </CardTitle>
              <CardDescription className="text-slate-400">
                Three simple steps to start earning through referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-mansagold/15 ring-1 ring-mansagold/40 text-mansagold font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 text-sm">1</span>
                  <div>
                    <h3 className="font-medium text-white">Get your referral code</h3>
                    <p className="text-sm text-slate-400">Apply to become a Mansa Ambassador and receive your unique code</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-mansagold/15 ring-1 ring-mansagold/40 text-mansagold font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 text-sm">2</span>
                  <div>
                    <h3 className="font-medium text-white">Share with potential users</h3>
                    <p className="text-sm text-slate-400">Share your code with friends, family, and businesses</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-mansagold text-black font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 text-sm">3</span>
                  <div>
                    <h3 className="font-medium text-white">Earn rewards</h3>
                    <p className="text-sm text-slate-400">Earn commission for every successful signup using your code</p>
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
