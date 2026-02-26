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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="text-muted-foreground hover:text-foreground gap-1.5 mb-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};

export default BackToButton;
