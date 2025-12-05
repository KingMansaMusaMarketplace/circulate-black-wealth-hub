import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Crown, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SubscriptionDetailsCardProps {
  companyName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
}

const tierColors = {
  bronze: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  gold: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  platinum: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
};

const tierNames = {
  bronze: 'Bronze Partner',
  silver: 'Silver Partner',
  gold: 'Gold Partner',
  platinum: 'Platinum Partner',
};

export const SubscriptionDetailsCard: React.FC<SubscriptionDetailsCardProps> = ({
  companyName,
  tier,
  status,
  currentPeriodStart,
  currentPeriodEnd,
  logoUrl,
  websiteUrl,
  className,
}) => {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-amber-100">{companyName}</CardTitle>
            <CardDescription className="text-blue-200/70">Corporate Sponsorship Details</CardDescription>
          </div>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className="h-12 w-auto max-w-[120px] object-contain rounded-lg bg-white/10 p-1"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-amber-400" />
          <div className="flex-1">
            <p className="text-sm text-blue-200/70">Tier</p>
            <Badge className={tierColors[tier]} variant="outline">
              {tierNames[tier]}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-amber-400" />
          <div className="flex-1">
            <p className="text-sm text-blue-200/70">Status</p>
            <Badge 
              className={status === 'active' 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
              }
              variant="outline"
            >
              {status}
            </Badge>
          </div>
        </div>

        {currentPeriodStart && currentPeriodEnd && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm font-medium mb-2 text-amber-100">Billing Period</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200/70">Start Date</p>
                <p className="font-medium text-blue-100">
                  {format(new Date(currentPeriodStart), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-blue-200/70">End Date</p>
                <p className="font-medium text-blue-100">
                  {format(new Date(currentPeriodEnd), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}

        {websiteUrl && (
          <div className="flex items-center gap-2 pt-4 border-t border-white/10">
            <LinkIcon className="h-4 w-4 text-blue-200/70" />
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-400 hover:text-amber-300 hover:underline transition-colors"
            >
              {websiteUrl}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};