
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  to,
  icon: Icon,
  label,
  isActive
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
        isActive
          ? "bg-blue-500/20 text-blue-400 font-medium"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="mr-3 h-5 w-5" />
      {label}
    </Link>
  );
};

export default SidebarNavItem;
