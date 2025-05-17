
import React from 'react';

export type LogoVariant = 'default' | 'crown' | 'coins' | 'silhouette' | 'interlocking';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface MansaMusaLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const MansaMusaLogo: React.FC<MansaMusaLogoProps> = ({ 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  // Size mapping
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Common styles
  const baseClasses = `${sizeClasses[size]} ${className}`;

  // Variant: Default - Modern "MM" with circulation symbol
  if (variant === 'default') {
    return (
      <div className={`relative ${baseClasses}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBA53A" />
              <stop offset="100%" stopColor="#F8E3A3" />
            </linearGradient>
          </defs>
          {/* Circle background */}
          <circle cx="50" cy="50" r="45" fill="#0F2876" />
          
          {/* Gold crown */}
          <path d="M30,35 L70,35 L75,25 L65,30 L55,20 L45,30 L35,20 L25,30 L30,35" 
                fill="url(#goldGradient)" stroke="#0A1D5C" strokeWidth="1" />
          
          {/* Stylized MM */}
          <path d="M30,45 L35,45 L40,55 L45,45 L50,45 L50,65 L45,65 L45,50 L40,60 L35,50 L35,65 L30,65 Z" 
                fill="white" />
          <path d="M55,45 L60,45 L65,55 L70,45 L75,45 L75,65 L70,65 L70,50 L65,60 L60,50 L60,65 L55,65 Z" 
                fill="white" />
          
          {/* Circulation arrows */}
          <path d="M20,75 C35,85 65,85 80,75" stroke="url(#goldGradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M80,70 L85,75 L80,80" fill="url(#goldGradient)" stroke="url(#goldGradient)" strokeWidth="1" />
          <path d="M20,70 L15,75 L20,80" fill="url(#goldGradient)" stroke="url(#goldGradient)" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // Variant: Crown logo
  if (variant === 'crown') {
    return (
      <div className={`relative ${baseClasses}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBA53A" />
              <stop offset="100%" stopColor="#F8E3A3" />
            </linearGradient>
          </defs>
          {/* Circle background */}
          <circle cx="50" cy="50" r="45" fill="#0F2876" />
          
          {/* Gold crown */}
          <path d="M20,40 L80,40 L85,25 L70,35 L50,20 L30,35 L15,25 L20,40" 
                fill="url(#goldGradient2)" stroke="#0A1D5C" strokeWidth="2" />
          
          {/* Crown jewels */}
          <circle cx="50" cy="32" r="4" fill="#0F2876" />
          <circle cx="30" cy="35" r="3" fill="#0F2876" />
          <circle cx="70" cy="35" r="3" fill="#0F2876" />
          
          {/* Marketplace text */}
          <text x="50" y="65" fontFamily="'League Spartan', sans-serif" fontSize="14" 
                fontWeight="bold" fill="white" textAnchor="middle">MANSA</text>
          <text x="50" y="80" fontFamily="'League Spartan', sans-serif" fontSize="12" 
                fontWeight="normal" fill="white" textAnchor="middle">MARKETPLACE</text>
        </svg>
      </div>
    );
  }

  // Variant: Gold coins
  if (variant === 'coins') {
    return (
      <div className={`relative ${baseClasses}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBA53A" />
              <stop offset="100%" stopColor="#F8E3A3" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F2876" />
              <stop offset="100%" stopColor="#19A7CE" />
            </linearGradient>
          </defs>
          {/* Base blue circle */}
          <circle cx="50" cy="50" r="45" fill="url(#blueGradient)" />
          
          {/* Coins in circulation */}
          <circle cx="35" cy="35" r="15" fill="url(#goldGradient3)" stroke="#0A1D5C" strokeWidth="1" />
          <circle cx="65" cy="35" r="12" fill="url(#goldGradient3)" stroke="#0A1D5C" strokeWidth="1" />
          <circle cx="50" cy="65" r="18" fill="url(#goldGradient3)" stroke="#0A1D5C" strokeWidth="1" />
          
          {/* Coin details */}
          <text x="35" y="38" fontFamily="'League Spartan', sans-serif" fontSize="14" 
                fontWeight="bold" fill="#0F2876" textAnchor="middle">MM</text>
          <text x="65" y="38" fontFamily="'League Spartan', sans-serif" fontSize="10" 
                fontWeight="bold" fill="#0F2876" textAnchor="middle">MM</text>
          <text x="50" y="68" fontFamily="'League Spartan', sans-serif" fontSize="16" 
                fontWeight="bold" fill="#0F2876" textAnchor="middle">MM</text>
        </svg>
      </div>
    );
  }

  // Variant: Silhouette logo
  if (variant === 'silhouette') {
    return (
      <div className={`relative ${baseClasses}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBA53A" />
              <stop offset="100%" stopColor="#F8E3A3" />
            </linearGradient>
          </defs>
          {/* Circle background */}
          <circle cx="50" cy="50" r="45" fill="#0F2876" />
          
          {/* Map outline in gold */}
          <path d="M20,30 C25,25 35,35 40,25 C45,20 55,30 60,25 C65,20 70,25 80,30 
                   C85,40 75,50 80,60 C75,70 65,65 55,70 C50,75 40,70 30,75 C20,70 15,60 20,50 Z" 
                fill="none" stroke="url(#goldGradient4)" strokeWidth="2" opacity="0.6" />
          
          {/* Mansa Musa silhouette */}
          <path d="M40,30 C40,25 45,20 50,20 C55,20 60,25 60,30 
                   C60,32 58,35 58,35 L58,40 C58,42 60,45 60,50 
                   C60,55 58,60 55,65 C52,70 48,70 45,65 C42,60 40,55 40,50 
                   C40,45 42,42 42,40 L42,35 C42,35 40,32 40,30 Z" 
                fill="black" />
          
          {/* Crown */}
          <path d="M40,30 L60,30 L55,20 L50,25 L45,20 L40,30" 
                fill="url(#goldGradient4)" stroke="#0A1D5C" strokeWidth="1" />
          
          <text x="50" y="85" fontFamily="'League Spartan', sans-serif" fontSize="12" 
                fontWeight="bold" fill="white" textAnchor="middle">MANSA MUSA</text>
        </svg>
      </div>
    );
  }

  // Variant: Interlocking M's
  if (variant === 'interlocking') {
    return (
      <div className={`relative ${baseClasses}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBA53A" />
              <stop offset="100%" stopColor="#F8E3A3" />
            </linearGradient>
          </defs>
          {/* Circle background */}
          <circle cx="50" cy="50" r="45" fill="white" />
          
          {/* First M in blue */}
          <path d="M20,30 L30,30 L40,50 L50,30 L60,30 L60,70 L50,70 L50,50 L40,70 L30,50 L30,70 L20,70 Z" 
                fill="#0F2876" />
          
          {/* Second M in gold, slightly offset */}
          <path d="M30,40 L40,40 L50,60 L60,40 L70,40 L70,80 L60,80 L60,60 L50,80 L40,60 L40,80 L30,80 Z" 
                fill="url(#goldGradient5)" opacity="0.9" />
        </svg>
      </div>
    );
  }

  // Fallback to default if variant is not recognized
  return (
    <div className={`relative ${baseClasses}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="#0F2876" />
        <text x="50" y="55" fontFamily="'League Spartan', sans-serif" fontSize="24" 
              fontWeight="bold" fill="white" textAnchor="middle">MM</text>
      </svg>
    </div>
  );
};

export default MansaMusaLogo;
