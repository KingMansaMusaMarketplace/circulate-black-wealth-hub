
import React from 'react';

const SponsorshipShowcase = () => {
  const sponsors = {
    platinum: [
      { name: 'Global Financial Partners', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
      { name: 'Tech Innovations Inc', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    ],
    gold: [
      { name: 'Horizon Technologies', logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
      { name: 'Unity Investments', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
      { name: 'Northwest Healthcare', logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    ],
    silver: [
      { name: 'Metro Construction', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
      { name: 'Evergreen Energy', logo: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
      { name: 'Urban Retail Group', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
      { name: 'Local Food Co-op', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    ],
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Corporate Partners</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join these forward-thinking organizations committed to economic empowerment and community development.
          </p>
        </div>

        <div className="space-y-10">
          {/* Platinum Sponsors */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-center mb-6">Platinum Sponsors</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {sponsors.platinum.map((sponsor, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-sm overflow-hidden mb-3">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-center mb-6">Gold Sponsors</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {sponsors.gold.map((sponsor, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-lg shadow-sm overflow-hidden mb-3">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div>
            <h3 className="text-xl font-semibold text-center mb-6">Silver Sponsors</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {sponsors.silver.map((sponsor, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-sm overflow-hidden mb-2">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipShowcase;
