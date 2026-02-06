
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      {/* Mobile navigation toggle */}
      <DashboardHeader 
        mobileNavOpen={mobileNavOpen} 
        setMobileNavOpen={setMobileNavOpen} 
      />

      {/* Sidebar */}
      <Sidebar 
        user={user} 
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Main content */}
      <div className={cn(
        "flex-1 lg:ml-64 relative z-10",
        mobileNavOpen ? "lg:mr-0" : "mr-0",
      )}>
        <main className="px-4 sm:px-6 lg:px-8 pt-16 lg:pt-4">
          {/* Page header */}
          <PageHeader title={title} icon={icon} location={location} />
          
          {/* Page content */}
          <div className="space-y-3">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile nav backdrop */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-10 lg:hidden animate-fade-in"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
