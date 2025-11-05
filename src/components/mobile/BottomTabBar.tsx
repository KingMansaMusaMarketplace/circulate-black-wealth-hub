import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, QrCode, User, Compass } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useAuth } from '@/contexts/AuthContext';

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { light } = useHapticFeedback();
  const { session } = useAuth();

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/directory' },
    { icon: QrCode, label: 'Scan', path: '/qr-scanner' },
    { icon: Compass, label: 'Discover', path: '/loyalty' },
    { icon: User, label: 'Profile', path: session ? '/dashboard' : '/login' },
  ];

  const handleTabClick = (path: string) => {
    light();
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <Icon className={`h-6 w-6 mb-1 ${active ? 'stroke-2' : 'stroke-[1.5]'}`} />
              <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
