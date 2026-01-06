import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Users,
  TrendingUp
} from 'lucide-react';
import { useClaimBusiness, ExternalLead } from '@/hooks/use-claim-business';
import { ExternalLeadCard } from './ExternalLeadCard';
import { InviteBusinessModal } from './InviteBusinessModal';
import { toast } from 'sonner';

export const DiscoveredBusinessesSection: React.FC = () => {
  const { externalLeads, leadsLoading, initiateClaim, claimingId } = useClaimBusiness();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ExternalLead | null>(null);

  const handleClaim = async (leadId: string) => {
    await initiateClaim(leadId);
  };

  const handleShare = (lead: ExternalLead) => {
    setSelectedLead(lead);
    setShowInviteModal(true);
  };

  const handleCopyShareLink = (lead: ExternalLead) => {
    const shareText = `Check out ${lead.business_name} on Mansa Musa Marketplace - a platform supporting Black-owned businesses! ${window.location.origin}/directory`;
    navigator.clipboard.writeText(shareText);
    toast.success('Share text copied!');
  };

  if (leadsLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/90 border-purple-500/20">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-purple-500/20 rounded-full mb-4" />
            <div className="h-4 w-48 bg-slate-700 rounded mb-2" />
            <div className="h-3 w-32 bg-slate-800 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (externalLeads.length === 0) {
    return null; // Don't show section if no discovered businesses
  }

  // Public view doesn't expose claim_status for privacy - show aggregate counts
  const convertedCount = externalLeads.filter(l => l.is_converted).length;
  const discoverableCount = externalLeads.filter(l => !l.is_converted).length;

  return (
    <>
      <Card className="bg-gradient-to-br from-purple-900/20 via-slate-900/90 to-pink-900/20 border-purple-500/20 overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  AI-Discovered Businesses
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {externalLeads.length} Found
                  </Badge>
                </CardTitle>
                <p className="text-sm text-slate-400 mt-1">
                  Black-owned businesses found across the web • Help them join our community
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInviteModal(true)}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
              >
                <Users className="h-4 w-4 mr-1" />
                Invite Business
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-400">{convertedCount} Joined</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="text-sm text-slate-400">{discoverableCount} Discoverable</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1 text-sm text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span>Growing daily</span>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {externalLeads.slice(0, 8).map((lead) => (
                <ExternalLeadCard
                  key={lead.id}
                  lead={lead}
                  onClaim={handleClaim}
                  onShare={handleShare}
                  isClaiming={claimingId === lead.id}
                />
              ))}
            </div>

            {externalLeads.length > 8 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  View All {externalLeads.length} Discovered Businesses
                </Button>
              </div>
            )}

            {/* Call to action */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold text-white">Know a Black-owned business?</h4>
                  <p className="text-sm text-slate-400">
                    Invite them to join and earn rewards when they sign up!
                  </p>
                </div>
                <Button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white whitespace-nowrap"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite a Business
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <InviteBusinessModal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setSelectedLead(null);
        }}
        prefilledLead={selectedLead}
      />
    </>
  );
};
