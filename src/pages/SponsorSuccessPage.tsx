import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
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
      platinum: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
      gold: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
      silver: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
      bronze: 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100',
    };
    return colors[tier.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  return (
    <>
      <Helmet>
        <title>Sponsorship Confirmed - Thank You!</title>
        <meta name="description" content="Your corporate sponsorship has been confirmed. Thank you for supporting Black-owned businesses." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center space-y-4">
            {isPreviewMode && (
              <Badge variant="outline" className="mx-auto bg-yellow-100 text-yellow-800 border-yellow-300">
                Preview Mode - No session ID provided
              </Badge>
            )}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Sponsorship Confirmed!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for becoming a corporate sponsor. Your support will make a real difference in strengthening Black-owned businesses and communities.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">Loading your subscription details...</p>
              </div>
            ) : subscription ? (
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Your Sponsorship Details</h3>
                  <Badge className={getTierColor(subscription.tier)}>
                    {subscription.tier.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{subscription.company_name}</span>
                  </div>
                  {subscription.current_period_start && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billing Started:</span>
                      <span className="font-medium">
                        {format(new Date(subscription.current_period_start), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  {subscription.current_period_end && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Billing:</span>
                      <span className="font-medium">
                        {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-lg">What Happens Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>You'll receive a confirmation email with your sponsorship details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Your company logo will be added to the platform within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Access to your sponsor dashboard will be granted shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Our team will contact you to coordinate promotional materials</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1" 
                onClick={() => navigate('/sponsor-dashboard')}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>Questions? Contact us at <a href="mailto:sponsors@example.com" className="text-primary hover:underline">sponsors@example.com</a></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SponsorSuccessPage;
