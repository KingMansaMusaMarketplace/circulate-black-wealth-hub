import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Calendar,
  Home,
  DollarSign,
  Shield,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface CoHostInvite {
  id: string;
  property_id: string;
  cohost_email: string;
  permissions: string[];
  status: string;
  invited_at: string;
  invite_expires_at: string | null;
  property?: {
    title: string;
    city: string;
    state: string;
    photos: string[];
  };
}

const PERMISSION_ICONS: Record<string, React.ReactNode> = {
  messaging: <MessageSquare className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  bookings: <Home className="w-4 h-4" />,
  payouts: <DollarSign className="w-4 h-4" />,
};

const PERMISSION_LABELS: Record<string, string> = {
  messaging: 'Guest Messaging',
  calendar: 'Calendar Management',
  bookings: 'Reservation Access',
  payouts: 'Payout Visibility',
};

const CoHostAcceptPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = searchParams.get('token');

  const [invite, setInvite] = useState<CoHostInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [result, setResult] = useState<'accepted' | 'declined' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadInvite();
    } else {
      setError('Invalid invitation link. No token found.');
      setLoading(false);
    }
  }, [token]);

  const loadInvite = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('property_cohosts')
        .select(`
          *,
          property:vacation_properties(title, city, state, photos)
        `)
        .eq('invite_token', token)
        .single();

      if (fetchError || !data) {
        setError('Invitation not found or has already been used.');
        return;
      }

      // Check expiry
      if (data.invite_expires_at && new Date(data.invite_expires_at) < new Date()) {
        setError('This invitation has expired. Please ask the host to send a new invitation.');
        return;
      }

      if (data.status !== 'pending') {
        setResult(data.status as 'accepted' | 'declined');
        setInvite(data as CoHostInvite);
        return;
      }

      setInvite(data as CoHostInvite);
    } catch (err) {
      console.error('Error loading invite:', err);
      setError('Failed to load invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (accept: boolean) => {
    if (!invite) return;
    setResponding(true);
    try {
      const updateData: Record<string, unknown> = {
        status: accept ? 'accepted' : 'declined',
        invite_token: null, // Consume the token
      };

      if (accept && user) {
        updateData.cohost_user_id = user.id;
        updateData.accepted_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('property_cohosts')
        .update(updateData)
        .eq('id', invite.id)
        .eq('invite_token', token);

      if (updateError) throw updateError;

      setResult(accept ? 'accepted' : 'declined');
      toast.success(accept ? 'You are now a co-host!' : 'Invitation declined.');
    } catch (err) {
      console.error('Error responding to invite:', err);
      toast.error('Failed to respond. Please try again.');
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>Co-Host Invitation | Mansa Stays</title>
      </Helmet>

      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/20 to-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/15 to-amber-500/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {error ? (
          <Card className="bg-slate-800/80 border-red-500/30 backdrop-blur-xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Invalid Invitation</h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <Button onClick={() => navigate('/stays')} className="bg-mansagold text-black hover:bg-mansagold/90">
                Browse Mansa Stays
              </Button>
            </CardContent>
          </Card>
        ) : result === 'accepted' ? (
          <Card className="bg-slate-800/80 border-green-500/30 backdrop-blur-xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">You're a Co-Host!</h2>
              <p className="text-slate-400 mb-2">
                Welcome to {invite?.property?.title || 'the property'}.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                You can now help manage this listing from your host dashboard.
              </p>
              <Button onClick={() => navigate('/stays/host')} className="bg-mansagold text-black hover:bg-mansagold/90">
                Go to Host Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : result === 'declined' ? (
          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <XCircle className="w-16 h-16 text-slate-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Invitation Declined</h2>
              <p className="text-slate-400 mb-6">
                You've declined this co-host invitation.
              </p>
              <Button onClick={() => navigate('/stays')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Browse Stays
              </Button>
            </CardContent>
          </Card>
        ) : invite ? (
          <Card className="bg-slate-800/80 border-mansagold/30 backdrop-blur-xl">
            <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent rounded-t-xl" />
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-mansagold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-mansagold" />
              </div>
              <CardTitle className="text-2xl text-white">Co-Host Invitation</CardTitle>
              <CardDescription className="text-slate-400">
                You've been invited to co-host a property on Mansa Stays
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Property Preview */}
              {invite.property && (
                <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                  {invite.property.photos?.[0] ? (
                    <img
                      src={invite.property.photos[0]}
                      alt={invite.property.title}
                      className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-16 rounded-lg bg-slate-600 flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{invite.property.title}</p>
                    <p className="text-sm text-slate-400">
                      {invite.property.city}, {invite.property.state}
                    </p>
                  </div>
                </div>
              )}

              {/* Permissions */}
              <div>
                <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-mansagold" />
                  Your permissions will include:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {invite.permissions.map(perm => (
                    <div
                      key={perm}
                      className="flex items-center gap-2 p-2.5 bg-mansagold/10 border border-mansagold/20 rounded-lg"
                    >
                      <span className="text-mansagold">
                        {PERMISSION_ICONS[perm] || <Shield className="w-4 h-4" />}
                      </span>
                      <span className="text-sm text-white">
                        {PERMISSION_LABELS[perm] || perm}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Login prompt if not authenticated */}
              {!user && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm text-blue-300">
                  <p className="font-medium mb-1">Sign in to accept</p>
                  <p className="text-blue-300/70">
                    You'll be redirected back after logging in.
                  </p>
                  <Button
                    className="mt-3 bg-mansagold text-black hover:bg-mansagold/90 w-full"
                    onClick={() => navigate(`/login?redirect=/stays/cohost-accept?token=${token}`)}
                  >
                    Sign In to Accept
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              {user && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    onClick={() => handleResponse(false)}
                    disabled={responding}
                  >
                    {responding ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
                    Decline
                  </Button>
                  <Button
                    className="flex-1 bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
                    onClick={() => handleResponse(true)}
                    disabled={responding}
                  >
                    {responding ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                    Accept
                  </Button>
                </div>
              )}

              {invite.invite_expires_at && (
                <p className="text-xs text-slate-500 text-center">
                  Expires {new Date(invite.invite_expires_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </motion.div>
    </div>
  );
};

export default CoHostAcceptPage;
