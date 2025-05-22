
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  Store, 
  User, 
  Award, 
  QrCode, 
  Settings, 
  LogOut,
  Users
} from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';
import { toast } from 'sonner';
import { handleSignOut } from '@/lib/auth-operations';

const SidebarNavigation: React.FC = () => {
  const pathname = useLocation().pathname;
  
  // Perform sign out
  const onSignOut = async () => {
    await handleSignOut((message: string) => toast(message));
  };

  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <SidebarNavItem 
        to="/dashboard" 
        icon={<Home />} 
        isActive={pathname === "/dashboard"}
      >
        Dashboard
      </SidebarNavItem>

      <SidebarNavItem 
        to="/business-profile" 
        icon={<Store />} 
        isActive={pathname === "/business-profile"}
      >
        Business Profile
      </SidebarNavItem>

      <SidebarNavItem 
        to="/profile" 
        icon={<User />} 
        isActive={pathname === "/profile"}
      >
        User Profile
      </SidebarNavItem>

      <SidebarNavItem 
        to="/loyalty-history" 
        icon={<Award />} 
        isActive={pathname === "/loyalty-history"}
      >
        Loyalty Program
      </SidebarNavItem>

      <SidebarNavItem 
        to="/qr-code-management" 
        icon={<QrCode />} 
        isActive={pathname === "/qr-code-management"}
      >
        QR Code Management
      </SidebarNavItem>

      <SidebarNavItem 
        to="/sales-agent" 
        icon={<Users />} 
        isActive={pathname === "/sales-agent"}
      >
        Sales Agent
      </SidebarNavItem>

      <div className="pt-4 mt-4 border-t border-gray-200">
        <SidebarNavItem 
          to="/settings" 
          icon={<Settings />} 
          isActive={pathname === "/settings"}
        >
          Settings
        </SidebarNavItem>

        <button
          onClick={onSignOut}
          className="flex w-full items-center px-2 py-2 mt-1 text-sm rounded-md text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </button>
      </div>
    </nav>
  );
};

export default SidebarNavigation;
