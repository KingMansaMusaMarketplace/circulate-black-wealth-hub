import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, Package, Clock, Share2, Check, ChevronRight, ChevronLeft, 
  X, Sparkles, Building2, Camera, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface QuickWinStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  isComplete: boolean;
}

interface QuickWinOnboardingProps {
  businessId: string;
  onComplete?: () => void;
  onDismiss?: () => void;
}

const QuickWinOnboarding = ({ businessId, onComplete, onDismiss }: QuickWinOnboardingProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<QuickWinStep[]>([
    {
      id: 'logo',
      title: 'Add Your Logo',
      description: 'Help customers recognize your business with a logo or photo',
      icon: <Camera className="w-6 h-6" />,
      actionLabel: 'Upload Logo',
      isComplete: false
    },
    {
      id: 'products',
      title: 'Add 3 Products/Services',
      description: 'Show customers what you offer - this takes about 2 minutes',
      icon: <Package className="w-6 h-6" />,
      actionLabel: 'Add Products',
      isComplete: false
    },
    {
      id: 'hours',
      title: 'Set Business Hours',
      description: 'Let customers know when you\'re open for business',
      icon: <Clock className="w-6 h-6" />,
      actionLabel: 'Set Hours',
      isComplete: false
    },
    {
      id: 'share',
      title: 'Share Your Profile',
      description: 'Get your first customers by sharing your new listing!',
      icon: <Share2 className="w-6 h-6" />,
      actionLabel: 'Share Now',
      isComplete: false
    }
  ]);
  const [isVisible, setIsVisible] = useState(true);
  const [profileStrength, setProfileStrength] = useState(0);

  useEffect(() => {
    checkBusinessProfile();
  }, [businessId]);

  const checkBusinessProfile = async () => {
    if (!businessId) return;
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('logo_url, hours, description')
        .eq('id', businessId)
        .single();

      if (error) throw error;

      // Check product count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId);

      const updatedSteps = [...steps];
      let completed = 0;

      // Check logo
      if (data?.logo_url) {
        updatedSteps[0].isComplete = true;
        completed++;
      }

      // Check products (need at least 3)
      if ((productCount || 0) >= 3) {
        updatedSteps[1].isComplete = true;
        completed++;
      }

      // Check hours
      if (data?.hours && Object.keys(data.hours).length > 0) {
        updatedSteps[2].isComplete = true;
        completed++;
      }

      setSteps(updatedSteps);
      setProfileStrength((completed / steps.length) * 100);

      // Find first incomplete step
      const firstIncomplete = updatedSteps.findIndex(s => !s.isComplete);
      if (firstIncomplete !== -1) {
        setCurrentStep(firstIncomplete);
      }
    } catch (err) {
      console.error('Error checking profile:', err);
    }
  };

  const handleStepAction = async (stepId: string) => {
    switch (stepId) {
      case 'logo':
        // Navigate to profile page with logo section
        window.location.href = '/profile?section=logo';
        break;
      case 'products':
        // Navigate to products management
        window.location.href = '/business-dashboard?tab=products';
        break;
      case 'hours':
        // Navigate to hours settings
        window.location.href = '/profile?section=hours';
        break;
      case 'share':
        // Share the profile
        handleShare();
        break;
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/business/${businessId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my business on Mansa Musa Marketplace!',
          text: 'I just listed my Black-owned business. Support local!',
          url: shareUrl
        });
        markStepComplete('share');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Profile link copied to clipboard!');
      markStepComplete('share');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const markStepComplete = async (stepId: string) => {
    const updatedSteps = steps.map(s => 
      s.id === stepId ? { ...s, isComplete: true } : s
    );
    setSteps(updatedSteps);
    
    const completedCount = updatedSteps.filter(s => s.isComplete).length;
    setProfileStrength((completedCount / steps.length) * 100);
    
    // Check if all complete
    if (completedCount === steps.length) {
      // Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('🎉 Profile Complete! You\'re all set for success!');
      onComplete?.();
    } else {
      // Move to next incomplete step
      const nextIncomplete = updatedSteps.findIndex((s, i) => i > currentStep && !s.isComplete);
      if (nextIncomplete !== -1) {
        setCurrentStep(nextIncomplete);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`quickwin-dismissed-${businessId}`, 'true');
    onDismiss?.();
  };

  // Check if already dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(`quickwin-dismissed-${businessId}`);
    if (dismissed) {
      setIsVisible(false);
    }
  }, [businessId]);

  if (!isVisible) return null;

  const allComplete = steps.every(s => s.isComplete);
  if (allComplete) return null;

  const currentStepData = steps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-dark rounded-2xl border border-white/10 overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-mansagold/20 to-transparent border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-mansagold/20">
              <Sparkles className="w-5 h-5 text-mansagold" />
            </div>
            <div>
              <h3 className="text-white font-bold">Quick Setup</h3>
              <p className="text-blue-200/70 text-sm">5 minutes to your first customers</p>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-200/70 text-sm">Profile Strength</span>
          <span className="text-mansagold font-bold text-sm">{Math.round(profileStrength)}%</span>
        </div>
        <Progress value={profileStrength} className="h-2" />
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`flex flex-col items-center gap-1 transition-all ${
                index === currentStep ? 'scale-110' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step.isComplete 
                  ? 'bg-emerald-500 text-white' 
                  : index === currentStep 
                    ? 'bg-mansagold text-slate-900' 
                    : 'bg-white/10 text-white/50'
              }`}>
                {step.isComplete ? <Check className="w-5 h-5" /> : step.icon}
              </div>
              <span className={`text-xs ${
                index === currentStep ? 'text-white' : 'text-white/50'
              }`}>
                {step.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="px-6 pb-6"
        >
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                currentStepData.isComplete 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-mansagold/20 text-mansagold'
              }`}>
                {currentStepData.isComplete ? <Check className="w-6 h-6" /> : currentStepData.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg mb-1">
                  {currentStepData.title}
                </h4>
                <p className="text-blue-200/70 text-sm mb-4">
                  {currentStepData.description}
                </p>
                
                {!currentStepData.isComplete && (
                  <Button
                    onClick={() => handleStepAction(currentStepData.id)}
                    className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-bold"
                  >
                    {currentStepData.actionLabel}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                
                {currentStepData.isComplete && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    <span>Completed!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-white/70 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="text-white/70 hover:text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default QuickWinOnboarding;
