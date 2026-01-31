import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ClaimBusinessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error' | 'expired'>('loading');
  const [businessName, setBusinessName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [claiming, setClaiming] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setError('No claim token provided');
        return;
      }

      try {
        // Check if token is valid
        const { data, error: fetchError } = await supabase
          .from('b2b_external_leads')
          .select('business_name, claim_status, claim_token_expires_at')
          .eq('claim_token', token)
          .single();

        if (fetchError || !data) {
          setStatus('error');
          setError('Invalid or expired claim link');
          return;
        }

        // Check if already claimed
        if (data.claim_status === 'verified') {
          setStatus('error');
          setError('This business has already been claimed');
          return;
        }

        // Check expiration
        if (new Date(data.claim_token_expires_at) < new Date()) {
          setStatus('expired');
          setError('This claim link has expired');
          return;
        }

        setBusinessName(data.business_name);
        setStatus('ready');
      } catch (err) {
        console.error('Error verifying token:', err);
        setStatus('error');
        setError('Something went wrong. Please try again.');
      }
    };

    verifyToken();
  }, [token]);

  const handleClaim = async () => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/claim-business?token=${token}`);
      return;
    }

    setClaiming(true);

    try {
      const { data, error: claimError } = await supabase
        .rpc('claim_business_lead', {
          p_token: token,
          p_user_id: user.id
        });

      if (claimError) throw claimError;

      const result = data as { success: boolean; error?: string; business_name?: string };

      if (result.success) {
        setStatus('success');
        toast.success('Business claimed successfully!');
      } else {
        throw new Error(result.error || 'Failed to claim business');
      }
    } catch (err: any) {
      console.error('Error claiming business:', err);
      setError(err.message || 'Failed to claim business');
      setStatus('error');
      toast.error('Failed to claim business');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Claim Your Business | Mansa Musa Marketplace</title>
        <meta name="description" content="Claim your business listing on Mansa Musa Marketplace" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <Card className="relative w-full max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-purple-500/20 backdrop-blur-xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
          
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              {status === 'success' ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              ) : status === 'error' || status === 'expired' ? (
                <XCircle className="h-8 w-8 text-red-400" />
              ) : (
                <Building2 className="h-8 w-8 text-purple-400" />
              )}
            </div>
            
            <CardTitle className="text-2xl text-white">
              {status === 'success' 
                ? 'Business Claimed!' 
                : status === 'error' || status === 'expired'
                  ? 'Claim Failed'
                  : 'Claim Your Business'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
                <p className="text-slate-400">Verifying claim link...</p>
              </div>
            )}

            {status === 'ready' && (
              <>
                <div className="text-center">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-Discovered Business
                  </Badge>
                  <h3 className="text-xl font-semibold text-white mb-2">{businessName}</h3>
                  <p className="text-slate-400 text-sm">
                    You're about to claim ownership of this business listing on Mansa Musa Marketplace.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Verified Owner Badge</p>
                      <p className="text-xs text-slate-400">Show customers you're the real deal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Full Control</p>
                      <p className="text-xs text-slate-400">Update your listing, add photos, respond to reviews</p>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-sm text-amber-300 text-center">
                      You'll need to sign in or create an account to claim this business
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                >
                  {claiming ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Claiming...
                    </>
                  ) : user ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Claim This Business
                    </>
                  ) : (
                    <>
                      Sign In & Claim
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-emerald-300">
                    <strong>{businessName}</strong> is now verified as yours!
                  </p>
                </div>
                
                <p className="text-slate-400 text-sm">
                  You can now manage your business listing from your dashboard.
                </p>

                <Button
                  onClick={() => navigate('/business-dashboard')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {(status === 'error' || status === 'expired') && (
              <div className="text-center space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-300">{error}</p>
                </div>
                
                {status === 'expired' && (
                  <p className="text-slate-400 text-sm">
                    Contact the person who shared this link to get a new one.
                  </p>
                )}

                <Button
                  variant="outline"
                  onClick={() => navigate('/directory')}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Explore Businesses
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ClaimBusinessPage;
