
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

  return (
    <section id="history" className="py-10 relative overflow-hidden backdrop-blur-xl bg-white/5">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-yellow-500/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className={`container-custom transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-6">
          <h2 className="heading-lg text-white mb-2 relative">
            <span className="relative inline-block">
              The Legacy Behind Our Name
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></span>
            </span>
          </h2>
          <p className="text-white/90 max-w-3xl mx-auto text-lg">
            Mansa Musa Marketplace is inspired by the legendary African ruler who exemplifies wealth circulation and community empowerment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:order-2">
            <div className="backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg">
              <h3 className="text-yellow-400 text-xl font-bold mb-3">Mansa Musa: The Wealthiest Person in History</h3>
              <p className="text-white/90 mb-3 leading-relaxed">
                In the 14th century, Mansa Musa ruled the Mali Empire with wealth that, adjusted for inflation, would make him the richest person in history. His empire controlled more than half the world's supply of gold and salt.
              </p>
              <p className="text-white/90 mb-3 leading-relaxed">
                During his famous pilgrimage to Mecca in 1324, he distributed so much gold along his journey that he temporarily collapsed the value of gold in Egypt.
              </p>
              <p className="text-white/90 leading-relaxed">
                What's remarkable wasn't just his wealth, but how he used it - building universities, mosques, and infrastructure that created lasting prosperity for his kingdom and people.
              </p>
            </div>
          </div>
          <InfoSection />
        </div>
      </div>
    </section>
  );
};

export default MansaMusaHistory;
