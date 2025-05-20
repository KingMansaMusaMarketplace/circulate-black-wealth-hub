
import React from 'react';

const SponsorshipShowcase = () => {
  const sponsors = {
    platinum: [
      { name: 'Global Financial Partners', logo: 'https://via.placeholder.com/180x100?text=GFP' },
      { name: 'Tech Innovations Inc', logo: 'https://via.placeholder.com/180x100?text=TII' },
    ],
    gold: [
      { name: 'Horizon Technologies', logo: 'https://via.placeholder.com/160x90?text=HT' },
      { name: 'Unity Investments', logo: 'https://via.placeholder.com/160x90?text=UI' },
      { name: 'Northwest Healthcare', logo: 'https://via.placeholder.com/160x90?text=NH' },
    ],
    silver: [
      { name: 'Metro Construction', logo: 'https://via.placeholder.com/140x80?text=MC' },
      { name: 'Evergreen Energy', logo: 'https://via.placeholder.com/140x80?text=EE' },
      { name: 'Urban Retail Group', logo: 'https://via.placeholder.com/140x80?text=URG' },
      { name: 'Local Food Co-op', logo: 'https://via.placeholder.com/140x80?text=LFC' },
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
                  <img 
                    src={sponsor.logo} 
                    alt={`${sponsor.name} logo`} 
                    className="h-24 object-contain mb-3 bg-white p-4 rounded-md shadow-sm"
                  />
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
                  <img 
                    src={sponsor.logo} 
                    alt={`${sponsor.name} logo`} 
                    className="h-20 object-contain mb-3 bg-white p-4 rounded-md shadow-sm"
                  />
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
                  <img 
                    src={sponsor.logo} 
                    alt={`${sponsor.name} logo`} 
                    className="h-16 object-contain mb-2 bg-white p-3 rounded-md shadow-sm"
                  />
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
