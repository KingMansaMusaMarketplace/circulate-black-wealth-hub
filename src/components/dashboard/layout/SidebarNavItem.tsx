
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  href,
  icon: Icon,
  label
}) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-2 py-2 text-sm rounded-md",
        isActive
          ? "bg-gray-100 text-mansablue font-medium"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <Icon className="mr-3 h-5 w-5" />
      {label}
    </Link>
  );
};

export default SidebarNavItem;
