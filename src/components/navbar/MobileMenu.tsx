
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, LogOut, QrCode, Award, Settings, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoyaltyPointsIndicator } from '@/components/loyalty/LoyaltyPointsIndicator';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  signOut: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user, signOut }) => {
  const location = useLocation();

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Directory", path: "/directory" },
    { name: "Corporate Sponsorship", path: "/corporate-sponsorship" },
    { name: "FAQ", path: "/faq" }
  ];

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", icon: User },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Loyalty Program", path: "/loyalty", icon: Award },
    { name: "QR Scanner", path: "/qr-scanner", icon: QrCode },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  const businessLinks = [
    { name: "Business Profile", path: "/business-profile", icon: Building },
    { name: "QR Management", path: "/qr-management", icon: QrCode },
    { name: "Sales Agent", path: "/sales-agent", icon: User }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop with touch handling */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
        onTouchStart={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-mansablue">Menu</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="touch-manipulation"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* User Section */}
          {user ? (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.name} />
                  <AvatarFallback className="bg-mansablue text-white">
                    {user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user?.user_metadata?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <LoyaltyPointsIndicator />
            </div>
          ) : (
            <div className="mb-6 space-y-2">
              <Link to="/login" onClick={handleLinkClick}>
                <Button className="w-full bg-mansablue hover:bg-mansablue-dark touch-manipulation">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full touch-manipulation">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="pb-2 mb-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Navigate
              </h3>
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`block px-3 py-3 text-base rounded-md transition-colors touch-manipulation
                    ${location.pathname === link.path
                      ? "text-mansablue bg-mansablue/10 font-semibold"
                      : "text-gray-700 hover:text-mansablue hover:bg-gray-50 active:bg-gray-100"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* User-specific links */}
            {user && (
              <>
                <div className="pb-2 mb-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Account
                  </h3>
                  {userLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 px-3 py-3 text-base rounded-md transition-colors touch-manipulation
                        ${location.pathname === link.path
                          ? "text-mansablue bg-mansablue/10 font-semibold"
                          : "text-gray-700 hover:text-mansablue hover:bg-gray-50 active:bg-gray-100"
                        }`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="pb-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Business
                  </h3>
                  {businessLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 px-3 py-3 text-base rounded-md transition-colors touch-manipulation
                        ${location.pathname === link.path
                          ? "text-mansablue bg-mansablue/10 font-semibold"
                          : "text-gray-700 hover:text-mansablue hover:bg-gray-50 active:bg-gray-100"
                        }`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  ))}
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-3 py-3 text-base text-red-600 hover:bg-red-50 active:bg-red-100 rounded-md transition-colors touch-manipulation"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
