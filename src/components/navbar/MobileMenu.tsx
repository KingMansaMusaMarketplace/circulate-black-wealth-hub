
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface MobileMenuProps {
  onNavigate: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate }) => {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/directory', label: 'Directory' },
    { to: '/community', label: 'Community' },
    { to: '/sponsorship', label: 'Sponsorship' },
  ];

  return (
    <div className="fixed inset-x-0 top-16 z-40 md:hidden">
      <Card className="mx-4 mt-2">
        <CardContent className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-mansagold hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileMenu;
