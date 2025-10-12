import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Crown, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

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
  bronze: 'bg-orange-100 text-orange-800 border-orange-300',
  silver: 'bg-gray-100 text-gray-800 border-gray-300',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  platinum: 'bg-purple-100 text-purple-800 border-purple-300',
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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{companyName}</CardTitle>
            <CardDescription>Corporate Sponsorship Details</CardDescription>
          </div>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className="h-12 w-auto max-w-[120px] object-contain"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Tier</p>
            <Badge className={tierColors[tier]} variant="outline">
              {tierNames[tier]}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          </div>
        </div>

        {currentPeriodStart && currentPeriodEnd && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Billing Period</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {format(new Date(currentPeriodStart), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {format(new Date(currentPeriodEnd), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}

        {websiteUrl && (
          <div className="flex items-center gap-2 pt-4 border-t">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {websiteUrl}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
