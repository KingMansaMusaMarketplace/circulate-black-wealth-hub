
import React from 'react';

interface LoginContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ children, header }) => {
  return (
    <div className="w-full max-w-md animate-fade-in">
      {header && (
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {header}
        </div>
      )}

      <div 
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100 animate-fade-in" 
        style={{ animationDelay: '0.2s' }}
      >
        {children}
      </div>
    </div>
  );
};

export default LoginContainer;
