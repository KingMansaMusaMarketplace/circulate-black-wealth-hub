
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'white';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  href?: string; // Add href for navigation
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  onClick,
  href,
  ...props
}) => {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    
    try {
      // If href is provided and no onClick, navigate
      if (href && !onClick) {
        window.location.href = href;
        return;
      }
      
      if (onClick) {
        await onClick(e);
      }
    } catch (error) {
      console.error('Button click error:', error);
    }
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default InteractiveButton;
