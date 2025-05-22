
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
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
      
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className={`container mx-auto px-4 ${containerClassName}`}>
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResponsiveLayout;
