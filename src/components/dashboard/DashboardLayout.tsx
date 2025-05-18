
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Store, 
  User, 
  Award, 
  QrCode, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/lib/auth-operations';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  location?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  icon,
  location
}) => {
  const { user } = useAuth();
  const pathname = useLocation().pathname;
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  // Perform sign out
  const onSignOut = async () => {
    await handleSignOut((props) => toast(props));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile navigation toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-mansablue">
            Mansa Musa
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-20 transform bg-white shadow-lg w-64 transition-transform duration-200 ease-in-out",
        mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-0"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-5 border-b">
            <Link to="/" className="text-2xl font-bold text-mansablue flex items-center">
              Mansa Musa
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md",
                pathname === "/dashboard"
                  ? "bg-gray-100 text-mansablue font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>

            <Link
              to="/business-profile"
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md",
                pathname === "/business-profile"
                  ? "bg-gray-100 text-mansablue font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Store className="mr-3 h-5 w-5" />
              Business Profile
            </Link>

            <Link
              to="/profile"
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md",
                pathname === "/profile"
                  ? "bg-gray-100 text-mansablue font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <User className="mr-3 h-5 w-5" />
              User Profile
            </Link>

            <Link
              to="/loyalty-history"
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md",
                pathname === "/loyalty-history"
                  ? "bg-gray-100 text-mansablue font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Award className="mr-3 h-5 w-5" />
              Loyalty Program
            </Link>

            <Link
              to="/qr-code-management"
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md",
                pathname === "/qr-code-management"
                  ? "bg-gray-100 text-mansablue font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <QrCode className="mr-3 h-5 w-5" />
              QR Code Management
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to="/settings"
                className="flex items-center px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>

              <button
                onClick={onSignOut}
                className="flex w-full items-center px-2 py-2 mt-1 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log out
              </button>
            </div>
          </nav>
          
          {/* User info */}
          <div className="p-4 border-t flex items-center">
            <div className="w-10 h-10 rounded-full bg-mansablue/20 flex items-center justify-center text-mansablue font-medium mr-3">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-gray-500">Business Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 lg:ml-64 pt-4",
        mobileNavOpen ? "lg:mr-0" : "mr-0",
      )}>
        <main className="px-4 sm:px-6 lg:px-8 py-8 mt-10 lg:mt-0">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center text-gray-900">
              {icon}
              {title}
            </h1>
            {location && (
              <p className="mt-1 text-sm text-gray-500">{location}</p>
            )}
          </div>
          
          {/* Page content */}
          {children}
        </main>
      </div>
      
      {/* Mobile nav backdrop */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-10 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
