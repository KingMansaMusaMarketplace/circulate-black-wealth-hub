
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MobileMenuProps {
  onNavigate: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate }) => {
  const businessItems = [
    { to: '/directory', label: 'Business Directory' },
    { to: '/signup?type=business', label: 'Business Signup' },
    { to: '/sponsorship', label: 'Sponsorship' },
    { to: '/sales-agent', label: 'Sales Agent Program' },
  ];

  const resourceItems = [
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/subscription', label: 'Plans' },
    { to: '/faq', label: 'FAQ' },
    { to: '/help', label: 'Help Center' },
    { to: '/blog', label: 'Blog' },
  ];

  const mainItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/community', label: 'Community' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="w-full" data-mobile-menu>
      <Card className="mx-4 mt-2 shadow-lg bg-white border border-gray-200">
        <CardContent className="p-4 max-h-[80vh] overflow-y-auto">
          <nav className="space-y-2">
            {/* Main Navigation */}
            {mainItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-mansagold hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            <Separator className="my-3" />
            
            {/* For Businesses Section */}
            <div className="px-3 py-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                For Businesses
              </h3>
            </div>
            {businessItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className="block px-6 py-2 text-sm text-gray-600 hover:text-mansagold hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            <Separator className="my-3" />
            
            {/* Resources Section */}
            <div className="px-3 py-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Resources
              </h3>
            </div>
            {resourceItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className="block px-6 py-2 text-sm text-gray-600 hover:text-mansagold hover:bg-gray-50 rounded-md transition-colors"
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
