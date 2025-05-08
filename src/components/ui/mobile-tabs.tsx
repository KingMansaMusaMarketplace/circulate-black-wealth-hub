import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileTabsProps {
  tabItems: {
    value: string;
    label: React.ReactNode;
    content: React.ReactNode;
  }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  tabItems,
  defaultValue,
  onChange,
  variant = 'default',
  fullWidth = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultValue || (tabItems.length > 0 ? tabItems[0].value : '')
  );
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onChange) onChange(value);
  };

  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors', 
          isActive 
            ? 'bg-mansablue text-white shadow-sm' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        );
      case 'underline':
        return cn(
          'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
          isActive
            ? 'border-mansablue text-mansablue'
            : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
        );
      default:
        return cn(
          'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
          isActive
            ? 'bg-white text-mansablue border border-gray-200 border-b-0'
            : 'bg-gray-50 text-gray-600 hover:text-mansablue hover:bg-gray-100'
        );
    }
  };

  return (
    <div className="w-full">
      {/* Tab Bar - Scrollable on mobile */}
      <div className={`${isMobile ? 'overflow-x-auto' : ''} mb-4`}>
        <div className={`flex ${isMobile ? 'space-x-2' : fullWidth ? 'grid grid-cols-' + tabItems.length : 'space-x-2'} ${variant === 'default' ? 'border-b border-gray-200' : ''}`}>
          {tabItems.map((tab) => (
            <button
              key={tab.value}
              className={`${getTabStyles(activeTab === tab.value)} ${fullWidth && !isMobile ? 'flex-1 justify-center' : ''}`}
              onClick={() => handleTabChange(tab.value)}
              type="button"
              aria-selected={activeTab === tab.value}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabItems.map((tab) => (
          <div 
            key={tab.value} 
            role="tabpanel"
            className={cn(
              'transition-opacity duration-300',
              activeTab === tab.value ? 'opacity-100' : 'hidden opacity-0'
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileTabs;
