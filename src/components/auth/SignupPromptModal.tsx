import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Heart, Gift, ArrowRight, Sparkles } from 'lucide-react';

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: 'favorite' | 'save_favorite' | 'reward' | 'qr_scan' | 'loyalty' | 'default' | string;
  businessName?: string;
}

const actionMessages: Record<string, { title: string; description: string; icon: typeof Heart; benefit: string }> = {
  favorite: {
    title: 'Save Your Favorites',
    description: 'Create a free account to save businesses and access them anytime.',
    icon: Heart,
    benefit: 'Keep track of all the businesses you love!',
  },
  save_favorite: {
    title: 'Save Your Favorites',
    description: 'Create a free account to save businesses and access them anytime.',
    icon: Heart,
    benefit: 'Keep track of all the businesses you love!',
  },
  reward: {
    title: 'Claim Your Reward',
    description: 'Sign up for free to claim this reward and start earning points.',
    icon: Gift,
    benefit: 'Earn 50 bonus points just for signing up!',
  },
  qr_scan: {
    title: 'Start Earning Points',
    description: 'Create an account to scan QR codes and earn loyalty points.',
    icon: Star,
    benefit: 'Get rewards at every Black-owned business you visit!',
  },
  loyalty: {
    title: 'Join the Loyalty Program',
    description: 'Sign up for free to access exclusive discounts and rewards.',
    icon: Sparkles,
    benefit: 'Members save an average of 15% on every purchase!',
  },
  default: {
    title: 'Join for Free',
    description: 'Create an account to unlock all features and start saving.',
    icon: Star,
    benefit: 'It only takes 30 seconds!',
  },
};

export const SignupPromptModal: React.FC<SignupPromptModalProps> = ({
  isOpen,
  onClose,
  action = 'default',
  businessName,
}) => {
  const navigate = useNavigate();
  const message = actionMessages[action] || actionMessages.default;
  const Icon = message.icon;

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-mansagold to-amber-500 flex items-center justify-center">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {message.title}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {businessName ? (
              <>Create a free account to {action === 'favorite' ? 'save' : 'support'} <span className="font-semibold text-foreground">{businessName}</span>.</>
            ) : (
              message.description
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 my-4">
          <p className="text-sm text-center text-muted-foreground">
            ✨ {message.benefit}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold-dark hover:to-amber-600 text-white font-semibold py-6"
          >
            Create Free Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleLogin}
            className="w-full"
          >
            I already have an account
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Join thousands of members saving money while supporting Black-owned businesses.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignupPromptModal;
