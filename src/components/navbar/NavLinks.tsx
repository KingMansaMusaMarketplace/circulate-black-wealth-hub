
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ className = "", onClick }) => {
  const location = useLocation();
  
  const links = [
    { name: "Home", path: "/" },
    { name: "Directory", path: "/directory" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Loyalty Program", path: "/loyalty" },
    { name: "Corporate Sponsorship", path: "/corporate-sponsorship" },
    { name: "Sales Agent", path: "/sales-agent" },
    { name: "FAQ", path: "/faq" },
    { name: "About Us", path: "/about-us" }
  ];
  
  return (
    <nav className={`hidden md:flex items-center space-x-4 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={`text-sm font-medium px-2 py-1 rounded-md transition-colors
            ${location.pathname === link.path
              ? "text-mansablue"
              : "text-gray-600 hover:text-mansablue hover:bg-gray-50"
            }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
