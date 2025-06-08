
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from '@/components/auth/ProfileMenu';
import { Search, MapPin, Users, Crown, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { to: '/directory/enhanced', label: 'Directory', icon: Search },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/community', label: 'Community', icon: Users },
    { to: '/subscription', label: 'Plans', icon: Crown },
    { to: '/about', label: 'About' },
    { to: '/sponsorship', label: 'Sponsorship' },
  ];

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                  isActive(item.to) || (item.to === '/directory/enhanced' && isActive('/directory'))
                    ? 'text-mansablue' 
                    : 'text-gray-600 hover:text-mansablue'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile + Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <img 
                      src="/lovable-uploads/150432cc-c354-44c5-8b52-771f74dfc018.png" 
                      alt="Mansa Musa" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-bold text-mansablue">Mansa Musa</span>
                  </div>
                  
                  {navigationItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive(item.to) || (item.to === '/directory/enhanced' && isActive('/directory'))
                          ? 'bg-mansablue text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                  
                  {/* Mobile Auth Section */}
                  <div className="pt-4 border-t">
                    {user ? (
                      <div className="space-y-3">
                        {user.user_metadata?.user_type === 'customer' && (
                          <Link 
                            to="/scanner"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                          >
                            <Search className="h-5 w-5" />
                            <span>Scan QR</span>
                          </Link>
                        )}
                        <div className="px-3">
                          <ProfileMenu />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Log In
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
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
      </div>
    </nav>
  );
};

export default Navbar;
