import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Target } from 'lucide-react';

interface ProgressiveDisclosureProps {
  id: string;
  title: string;
  message: string;
  targetSelector?: string;
  showOnMount?: boolean;
  autoShow?: boolean;
  delay?: number;
  position?: 'center' | 'top' | 'bottom';
  onAction?: () => void;
  actionText?: string;
  onDismiss?: () => void;
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  id,
  title,
  message,
  targetSelector,
  showOnMount = false,
  autoShow = false,
  delay = 1000,
  position = 'center',
  onAction,
  actionText = 'Got it!',
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });

  // Check if this disclosure has been dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(`disclosure-dismissed-${id}`);
    if (dismissed !== 'true' && (showOnMount || autoShow)) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [id, showOnMount, autoShow, delay]);

  // Find and highlight target element
  useEffect(() => {
    if (isVisible && targetSelector) {
      const element = document.querySelector(targetSelector) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Calculate position relative to target
        const rect = element.getBoundingClientRect();
        setOverlayPosition({
          top: rect.top + rect.height + 10,
          left: rect.left + rect.width / 2
        });

        // Add highlight class
        element.classList.add('progressive-disclosure-highlight');
        element.style.position = 'relative';
        element.style.zIndex = '1000';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
        element.style.borderRadius = '8px';
        element.style.transition = 'all 0.3s ease';
      }
    }

    return () => {
      if (targetElement) {
        targetElement.classList.remove('progressive-disclosure-highlight');
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
        targetElement.style.transition = '';
      }
    };
  }, [isVisible, targetSelector, targetElement]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`disclosure-dismissed-${id}`, 'true');
    onDismiss?.();
  };

  const handleAction = () => {
    onAction?.();
    handleDismiss();
  };

  if (!isVisible) return null;

  const getPositionStyles = () => {
    if (targetSelector && overlayPosition.top > 0) {
      return {
        position: 'fixed' as const,
        top: overlayPosition.top,
        left: overlayPosition.left,
        transform: 'translateX(-50%)',
        zIndex: 1001
      };
    }

    switch (position) {
      case 'top':
        return {
          position: 'fixed' as const,
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001
        };
      case 'bottom':
        return {
          position: 'fixed' as const,
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001
        };
      default:
        return {
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001
        };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-[1000]"
        onClick={handleDismiss}
      />
      
      {/* Disclosure card */}
      <div style={getPositionStyles()}>
        <Card className="w-80 bg-white shadow-xl border-2 border-mansablue/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-mansablue" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-auto p-1 hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {message}
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleDismiss} size="sm">
                Maybe Later
              </Button>
              <Button 
                onClick={handleAction}
                size="sm"
                className="bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue-dark hover:to-mansagold-dark text-white"
              >
                {actionText}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProgressiveDisclosure;