
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  to,
  icon,
  children,
  isActive
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-2 py-2 text-sm rounded-md",
        isActive
          ? "bg-gray-100 text-mansablue font-medium"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "mr-3 h-5 w-5" })}
      {children}
    </Link>
  );
};

export default SidebarNavItem;
