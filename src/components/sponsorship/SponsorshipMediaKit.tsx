
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Users, BarChart3, FilePen, Shield } from 'lucide-react';

const SponsorshipMediaKit = () => {
  const mediaKitItems = [
    {
      icon: <FileText className="h-8 w-8 text-mansablue" />,
      title: "Sponsorship Prospectus",
      description: "Complete details about our sponsorship tiers, benefits, and impact metrics.",
      buttonText: "Download PDF"
    },
    {
      icon: <FilePen className="h-8 w-8 text-mansablue" />,
      title: "Sponsorship Agreement",
      description: "Our detailed legal agreement outlining terms, conditions, and cancellation policies.",
      buttonText: "Download Agreement"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-mansablue" />,
      title: "Impact Report",
      description: "Our latest data on economic circulation and community impact.",
      buttonText: "Download Report"
    },
    {
      icon: <Users className="h-8 w-8 text-mansablue" />,
      title: "Audience Demographics",
      description: "Detailed information about our community members and their engagement.",
      buttonText: "View Demographics"
    },
    {
      icon: <Shield className="h-8 w-8 text-mansablue" />,
      title: "Legal Compliance Guide",
      description: "Guidelines on regulatory compliance and ethical considerations for partnerships.",
      buttonText: "Download Guide"
    }
  ];

  // Function to handle document downloads
  const handleDownload = (documentTitle: string) => {
    // In a real implementation, this would download actual files
    console.log(`Downloading ${documentTitle}`);
    
    // For demonstration purposes, we'll show an alert
    alert(`The ${documentTitle} would download now. In production, this would connect to your document storage system.`);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sponsorship Resources</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download these resources to learn more about our sponsorship program and share them with your team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mediaKitItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm h-full">
              <div className="mb-4 bg-white p-3 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{item.description}</p>
              <Button 
                className="bg-mansablue hover:bg-mansablue-dark"
                onClick={() => handleDownload(item.title)}
              >
                <Download className="h-4 w-4 mr-2" />
                {item.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipMediaKit;
