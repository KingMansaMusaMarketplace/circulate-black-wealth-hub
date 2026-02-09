import React, { useState, useEffect } from 'react';
import { usePartnerPortal } from '@/hooks/use-partner-portal';
import PartnerDashboard from '@/components/partner/PartnerDashboard';
import PartnerApplicationForm from '@/components/partner/PartnerApplicationForm';
import PartnerPendingReview from '@/components/partner/PartnerPendingReview';
import AdminPartnerPreview from '@/components/partner/AdminPartnerPreview';
import PartnerFAQ from '@/components/partner/PartnerFAQ';
import PartnerLanding from '@/components/partner/PartnerLanding';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const PartnerPortal: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { partner, stats, referrals, payouts, loading, isPartner, applyAsPartner, requestPayout, copyReferralLink, getEmbedCode } = usePartnerPortal();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!error && data) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Show loading state only when user is logged in
  if (user && (authLoading || loading || checkingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show public landing page for unauthenticated users
  if (!user) {
    return <PartnerLanding />;
  }

  // Admin users see the preview mode where they can select any partner
  if (isAdmin && !isPartner) {
    return <AdminPartnerPreview />;
  }

  // Not a partner yet - show application form
  if (!isPartner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900">
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Become a Directory Partner</h1>
            <p className="text-slate-400">
              Earn revenue by referring businesses from your directory to <span className="font-mono tracking-wider text-mansagold">1325.AI</span>
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Application Form */}
            <div>
              <PartnerApplicationForm onSubmit={applyAsPartner} />
            </div>
            
            {/* FAQ Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <PartnerFAQ variant="compact" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Partner exists but is pending approval
  if (partner && partner.status === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900">
        <PartnerPendingReview partner={partner} />
      </div>
    );
  }

  // Partner is active - show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900">
      <PartnerDashboard
        partner={partner!}
        stats={stats!}
        referrals={referrals}
        payouts={payouts}
        onCopyReferralLink={copyReferralLink}
        onRequestPayout={requestPayout}
        getEmbedCode={getEmbedCode}
      />
    </div>
  );
};

export default PartnerPortal;
