
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ResultItemProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  bgColor?: string;
  textColor?: string;
}

const ResultItem: React.FC<ResultItemProps> = ({ 
  label, 
  value, 
  icon: Icon,
  bgColor = "bg-gray-50",
  textColor = "text-gray-600" 
}) => {
  return (
    <div className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}>
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-2 ${textColor}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={`font-medium ${textColor}`}>{value}</span>
    </div>
  );
};

export default ResultItem;
