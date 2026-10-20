import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ClinicalSiteBack() {
  const navigate = useNavigate();
  const goBack = () => {
    const index = window.history.state?.idx;
    if (typeof index === 'number' && index > 0) navigate(-1);
    else navigate('/health/welcome');
  };
  return <Button variant="ghost" size="sm" onClick={goBack} className="gap-2 px-0"><ArrowLeft className="h-4 w-4" />Go back</Button>;
}