
import React from 'react';
import { Landmark } from 'lucide-react';

const MansaMusaHistory = () => {
  return (
    <section className="py-20 bg-[#121212]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-[#FFD700] mb-4">The Legacy Behind Our Name</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Mansa Musa Marketplace is inspired by the legendary African ruler who exemplifies wealth circulation and community empowerment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#262626] p-6 text-white flex items-center">
              <Landmark className="h-8 w-8 mr-3 text-[#FFD700]" />
              <h3 className="text-2xl font-bold">Mansa Musa of Mali (c. 1280-1337)</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
                  <div className="md:w-1/3">
                    <img 
                      src="/lovable-uploads/4a17f10b-e405-454e-bb76-c891478f42f6.png"
                      alt="Historical depiction of Mansa Musa"
                      className="rounded-lg shadow-md w-full h-auto object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "https://via.placeholder.com/300x400?text=Mansa+Musa";
                        console.error("Image failed to load, using fallback");
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-2 italic text-center">Historical depiction of Mansa Musa</p>
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
                <p className="text-gray-200">
                  <span className="font-bold text-[#FFD700]">Community Investment:</span> He built mosques, universities, and other institutions throughout 
                  his empire, including the famous Djinguereber Mosque in Timbuktu. Under his rule, Timbuktu became a center of education, 
                  commerce, and Islamic scholarship.
                </p>
                <p className="text-gray-200">
                  <span className="font-bold text-[#FFD700]">Legacy of Circulation:</span> Mansa Musa's approach to wealth was not merely about accumulation but 
                  circulation. He invested in his community, sponsored arts and education, and helped establish Mali as a cultural and economic 
                  powerhouse.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border-l-4 border-[#FFD700] shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-white">Our Inspiration</h3>
              <p className="text-gray-300">
                Mansa Musa Marketplace draws inspiration from this legacy of economic power coupled with community reinvestment. 
                Just as Mansa Musa's wealth strengthened his empire, we believe the collective economic power of Black communities 
                can be harnessed to build generational wealth and opportunity.
              </p>
            </div>
            
            <div className="bg-[#1E1E1E] p-6 rounded-xl border-l-4 border-[#7D5AF0] shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
              <p className="text-gray-300">
                We're creating modern infrastructure for wealth circulation within Black communities. By connecting consumers 
                with Black-owned businesses and providing tools for sustained engagement, we're enabling the "Mansa Musa Effect" — 
                where dollars circulate longer, creating prosperity that benefits everyone.
              </p>
            </div>
            
            <div className="bg-[#1E1E1E] p-6 rounded-xl border-l-4 border-[#FFD700] shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-white">The Circulation Principle</h3>
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
