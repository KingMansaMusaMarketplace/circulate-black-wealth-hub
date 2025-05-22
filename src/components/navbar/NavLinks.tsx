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
    { name: "About Us", path: "/about-us" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Directory", path: "/directory" },
    { name: "Loyalty Program", path: "/loyalty" },
    { name: "Corporate Sponsorship", path: "/corporate-sponsorship" },
    { name: "Sales Agent", path: "/sales-agent" },
    { name: "FAQ", path: "/faq" }
  ];
  
  return (
    <nav className={`hidden md:flex items-center space-x-6 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={`text-sm font-medium transition-colors hover:text-mansablue relative group
            ${location.pathname === link.path
              ? "text-mansablue"
              : "text-gray-700"
            }`}
        >
          {link.name}
          <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-mansablue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 
            ${location.pathname === link.path ? "scale-x-100" : ""}`}></span>
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
