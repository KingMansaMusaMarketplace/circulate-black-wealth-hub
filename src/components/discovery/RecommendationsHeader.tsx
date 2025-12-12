
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecommendationsHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-center animate-slide-in-right">
        <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-mansagold to-yellow-400">Recommended For You</h2>
        <Button variant="link" className="text-white hover:text-mansagold hover:scale-105 transition-transform" onClick={() => navigate('/directory')}>
          View All
        </Button>
      </div>
    </>
  );
};

export const RecommendationsFooter: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center mt-6 animate-fade-in">
      <Button variant="outline" className="flex items-center gap-2 hover:scale-105 transition-all border-white/20 bg-gradient-to-r from-mansablue to-blue-600 hover:from-blue-700 hover:to-mansablue text-white" onClick={() => navigate('/directory')}>
        <TrendingUp className="h-4 w-4" />
        More Recommendations
      </Button>
    </div>
  );
};

export default RecommendationsHeader;
