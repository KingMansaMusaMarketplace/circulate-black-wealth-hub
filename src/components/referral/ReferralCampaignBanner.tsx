import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Users, Trophy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReferralCampaigns, ReferralCampaign } from '@/hooks/use-referral-campaigns';

interface ReferralCampaignBannerProps {
  campaign?: ReferralCampaign;
  onJoin?: (campaignId: string) => void;
  compact?: boolean;
}

export const ReferralCampaignBanner: React.FC<ReferralCampaignBannerProps> = ({
  campaign: propCampaign,
  onJoin,
  compact = false,
}) => {
  const { featuredCampaign, joinCampaign, joiningCampaign, getTimeRemaining } = useReferralCampaigns();
  const campaign = propCampaign || featuredCampaign;
  
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, expired: false });

  useEffect(() => {
    if (!campaign) return;
    
    const updateTime = () => {
      setTimeRemaining(getTimeRemaining(campaign.end_date));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [campaign, getTimeRemaining]);

  if (!campaign || timeRemaining.expired) return null;

  const handleJoin = () => {
    if (onJoin) {
      onJoin(campaign.id);
    } else {
      joinCampaign(campaign.id);
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'flash': return <Zap className="w-5 h-5" />;
      case 'team': return <Users className="w-5 h-5" />;
      case 'milestone': return <Trophy className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getCampaignTypeLabel = (type: string) => {
    switch (type) {
      case 'flash': return 'Flash Campaign';
      case 'team': return 'Team Challenge';
      case 'milestone': return 'Milestone Event';
      case 'seasonal': return 'Seasonal Special';
      default: return 'Campaign';
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4"
        style={{ borderColor: `${campaign.banner_color}40` }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${campaign.banner_color}30` }}
            >
              {getCampaignTypeIcon(campaign.campaign_type)}
            </div>
            <div>
              <p className="font-semibold text-white">{campaign.name}</p>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Clock className="w-3 h-3" />
                <span>
                  {timeRemaining.days}d {timeRemaining.hours}h left
                </span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-xs">
                  {campaign.bonus_multiplier}x Points
                </Badge>
              </div>
            </div>
          </div>
          {!campaign.is_joined && (
            <Button
              size="sm"
              onClick={handleJoin}
              disabled={joiningCampaign}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Join
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
      style={{ 
        background: `linear-gradient(135deg, ${campaign.banner_color}40, ${campaign.banner_color}20)`,
        borderColor: `${campaign.banner_color}50`
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl"
          style={{ backgroundColor: `${campaign.banner_color}30` }}
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl"
          style={{ backgroundColor: `${campaign.banner_color}20` }}
        />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left side - Campaign info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary" 
                className="text-white border-white/20"
                style={{ backgroundColor: `${campaign.banner_color}50` }}
              >
                {getCampaignTypeIcon(campaign.campaign_type)}
                <span className="ml-1">{getCampaignTypeLabel(campaign.campaign_type)}</span>
              </Badge>
              {campaign.is_featured && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {campaign.name}
              </h3>
              {campaign.description && (
                <p className="text-blue-200 text-lg">{campaign.description}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-200">Bonus</p>
                  <p className="font-bold">{campaign.bonus_multiplier}x Points</p>
                </div>
              </div>
              
              {campaign.participant_count !== undefined && (
                <div className="flex items-center gap-2 text-white">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Participants</p>
                    <p className="font-bold">{campaign.participant_count}</p>
                  </div>
                </div>
              )}

              {campaign.is_joined && campaign.my_rank && (
                <div className="flex items-center gap-2 text-white">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Your Rank</p>
                    <p className="font-bold">#{campaign.my_rank}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Timer and CTA */}
          <div className="flex flex-col items-center gap-4">
            {/* Countdown */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{timeRemaining.days}</div>
                <div className="text-xs text-blue-200">Days</div>
              </div>
              <span className="text-2xl text-white/50">:</span>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{timeRemaining.hours}</div>
                <div className="text-xs text-blue-200">Hours</div>
              </div>
              <span className="text-2xl text-white/50">:</span>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{timeRemaining.minutes}</div>
                <div className="text-xs text-blue-200">Min</div>
              </div>
            </div>

            {/* CTA Button */}
            {campaign.is_joined ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 px-4 py-2">
                ✓ You're In! {campaign.my_referrals || 0} referrals
              </Badge>
            ) : (
              <Button
                size="lg"
                onClick={handleJoin}
                disabled={joiningCampaign}
                className="bg-white text-slate-900 hover:bg-white/90 font-bold shadow-lg"
              >
                {joiningCampaign ? 'Joining...' : 'Join Campaign'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
