
import React, { useState, useEffect } from 'react';
import { Landmark, ImageOff, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MansaMusaHistory = () => {
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('legacy');
  const isMobile = useIsMobile();
  
  // Add a subtle animation effect when component mounts
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Updated image array with corrected images
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
      src: "https://images.unsplash.com/photo-1610375461249-b6f5255f1638",
      alt: "Gold bars representing Mansa Musa's wealth",
      caption: "Gold bars symbolizing the vast wealth of Mali"
    },
    {
      src: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375",
      alt: "Gold nuggets and dust",
      caption: "Raw gold from Mali's legendary mines"
    },
    {
      src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
      alt: "Natural landscape representing West African terrain",
      caption: "The diverse terrain of the Mali Empire"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasImageLoadError, setHasImageLoadError] = useState(false);

  const changeImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      // Reset the error state when changing images
      setHasImageLoadError(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(changeImage, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = images[currentImageIndex];

  const handleImageError = () => {
    setHasImageLoadError(true);
    // Try the next image after a short delay
    setTimeout(() => {
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }, 500);
  };

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
          <div className="bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
            <div className="bg-[#262626] p-6 text-white flex items-center border-b border-[#333333]">
              <Landmark className="h-8 w-8 mr-3 text-[#FFD700]" />
              <h3 className="text-2xl font-bold">Mansa Musa of Mali (c. 1280-1337)</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
                  <div className="md:w-1/3 relative group">
                    {hasImageLoadError ? (
                      <div className="rounded-lg bg-gray-800 h-64 w-full flex items-center justify-center">
                        <div className="text-center p-4">
                          <ImageOff className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-400">Image temporarily unavailable</p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg shadow-md relative">
                        <img 
                          src={currentImage.src}
                          alt={currentImage.alt}
                          className="rounded-lg w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-3 text-sm">{currentImage.caption}</p>
                        </div>
                      </div>
                    )}
                    {!hasImageLoadError && (
                      <p className="text-xs text-gray-400 mt-2 italic text-center">{currentImage.caption}</p>
                    )}
                  </div>
                  <div className="md:w-2/3">
                    <p className="mb-4 text-gray-200">
                      <span className="font-bold text-[#FFD700]">The Richest Person in History:</span> Mansa Musa was the Emperor of the Mali Empire in West Africa 
                      and is widely considered to be the wealthiest individual to have ever lived. His wealth was so vast that historians 
                      have difficulty calculating it in modern terms, but estimates place his fortune at an equivalent of $400 billion.
                    </p>
                    <p className="text-gray-200">
                      <span className="font-bold text-[#FFD700]">Economic Impact:</span> During his famous pilgrimage to Mecca in 1324, Mansa Musa's generosity 
                      and spending were so significant that they caused inflation in the economies of Cairo, Medina, and Mecca due to the 
                      amount of gold he distributed.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-[#333333] pt-4">
                  <div className="flex space-x-4 mb-4">
                    <button 
                      className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'legacy' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-gray-400 hover:bg-[#333333]'}`}
                      onClick={() => setActiveTab('legacy')}
                    >
                      Legacy
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'community' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-gray-400 hover:bg-[#333333]'}`}
                      onClick={() => setActiveTab('community')}
                    >
                      Community
                    </button>
                  </div>
                  
                  <div className="min-h-[120px]">
                    {activeTab === 'legacy' && (
                      <div className="animate-fade-in">
                        <p className="text-gray-200">
                          <span className="font-bold text-[#FFD700]">Community Investment:</span> He built mosques, universities, and other institutions throughout 
                          his empire, including the famous Djinguereber Mosque in Timbuktu. Under his rule, Timbuktu became a center of education, 
                          commerce, and Islamic scholarship.
                        </p>
                      </div>
                    )}
                    
                    {activeTab === 'community' && (
                      <div className="animate-fade-in">
                        <p className="text-gray-200">
                          <span className="font-bold text-[#FFD700]">Legacy of Circulation:</span> Mansa Musa's approach to wealth was not merely about accumulation but 
                          circulation. He invested in his community, sponsored arts and education, and helped establish Mali as a cultural and economic 
                          powerhouse.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border-l-4 border-[#FFD700] shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-5px]">
              <h3 className="text-xl font-bold mb-3 text-white">Our Inspiration</h3>
              <p className="text-gray-300">
                Mansa Musa Marketplace draws inspiration from this legacy of economic power coupled with community reinvestment. 
                Just as Mansa Musa's wealth strengthened his empire, we believe the collective economic power of Black communities 
                can be harnessed to build generational wealth and opportunity.
              </p>
            </div>
            
            <div className="bg-[#1E1E1E] p-6 rounded-xl border-l-4 border-[#7D5AF0] shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-5px]">
              <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
              <p className="text-gray-300">
                We're creating modern infrastructure for wealth circulation within Black communities. By connecting consumers 
                with Black-owned businesses and providing tools for sustained engagement, we're enabling the "Mansa Musa Effect" — 
                where dollars circulate longer, creating prosperity that benefits everyone.
              </p>
            </div>
            
            <div className="bg-[#1E1E1E] p-6 rounded-xl border-l-4 border-[#FFD700] shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-5px]">
              <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                The Circulation Principle
                <ChevronRight className="h-5 w-5 text-[#FFD700] ml-2" />
              </h3>
              <p className="text-gray-300">
                While the Black dollar currently circulates for just 6 hours in Black communities (compared to 28+ days in other 
                communities), our platform is designed to extend this circulation time. Every additional hour represents new opportunities 
                for growth, employment, and community development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MansaMusaHistory;
