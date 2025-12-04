import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminBreadcrumbProps {
  currentTab: string;
  tabs: { id: string; label: string }[];
}

const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({ currentTab, tabs }) => {
  const currentTabInfo = tabs.find(t => t.id === currentTab);

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        to="/"
        className="flex items-center gap-1 text-blue-200/60 hover:text-blue-200 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      <ChevronRight className="h-4 w-4 text-white/30" />
      
      <span className="text-blue-200/60">Admin</span>
      
      <ChevronRight className="h-4 w-4 text-white/30" />
      
      <span className="text-yellow-400 font-medium">
        {currentTabInfo?.label || 'Dashboard'}
      </span>
    </nav>
  );
};

export default AdminBreadcrumb;
