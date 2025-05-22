
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Gift, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-blue-100"
      onClick={onClick}
    >
      <div className="h-40 bg-blue-50 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-mansablue/10 to-blue-50">
            <Gift size={32} className="text-mansablue opacity-50" />
          </div>
        )}
        {businessName && (
          <div className="absolute top-0 left-0 m-2">
            <Badge className="bg-white/90 text-mansablue border border-mansablue/20 hover:bg-white">
              {businessName}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-base text-mansablue line-clamp-2">{title}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-blue-50 mt-2">
        <div className="font-bold text-mansagold flex items-center">
          <Gift size={16} className="mr-1" />
          {pointsCost.toLocaleString()} pts
        </div>
        <div className="flex items-center gap-3">
          {hasExpiration && expireDate && (
            <span className={`text-xs flex items-center ${isExpiringSoon ? 'text-red-500' : 'text-gray-500'}`}>
              <Clock size={12} className="mr-1" />
              {formatDistanceToNow(expireDate, { addSuffix: true })}
            </span>
          )}
          {actionButton && (
            <div onClick={(e) => e.stopPropagation()} className="z-10">
              {actionButton}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default RewardCard;
