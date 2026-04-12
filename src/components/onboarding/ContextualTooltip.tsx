import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextualTooltipProps {
  /** Unique key for localStorage persistence */
  tooltipKey: string;
  /** Tooltip message */
  message: string;
  /** Position relative to children */
  position?: 'top' | 'bottom';
  /** Optional icon */
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ContextualTooltip: React.FC<ContextualTooltipProps> = ({
  tooltipKey,
  message,
  position = 'bottom',
  icon,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const storageKey = `ctx-tip-${tooltipKey}`;

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  return (
    <div className="relative">
      {children}
      {visible && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300",
            position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
          )}
        >
          <div className="bg-mansablue text-white text-sm rounded-lg px-4 py-3 shadow-xl max-w-xs flex items-start gap-2 whitespace-normal">
            {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
            <span className="flex-1">{message}</span>
            <button onClick={dismiss} className="shrink-0 hover:bg-white/20 rounded p-0.5 -mt-0.5 -mr-1">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Arrow */}
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-mansablue rotate-45",
              position === 'top' ? '-bottom-1.5' : '-top-1.5'
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ContextualTooltip;
