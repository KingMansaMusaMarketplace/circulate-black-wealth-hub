
import React from 'react';
import { Helmet } from 'react-helmet';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  containerClassName?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  description,
  className = '',
  containerClassName = ''
}) => {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <Helmet>
        {title && <title>{title} | Mansa Musa Marketplace</title>}
        {description && <meta name="description" content={description} />}
      </Helmet>
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className={`container mx-auto px-4 ${containerClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResponsiveLayout;
