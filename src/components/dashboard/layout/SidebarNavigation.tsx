
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home,
  Search,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  Building2,
  QrCode,
  TrendingUp,
  BarChart3,
  Award,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

interface SidebarNavigationProps {
  userType?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ userType }) => {
  const location = useLocation();

  const customerNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/directory/enhanced', icon: Search, label: 'Business Directory' },
    { to: '/community', icon: Users, label: 'Community Hub' },
    { to: '/community-impact', icon: TrendingUp, label: 'Community Impact' },
    { to: '/loyalty', icon: Award, label: 'Rewards & Loyalty' },
    { to: '/scanner', icon: QrCode, label: 'QR Scanner' },
    { to: '/help', icon: HelpCircle, label: 'Help Center' },
    { to: '/profile', icon: Settings, label: 'Account Settings' },
  ];

  const businessNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/business/profile', icon: Building2, label: 'Business Profile' },
    { to: '/business/qr-codes', icon: QrCode, label: 'QR Codes' },
    { to: '/business/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/community', icon: Users, label: 'Community Hub' },
    { to: '/community-impact', icon: TrendingUp, label: 'Community Impact' },
    { to: '/help', icon: HelpCircle, label: 'Help Center' },
    { to: '/profile', icon: Settings, label: 'Account Settings' },
  ];

  const salesAgentNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/sales-agent', icon: UserCheck, label: 'Sales Agent Hub' },
    { to: '/directory/enhanced', icon: Search, label: 'Business Directory' },
    { to: '/community', icon: Users, label: 'Community Hub' },
    { to: '/community-impact', icon: TrendingUp, label: 'Community Impact' },
    { to: '/help', icon: HelpCircle, label: 'Help Center' },
    { to: '/profile', icon: Settings, label: 'Account Settings' },
  ];

  const getNavItems = () => {
    switch (userType) {
      case 'business':
        return businessNavItems;
      case 'sales_agent':
        return salesAgentNavItems;
      default:
        return customerNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => (
        <SidebarNavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={location.pathname === item.to}
        />
      ))}
    </nav>
  );
};

export default SidebarNavigation;
