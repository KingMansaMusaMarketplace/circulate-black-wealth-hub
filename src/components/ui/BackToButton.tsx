import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on the homepage
  if (location.pathname === '/') return null;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="text-white/80 hover:text-white hover:bg-white/15 gap-1.5 backdrop-blur-md bg-black/30 border border-white/10 shadow-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </div>
  );
};

export default BackToButton;
