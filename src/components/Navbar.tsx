
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from '@/components/auth/ProfileMenu';
import { Search, MapPin, Users, Crown } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/150432cc-c354-44c5-8b52-771f74dfc018.png" 
              alt="Mansa Musa" 
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="font-spartan font-bold text-xl text-mansablue hidden sm:block">
              Mansa Musa Marketplace
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/directory/enhanced" 
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                isActive('/directory/enhanced') || isActive('/directory')
                  ? 'text-mansablue' 
                  : 'text-gray-600 hover:text-mansablue'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Directory</span>
            </Link>

            <Link 
              to="/how-it-works" 
              className={`text-sm font-medium transition-colors ${
                isActive('/how-it-works') 
                  ? 'text-mansablue' 
                  : 'text-gray-600 hover:text-mansablue'
              }`}
            >
              How It Works
            </Link>

            <Link 
              to="/community" 
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                isActive('/community') 
                  ? 'text-mansablue' 
                  : 'text-gray-600 hover:text-mansablue'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Community</span>
            </Link>

            <Link 
              to="/subscription" 
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                isActive('/subscription') 
                  ? 'text-mansablue' 
                  : 'text-gray-600 hover:text-mansablue'
              }`}
            >
              <Crown className="h-4 w-4" />
              <span>Plans</span>
            </Link>

            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-mansablue' 
                  : 'text-gray-600 hover:text-mansablue'
              }`}
            >
              About
            </Link>

            <Link 
              to="/sponsorship" 
              className={`text-sm font-medium transition-colors ${
                isActive('/sponsorship') 
                  ? 'text-mansablue' 
                  : 'text-gray-600 hover:text-mansablue'
              }`}
            >
              Sponsorship
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.user_type === 'customer' && (
                  <Link to="/scanner">
                    <Button variant="outline" size="sm" className="text-mansablue border-mansablue hover:bg-mansablue hover:text-white">
                      Scan QR
                    </Button>
                  </Link>
                )}
                <ProfileMenu />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-mansablue hover:bg-mansablue-dark">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
