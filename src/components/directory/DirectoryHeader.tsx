import React from 'react';

interface DirectoryHeaderProps {
  title: string;
  description?: string;
}

const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h1>
      <div className="h-px w-16 bg-mansagold mb-4" />
      {description && (
        <p className="font-body text-slate-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default DirectoryHeader;
