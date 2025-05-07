
import React from 'react';
import { Landmark } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import ContentTabs from './ContentTabs';

interface HistoryPanelProps {
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
}

const HistoryPanel = ({ images }: HistoryPanelProps) => {
  const tabs = [
    {
      id: 'legacy',
      label: 'Legacy',
      content: (
        <p className="text-gray-200">
          <span className="font-bold text-[#FFD700]">Community Investment:</span> He built mosques, universities, and other institutions throughout 
          his empire, including the famous Djinguereber Mosque in Timbuktu. Under his rule, Timbuktu became a center of education, 
          commerce, and Islamic scholarship.
        </p>
      )
    },
    {
      id: 'community',
      label: 'Community',
      content: (
        <p className="text-gray-200">
          <span className="font-bold text-[#FFD700]">Legacy of Circulation:</span> Mansa Musa's approach to wealth was not merely about accumulation but 
          circulation. He invested in his community, sponsored arts and education, and helped establish Mali as a cultural and economic 
          powerhouse.
        </p>
      )
    }
  ];

  return (
    <div className="bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
      <div className="bg-[#262626] p-6 text-white flex items-center border-b border-[#333333]">
        <Landmark className="h-8 w-8 mr-3 text-[#FFD700]" />
        <h3 className="text-2xl font-bold">Mansa Musa of Mali (c. 1280-1337)</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
            <ImageCarousel images={images} />
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
          
          <ContentTabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
