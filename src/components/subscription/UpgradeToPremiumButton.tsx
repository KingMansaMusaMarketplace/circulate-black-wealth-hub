
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useSubscriptionActions } from './hooks/useSubscriptionActions';

interface UpgradeToPremiumButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

const UpgradeToPremiumButton: React.FC<UpgradeToPremiumButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  children
}) => {
  const { loading, handleSubscribe, isAuthenticated } = useSubscriptionActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`bg-mansagold hover:bg-mansagold/90 text-mansablue ${className}`}
      onClick={() => handleSubscribe('premium')}
      disabled={loading === 'premium'}
    >
      {loading === 'premium' ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <Crown className="h-4 w-4 mr-2" />
          {children || 'Upgrade to Premium'}
        </>
      )}
    </Button>
  );
};

export default UpgradeToPremiumButton;
