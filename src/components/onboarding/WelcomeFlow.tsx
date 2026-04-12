import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building, 
  QrCode, 
  Trophy, 
  TrendingUp, 
  ArrowRight,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type UserSelection = 'customer' | 'business' | null;

interface WelcomeFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<UserSelection>(
    user?.user_metadata?.user_type === 'business' ? 'business' : null
  );

  const handleComplete = (route?: string) => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
    if (route) {
      navigate(route);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const totalSteps = 3;

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-mansagold" : "w-1.5 bg-white/20"
              )}
            />
          ))}
        </div>

        {/* Step 1: Welcome + User Type */}
        {step === 0 && (
          <div className="px-8 pb-8 pt-4 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-mansablue to-mansagold flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to 1325.AI</h2>
              <p className="text-white/60">
                The economic operating system for the African Diaspora.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-white/40 uppercase tracking-wider font-medium">I am a...</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedType('customer')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    selectedType === 'customer'
                      ? "border-mansagold bg-mansagold/10"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  )}
                >
                  <Users className="h-6 w-6 text-mansagold mb-2" />
                  <p className="font-semibold text-white text-sm">Community Member</p>
                  <p className="text-xs text-white/50 mt-1">Discover & support businesses</p>
                </button>
                <button
                  onClick={() => setSelectedType('business')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    selectedType === 'business'
                      ? "border-mansagold bg-mansagold/10"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  )}
                >
                  <Building className="h-6 w-6 text-mansablue mb-2" />
                  <p className="font-semibold text-white text-sm">Business Owner</p>
                  <p className="text-xs text-white/50 mt-1">Grow & connect with customers</p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={handleSkip} className="text-white/40 hover:text-white/60">
                Skip
              </Button>
              <Button
                onClick={() => selectedType && setStep(1)}
                disabled={!selectedType}
                className="bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
              >
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: How it works (role-specific) */}
        {step === 1 && (
          <div className="px-8 pb-8 pt-4 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-1">Here's how it works</h2>
              <p className="text-white/50 text-sm">
                {selectedType === 'customer' ? 'Three steps to impact' : 'Three steps to growth'}
              </p>
            </div>

            {selectedType === 'customer' ? (
              <div className="space-y-4">
                <FlowCard
                  icon={<Search className="h-5 w-5" />}
                  number={1}
                  title="Discover"
                  description="Find verified businesses in our directory"
                  color="from-mansablue to-blue-600"
                />
                <FlowCard
                  icon={<QrCode className="h-5 w-5" />}
                  number={2}
                  title="Scan"
                  description="Scan QR codes when you visit to earn points"
                  color="from-purple-500 to-purple-700"
                />
                <FlowCard
                  icon={<Trophy className="h-5 w-5" />}
                  number={3}
                  title="Earn"
                  description="Redeem loyalty points for rewards & discounts"
                  color="from-mansagold to-amber-600"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <FlowCard
                  icon={<Building className="h-5 w-5" />}
                  number={1}
                  title="Profile"
                  description="Create your business listing with photos & details"
                  color="from-mansablue to-blue-600"
                />
                <FlowCard
                  icon={<QrCode className="h-5 w-5" />}
                  number={2}
                  title="QR Codes"
                  description="Generate loyalty codes for customer engagement"
                  color="from-purple-500 to-purple-700"
                />
                <FlowCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  number={3}
                  title="Grow"
                  description="Track analytics and build your customer base"
                  color="from-mansagold to-amber-600"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(0)} className="text-white/40 hover:text-white/60">
                Back
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
              >
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: First Action CTA */}
        {step === 2 && (
          <div className="px-8 pb-8 pt-4 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mansagold/20 to-mansablue/20 flex items-center justify-center">
              {selectedType === 'customer' ? (
                <Search className="h-10 w-10 text-mansagold" />
              ) : (
                <Building className="h-10 w-10 text-mansablue" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                {selectedType === 'customer' ? "Let's find your first business" : "Let's set up your profile"}
              </h2>
              <p className="text-white/50 text-sm">
                {selectedType === 'customer'
                  ? "Explore the directory and discover businesses in your area."
                  : "Complete your profile so customers can find and support you."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={() => handleComplete(selectedType === 'customer' ? '/directory' : '/business/profile')}
                className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-black font-semibold h-12 text-base"
              >
                {selectedType === 'customer' ? 'Explore Directory' : 'Set Up Profile'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleComplete()}
                className="w-full text-white/40 hover:text-white/60"
              >
                I'll explore on my own
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const FlowCard: React.FC<{
  icon: React.ReactNode;
  number: number;
  title: string;
  description: string;
  color: string;
}> = ({ icon, number, title, description, color }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
    <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0", color)}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-white text-sm">{title}</p>
      <p className="text-xs text-white/50">{description}</p>
    </div>
    <span className="text-xs font-bold text-white/20">{number}</span>
  </div>
);

export default WelcomeFlow;
