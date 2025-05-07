
import React from 'react';
import InfoCard from './InfoCard';

const InfoSection = () => {
  return (
    <div className="space-y-6">
      <InfoCard 
        title="Our Inspiration"
        content="Mansa Musa Marketplace draws inspiration from this legacy of economic power coupled with community reinvestment. Just as Mansa Musa's wealth strengthened his empire, we believe the collective economic power of Black communities can be harnessed to build generational wealth and opportunity."
        borderColor="[#FFD700]"
      />
      
      <InfoCard 
        title="Our Mission"
        content="We're creating modern infrastructure for wealth circulation within Black communities. By connecting consumers with Black-owned businesses and providing tools for sustained engagement, we're enabling the &quot;Mansa Musa Effect&quot; — where dollars circulate longer, creating prosperity that benefits everyone."
        borderColor="[#7D5AF0]"
      />
      
      <InfoCard 
        title="The Circulation Principle"
        content="While the Black dollar currently circulates for just 6 hours in Black communities (compared to 28+ days in other communities), our platform is designed to extend this circulation time. Every additional hour represents new opportunities for growth, employment, and community development."
        borderColor="[#FFD700]"
        showIcon={true}
      />
    </div>
  );
};

export default InfoSection;
