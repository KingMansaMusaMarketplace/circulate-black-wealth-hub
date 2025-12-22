import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, User, Menu } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const haptics = useHapticFeedback();

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Directory', path: '/directory' },
    { icon: User, label: 'Profile', path: '/user-profile' },
    { icon: Menu, label: 'More', path: '/how-it-works' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => {
                haptics.light();
                navigate(tab.path);
              }}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Icon 
                className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-gray-500'}`}
              />
              <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar;
