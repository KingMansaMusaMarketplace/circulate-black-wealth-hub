
import React from 'react';
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

  const customerNavItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Scan, label: 'QR Scanner', href: '/scanner' },
    { icon: Gift, label: 'Loyalty & Rewards', href: '/loyalty' },
    { icon: Building2, label: 'Directory', href: '/directory' },
    { icon: TrendingUp, label: 'Community Impact', href: '/community-impact' },
    { icon: Users, label: 'Community', href: '/community' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: HelpCircle, label: 'Help Center', href: '/help' },
  ];

  const businessNavItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/business/dashboard' },
    { icon: Building2, label: 'Business Profile', href: '/business/profile' },
    { icon: QrCode, label: 'QR Code Management', href: '/business/qr-codes' },
    { icon: TrendingUp, label: 'Analytics', href: '/business/profile?tab=analytics' },
    { icon: Users, label: 'Directory', href: '/directory' },
    { icon: Users, label: 'Community', href: '/community' },
    { icon: Settings, label: 'Settings', href: '/profile' },
    { icon: HelpCircle, label: 'Help Center', href: '/help' },
  ];

  const navItems = userType === 'business' ? businessNavItems : customerNavItems;

  return (
    <nav className="mt-8">
      <div className="space-y-1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
