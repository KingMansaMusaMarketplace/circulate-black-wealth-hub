
import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MobileMenuProps {
  onNavigate: () => void;
  onSearchOpen?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate, onSearchOpen }) => {
  const handleLinkClick = (e: React.MouseEvent) => {
    // Ensure the click event propagates properly
    e.stopPropagation();
    onNavigate();
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate();
    onSearchOpen?.();
  };

  const businessItems = [
    { to: '/directory', label: 'Business Directory' },
    { to: '/signup?type=business', label: 'Business Signup' },
    { to: '/business/how-it-works', label: 'How Payments Work' },
    { to: '/corporate-sponsorship', label: 'Sponsorship' },
    { to: '/sales-agent', label: 'Sales Agent Program' },
  ];

  const resourceItems = [
    { to: '/education', label: 'Education Center' },
    { to: '/mentorship', label: 'Mentorship' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/subscription', label: 'Plans' },
    { to: '/support', label: 'Support' },
    { to: '/faq', label: 'FAQ' },
    { to: '/help', label: 'Help Center' },
    { to: '/blog', label: 'Blog' },
  ];

  const mainItems = [
    { to: '/', label: 'Home', alwaysGold: true },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/directory', label: 'Business Directory', alwaysGold: true },
    { to: '/stays', label: 'Vacation Rentals', alwaysGold: true },
    { to: '/partner-portal', label: '🤝 Partner Program', alwaysGold: true },
    { to: '/karma', label: '✨ Karma Dashboard', alwaysGold: true },
    { to: '/susu-circles', label: '💰 Susu Circles', alwaysGold: true },
    { to: '/recommendations', label: 'Discover & Achieve' },
    { to: '/impact', label: '❤️ My Impact', alwaysGold: true },
    { to: '/features', label: 'Features ⚡' },
    { to: '/community', label: 'Community' },
    { to: '/community-finance', label: 'Community Finance' },
    { to: '/challenges', label: 'Group Challenges' },
    { to: '/referrals', label: 'Earn Rewards 🎁' },
    { to: '/share-impact', label: 'Share My Impact 📸' },
    { to: '/social-proof', label: 'Success Stories 🌟' },
    { to: '/network', label: 'My Network 👥' },
    { to: '/about', label: 'About Us' },
    { to: '/scanner', label: 'QR Scanner', dataTour: 'qr-scanner' },
    { to: '/loyalty', label: 'Rewards' },
    { to: '/community-impact', label: 'Community Impact' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="w-full" data-mobile-menu>
      <Card className="mx-4 mt-2 shadow-lg bg-white border border-gray-200">
        <CardContent className="p-4">
          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center gap-3 px-3 py-3 mb-3 text-base font-medium text-gray-700 hover:text-mansagold bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation active:bg-gray-200"
            style={{ minHeight: '48px' }}
          >
            <Search className="h-5 w-5 text-gray-400" />
            <span>Search businesses...</span>
          </button>
          
          <Separator className="mb-3" />
          
          <nav className="space-y-2">
            {/* Main Navigation */}
            {mainItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className={`block px-3 py-3 text-base font-medium ${item.alwaysGold ? 'text-mansagold' : 'text-gray-700'} hover:text-mansagold hover:bg-gray-50 rounded-md transition-colors touch-manipulation active:bg-gray-100`}
                style={{ minHeight: '44px' }}
                data-tour={item.dataTour}
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
                onClick={handleLinkClick}
                className="block px-6 py-3 text-sm text-gray-600 hover:text-mansagold hover:bg-gray-50 rounded-md transition-colors touch-manipulation active:bg-gray-100"
                style={{ minHeight: '44px' }}
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
                onClick={handleLinkClick}
                className="block px-6 py-3 text-sm text-gray-600 hover:text-mansagold hover:bg-gray-50 rounded-md transition-colors touch-manipulation active:bg-gray-100"
                style={{ minHeight: '44px' }}
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
