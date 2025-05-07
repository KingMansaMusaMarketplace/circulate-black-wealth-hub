
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  location?: string;
  icon?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title,
  location = "Atlanta, GA",
  icon
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container-custom py-6 flex-grow relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-mansablue/5 blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-mansagold/5 blur-xl"></div>
        </div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h1 className="text-2xl font-bold text-mansablue-dark flex items-center gap-2">
            {icon}
            {title}
          </h1>
          {location && (
            <div className="flex items-center text-sm text-gray-600 bg-white p-2 rounded-md shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-4 w-4"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{location}</span>
            </div>
          )}
        </div>
        
        {/* Card-like container with subtle shadow */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 relative">
          {/* Subtle decorative corner */}
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-4 h-4 bg-mansablue/10 transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {children}
        </div>
        
        {/* Decorative elements at the bottom */}
        <div className="flex justify-center mt-10 opacity-30">
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-1 rounded-full ${i === 1 ? 'w-6 bg-mansablue' : 'w-2 bg-mansablue/50'}`}></div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
