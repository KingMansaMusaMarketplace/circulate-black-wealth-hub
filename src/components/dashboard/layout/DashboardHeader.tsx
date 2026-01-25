
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  mobileNavOpen,
  setMobileNavOpen
}) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3 safe-top">
      <div className="flex justify-between items-center">
        <Link to="/" className="font-mono font-bold text-xl tracking-wider text-primary">
          1325.AI
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="h-10 w-10 touch-manipulation"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
