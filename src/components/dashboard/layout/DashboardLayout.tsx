
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  location?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  icon,
  location
}) => {
  const { user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  // Fix scrolling behavior when navigating between pages on mobile
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile navigation toggle */}
      <DashboardHeader 
        mobileNavOpen={mobileNavOpen} 
        setMobileNavOpen={setMobileNavOpen} 
      />

      {/* Sidebar */}
      <Sidebar 
        user={user as any} 
        mobileNavOpen={mobileNavOpen} 
      />

      {/* Main content */}
      <div className={cn(
        "flex-1 lg:ml-64 pt-4",
        mobileNavOpen ? "lg:mr-0" : "mr-0",
      )}>
        <main className="px-4 sm:px-6 lg:px-8 mt-10 lg:mt-0">
          {/* Page header */}
          <PageHeader title={title} icon={icon} location={location} />
          
          {/* Page content */}
          {children}
        </main>
      </div>
      
      {/* Mobile nav backdrop */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-10 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
