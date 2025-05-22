
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const links = [
    { name: "Home", path: "/" },
    { name: "Directory", path: "/directory" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Loyalty Program", path: "/loyalty" },
    { name: "Corporate Sponsorship", path: "/corporate-sponsorship" },
    { name: "Sales Agent", path: "/sales-agent" },
    { name: "FAQ", path: "/faq" },
    { name: "About Us", path: "/about-us" },
    { name: "Our Team", path: "/our-team" }
  ];

  return (
    <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className="text-gray-600 hover:text-mansablue px-4 py-2 rounded-md hover:bg-gray-50"
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
