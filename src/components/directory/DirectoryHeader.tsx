
import React from 'react';

interface DirectoryHeaderProps {
  title: string;
  description?: string;
}

const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-mansablue mb-4">{title}</h1>
      {description && (
        <p className="text-gray-600 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default DirectoryHeader;
