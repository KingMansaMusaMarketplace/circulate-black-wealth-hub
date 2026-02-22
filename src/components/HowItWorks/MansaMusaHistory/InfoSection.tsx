
import React from 'react';
import InfoCard from './InfoCard';

const InfoSection = () => {
  return (
    <div className="space-y-6">
      <InfoCard 
        title="Our Inspiration"
        content="1325.AI draws inspiration from this legacy of economic power coupled with community reinvestment. Just as Mansa Musa's wealth strengthened his empire, we believe the collective economic power of our communities can be harnessed to build generational wealth and opportunity."
        borderColor="yellow-400"
        titleColor="yellow-400"
      />
      
      <InfoCard 
        title="Our Mission"
        content="We're creating modern infrastructure for wealth circulation within our communities. By connecting consumers with great businesses and providing tools for sustained engagement, we're enabling the &quot;Circulation Effect&quot; — where dollars circulate longer, creating prosperity that benefits everyone."
        borderColor="blue-400"
        titleColor="yellow-400"
      />
      
      <InfoCard 
        title="The Circulation Principle"
        content="While our dollar currently circulates for just 6 hours in the community (compared to 28+ days in other communities), our platform is designed to extend this circulation time. Every additional hour represents new opportunities for growth, employment, and community development."
        borderColor="yellow-400"
        titleColor="yellow-400"
        showIcon={true}
      />
    </div>
  );
};

export default InfoSection;
