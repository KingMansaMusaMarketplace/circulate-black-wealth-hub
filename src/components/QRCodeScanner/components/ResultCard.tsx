
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultCardProps {
  children: React.ReactNode;
  title: string;
  titleColor?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  children, 
  title,
  titleColor = 'text-gray-900' 
}) => {
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in-up glass-card">
      <CardHeader className="pb-2 pt-6">
        <CardTitle className={`text-center text-xl ${titleColor}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
