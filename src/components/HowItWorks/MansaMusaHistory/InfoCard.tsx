
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface InfoCardProps {
  title: string;
  content: string;
  borderColor: string;
  showIcon?: boolean;
}

const InfoCard = ({ title, content, borderColor, showIcon = false }: InfoCardProps) => {
  return (
    <div className={`bg-[#1E1E1E] p-6 rounded-xl border-l-4 border-${borderColor} shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-5px]`}>
      <h3 className="text-xl font-bold mb-3 text-white flex items-center">
        {title}
        {showIcon && <ChevronRight className="h-5 w-5 text-[#FFD700] ml-2" />}
      </h3>
      <p className="text-gray-300">
        {content}
      </p>
    </div>
  );
};

export default InfoCard;
