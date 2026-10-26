import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isHolidaySpecialActive } from '@/components/homepage/HolidayAnnouncementBar';

const BackToButton: React.FC<{ inline?: boolean; showOnHome?: boolean }> = ({ inline = false, showOnHome = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on the homepage
  if (location.pathname === '/' && !showOnHome) return null;

  const handleBack = () => {
    const index = window.history.state?.idx;
    if (typeof index === 'number' && index > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    // While the Holiday banner shows, sit below the banner + menu so it never covers them.
    <div className={inline ? '' : `fixed left-4 z-50 ${isHolidaySpecialActive() ? 'top-36' : 'top-4'}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className={inline ? 'gap-1.5 px-0 text-muted-foreground hover:text-foreground' : 'text-foreground hover:text-foreground hover:bg-accent gap-1.5 backdrop-blur-md bg-background/80 border border-border shadow-lg'}
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Button>
    </div>
  );
};

export default BackToButton;
