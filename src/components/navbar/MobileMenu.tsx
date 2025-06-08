
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';

interface MobileMenuProps {
  onNavigate: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate }) => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = () => {
    setOpen(false);
    onNavigate();
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    onNavigate();
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col space-y-4 mt-8">
            <Link 
              to="/" 
              className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleLinkClick}
            >
              About Us
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleLinkClick}
            >
              How It Works
            </Link>
            <Link 
              to="/directory" 
              className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleLinkClick}
            >
              Directory
            </Link>
            <Link 
              to="/community" 
              className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleLinkClick}
            >
              Community
            </Link>
            <Link 
              to="/sponsorship" 
              className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleLinkClick}
            >
              Sponsorship
            </Link>
            
            <div className="border-t pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <Link 
                    to="/dashboard" 
                    className="block text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={handleLinkClick}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={handleLinkClick}
                  >
                    Profile
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="w-full text-left justify-start"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={handleLinkClick}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={handleLinkClick}>
                    <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
