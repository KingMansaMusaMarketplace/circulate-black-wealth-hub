
import React from 'react';
import { Landmark } from 'lucide-react';

const MansaMusaHistory = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-mansablue mb-4">The Legacy Behind Our Name</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Mansa Musa Marketplace is inspired by the legendary African ruler who exemplifies wealth circulation and community empowerment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-mansablue p-6 text-white flex items-center">
              <Landmark className="h-8 w-8 mr-3 text-mansagold" />
              <h3 className="text-2xl font-bold">Mansa Musa of Mali (c. 1280-1337)</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p>
                  <span className="font-bold text-mansablue">The Richest Person in History:</span> Mansa Musa was the Emperor of the Mali Empire in West Africa 
                  and is widely considered to be the wealthiest individual to have ever lived. His wealth was so vast that historians 
                  have difficulty calculating it in modern terms, but estimates place his fortune at an equivalent of $400 billion.
                </p>
                <p>
                  <span className="font-bold text-mansablue">Economic Impact:</span> During his famous pilgrimage to Mecca in 1324, Mansa Musa's generosity 
                  and spending were so significant that they caused inflation in the economies of Cairo, Medina, and Mecca due to the 
                  amount of gold he distributed.
                </p>
                <p>
                  <span className="font-bold text-mansablue">Community Investment:</span> He built mosques, universities, and other institutions throughout 
                  his empire, including the famous Djinguereber Mosque in Timbuktu. Under his rule, Timbuktu became a center of education, 
                  commerce, and Islamic scholarship.
                </p>
                <p>
                  <span className="font-bold text-mansablue">Legacy of Circulation:</span> Mansa Musa's approach to wealth was not merely about accumulation but 
                  circulation. He invested in his community, sponsored arts and education, and helped establish Mali as a cultural and economic 
                  powerhouse.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-l-4 border-mansagold shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-mansablue-dark">Our Inspiration</h3>
              <p className="text-gray-700">
                Mansa Musa Marketplace draws inspiration from this legacy of economic power coupled with community reinvestment. 
                Just as Mansa Musa's wealth strengthened his empire, we believe the collective economic power of Black communities 
                can be harnessed to build generational wealth and opportunity.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-l-4 border-mansablue shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-mansablue-dark">Our Mission</h3>
              <p className="text-gray-700">
                We're creating modern infrastructure for wealth circulation within Black communities. By connecting consumers 
                with Black-owned businesses and providing tools for sustained engagement, we're enabling the "Mansa Musa Effect" — 
                where dollars circulate longer, creating prosperity that benefits everyone.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-l-4 border-mansagold shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-mansablue-dark">The Circulation Principle</h3>
              <p className="text-gray-700">
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
