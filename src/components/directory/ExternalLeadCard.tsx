import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  BadgeCheck, 
  Clock, 
  Sparkles,
  Share2
} from 'lucide-react';
import { ExternalLead } from '@/hooks/use-claim-business';
import { useAuth } from '@/contexts/AuthContext';

interface ExternalLeadCardProps {
  lead: ExternalLead;
  onClaim: (leadId: string) => void;
  onShare: (lead: ExternalLead) => void;
  isClaiming?: boolean;
}

export const ExternalLeadCard: React.FC<ExternalLeadCardProps> = ({
  lead,
  onClaim,
  onShare,
  isClaiming
}) => {
  const { user } = useAuth();

  const getStatusBadge = () => {
    // Public view shows conversion status only (no claim details for privacy)
    if (lead.is_converted) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
          <BadgeCheck className="h-3 w-3 mr-1" />
          Joined
        </Badge>
      );
    }
    return (
      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
        <Sparkles className="h-3 w-3 mr-1" />
        Discovered
      </Badge>
    );
  };

  const confidencePercent = Math.round((lead.confidence_score || 0.7) * 100);

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden group">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
      
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg line-clamp-1 group-hover:text-purple-300 transition-colors">
              {lead.business_name}
            </h3>
            {lead.category && (
              <Badge variant="secondary" className="mt-1 text-xs bg-slate-700/50 text-slate-300 border-0">
                {lead.category}
              </Badge>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
          {lead.business_description || 'Black-owned business discovered via AI search'}
        </p>

        {/* Location - show city/state or location */}
        {(lead.city || lead.state || lead.location) && (
          <div className="flex items-center text-xs text-slate-500 mb-3">
            <MapPin className="h-3 w-3 mr-1 text-pink-400" />
            {lead.city && lead.state ? `${lead.city}, ${lead.state}` : lead.location}
          </div>
        )}

        {/* Confidence indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                confidencePercent >= 80 ? 'bg-emerald-500' : 
                confidencePercent >= 60 ? 'bg-amber-500' : 'bg-slate-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{confidencePercent}% match</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {lead.website_url && (
            <a
              href={lead.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Website
              </Button>
            </a>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare(lead)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          {/* Show claim button only for unconverted businesses */}
          {!lead.is_converted && (
            <Button
              size="sm"
              onClick={() => onClaim(lead.id)}
              disabled={isClaiming || !user}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isClaiming ? (
                <>
                  <Clock className="h-4 w-4 mr-1 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-1" />
                  Claim
                </>
              )}
            </Button>
          )}
        </div>

        {/* Sign in prompt for non-authenticated users */}
        {!user && !lead.is_converted && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            Sign in to claim this business
          </p>
        )}
      </CardContent>
    </Card>
  );
};
