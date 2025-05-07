
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import HistoryPanel from './MansaMusaHistory/HistoryPanel';
import InfoSection from './MansaMusaHistory/InfoSection';

const MansaMusaHistory = () => {
  // Add a subtle animation effect when component mounts
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Carefully selected gold-themed images with confirmed working URLs
  const images = [
    {
      src: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151",
      alt: "Desert landscape representing the Sahara routes of Mali",
      caption: "The Sahara desert routes traveled by Mansa Musa"
    },
    {
      src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
      alt: "Camels crossing desert landscape",
      caption: "Caravan travel during Mansa Musa's era"
    },
    {
      src: "https://images.unsplash.com/photo-1543699565-003b8adda5fc",
      alt: "Gold coins and pieces",
      caption: "Gold wealth from Mali's empire"
    },
    {
      src: "https://images.unsplash.com/photo-1610375461249-b6f5255f1638",
      alt: "Gold bars close-up",
      caption: "Gold from Mali's legendary mines"
    },
    {
      src: "https://images.unsplash.com/photo-1423592707957-3b212afa6733",
      alt: "Gold dust and nuggets",
      caption: "Gold dust representing Mali's wealth"
    }
  ];

  return (
    <section className="py-20 bg-[#121212] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#FFD700]/10 to-transparent"></div>
      </div>
      
      <div className={`container-custom transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-12">
          <h2 className="heading-lg text-[#FFD700] mb-4 relative">
            <span className="relative inline-block">
              The Legacy Behind Our Name
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700] to-[#FFD700]/0"></span>
            </span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Mansa Musa Marketplace is inspired by the legendary African ruler who exemplifies wealth circulation and community empowerment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <HistoryPanel images={images} />
          <InfoSection />
        </div>
      </div>
    </section>
  );
};

export default MansaMusaHistory;
