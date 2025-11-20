
import React from 'react';

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  location?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon, location }) => {
  return (
    <div className="mb-2">
      <h1 className="text-2xl font-bold flex items-center text-white">
        {icon}
        {title}
      </h1>
      {location && (
        <p className="mt-1 text-sm text-white/70">{location}</p>
      )}
    </div>
  );
};

export default PageHeader;
