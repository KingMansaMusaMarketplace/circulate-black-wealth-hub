
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Directory", path: "/directory" },
    { name: "Loyalty Program", path: "/loyalty" },
    { name: "Corporate Sponsorship", path: "/corporate-sponsorship" },
    { name: "Sales Agent", path: "/sales-agent" },
    { name: "FAQ", path: "/faq" }
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="px-4 py-4">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors
                ${location.pathname === link.path
                  ? "text-mansablue bg-mansablue/10 font-semibold"
                  : "text-gray-700 hover:text-mansablue hover:bg-gray-50"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
