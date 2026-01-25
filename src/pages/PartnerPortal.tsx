import React from 'react';
import { usePartnerPortal } from '@/hooks/use-partner-portal';
import PartnerDashboard from '@/components/partner/PartnerDashboard';
import PartnerApplicationForm from '@/components/partner/PartnerApplicationForm';
import PartnerPendingReview from '@/components/partner/PartnerPendingReview';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const PartnerPortal: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { partner, stats, referrals, payouts, loading, isPartner, applyAsPartner, requestPayout, copyReferralLink, getEmbedCode } = usePartnerPortal();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Not a partner yet - show application form
  if (!isPartner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900">
        <div className="container max-w-2xl mx-auto py-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Become a Directory Partner</h1>
            <p className="text-slate-400">
              Earn revenue by referring businesses from your directory to 1325.ai
            </p>
          </div>
          <PartnerApplicationForm onSubmit={applyAsPartner} />
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
