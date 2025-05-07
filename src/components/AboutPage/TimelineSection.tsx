
import React from 'react';
import { Clock, Award, TrendingUp, Star } from 'lucide-react';

const TimelineSection = () => {
  const timelineEvents = [
    {
      year: "2021",
      title: "The Vision",
      description: "Thomas Bowling first conceptualizes Mansa Musa Marketplace after studying circulation patterns in economic systems.",
      icon: <Clock className="h-6 w-6" />
    },
    {
      year: "2022",
      title: "Prototype Development",
      description: "First MVP of the marketplace platform begins development with focus on loyalty and circulation mechanics.",
      icon: <Award className="h-6 w-6" />
    },
    {
      year: "2023",
      title: "Beta Launch",
      description: "Limited beta release with 50 merchants and 500 users in target communities shows promising results.",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      year: "2024",
      title: "Platform Expansion",
      description: "Official public launch with enhanced features and expanded merchant partnerships across multiple cities.",
      icon: <Star className="h-6 w-6" />
    }
  ];

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md text-mansablue mb-4">Our Journey</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Building economic infrastructure takes time. Here's how our vision has evolved.
          </p>
        </div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-mansagold/30 z-0"></div>
          
          <div className="relative z-10">
            {timelineEvents.map((event, index) => (
              <div 
                key={index} 
                className={`flex items-center mb-16 last:mb-0 ${
                  index % 2 === 0 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="w-1/2"></div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-mansagold flex items-center justify-center text-white">
                  {event.icon}
                </div>
                
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-16 text-right' : 'pl-16'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover">
                    <div className="text-mansagold font-bold text-2xl mb-2">{event.year}</div>
                    <h3 className="text-mansablue-dark text-lg font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
