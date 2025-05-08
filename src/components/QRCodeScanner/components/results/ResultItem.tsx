
import React from 'react';

interface ResultItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ResultItem: React.FC<ResultItemProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="flex items-start space-x-3 p-3 bg-white rounded-md border border-gray-100 shadow-sm">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default ResultItem;
