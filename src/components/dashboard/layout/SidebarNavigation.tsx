
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Building2, 
  QrCode, 
  BarChart3, 
  Users, 
  Settings,
  Wallet,
  Search,
  Heart,
  HelpCircle,
  BookOpen,
  DollarSign
} from 'lucide-react';

const SidebarNavigation = () => {
  const location = useLocation();
  const { userType } = useAuth();

  const customerNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Directory', href: '/directory', icon: Search },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'Scanner', href: '/scanner', icon: QrCode },
    { name: 'Loyalty', href: '/loyalty', icon: Wallet },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Profile', href: '/profile', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  const businessNavItems = [
    { name: 'Dashboard', href: '/business-dashboard', icon: Home },
    { name: 'Profile', href: '/business/profile', icon: Building2 },
    { name: 'Finances', href: '/business-finances', icon: DollarSign },
    { name: 'Analytics', href: '/business-analytics', icon: BarChart3 },
    { name: 'QR Codes', href: '/business/qr-codes', icon: QrCode },
    { name: 'Customers', href: '/business/customers', icon: Users },
    { name: 'Directory', href: '/directory', icon: Search },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'Community', href: '/community', icon: Heart },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  const navItems = userType === 'business' ? businessNavItems : customerNavItems;

  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-mansablue text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-mansablue"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
