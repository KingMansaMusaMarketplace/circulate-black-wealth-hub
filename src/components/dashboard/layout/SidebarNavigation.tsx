
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SidebarNavItem from './SidebarNavItem';
import { 
  BarChart3, 
  Building2, 
  QrCode, 
  Users, 
  Settings,
  Home,
  Scan,
  Gift,
  TrendingUp,
  HelpCircle,
  User
} from 'lucide-react';

const SidebarNavigation = () => {
  const { userType } = useAuth();
  const location = useLocation();

  const customerNavItems = [
    { icon: Home, label: 'Dashboard', to: '/dashboard' },
    { icon: Scan, label: 'QR Scanner', to: '/scanner' },
    { icon: Gift, label: 'Loyalty & Rewards', to: '/loyalty' },
    { icon: Building2, label: 'Directory', to: '/directory' },
    { icon: TrendingUp, label: 'Community Impact', to: '/community-impact' },
    { icon: Users, label: 'Community', to: '/community' },
    { icon: User, label: 'Profile', to: '/profile' },
    { icon: HelpCircle, label: 'Help Center', to: '/help' },
  ];

  const businessNavItems = [
    { icon: BarChart3, label: 'Dashboard', to: '/business/dashboard' },
    { icon: Building2, label: 'Business Profile', to: '/business/profile' },
    { icon: QrCode, label: 'QR Code Management', to: '/business/qr-codes' },
    { icon: TrendingUp, label: 'Analytics', to: '/business/profile?tab=analytics' },
    { icon: Users, label: 'Directory', to: '/directory' },
    { icon: Users, label: 'Community', to: '/community' },
    { icon: Settings, label: 'Settings', to: '/profile' },
    { icon: HelpCircle, label: 'Help Center', to: '/help' },
  ];

  const navItems = userType === 'business' ? businessNavItems : customerNavItems;

  return (
    <nav className="mt-8">
      <div className="space-y-1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
