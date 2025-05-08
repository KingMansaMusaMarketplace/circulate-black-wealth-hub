
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultCardProps {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  titleColor = "text-gray-900", 
  children, 
  icon 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        {icon && (
          <div className="flex justify-center mb-4">
            {icon}
          </div>
        )}
        <CardTitle className={titleColor}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
