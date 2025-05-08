
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface RewardCardProps {
  title: string;
  pointsCost: number;
  businessName?: string;
  imageUrl?: string;
  expiresAt?: string;
  onClick: () => void;
  actionButton?: React.ReactNode;
}

export function RewardCard({
  title,
  pointsCost,
  businessName,
  imageUrl,
  expiresAt,
  onClick,
  actionButton
}: RewardCardProps) {
  const hasExpiration = Boolean(expiresAt);
  const expireDate = expiresAt ? new Date(expiresAt) : null;
  const isExpiringSoon = expireDate && expireDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="h-36 bg-gray-100">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-mansablue/20 to-mansagold/20">
            <span className="font-bold text-mansablue">{businessName || 'Reward'}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-base line-clamp-2">{title}</h3>
        {businessName && (
          <p className="text-sm text-gray-500 mt-1">{businessName}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold text-mansablue">
          {pointsCost.toLocaleString()} pts
        </div>
        <div className="flex items-center gap-3">
          {hasExpiration && expireDate && (
            <span className={`text-xs ${isExpiringSoon ? 'text-red-500' : 'text-gray-500'}`}>
              Expires {formatDistanceToNow(expireDate, { addSuffix: true })}
            </span>
          )}
          {actionButton && (
            <div onClick={(e) => e.stopPropagation()}>
              {actionButton}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default RewardCard;
