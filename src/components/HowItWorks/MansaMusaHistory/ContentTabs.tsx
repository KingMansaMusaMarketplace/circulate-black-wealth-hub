
import React, { useState } from 'react';

interface ContentTabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

const ContentTabs = ({ tabs }: ContentTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="border-t border-[#333333] pt-4">
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === tab.id ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-gray-400 hover:bg-[#333333]'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="min-h-[120px]">
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id} className="animate-fade-in">
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ContentTabs;
