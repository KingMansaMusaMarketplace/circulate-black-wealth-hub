import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Loader2, Sparkles, Crown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSponsorSubscription } from '@/hooks/useSponsorSubscription';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const SponsorSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const isPreviewMode = !sessionId;
  const { subscription, isLoading, error } = useSponsorSubscription();

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      platinum: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      gold: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
      bronze: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };
    return colors[tier.toLowerCase()] || 'bg-white/10 text-white/70';
  };

  return (
    <>
      <Helmet>
        <title>Sponsorship Confirmed - Thank You!</title>
        <meta name="description" content="Your corporate sponsorship has been confirmed. Thank you for supporting Black-owned businesses." />
      </Helmet>

      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/30 to-yellow-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/25 to-indigo-700/15 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_1s]" />
          <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-emerald-500/20 to-green-600/10 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]" />
        </div>

        <Card className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border-white/10 relative z-10">
          <CardHeader className="text-center space-y-4">
            {isPreviewMode && (
              <Badge variant="outline" className="mx-auto bg-amber-500/20 text-amber-300 border-amber-500/30">
                Preview Mode - No session ID provided
              </Badge>
            )}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-amber-400" />
              <CardTitle className="text-3xl bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                Sponsorship Confirmed!
              </CardTitle>
              <Crown className="h-6 w-6 text-amber-400" />
            </div>
            <CardDescription className="text-lg text-blue-200/80">
              Thank you for becoming a corporate sponsor. Your support will make a real difference in strengthening Black-owned businesses and communities.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              </div>
            ) : error ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                <p className="text-blue-200/70">Loading your subscription details...</p>
              </div>
            ) : subscription ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-amber-100 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Your Sponsorship Details
                  </h3>
                  <Badge className={getTierColor(subscription.tier)}>
                    {subscription.tier.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">Company:</span>
                    <span className="font-medium text-blue-100">{subscription.company_name}</span>
                  </div>
                  {subscription.current_period_start && (
                    <div className="flex justify-between">
                      <span className="text-blue-200/70">Billing Started:</span>
                      <span className="font-medium text-blue-100">
                        {format(new Date(subscription.current_period_start), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  {subscription.current_period_end && (
                    <div className="flex justify-between">
                      <span className="text-blue-200/70">Next Billing:</span>
                      <span className="font-medium text-blue-100">
                        {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">Status:</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-lg text-amber-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                What Happens Next?
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-blue-100">You will receive a confirmation email with your sponsorship details</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-blue-100">Your company logo will be added to the platform within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-blue-100">Access to your sponsor dashboard will be granted shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-blue-100">Our team will contact you to coordinate promotional materials</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/25" 
                onClick={() => navigate('/sponsor-dashboard')}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-white/5 border-white/20 text-blue-100 hover:bg-white/10 hover:text-white"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>

            <div className="text-center text-sm pt-4 border-t border-white/10">
              <p className="text-blue-200/70">
                Questions? Contact us at{' '}
                <a href="mailto:sponsors@mansamusamarketplace.com" className="text-amber-400 hover:text-amber-300 hover:underline">
                  sponsors@mansamusamarketplace.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SponsorSuccessPage;
