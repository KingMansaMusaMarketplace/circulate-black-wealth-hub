import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityDepositInfoProps {
  amount: number;
  variant?: 'inline' | 'card' | 'alert';
  className?: string;
}

export const SecurityDepositInfo: React.FC<SecurityDepositInfoProps> = ({
  amount,
  variant = 'inline',
  className,
}) => {
  if (amount <= 0) return null;

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-slate-300">
          <span className="font-medium text-white">${amount.toLocaleString()}</span> security deposit
        </span>
      </div>
    );
  }

  if (variant === 'alert') {
    return (
      <Alert className={cn('bg-blue-500/10 border-blue-500/30', className)}>
        <Shield className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-slate-300">
          A <span className="font-semibold text-white">${amount.toLocaleString()}</span> security 
          deposit will be authorized on your card. It will be released within 14 days after 
          checkout if no damage claims are made.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={cn('bg-slate-800/50 border-slate-700', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Security Deposit
        </CardTitle>
        <CardDescription className="text-slate-400">
          Protection for both guests and hosts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-slate-700">
          <span className="text-slate-400">Deposit Amount</span>
          <span className="text-xl font-bold text-white">${amount.toLocaleString()}</span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
              Your card will be authorized (not charged) for the deposit amount at booking
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
              The hold is released within 14 days after checkout if no issues are reported
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
              If damage occurs, the host can submit a claim with evidence for review
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DepositStatusProps {
  status: 'pending' | 'held' | 'partially_claimed' | 'claimed' | 'released' | 'disputed';
  amount: number;
  amountHeld?: number;
  amountDeducted?: number;
  className?: string;
}

export const DepositStatus: React.FC<DepositStatusProps> = ({
  status,
  amount,
  amountHeld = 0,
  amountDeducted = 0,
  className,
}) => {
  const statusConfig = {
    pending: {
      icon: Info,
      label: 'Pending',
      description: 'Deposit authorization pending',
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    },
    held: {
      icon: Shield,
      label: 'Held',
      description: 'Deposit is held on your card',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    partially_claimed: {
      icon: AlertTriangle,
      label: 'Partially Claimed',
      description: `$${amountDeducted} claimed for damages`,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    },
    claimed: {
      icon: AlertTriangle,
      label: 'Claimed',
      description: 'Full deposit claimed for damages',
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
    },
    released: {
      icon: CheckCircle,
      label: 'Released',
      description: 'Deposit has been released',
      color: 'text-green-400 bg-green-500/10 border-green-500/30',
    },
    disputed: {
      icon: AlertTriangle,
      label: 'Disputed',
      description: 'Under review',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={cn('border', config.color, className)}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <div>
              <p className="font-medium text-white">{config.label}</p>
              <p className="text-sm text-slate-400">{config.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">${amount.toLocaleString()}</p>
            {status === 'held' && amountHeld > 0 && (
              <p className="text-xs text-slate-400">Currently held</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityDepositInfo;
