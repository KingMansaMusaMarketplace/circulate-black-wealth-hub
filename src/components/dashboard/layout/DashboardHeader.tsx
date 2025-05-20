
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
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-mansablue">
          Mansa Musa
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? <X /> : <Menu />}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
