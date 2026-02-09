/**
 * @fileoverview Offline Loyalty Card Component
 * 
 * Displays the user's loyalty card information even when offline.
 * Uses service worker caching for persistent access.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoyalty } from '@/hooks/use-loyalty';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import QRCode from 'qrcode';

interface OfflineLoyaltyCardProps {
  className?: string;
}

export const OfflineLoyaltyCard: React.FC<OfflineLoyaltyCardProps> = ({ className }) => {
  const { user } = useAuth();
  const { summary, currentTier, isLoading, refreshData } = useLoyalty();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [cachedData, setCachedData] = useState<{
    points: number;
    tier: string;
    lastSync: string;
  } | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache data for offline access
  useEffect(() => {
    if (summary.totalPoints > 0 && isOnline) {
      const data = {
        points: summary.totalPoints,
        tier: currentTier,
        lastSync: new Date().toISOString(),
      };
      localStorage.setItem('mansa-loyalty-cache', JSON.stringify(data));
      setCachedData(data);
    }
  }, [summary.totalPoints, currentTier, isOnline]);

  // Load cached data on mount
  useEffect(() => {
    const cached = localStorage.getItem('mansa-loyalty-cache');
    if (cached) {
      try {
        setCachedData(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached loyalty data:', e);
      }
    }
  }, []);

  // Generate QR code for user's loyalty card
  useEffect(() => {
    if (user?.id) {
      const cardData = JSON.stringify({
        type: 'mansa-loyalty-card',
        userId: user.id,
        tier: currentTier,
      });
      
      QRCode.toDataURL(cardData, {
        width: 150,
        margin: 2,
        color: {
          dark: '#1B365D',
          light: '#FFFFFF',
        },
      })
        .then(setQrCodeUrl)
        .catch(console.error);
    }
  }, [user?.id, currentTier]);

  const displayData = isOnline
    ? { points: summary.totalPoints, tier: currentTier }
    : cachedData || { points: 0, tier: 'Bronze' };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'bg-gradient-to-r from-muted to-muted-foreground/30';
      case 'gold':
        return 'bg-gradient-to-r from-accent to-accent-foreground/30';
      case 'silver':
        return 'bg-gradient-to-r from-secondary to-secondary-foreground/30';
      default:
        return 'bg-gradient-to-r from-primary/60 to-primary/80';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background gradient based on tier */}
      <div 
        className={`absolute inset-0 opacity-10 ${getTierColor(displayData.tier)}`} 
      />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Loyalty Card
          </CardTitle>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Badge variant="outline" className="text-primary border-primary">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="outline" className="text-destructive border-destructive">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-3xl font-bold">{displayData.points.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tier</p>
            <Badge className={`${getTierColor(displayData.tier)} text-white`}>
              <Star className="h-3 w-3 mr-1" />
              {displayData.tier}
            </Badge>
          </div>
        </div>

        {/* QR Code */}
        {qrCodeUrl && (
          <div className="flex justify-center py-2">
            <img 
              src={qrCodeUrl} 
              alt="Your loyalty card QR code" 
              className="rounded-lg border"
            />
          </div>
        )}

        {/* Member info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>{user.email}</p>
          {cachedData?.lastSync && !isOnline && (
            <p className="text-xs mt-1">
              Last synced: {format(new Date(cachedData.lastSync), 'MMM d, h:mm a')}
            </p>
          )}
        </div>

        {/* Refresh button */}
        {isOnline && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => refreshData()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Syncing...' : 'Sync Points'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineLoyaltyCard;
